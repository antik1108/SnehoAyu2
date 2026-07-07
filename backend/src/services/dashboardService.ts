import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';
import { calculateCorrectedAge, diffInDaysUtc, formatAgeDays, formatAgeWeeks, todayUtcDateOnly } from '../utils/age.js';
import { formatDateOnly } from '../utils/dateOnly.js';
import { mapChecklistToDashboard } from './checklistService.js';
import { getLatestGrowthReadingForDashboard } from './growthService.js';
import { resolveDailyMessageForMother } from './messageService.js';

type RequestUser = {
  id: string;
  role: string;
  preferredLanguage: string;
};

type DashboardHomeResponse = {
  status: 'ok';
  data: {
    onboardingState: 'complete' | 'mother_profile_required' | 'baby_profile_required' | 'hospital_link_required' | 'participant_code_required' | 'onboarding_incomplete';
    baby: {
      name: string | null;
      displayName: string;
      sex: 'male' | 'female';
      dateOfBirth: string;
      dischargeDate: string;
      gestationalAgeWeeks: number;
      chronologicalAgeDays: number;
      chronologicalAgeWeeks: number;
      correctedAgeDays: number;
      correctedAgeWeeks: number;
      ageDisplay: string;
      correctedAgeDisplay: string;
      latestWeightGrams: number | null;
      latestWeightSource: 'discharge' | 'growth' | 'none';
    } | null;
    participant: {
      participantCode: string;
      studyGroup: 'study' | 'control';
    } | null;
    hospital: {
      code: string;
      name: string;
      emergencyPhone: string | null;
    } | null;
    careToday: {
      date: string;
      available: boolean;
      completedCount: number;
      totalCount: number;
      completionPercent: number;
      source: 'daily_log' | 'not_configured';
    };
    feeding: {
      available: boolean;
      completedFeeds: number | null;
      targetFeedsMin: number;
      targetFeedsMax: number;
      source: 'daily_log' | 'not_configured';
    };
    healthStats: {
      lastTemperatureC: number | null;
      lastWeightGrams: number | null;
      lastSpO2Percent: number | null;
      weightSource: 'discharge' | 'growth' | 'none';
    };
    nextReminder: {
      type: 'follow_up' | 'vaccination' | 'none';
      title: string | null;
      date: string | null;
      daysRemaining: number | null;
      status: string | null;
    };
    dailyMessage: {
      available: boolean;
      text: string | null;
      language: 'bn' | 'hi' | 'en';
      source: 'message_scheduler' | 'not_configured';
    };
  };
};

function assertMotherUser(user: RequestUser | undefined): RequestUser {
  if (!user) {
    throw createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.');
  }

  if (user.role !== 'mother') {
    throw createError(403, 'MOTHER_ROLE_REQUIRED', 'Only authenticated mothers can access the dashboard.');
  }

  return user;
}

function buildAgeDisplay(days: number): string {
  if (days < 7) {
    return formatAgeDays(days);
  }

  const weeks = Math.floor(days / 7);
  const remainder = days % 7;
  return remainder === 0 ? formatAgeWeeks(weeks) : `${weeks} weeks ${remainder} days`;
}

function buildCorrectedAgeDisplay(days: number): string {
  if (days <= 0) {
    return '0 days';
  }

  return buildAgeDisplay(days);
}

export async function getDashboardHomeForMother(user: RequestUser): Promise<DashboardHomeResponse> {
  const currentUser = assertMotherUser(user);
  const motherProfile = await prisma.motherProfile.findUnique({
    where: { userId: currentUser.id },
    include: {
      babyProfile: true,
      hospital: true,
      followUpSchedules: true,
    },
  });

  if (!motherProfile) {
    throw createError(409, 'MOTHER_PROFILE_REQUIRED', 'Complete the mother profile before opening the dashboard.');
  }

  if (!motherProfile.babyProfile) {
    throw createError(409, 'BABY_PROFILE_REQUIRED', 'Complete the baby profile before opening the dashboard.');
  }

  if (!motherProfile.hospitalId || !motherProfile.hospital) {
    throw createError(409, 'HOSPITAL_LINK_REQUIRED', 'Link a hospital before opening the dashboard.');
  }

  if (!motherProfile.participantCode || !motherProfile.studyGroup || (motherProfile.studyGroup !== 'study' && motherProfile.studyGroup !== 'control')) {
    throw createError(409, 'PARTICIPANT_CODE_REQUIRED', 'Generate a participant code before opening the dashboard.');
  }

  const babyProfile = motherProfile.babyProfile;
  const hospital = motherProfile.hospital;
  const today = todayUtcDateOnly();
  const gestationalAgeWeeks = Number(babyProfile.gestationalAgeWeeks.toString());
  const age = calculateCorrectedAge({
    dateOfBirth: babyProfile.dateOfBirth,
    gestationalAgeWeeks,
    referenceDate: today,
  });
  const pendingSchedules = motherProfile.followUpSchedules
    .filter((schedule) => schedule.status === 'pending')
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
  const nextReminder = pendingSchedules[0] ?? null;
  const participantCode = {
    participantCode: motherProfile.participantCode,
    studyGroup: motherProfile.studyGroup as 'study' | 'control',
  };
  const dailyLog = await prisma.dailyLog.findUnique({
    where: {
      motherProfileId_careDate: {
        motherProfileId: motherProfile.id,
        careDate: today,
      },
    },
  });
  const checklistSummary = mapChecklistToDashboard(dailyLog);
  const latestGrowth = await getLatestGrowthReadingForDashboard(motherProfile.id, babyProfile.id);
  const latestWeightGrams = latestGrowth?.weightGrams ?? babyProfile.weightAtDischargeGrams ?? null;
  const latestWeightSource = latestGrowth ? 'growth' : babyProfile.weightAtDischargeGrams ? 'discharge' : 'none';

  return {
    status: 'ok',
    data: {
      onboardingState: motherProfile.onboardingCompletedAt ? 'complete' : 'onboarding_incomplete',
      baby: {
        name: babyProfile.babyName,
        displayName: babyProfile.babyName?.trim() || 'Your baby',
        sex: babyProfile.sex === 'female' ? 'female' : 'male',
        dateOfBirth: formatDateOnly(babyProfile.dateOfBirth),
        dischargeDate: formatDateOnly(babyProfile.dischargeDate),
        gestationalAgeWeeks,
        chronologicalAgeDays: age.chronologicalAgeDays,
        chronologicalAgeWeeks: Math.floor(age.chronologicalAgeDays / 7),
        correctedAgeDays: age.correctedAgeDays,
        correctedAgeWeeks: Math.floor(age.correctedAgeDays / 7),
        ageDisplay: buildAgeDisplay(age.chronologicalAgeDays),
        correctedAgeDisplay: buildCorrectedAgeDisplay(age.correctedAgeDays),
        latestWeightGrams,
        latestWeightSource,
      },
      participant: participantCode,
      hospital: {
        code: hospital.code,
        name: hospital.name,
        emergencyPhone: hospital.emergencyPhone ?? null,
      },
      careToday: checklistSummary.careToday,
      feeding: checklistSummary.feeding,
      healthStats: {
        lastTemperatureC: checklistSummary.healthStats.lastTemperatureC,
        lastWeightGrams: latestWeightGrams,
        lastSpO2Percent: checklistSummary.healthStats.lastSpO2Percent,
        weightSource: latestWeightSource,
      },
      nextReminder: nextReminder
        ? {
            type: 'follow_up',
            title: nextReminder.timePoint,
            date: formatDateOnly(nextReminder.scheduledDate),
            daysRemaining: diffInDaysUtc(nextReminder.scheduledDate, today),
            status: nextReminder.status,
          }
        : {
            type: 'none',
            title: null,
            date: null,
            daysRemaining: null,
            status: null,
          },
      dailyMessage: (() => {
        const language: 'bn' | 'hi' | 'en' = currentUser.preferredLanguage === 'hi' || currentUser.preferredLanguage === 'en' ? currentUser.preferredLanguage : 'bn';
        // Phase 2: message selection uses corrected age (KB §2 implementation rule).
        const { text } = resolveDailyMessageForMother(
          babyProfile.dateOfBirth,
          gestationalAgeWeeks,
          babyProfile.dischargeDate,
          today,
          language,
        );
        return {
          available: text !== null,
          text,
          language,
          source: text !== null ? 'message_scheduler' as const : 'not_configured' as const,
        };
      })(),
    },
  };
}
