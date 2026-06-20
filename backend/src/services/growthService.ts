import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';
import { calculateCorrectedAge } from '../utils/age.js';
import { compareDateOnly, formatDateOnly, getTodayDateOnlyInIST, parseDateOnlyToUTCDate } from '../utils/dateOnly.js';
import type { CreateGrowthReadingInput } from '../validators/growthValidator.js';

type RequestUser = {
  id: string;
  role: string;
  preferredLanguage: string;
};

type GrowthRecord = {
  readingDate: Date;
  weightGrams: number;
  lengthCm: unknown;
  headCircumferenceCm: unknown;
  chronologicalAgeDays: number;
  chronologicalAgeWeeks: unknown;
  correctedAgeDays: number;
  correctedAgeWeeks: unknown;
  timePoint: string | null;
  source: string;
  notes?: string | null;
  createdAt?: Date;
};

function assertMotherUser(user: RequestUser | undefined): RequestUser {
  if (!user) {
    throw createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.');
  }

  if (user.role !== 'mother') {
    throw createError(403, 'MOTHER_ROLE_REQUIRED', 'Only authenticated mothers can access growth tracking.');
  }

  return user;
}

async function resolveGrowthContext(user: RequestUser) {
  const motherProfile = await prisma.motherProfile.findUnique({
    where: { userId: user.id },
    include: { babyProfile: true },
  });

  if (!motherProfile) {
    throw createError(409, 'MOTHER_PROFILE_REQUIRED', 'Complete the mother profile before opening growth tracking.');
  }

  if (!motherProfile.babyProfile) {
    throw createError(409, 'BABY_PROFILE_REQUIRED', 'Complete the baby profile before opening growth tracking.');
  }

  if (!motherProfile.onboardingCompletedAt) {
    throw createError(409, 'ONBOARDING_INCOMPLETE', 'Complete onboarding before opening growth tracking.');
  }

  return { motherProfile, babyProfile: motherProfile.babyProfile };
}

function toNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (value && typeof value === 'object' && 'toString' in value) return Number(value.toString());
  return Number(value);
}

function mapGrowthReading(record: GrowthRecord) {
  return {
    readingDate: formatDateOnly(record.readingDate),
    weightGrams: record.weightGrams,
    lengthCm: toNumber(record.lengthCm),
    headCircumferenceCm: toNumber(record.headCircumferenceCm),
    chronologicalAge: {
      days: record.chronologicalAgeDays,
      weeks: toNumber(record.chronologicalAgeWeeks),
    },
    correctedAge: {
      days: record.correctedAgeDays,
      weeks: toNumber(record.correctedAgeWeeks),
    },
    timePoint: record.timePoint,
    source: record.source as 'manual' | 'growth',
    notes: record.notes ?? null,
    createdAt: record.createdAt?.toISOString(),
  };
}

function mapDischargeBaseline(babyProfile: { dischargeDate: Date; weightAtDischargeGrams: number }) {
  return {
    source: 'discharge' as const,
    readingDate: formatDateOnly(babyProfile.dischargeDate),
    weightGrams: babyProfile.weightAtDischargeGrams,
    lengthCm: null,
    headCircumferenceCm: null,
  };
}

function resolveReadingDate(inputDate: string | undefined): string {
  return inputDate ?? getTodayDateOnlyInIST();
}

function validateReadingDateAgainstBaby(readingDate: string, babyProfile: { dateOfBirth: Date }) {
  const dob = formatDateOnly(babyProfile.dateOfBirth);
  const today = getTodayDateOnlyInIST();

  if (compareDateOnly(readingDate, today) > 0) {
    throw createError(400, 'INVALID_READING_DATE', 'Reading date cannot be in the future.');
  }

  if (compareDateOnly(readingDate, dob) < 0) {
    throw createError(400, 'INVALID_READING_DATE', 'Reading date cannot be before the baby date of birth.');
  }
}

export async function createGrowthReadingForMother(user: RequestUser, input: CreateGrowthReadingInput) {
  const currentUser = assertMotherUser(user);
  const { motherProfile, babyProfile } = await resolveGrowthContext(currentUser);
  const readingDateString = resolveReadingDate(input.readingDate);
  validateReadingDateAgainstBaby(readingDateString, babyProfile);

  const age = calculateCorrectedAge({
    dateOfBirth: babyProfile.dateOfBirth,
    gestationalAgeWeeks: Number(babyProfile.gestationalAgeWeeks.toString()),
    referenceDate: readingDateString,
  });

  try {
    const record = await prisma.growthReading.create({
      data: {
        motherProfileId: motherProfile.id,
        babyProfileId: babyProfile.id,
        recordedByUserId: currentUser.id,
        readingDate: parseDateOnlyToUTCDate(readingDateString),
        weightGrams: input.weightGrams,
        lengthCm: input.lengthCm,
        headCircumferenceCm: input.headCircumferenceCm,
        chronologicalAgeDays: age.chronologicalAgeDays,
        chronologicalAgeWeeks: age.chronologicalAgeWeeks,
        correctedAgeDays: age.correctedAgeDays,
        correctedAgeWeeks: age.correctedAgeWeeks,
        timePoint: input.timePoint ?? null,
        source: 'manual',
        notes: input.notes?.trim() ? input.notes.trim() : null,
      },
    });

    return {
      success: true,
      message: 'Growth reading saved successfully.',
      data: mapGrowthReading(record),
    };
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2002') {
      throw createError(409, 'GROWTH_READING_ALREADY_EXISTS', 'A growth reading already exists for this date.');
    }

    throw error;
  }
}

export async function getGrowthHistoryForMother(user: RequestUser, limit: number) {
  const currentUser = assertMotherUser(user);
  const { motherProfile, babyProfile } = await resolveGrowthContext(currentUser);

  const readings = await prisma.growthReading.findMany({
    where: { motherProfileId: motherProfile.id, babyProfileId: babyProfile.id },
    orderBy: [{ readingDate: 'desc' }, { createdAt: 'desc' }],
    take: limit,
  });

  return {
    success: true,
    data: {
      baseline: mapDischargeBaseline(babyProfile),
      readings: readings.map(mapGrowthReading),
    },
  };
}

export async function getLatestGrowthReadingForMother(user: RequestUser) {
  const currentUser = assertMotherUser(user);
  const { motherProfile, babyProfile } = await resolveGrowthContext(currentUser);

  const latest = await prisma.growthReading.findFirst({
    where: { motherProfileId: motherProfile.id, babyProfileId: babyProfile.id },
    orderBy: [{ readingDate: 'desc' }, { createdAt: 'desc' }],
  });

  if (latest) {
    return {
      success: true,
      data: {
        ...mapGrowthReading(latest),
        source: 'growth' as const,
      },
    };
  }

  return {
    success: true,
    data: {
      ...mapDischargeBaseline(babyProfile),
      chronologicalAge: undefined,
      correctedAge: undefined,
    },
  };
}

export async function getLatestGrowthReadingForDashboard(motherProfileId: string, babyProfileId: string) {
  return prisma.growthReading.findFirst({
    where: { motherProfileId, babyProfileId },
    orderBy: [{ readingDate: 'desc' }, { createdAt: 'desc' }],
  });
}
