import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';

export async function listParticipants(filters: { birthWeightStratum?: string; hospitalId?: string }) {
  const mothers = await prisma.motherProfile.findMany({
    where: {
      ...(filters.hospitalId ? { hospitalId: filters.hospitalId } : {}),
      ...(filters.birthWeightStratum
        ? { babyProfile: { birthWeightStratum: filters.birthWeightStratum } }
        : {}),
    },
    include: {
      hospital: { select: { id: true, name: true, code: true } },
      babyProfile: { select: { birthWeightStratum: true } },
      user: { select: { lastLoginAt: true, isActive: true } },
      followUpSchedules: { select: { timePoint: true, status: true, scheduledDate: true } },
    },
    orderBy: { enrolledAt: 'desc' },
  });

  return mothers.map((m) => ({
    id: m.id,
    participantCode: m.participantCode,
    studyGroup: m.studyGroup,
    hospital: m.hospital,
    birthWeightStratum: m.babyProfile?.birthWeightStratum ?? null,
    enrolledAt: m.enrolledAt,
    onboardingCompletedAt: m.onboardingCompletedAt,
    isActive: m.user.isActive,
    lastLoginAt: m.user.lastLoginAt,
    followUpSchedules: m.followUpSchedules,
  }));
}

export async function getParticipantDetail(motherProfileId: string) {
  const mother = await prisma.motherProfile.findUnique({
    where: { id: motherProfileId },
    include: {
      hospital: true,
      babyProfile: true,
      followUpSchedules: true,
      growthReadings: { orderBy: { readingDate: 'asc' } },
      knowledgeAssessments: true,
      who5Assessments: true,
      psocAssessments: true,
      dailyLogs: { orderBy: { careDate: 'desc' }, take: 30 },
      tdscAssessments: true,
      vaccineRecords: { orderBy: { dueDate: 'asc' } },
      breastfeedingAssessments: true,
    },
  });

  if (!mother) {
    throw createError(404, 'PARTICIPANT_NOT_FOUND', 'Participant not found.');
  }

  return mother;
}

export async function assignStudyGroup(motherProfileId: string, studyGroup: 'study' | 'control') {
  const mother = await prisma.motherProfile.findUnique({ where: { id: motherProfileId } });

  if (!mother) {
    throw createError(404, 'PARTICIPANT_NOT_FOUND', 'Participant not found.');
  }

  if (mother.participantCode !== null) {
    throw createError(
      409,
      'STUDY_GROUP_LOCKED',
      'The study group cannot be changed after a participant code has been generated.'
    );
  }

  const updated = await prisma.motherProfile.update({
    where: { id: motherProfileId },
    data: { studyGroup },
  });

  return updated;
}

export async function listHospitals() {
  const hospitals = await prisma.hospital.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { motherProfiles: true, nurseProfiles: true } } },
  });

  return hospitals.map((h) => ({
    ...h,
    participantCount: h._count.motherProfiles,
    nurseCount: h._count.nurseProfiles,
    _count: undefined,
  }));
}

export async function getHospitalDetail(hospitalId: string) {
  const hospital = await prisma.hospital.findUnique({ where: { id: hospitalId } });
  if (!hospital) {
    throw createError(404, 'HOSPITAL_NOT_FOUND', 'Hospital not found.');
  }

  const nurses = await prisma.nurseProfile.findMany({
    where: { hospitalId },
    include: { user: { select: { phone: true, isActive: true, lastLoginAt: true } } },
    orderBy: { fullName: 'asc' },
  });

  const participants = await listParticipants({ hospitalId });

  return {
    hospital,
    nurses: nurses.map((n) => ({
      id: n.id,
      fullName: n.fullName,
      employeeId: n.employeeId,
      phone: n.user.phone,
      isActive: n.isActive && n.user.isActive,
      lastLoginAt: n.user.lastLoginAt,
    })),
    participants,
  };
}

export interface CreateHospitalInput {
  name: string;
  code: string;
  district: string;
  state?: string;
  type: string;
  emergencyPhone?: string;
}

export async function createHospital(input: CreateHospitalInput) {
  const existing = await prisma.hospital.findUnique({ where: { code: input.code.toUpperCase() } });
  if (existing) {
    throw createError(409, 'HOSPITAL_CODE_EXISTS', 'A hospital with this code already exists.');
  }

  return prisma.hospital.create({
    data: {
      name: input.name,
      code: input.code.toUpperCase(),
      district: input.district,
      state: input.state ?? 'West Bengal',
      type: input.type,
      emergencyPhone: input.emergencyPhone ?? null,
    },
  });
}

export interface UpdateHospitalInput {
  name?: string;
  district?: string;
  emergencyPhone?: string;
  isActive?: boolean;
}

export async function updateHospital(id: string, input: UpdateHospitalInput) {
  const hospital = await prisma.hospital.findUnique({ where: { id } });
  if (!hospital) {
    throw createError(404, 'HOSPITAL_NOT_FOUND', 'Hospital not found.');
  }

  return prisma.hospital.update({
    where: { id },
    data: input,
  });
}
