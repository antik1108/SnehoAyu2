import prisma from '../lib/prisma.js';
import { resolveDailyMessage } from '../content/careMessages.js';
import { computeStudyWeek } from '../services/messageService.js';
import { calculateCorrectedAge } from '../utils/age.js';

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function nextMidnightIstDelayMs(): number {
  const now = new Date();
  const istNow = new Date(now.getTime() + IST_OFFSET_MS);
  const istMidnight = new Date(Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate() + 1, 0, 0, 0));
  return istMidnight.getTime() - istNow.getTime();
}

/**
 * Sends (mocked) daily care SMS to all active participants.
 *
 * Phase 2 change: message text is now selected by the baby's corrected age
 * (KB §2 implementation rule) rather than study week. The CareMessage DB row
 * is still keyed by weekNumber (@@unique constraint) so no schema migration is
 * needed — weekNumber is used only as a stable upsert key for delivery logging.
 *
 * Wire MSG91/Twilio in place of console.log for production SMS delivery.
 * Runs once at the next IST midnight, then every 24 hours.
 */
export async function runDailyMessageDelivery(): Promise<void> {
  const today = new Date();

  const motherProfiles = await prisma.motherProfile.findMany({
    where: { onboardingCompletedAt: { not: null } },
    include: {
      babyProfile: true,
      user: { select: { preferredLanguage: true, isActive: true } },
    },
  });

  for (const profile of motherProfiles) {
    if (!profile.babyProfile || !profile.user.isActive) continue;

    // Phase 2: use corrected age for message selection (KB §2).
    const gestationalAgeWeeks = Number(profile.babyProfile.gestationalAgeWeeks.toString());
    const ageResult = calculateCorrectedAge({
      dateOfBirth: profile.babyProfile.dateOfBirth,
      gestationalAgeWeeks,
      referenceDate: today,
    });

    // Study week is kept for the CareMessage DB upsert key only.
    const studyWeek = computeStudyWeek(profile.babyProfile.dischargeDate, today);
    if (studyWeek > 26) continue;

    const language = profile.user.preferredLanguage === 'hi' || profile.user.preferredLanguage === 'en'
      ? profile.user.preferredLanguage as 'hi' | 'en'
      : 'bn';

    const resolved = resolveDailyMessage(ageResult.correctedAgeDays, language);
    if (!resolved) continue;

    console.log(
      `[MockSMS] -> ${profile.participantCode ?? profile.id} ` +
      `(correctedAge=${ageResult.correctedAgeDays}d, week=${studyWeek}, msg=${resolved.messageId}): ` +
      resolved.text,
    );

    // Upsert the CareMessage row using weekNumber as the unique key.
    // textBn is stored for the delivery history; the actual sent text uses
    // the language-resolved value from resolveDailyMessage() above.
    let careMessage = await prisma.careMessage.findUnique({
      where: { weekNumber_type: { weekNumber: Math.min(studyWeek, 26), type: 'daily' } },
    });
    if (!careMessage) {
      careMessage = await prisma.careMessage.upsert({
        where: { weekNumber_type: { weekNumber: Math.min(studyWeek, 26), type: 'daily' } },
        update: {},
        create: {
          weekNumber: Math.min(studyWeek, 26),
          type: 'daily',
          textBn: resolved.text,
          textEn: resolved.text,
        },
      });
    }

    await prisma.messageDelivery.create({
      data: { motherProfileId: profile.id, careMessageId: careMessage.id, channel: 'sms' },
    });
  }
}

export function startMessageScheduler(): void {
  const delay = nextMidnightIstDelayMs();
  setTimeout(() => {
    void runDailyMessageDelivery();
    setInterval(() => void runDailyMessageDelivery(), ONE_DAY_MS);
  }, delay);
}
