import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';
import { calculateCorrectedAge } from '../utils/age.js';
import { getTodayDateOnlyInIST, parseDateOnlyToUTCDate, formatDateOnly } from '../utils/dateOnly.js';
import { tdscItems, getApplicableTdscItems } from '../content/tdscItems.js';
import { recordAudit } from './auditService.js';

type RequestUser = { id: string; role: string };

function assertMotherUser(user: RequestUser | undefined): RequestUser {
  if (!user) throw createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.');
  if (user.role !== 'mother') throw createError(403, 'MOTHER_ROLE_REQUIRED', 'Only authenticated mothers can access TDSC tracking.');
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

export async function getTdscItemsForMother(user: RequestUser) {
  const currentUser = assertMotherUser(user);
  const { babyProfile } = await resolveContext(currentUser);

  const age = calculateCorrectedAge({
    dateOfBirth: babyProfile.dateOfBirth,
    gestationalAgeWeeks: Number(babyProfile.gestationalAgeWeeks.toString()),
    referenceDate: getTodayDateOnlyInIST(),
  });

  return {
    success: true,
    data: {
      correctedAgeDays: age.correctedAgeDays,
      items: getApplicableTdscItems(age.correctedAgeDays),
    },
  };
}

export interface TdscSubmissionInput {
  timePoint: string;
  results: Record<string, 'pass' | 'fail'>;
}

export async function submitTdscAssessment(user: RequestUser, input: TdscSubmissionInput) {
  const currentUser = assertMotherUser(user);
  const { motherProfile, babyProfile } = await resolveContext(currentUser);

  const today = getTodayDateOnlyInIST();
  const age = calculateCorrectedAge({
    dateOfBirth: babyProfile.dateOfBirth,
    gestationalAgeWeeks: Number(babyProfile.gestationalAgeWeeks.toString()),
    referenceDate: today,
  });

  const existing = await prisma.tdscAssessment.findUnique({
    where: { motherProfileId_timePoint: { motherProfileId: motherProfile.id, timePoint: input.timePoint } },
  });
  if (existing) {
    throw createError(409, 'ASSESSMENT_ALREADY_SUBMITTED', 'This TDSC assessment has already been submitted and is locked.');
  }

  let suspectedDelay = false;
  for (const item of tdscItems) {
    const result = input.results[String(item.id)];
    if (result === 'fail' && age.correctedAgeDays > item.upperLimitDays) {
      suspectedDelay = true;
      break;
    }
  }

  const record = await prisma.tdscAssessment.create({
    data: {
      motherProfileId: motherProfile.id,
      timePoint: input.timePoint,
      assessmentDate: parseDateOnlyToUTCDate(today),
      correctedAgeDays: age.correctedAgeDays,
      results: input.results,
      suspectedDelay,
    },
  });

  void recordAudit({
    actorId: currentUser.id,
    actorRole: currentUser.role,
    action: 'tdsc.submitted',
    entityType: 'TdscAssessment',
    entityId: record.id,
    metadata: { timePoint: input.timePoint, suspectedDelay },
  });

  return {
    success: true,
    message: 'TDSC assessment submitted successfully.',
    data: {
      timePoint: record.timePoint,
      assessmentDate: formatDateOnly(record.assessmentDate),
      suspectedDelay: record.suspectedDelay,
      results: record.results,
      locked: true,
    },
  };
}

export async function getTdscHistory(user: RequestUser) {
  const currentUser = assertMotherUser(user);
  const { motherProfile } = await resolveContext(currentUser);

  const records = await prisma.tdscAssessment.findMany({
    where: { motherProfileId: motherProfile.id },
    orderBy: { assessmentDate: 'asc' },
  });

  return {
    success: true,
    data: records.map((r) => ({
      timePoint: r.timePoint,
      assessmentDate: formatDateOnly(r.assessmentDate),
      suspectedDelay: r.suspectedDelay,
      results: r.results,
    })),
  };
}
