import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';
import { calculateCorrectedAge } from '../utils/age.js';
import { compareDateOnly, formatDateOnly, getTodayDateOnlyInIST, parseDateOnlyToUTCDate } from '../utils/dateOnly.js';
import type { CreateGrowthReadingInput } from '../validators/growthValidator.js';
import { calculateZScore, getPercentileCurve, type Sex } from '../content/whoGrowthStandards.js';
import { resolveStaffMotherContext, type StaffUser } from './assessmentPrerequisites.js';

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

// ─── Weight-gain validation (KB §7) ──────────────────────────────────────────

export type WeightGainFlag = 'NORMAL' | 'REVIEW' | 'INFO';

export interface WeightGainNote {
  flag: WeightGainFlag;
  /** Short, mother-facing narrative text key (resolved in frontend via i18n). */
  messageKey: string;
}

/**
 * Validates a weight entry against the expected weight-gain windows from
 * KB §7. Uses corrected age throughout — this cohort is preterm.
 *
 * Returns a narrative flag and i18n message key that the frontend renders
 * as a contextual note under the weight tile in CurrentMeasurementsCard.
 *
 * This is a MOTHER-FACING informational layer, not a clinical diagnostic tool.
 * It sits on top of the WHO z-score chart already present in the app.
 */
export function validateWeightGain(
  birthWeightGrams: number,
  currentWeightGrams: number,
  correctedAgeDays: number,
  previousWeightGrams?: number | null,
): WeightGainNote {
  // KB §7: first 7 days — up to 10% weight loss is normal
  if (correctedAgeDays >= 0 && correctedAgeDays <= 7) {
    const lossPercent = ((birthWeightGrams - currentWeightGrams) / birthWeightGrams) * 100;
    if (lossPercent > 10) {
      return { flag: 'REVIEW', messageKey: 'growth.weightGainNote.excessLossFirstWeek' };
    }
    return { flag: 'NORMAL', messageKey: 'growth.weightGainNote.normalFirstWeek' };
  }

  // KB §7: by day 14 should have regained birth weight
  if (correctedAgeDays >= 8 && correctedAgeDays <= 21) {
    if (correctedAgeDays >= 14 && currentWeightGrams < birthWeightGrams) {
      return { flag: 'REVIEW', messageKey: 'growth.weightGainNote.notRegainedByDay14' };
    }
    return { flag: 'NORMAL', messageKey: 'growth.weightGainNote.regainingWeight' };
  }

  // KB §7: after day 14 through ~4 months — expect ~25–30 g/day
  if (correctedAgeDays > 21 && correctedAgeDays <= 120) {
    if (previousWeightGrams != null && previousWeightGrams > 0) {
      const gainPerDay = (currentWeightGrams - previousWeightGrams);
      // gainPerDay here is total gain since last reading; we flag if it's
      // negative (weight loss after the recovery window)
      if (gainPerDay < 0) {
        return { flag: 'REVIEW', messageKey: 'growth.weightGainNote.weightLossAfterRecovery' };
      }
    }
    return { flag: 'NORMAL', messageKey: 'growth.weightGainNote.steadyGain' };
  }

  // KB §7: 4–5 months corrected — should have doubled birth weight
  if (correctedAgeDays >= 121 && correctedAgeDays <= 150) {
    if (currentWeightGrams < birthWeightGrams * 2) {
      // INFO not REVIEW — may still be on track, just surfacing the milestone
      return { flag: 'INFO', messageKey: 'growth.weightGainNote.doubleWeightMilestone' };
    }
    return { flag: 'NORMAL', messageKey: 'growth.weightGainNote.doubledBirthWeight' };
  }

  return { flag: 'NORMAL', messageKey: 'growth.weightGainNote.onTrack' };
}

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

function mapGrowthReading(record: GrowthRecord, sex?: Sex) {
  const correctedAgeWeeks = toNumber(record.correctedAgeWeeks);
  const weightKg = record.weightGrams / 1000;
  const lengthCm = toNumber(record.lengthCm);
  const headCircumferenceCm = toNumber(record.headCircumferenceCm);

  const zScores = sex
    ? {
        weightForAge: calculateZScore('weight', sex, correctedAgeWeeks, weightKg),
        lengthForAge: calculateZScore('length', sex, correctedAgeWeeks, lengthCm),
        headCircumferenceForAge: calculateZScore('headCircumference', sex, correctedAgeWeeks, headCircumferenceCm),
      }
    : undefined;

  return {
    readingDate: formatDateOnly(record.readingDate),
    weightGrams: record.weightGrams,
    lengthCm,
    headCircumferenceCm,
    chronologicalAge: {
      days: record.chronologicalAgeDays,
      weeks: toNumber(record.chronologicalAgeWeeks),
    },
    correctedAge: {
      days: record.correctedAgeDays,
      weeks: correctedAgeWeeks,
    },
    timePoint: record.timePoint,
    source: record.source as 'manual' | 'growth',
    notes: record.notes ?? null,
    createdAt: record.createdAt?.toISOString(),
    zScores,
    lowZScoreAlert: zScores
      ? zScores.weightForAge < -2 || zScores.lengthForAge < -2 || zScores.headCircumferenceForAge < -2
      : false,
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
      data: mapGrowthReading(record, babyProfile.sex as Sex),
    };
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2002') {
      throw createError(409, 'GROWTH_READING_ALREADY_EXISTS', 'A growth reading already exists for this date.');
    }

    throw error;
  }
}

/** Staff (nurse/researcher) variant — taking physical measurements at a follow-up visit, per PRD §8.3. */
export async function createGrowthReadingForStaff(
  staffUser: StaffUser | undefined,
  motherProfileId: string,
  input: CreateGrowthReadingInput
) {
  const motherProfile = await resolveStaffMotherContext(staffUser, motherProfileId);
  const babyProfile = motherProfile.babyProfile!;
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
        recordedByUserId: staffUser!.id,
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
      message: 'Growth reading recorded successfully.',
      data: mapGrowthReading(record, babyProfile.sex as Sex),
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
      readings: readings.map((r) => mapGrowthReading(r, babyProfile.sex as Sex)),
    },
  };
}

export async function getGrowthChartForMother(user: RequestUser, metric: 'weight' | 'length' | 'headCircumference') {
  const currentUser = assertMotherUser(user);
  const { motherProfile, babyProfile } = await resolveGrowthContext(currentUser);

  const readings = await prisma.growthReading.findMany({
    where: { motherProfileId: motherProfile.id, babyProfileId: babyProfile.id },
    orderBy: [{ readingDate: 'asc' }],
  });

  const sex = babyProfile.sex as Sex;
  const mapped = readings.map((r) => mapGrowthReading(r, sex));
  const maxWeeks = Math.max(26, ...mapped.map((r) => Math.ceil(r.correctedAge.weeks)));

  return {
    success: true,
    data: {
      metric,
      sex,
      percentileCurve: getPercentileCurve(metric, sex, maxWeeks),
      readings: mapped.map((r) => ({
        readingDate: r.readingDate,
        correctedAgeWeeks: r.correctedAge.weeks,
        value: metric === 'weight' ? r.weightGrams / 1000 : metric === 'length' ? r.lengthCm : r.headCircumferenceCm,
        zScore: metric === 'weight'
          ? r.zScores?.weightForAge
          : metric === 'length'
            ? r.zScores?.lengthForAge
            : r.zScores?.headCircumferenceForAge,
      })),
      alert: mapped.some((r) => r.lowZScoreAlert),
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
    // Fetch the reading just before this one for daily-gain calculation (KB §7)
    const previous = await prisma.growthReading.findFirst({
      where: {
        motherProfileId: motherProfile.id,
        babyProfileId: babyProfile.id,
        readingDate: { lt: latest.readingDate },
      },
      orderBy: [{ readingDate: 'desc' }, { createdAt: 'desc' }],
    });

    const weightGainNote = validateWeightGain(
      babyProfile.birthWeightGrams,
      latest.weightGrams,
      latest.correctedAgeDays,
      previous?.weightGrams ?? null,
    );

    return {
      success: true,
      data: {
        ...mapGrowthReading(latest, babyProfile.sex as Sex),
        source: 'growth' as const,
        weightGainNote,
      },
    };
  }

  return {
    success: true,
    data: {
      ...mapDischargeBaseline(babyProfile),
      chronologicalAge: undefined,
      correctedAge: undefined,
      weightGainNote: null,
    },
  };
}

export async function getLatestGrowthReadingForDashboard(motherProfileId: string, babyProfileId: string) {
  return prisma.growthReading.findFirst({
    where: { motherProfileId, babyProfileId },
    orderBy: [{ readingDate: 'desc' }, { createdAt: 'desc' }],
  });
}
