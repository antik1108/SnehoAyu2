import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';
import {
  CohortFilter,
  buildWhereClause,
  computeEngagementScore,
  computeEngagementTier,
  DailyLogRow,
} from './analyticsService.js';
import { mapGrowthReading } from './growthService.js';
import { Sex } from '../content/whoGrowthStandards.js';

export async function listParticipants(filters: CohortFilter = {}) {
  const where = buildWhereClause(filters);

  // If engagementTier filter is present, candidate mothers need to be filtered first
  let targetMotherIds: string[] | undefined;
  if (filters.engagementTier) {
    const studyMothers = await prisma.motherProfile.findMany({
      where: { ...where, studyGroup: 'study' },
      select: { id: true },
    });
    const candidateIds = studyMothers.map((m) => m.id);

    const twentyEightDaysAgo = new Date();
    twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 27);
    twentyEightDaysAgo.setHours(0, 0, 0, 0);

    const logs = await prisma.dailyLog.findMany({
      where: {
        motherProfileId: { in: candidateIds },
        careDate: { gte: twentyEightDaysAgo },
      },
      select: {
        motherProfileId: true,
        breastfeedingDone: true,
        kmcDone: true,
        temperatureDone: true,
        weightCheckDone: true,
        skinCordCareDone: true,
        sleepDone: true,
        stoolDone: true,
      },
    });

    const logsByMother: Record<string, DailyLogRow[]> = {};
    logs.forEach((log) => {
      if (!logsByMother[log.motherProfileId]) logsByMother[log.motherProfileId] = [];
      logsByMother[log.motherProfileId].push(log);
    });

    targetMotherIds = candidateIds.filter((id) => {
      const score = computeEngagementScore(logsByMother[id] || []);
      return computeEngagementTier(score) === filters.engagementTier;
    });
  }

  const finalWhere = targetMotherIds ? { ...where, id: { in: targetMotherIds } } : where;

  const mothers = await prisma.motherProfile.findMany({
    where: finalWhere,
    include: {
      hospital: { select: { id: true, name: true, code: true } },
      babyProfile: { select: { birthWeightStratum: true } },
      user: { select: { lastLoginAt: true, isActive: true } },
      followUpSchedules: {
        select: { timePoint: true, status: true, scheduledDate: true },
        orderBy: { scheduledDate: 'asc' },
      },
    },
    orderBy: { enrolledAt: 'desc' },
  });

  if (mothers.length === 0) {
    return [];
  }

  const motherIds = mothers.map((m) => m.id);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysFromToday = new Date(today);
  sevenDaysFromToday.setDate(sevenDaysFromToday.getDate() + 7);
  sevenDaysFromToday.setHours(23, 59, 59, 999);

  const twentyEightDaysAgo = new Date();
  twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 27);
  twentyEightDaysAgo.setHours(0, 0, 0, 0);

  // Batch 1: DailyLogs in past 28 days for engagement and latest careDate
  const dailyLogs = await prisma.dailyLog.findMany({
    where: {
      motherProfileId: { in: motherIds },
      careDate: { gte: twentyEightDaysAgo },
    },
    select: {
      motherProfileId: true,
      careDate: true,
      breastfeedingDone: true,
      kmcDone: true,
      temperatureDone: true,
      weightCheckDone: true,
      skinCordCareDone: true,
      sleepDone: true,
      stoolDone: true,
    },
    orderBy: { careDate: 'desc' },
  });

  const logsByMother: Record<string, DailyLogRow[]> = {};
  const latestCareDateByMother: Record<string, string> = {};

  dailyLogs.forEach((log) => {
    if (!logsByMother[log.motherProfileId]) {
      logsByMother[log.motherProfileId] = [];
      latestCareDateByMother[log.motherProfileId] = log.careDate.toISOString().split('T')[0];
    }
    logsByMother[log.motherProfileId].push(log);
  });

  // Batch 2: Active DangerSignAlerts
  const activeDangerAlerts = await prisma.dangerSignAlert.findMany({
    where: {
      motherProfileId: { in: motherIds },
      status: { in: ['OPEN', 'ACKNOWLEDGED'] },
    },
    select: { motherProfileId: true },
  });
  const dangerSignMotherIds = new Set(activeDangerAlerts.map((a) => a.motherProfileId));

  return mothers.map((m) => {
    const enrolledDate = new Date(m.enrolledAt);
    const diffTime = Math.max(0, today.getTime() - enrolledDate.getTime());
    const daysSinceEnrollment = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // lastActiveDate
    let lastActiveDate: string | null = null;
    if (m.studyGroup === 'study') {
      lastActiveDate = latestCareDateByMother[m.id] ?? null;
    } else {
      lastActiveDate = m.user.lastLoginAt ? m.user.lastLoginAt.toISOString().split('T')[0] : null;
    }

    // Engagement
    let engagementScore: number | null = null;
    let engagementTier: 'high' | 'medium' | 'low' | 'inactive' | null = null;
    if (m.studyGroup === 'study') {
      engagementScore = computeEngagementScore(logsByMother[m.id] || []);
      engagementTier = computeEngagementTier(engagementScore);
    }

    // Checkpoint calculations
    const pendingSchedules = m.followUpSchedules.filter((s) => s.status === 'pending');
    const nextSched = pendingSchedules[0] ?? null;

    let nextCheckpoint: { timePoint: string; scheduledDate: string; status: string } | null = null;
    if (nextSched) {
      nextCheckpoint = {
        timePoint: nextSched.timePoint,
        scheduledDate: nextSched.scheduledDate.toISOString().split('T')[0],
        status: nextSched.status,
      };
    }

    const isOverdue = pendingSchedules.some((s) => new Date(s.scheduledDate) < today);
    const isDueSoon = pendingSchedules.some((s) => {
      const d = new Date(s.scheduledDate);
      return d >= today && d <= sevenDaysFromToday;
    });

    const hasDangerSignFlag = dangerSignMotherIds.has(m.id);

    return {
      id: m.id,
      participantCode: m.participantCode,
      studyGroup: m.studyGroup as 'study' | 'control' | null,
      hospital: m.hospital,
      birthWeightStratum: m.babyProfile?.birthWeightStratum ?? null,
      enrolledAt: m.enrolledAt.toISOString(),
      onboardingCompletedAt: m.onboardingCompletedAt ? m.onboardingCompletedAt.toISOString() : null,
      isActive: m.user.isActive,
      lastLoginAt: m.user.lastLoginAt ? m.user.lastLoginAt.toISOString() : null,
      followUpSchedules: m.followUpSchedules.map((s) => ({
        timePoint: s.timePoint,
        status: s.status,
        scheduledDate: s.scheduledDate.toISOString().split('T')[0],
      })),
      daysSinceEnrollment,
      lastActiveDate,
      engagementScore,
      engagementTier,
      nextCheckpoint,
      isOverdue,
      isDueSoon,
      hasDangerSignFlag,
    };
  });
}

export async function getAdminParticipantGrowth(motherProfileId: string) {
  const mother = await prisma.motherProfile.findUnique({
    where: { id: motherProfileId },
    include: {
      babyProfile: true,
      growthReadings: { orderBy: { readingDate: 'asc' } },
    },
  });

  if (!mother) {
    throw createError(404, 'PARTICIPANT_NOT_FOUND', 'Participant not found.');
  }

  if (!mother.babyProfile) {
    return {
      babyProfile: null,
      readings: [],
    };
  }

  const baby = mother.babyProfile;
  const sex = baby.sex as Sex;

  const mappedReadings = mother.growthReadings.map((r) => mapGrowthReading(r as any, sex));

  if (mappedReadings.length === 0 && baby.weightAtDischargeGrams > 0) {
    return {
      babyProfile: {
        dateOfBirth: baby.dateOfBirth.toISOString().split('T')[0],
        gestationalAgeWeeks: Number(baby.gestationalAgeWeeks),
        weightAtDischargeGrams: baby.weightAtDischargeGrams,
      },
      readings: [
        {
          readingDate: baby.dischargeDate ? baby.dischargeDate.toISOString().split('T')[0] : baby.dateOfBirth.toISOString().split('T')[0],
          weightGrams: baby.weightAtDischargeGrams,
          lengthCm: null,
          headCircumferenceCm: null,
          correctedAgeWeeks: 0,
          source: 'discharge',
        },
      ],
    };
  }

  return {
    babyProfile: {
      dateOfBirth: baby.dateOfBirth.toISOString().split('T')[0],
      gestationalAgeWeeks: Number(baby.gestationalAgeWeeks),
      weightAtDischargeGrams: baby.weightAtDischargeGrams,
    },
    readings: mappedReadings.map((r) => ({
      ...r,
      correctedAgeWeeks: r.correctedAge.weeks,
    })),
  };
}

export async function getParticipantDetail(motherProfileId: string) {
  const mother = await prisma.motherProfile.findUnique({
    where: { id: motherProfileId },
    include: {
      hospital: true,
      babyProfile: true,
      followUpSchedules: { orderBy: { scheduledDate: 'asc' } },
      growthReadings: { orderBy: { readingDate: 'asc' } },
      knowledgeAssessments: true,
      who5Assessments: true,
      psocAssessments: true,
      dailyLogs: { orderBy: { careDate: 'desc' }, take: 30 },
      tdscAssessments: true,
      vaccineRecords: { orderBy: { dueDate: 'asc' } },
      breastfeedingAssessments: true,
      dangerSignAlerts: { orderBy: { raisedAt: 'desc' } },
    },
  });

  if (!mother) {
    throw createError(404, 'PARTICIPANT_NOT_FOUND', 'Participant not found.');
  }

  const twentyEightDaysAgo = new Date();
  twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 27);
  twentyEightDaysAgo.setHours(0, 0, 0, 0);

  const logsPast28 = mother.dailyLogs.filter((l) => new Date(l.careDate) >= twentyEightDaysAgo);

  let engagementScore: number | null = null;
  let engagementTier: 'high' | 'medium' | 'low' | 'inactive' | null = null;
  if (mother.studyGroup === 'study') {
    engagementScore = computeEngagementScore(logsPast28);
    engagementTier = computeEngagementTier(engagementScore);
  }

  const dailyLogs30Day = mother.dailyLogs.map((l) => {
    const completedCount = [
      l.breastfeedingDone,
      l.kmcDone,
      l.temperatureDone,
      l.weightCheckDone,
      l.skinCordCareDone,
      l.sleepDone,
      l.stoolDone,
    ].filter(Boolean).length;

    return {
      careDate: l.careDate.toISOString().split('T')[0],
      completedCount,
    };
  });

  return {
    ...mother,
    dailyLogs30Day,
    engagementScore,
    engagementTier,
    dangerSignAlerts: mother.dangerSignAlerts,
  };
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
