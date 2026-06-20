import prisma from '../lib/prisma.js';
import { type DailyLog } from '../../generated/prisma/index.js';
import { createError } from '../middlewares/errorHandler.js';
import { formatDateOnly, todayIstDateOnly, addDateOnlyDays } from '../utils/dateOnly.js';
import type { ChecklistLogInput } from '../validators/checklistValidator.js';

type RequestUser = {
  id: string;
  role: string;
  preferredLanguage: string;
};

export interface ChecklistCompletionSummary {
  completedCount: number;
  totalCount: number;
  percent: number;
}

export interface ChecklistItemSummary {
  breastfeeding: {
    done: boolean;
    feedsCount: number | null;
    volumeMl: number | null;
  };
  kmc: {
    done: boolean;
    minutes: number | null;
  };
  temperature: {
    done: boolean;
    morningC: number | null;
    eveningC: number | null;
  };
  weight: {
    done: boolean;
    grams: number | null;
    optional: true;
  };
  skinCordCare: {
    done: boolean;
  };
  medication: {
    done: boolean | null;
    notes: string | null;
    optional: true;
  };
  dangerSigns: {
    reviewed: boolean;
  };
}

export interface ChecklistTodayData {
  careDate: string;
  completion: ChecklistCompletionSummary;
  items: ChecklistItemSummary;
}

export interface ChecklistHistoryRecord {
  careDate: string;
  completedCount: number;
  totalCount: number;
  completionPercent: number;
}

export interface ChecklistHistoryData {
  days: 7 | 30;
  records: ChecklistHistoryRecord[];
}

export interface ChecklistTodayResponse {
  success: true;
  data: ChecklistTodayData;
}

export interface ChecklistHistoryResponse {
  success: true;
  data: ChecklistHistoryData;
}

const REQUIRED_TOTAL = 5;

function assertMotherUser(user: RequestUser | undefined): RequestUser {
  if (!user) {
    throw createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.');
  }

  if (user.role !== 'mother') {
    throw createError(403, 'MOTHER_ROLE_REQUIRED', 'Only authenticated mothers can access the checklist.');
  }

  return user;
}

async function resolveMotherContext(user: RequestUser) {
  const motherProfile = await prisma.motherProfile.findUnique({
    where: { userId: user.id },
    include: {
      babyProfile: true,
      hospital: true,
    },
  });

  if (!motherProfile) {
    throw createError(409, 'MOTHER_PROFILE_REQUIRED', 'Complete the mother profile before opening the checklist.');
  }

  if (!motherProfile.babyProfile) {
    throw createError(409, 'BABY_PROFILE_REQUIRED', 'Complete the baby profile before opening the checklist.');
  }

  if (!motherProfile.hospitalId || !motherProfile.hospital) {
    throw createError(409, 'HOSPITAL_LINK_REQUIRED', 'Link a hospital before opening the checklist.');
  }

  if (!motherProfile.participantCode || !motherProfile.studyGroup || (motherProfile.studyGroup !== 'study' && motherProfile.studyGroup !== 'control')) {
    throw createError(409, 'PARTICIPANT_CODE_REQUIRED', 'Generate a participant code before opening the checklist.');
  }

  if (!motherProfile.onboardingCompletedAt) {
    throw createError(409, 'ONBOARDING_INCOMPLETE', 'Complete onboarding before opening the checklist.');
  }

  return motherProfile;
}

function toNumberOrNull(value: number | null | undefined): number | null {
  return typeof value === 'number' ? value : null;
}

function toBooleanDone(value: boolean | null | undefined): boolean | null {
  return typeof value === 'boolean' ? value : null;
}

function resolveCompletion(log: {
  breastfeedingDone: boolean;
  kmcDone: boolean;
  temperatureDone: boolean;
  skinCordCareDone: boolean;
  dangerSignsReviewed: boolean;
}): ChecklistCompletionSummary {
  const completedCount = [
    log.breastfeedingDone,
    log.kmcDone,
    log.temperatureDone,
    log.skinCordCareDone,
    log.dangerSignsReviewed,
  ].filter(Boolean).length;

  const percent = Math.min(100, Math.max(0, Math.round((completedCount / REQUIRED_TOTAL) * 100)));

  return {
    completedCount,
    totalCount: REQUIRED_TOTAL,
    percent,
  };
}

function inferDone(existing: boolean, inputDone: boolean | undefined, hasMeasuredValue: boolean): boolean {
  if (inputDone !== undefined) {
    return inputDone;
  }

  if (hasMeasuredValue) {
    return true;
  }

  return existing;
}

function mergeChecklistPatch(existing: Awaited<ReturnType<typeof prisma.dailyLog.findUnique>>, input: ChecklistLogInput) {
  const patch: Record<string, unknown> = {};

  if (input.breastfeeding) {
    if (input.breastfeeding.done !== undefined || input.breastfeeding.feedsCount !== undefined || input.breastfeeding.volumeMl !== undefined) {
      patch.breastfeedingDone = inferDone(
        existing?.breastfeedingDone ?? false,
        input.breastfeeding.done,
        (input.breastfeeding.feedsCount ?? 0) > 0 || (input.breastfeeding.volumeMl ?? 0) > 0
      );
    }
    if (input.breastfeeding.feedsCount !== undefined) patch.breastfeedingFeedsCount = input.breastfeeding.feedsCount;
    if (input.breastfeeding.volumeMl !== undefined) patch.breastfeedingVolumeMl = input.breastfeeding.volumeMl;
  }

  if (input.kmc) {
    if (input.kmc.done !== undefined || input.kmc.minutes !== undefined) {
      patch.kmcDone = inferDone(existing?.kmcDone ?? false, input.kmc.done, (input.kmc.minutes ?? 0) > 0);
    }
    if (input.kmc.minutes !== undefined) patch.kmcMinutes = input.kmc.minutes;
  }

  if (input.temperature) {
    if (input.temperature.done !== undefined || input.temperature.morningC !== undefined || input.temperature.eveningC !== undefined) {
      patch.temperatureDone = inferDone(
        existing?.temperatureDone ?? false,
        input.temperature.done,
        input.temperature.morningC !== undefined || input.temperature.eveningC !== undefined
      );
    }
    if (input.temperature.morningC !== undefined) patch.temperatureMorningC = input.temperature.morningC;
    if (input.temperature.eveningC !== undefined) patch.temperatureEveningC = input.temperature.eveningC;
  }

  if (input.weight) {
    if (input.weight.done !== undefined || input.weight.grams !== undefined) {
      patch.weightCheckDone = inferDone(existing?.weightCheckDone ?? false, input.weight.done, input.weight.grams !== undefined);
    }
    if (input.weight.grams !== undefined) patch.weightGrams = input.weight.grams;
  }

  if (input.skinCordCare) {
    if (input.skinCordCare.done !== undefined) {
      patch.skinCordCareDone = input.skinCordCare.done;
    }
  }

  if (input.medication) {
    if (input.medication.done !== undefined) patch.medicationDone = input.medication.done;
    if (input.medication.notes !== undefined) patch.medicationNotes = input.medication.notes;
  }

  if (input.dangerSigns) {
    if (input.dangerSigns.reviewed !== undefined) patch.dangerSignsReviewed = input.dangerSigns.reviewed;
  }

  return patch;
}

function toTodayData(log: Awaited<ReturnType<typeof prisma.dailyLog.findUnique>>): ChecklistTodayData {
  const completion = resolveCompletion({
    breastfeedingDone: log?.breastfeedingDone ?? false,
    kmcDone: log?.kmcDone ?? false,
    temperatureDone: log?.temperatureDone ?? false,
    skinCordCareDone: log?.skinCordCareDone ?? false,
    dangerSignsReviewed: log?.dangerSignsReviewed ?? false,
  });

  return {
    careDate: formatDateOnly(log?.careDate ?? todayIstDateOnly()),
    completion,
    items: {
      breastfeeding: {
        done: log?.breastfeedingDone ?? false,
        feedsCount: toNumberOrNull(log?.breastfeedingFeedsCount ?? null),
        volumeMl: toNumberOrNull(log?.breastfeedingVolumeMl ?? null),
      },
      kmc: {
        done: log?.kmcDone ?? false,
        minutes: toNumberOrNull(log?.kmcMinutes ?? null),
      },
      temperature: {
        done: log?.temperatureDone ?? false,
        morningC: toNumberOrNull(log?.temperatureMorningC ? Number(log.temperatureMorningC) : null),
        eveningC: toNumberOrNull(log?.temperatureEveningC ? Number(log.temperatureEveningC) : null),
      },
      weight: {
        done: log?.weightCheckDone ?? false,
        grams: toNumberOrNull(log?.weightGrams ?? null),
        optional: true,
      },
      skinCordCare: {
        done: log?.skinCordCareDone ?? false,
      },
      medication: {
        done: toBooleanDone(log?.medicationDone ?? null),
        notes: log?.medicationNotes ?? null,
        optional: true,
      },
      dangerSigns: {
        reviewed: log?.dangerSignsReviewed ?? false,
      },
    },
  };
}

export async function getTodayChecklistForMother(user: RequestUser): Promise<ChecklistTodayResponse> {
  const currentUser = assertMotherUser(user);
  const motherProfile = await resolveMotherContext(currentUser);
  const careDate = todayIstDateOnly();

  const dailyLog = await prisma.dailyLog.findUnique({
    where: {
      motherProfileId_careDate: {
        motherProfileId: motherProfile.id,
        careDate,
      },
    },
  });

  return {
    success: true,
    data: toTodayData(dailyLog),
  };
}

export async function logTodayChecklistForMother(user: RequestUser, input: ChecklistLogInput): Promise<ChecklistTodayResponse> {
  const currentUser = assertMotherUser(user);
  const motherProfile = await resolveMotherContext(currentUser);
  const careDate = todayIstDateOnly();

  const existing = await prisma.dailyLog.findUnique({
    where: {
      motherProfileId_careDate: {
        motherProfileId: motherProfile.id,
        careDate,
      },
    },
  });

  const patch = mergeChecklistPatch(existing, input);

  const record = await prisma.dailyLog.upsert({
    where: {
      motherProfileId_careDate: {
        motherProfileId: motherProfile.id,
        careDate,
      },
    },
    create: {
      motherProfileId: motherProfile.id,
      careDate,
      ...patch,
    },
    update: patch,
  });

  return {
    success: true,
    data: toTodayData(record),
  };
}

export async function getChecklistHistoryForMother(user: RequestUser, days: 7 | 30): Promise<ChecklistHistoryResponse> {
  const currentUser = assertMotherUser(user);
  const motherProfile = await resolveMotherContext(currentUser);
  const endDate = todayIstDateOnly();
  const startDate = addDateOnlyDays(endDate, -(days - 1));

  const records = await prisma.dailyLog.findMany({
    where: {
      motherProfileId: motherProfile.id,
      careDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      careDate: 'desc',
    },
  });

  return {
    success: true,
    data: {
      days,
      records: records.map((record: DailyLog) => ({
        careDate: formatDateOnly(record.careDate),
        completedCount: resolveCompletion({
          breastfeedingDone: record.breastfeedingDone,
          kmcDone: record.kmcDone,
          temperatureDone: record.temperatureDone,
          skinCordCareDone: record.skinCordCareDone,
          dangerSignsReviewed: record.dangerSignsReviewed,
        }).completedCount,
        totalCount: REQUIRED_TOTAL,
        completionPercent: resolveCompletion({
          breastfeedingDone: record.breastfeedingDone,
          kmcDone: record.kmcDone,
          temperatureDone: record.temperatureDone,
          skinCordCareDone: record.skinCordCareDone,
          dangerSignsReviewed: record.dangerSignsReviewed,
        }).percent,
      })),
    },
  };
}

export function mapChecklistToDashboard(log: DailyLog | null) {
  const today = toTodayData(log);

  return {
    careToday: {
      date: today.careDate,
      available: true,
      completedCount: today.completion.completedCount,
      totalCount: today.completion.totalCount,
      completionPercent: today.completion.percent,
      source: (log ? 'daily_log' : 'not_configured') as 'daily_log' | 'not_configured',
    },
    feeding: {
      available: Boolean(log && log.breastfeedingFeedsCount !== null && log.breastfeedingFeedsCount !== undefined),
      completedFeeds: log?.breastfeedingFeedsCount ?? null,
      targetFeedsMin: 8,
      targetFeedsMax: 12,
      source: (log ? 'daily_log' : 'not_configured') as 'daily_log' | 'not_configured',
    },
    healthStats: {
      lastTemperatureC: log?.temperatureEveningC != null ? Number(log.temperatureEveningC) : log?.temperatureMorningC != null ? Number(log.temperatureMorningC) : null,
      lastWeightGrams: log?.weightGrams ?? null,
      lastSpO2Percent: null,
      weightSource: log?.weightGrams != null ? 'daily_log' : 'none',
    },
  };
}