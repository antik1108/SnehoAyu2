import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';
import { calculateCorrectedAge } from '../utils/age.js';
import { resolveDailyMessage, getTodayMessage } from '../content/careMessages.js';

type RequestUser = { id: string; role: string; preferredLanguage: string };

/**
 * @deprecated Retained for the messageScheduler which still uses study-week
 * bucketing for the CareMessage DB unique key. Phase 2 message selection now
 * uses corrected age days via resolveDailyMessage(). This function remains
 * for the scheduler's DB-row keying only — do not use it for message text selection.
 */
export function computeStudyWeek(dischargeDate: Date, referenceDate: Date): number {
  const diffMs = referenceDate.getTime() - dischargeDate.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  return Math.floor(diffDays / 7) + 1;
}

function assertMotherUser(user: RequestUser | undefined): RequestUser {
  if (!user) throw createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.');
  if (user.role !== 'mother') throw createError(403, 'MOTHER_ROLE_REQUIRED', 'Only authenticated mothers can access messages.');
  return user;
}

export async function getMessageHistoryForMother(user: RequestUser) {
  const currentUser = assertMotherUser(user);
  const motherProfile = await prisma.motherProfile.findUnique({ where: { userId: currentUser.id } });
  if (!motherProfile) throw createError(409, 'MOTHER_PROFILE_REQUIRED', 'Complete the mother profile first.');

  const deliveries = await prisma.messageDelivery.findMany({
    where: { motherProfileId: motherProfile.id },
    orderBy: { deliveredAt: 'desc' },
    take: 60,
  });

  const language: 'bn' | 'hi' | 'en' = currentUser.preferredLanguage === 'hi' || currentUser.preferredLanguage === 'en'
    ? currentUser.preferredLanguage
    : 'bn';

  const careMessageIds = deliveries.map((d) => d.careMessageId);
  const messages = await prisma.careMessage.findMany({ where: { id: { in: careMessageIds } } });
  const messageMap = new Map(messages.map((m) => [m.id, m]));

  return {
    success: true,
    data: deliveries.map((d) => {
      const msg = messageMap.get(d.careMessageId);
      const text = language === 'en' ? msg?.textEn ?? msg?.textBn : language === 'hi' ? msg?.textHi ?? msg?.textBn : msg?.textBn;
      return {
        deliveredAt: d.deliveredAt.toISOString(),
        channel: d.channel,
        text: text ?? null,
      };
    }),
  };
}

/**
 * Resolves the daily care message for a mother based on the baby's corrected
 * age — the Phase 2 implementation. Corrected age is calculated from
 * dateOfBirth + gestationalAgeWeeks so that preterm infants receive
 * age-appropriate messages from day 1 post-discharge.
 *
 * @param dateOfBirth       Baby's date of birth
 * @param gestationalAgeWeeks  Gestational age at birth (e.g. 32.0)
 * @param dischargeDate     Discharge date (used as study-start reference for legacy week calc)
 * @param referenceDate     Today's date
 * @param language          Preferred language for text
 */
export function resolveDailyMessageForMother(
  dateOfBirth: Date,
  gestationalAgeWeeks: number,
  dischargeDate: Date,
  referenceDate: Date,
  language: 'bn' | 'hi' | 'en',
): { correctedAgeDays: number; studyWeek: number; messageId: string | null; text: string | null } {
  const ageResult = calculateCorrectedAge({
    dateOfBirth,
    gestationalAgeWeeks,
    referenceDate,
  });
  const studyWeek = computeStudyWeek(dischargeDate, referenceDate);
  const resolved = resolveDailyMessage(ageResult.correctedAgeDays, language);
  return {
    correctedAgeDays: ageResult.correctedAgeDays,
    studyWeek,
    messageId: resolved?.messageId ?? null,
    text: resolved?.text ?? null,
  };
}

/**
 * @deprecated Phase 1 signature — accepts only dischargeDate.
 * dashboardService.ts has been updated to call the new signature.
 * This overload is retained temporarily for any callers not yet migrated.
 */
export function resolveDailyMessageLegacy(
  dischargeDate: Date,
  referenceDate: Date,
  language: 'bn' | 'hi' | 'en',
): { week: number; text: string | null } {
  const week = computeStudyWeek(dischargeDate, referenceDate);
  return { week, text: getTodayMessage(week, language) };
}
