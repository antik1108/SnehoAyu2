import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';
import { addUtcDays, formatDateOnly } from '../utils/dateOnly.js';
import { immunizationSchedule } from '../content/immunizationSchedule.js';
import { recordAudit } from './auditService.js';

type RequestUser = { id: string; role: string };

function assertMotherUser(user: RequestUser | undefined): RequestUser {
  if (!user) throw createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.');
  if (user.role !== 'mother') throw createError(403, 'MOTHER_ROLE_REQUIRED', 'Only authenticated mothers can access immunization tracking.');
  return user;
}

async function resolveContext(user: RequestUser) {
  const motherProfile = await prisma.motherProfile.findUnique({
    where: { userId: user.id },
    include: { babyProfile: true },
  });
  if (!motherProfile) throw createError(409, 'MOTHER_PROFILE_REQUIRED', 'Complete the mother profile first.');
  if (!motherProfile.babyProfile) throw createError(409, 'BABY_PROFILE_REQUIRED', 'Complete the baby profile first.');
  return { motherProfile, babyProfile: motherProfile.babyProfile };
}

async function ensureScheduleGenerated(motherProfileId: string, dateOfBirth: Date) {
  const existingCount = await prisma.vaccineRecord.count({ where: { motherProfileId } });
  if (existingCount > 0) return;

  await prisma.vaccineRecord.createMany({
    data: immunizationSchedule.map((v) => ({
      motherProfileId,
      vaccineId: v.id,
      vaccineName: v.name,
      dueDate: addUtcDays(dateOfBirth, v.dueOffsetDays),
      status: 'pending',
    })),
    skipDuplicates: true,
  });
}

export async function getImmunizationScheduleForMother(user: RequestUser) {
  const currentUser = assertMotherUser(user);
  const { motherProfile, babyProfile } = await resolveContext(currentUser);

  await ensureScheduleGenerated(motherProfile.id, babyProfile.dateOfBirth);

  const records = await prisma.vaccineRecord.findMany({
    where: { motherProfileId: motherProfile.id },
    orderBy: { dueDate: 'asc' },
  });

  const definitionMap = new Map(immunizationSchedule.map((v) => [v.id, v]));
  const completed = records.filter((r) => r.status === 'completed');

  return {
    success: true,
    data: {
      progressPercent: records.length ? Math.round((completed.length / records.length) * 100) : 0,
      totalCount: records.length,
      completedCount: completed.length,
      vaccines: records.map((r) => ({
        vaccineId: r.vaccineId,
        name: r.vaccineName,
        dueDate: formatDateOnly(r.dueDate),
        completedDate: r.completedDate ? formatDateOnly(r.completedDate) : null,
        batchNumber: r.batchNumber,
        administeredBy: r.administeredBy,
        status: r.status,
        description: definitionMap.get(r.vaccineId)?.description ?? '',
        sideEffects: definitionMap.get(r.vaccineId)?.sideEffects ?? '',
      })),
    },
  };
}

export interface MarkVaccineDoneInput {
  vaccineId: string;
  completedDate?: string;
  batchNumber?: string;
  administeredBy?: string;
}

export async function markVaccineComplete(user: RequestUser, input: MarkVaccineDoneInput) {
  const currentUser = assertMotherUser(user);
  const { motherProfile, babyProfile } = await resolveContext(currentUser);
  await ensureScheduleGenerated(motherProfile.id, babyProfile.dateOfBirth);

  const record = await prisma.vaccineRecord.findUnique({
    where: { motherProfileId_vaccineId: { motherProfileId: motherProfile.id, vaccineId: input.vaccineId } },
  });

  if (!record) {
    throw createError(404, 'VACCINE_NOT_FOUND', 'Vaccine record not found.');
  }

  const updated = await prisma.vaccineRecord.update({
    where: { id: record.id },
    data: {
      status: 'completed',
      completedDate: input.completedDate ? new Date(input.completedDate) : new Date(),
      batchNumber: input.batchNumber ?? null,
      administeredBy: input.administeredBy ?? null,
    },
  });

  void recordAudit({
    actorId: currentUser.id,
    actorRole: currentUser.role,
    action: 'immunization.marked_complete',
    entityType: 'VaccineRecord',
    entityId: updated.id,
    metadata: { vaccineId: input.vaccineId },
  });

  return {
    success: true,
    message: 'Vaccine marked as completed.',
    data: { vaccineId: updated.vaccineId, status: updated.status, completedDate: formatDateOnly(updated.completedDate!) },
  };
}
