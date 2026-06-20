import prisma from '../lib/prisma.js';
import { getTodayMessage } from '../content/careMessages.js';
import { computeStudyWeek } from '../services/messageService.js';

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function nextMidnightIstDelayMs(): number {
  const now = new Date();
  const istNow = new Date(now.getTime() + IST_OFFSET_MS);
  const istMidnight = new Date(Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate() + 1, 0, 0, 0));
  return istMidnight.getTime() - istNow.getTime();
}

/**
 * Sends (mocked) daily care SMS to all active participants. Logs to console
 * instead of calling a real SMS gateway — wire MSG91/Twilio here for
 * production. Runs once at the next IST midnight, then every 24 hours.
 */
export async function runDailyMessageDelivery(): Promise<void> {
  const today = new Date();

  const motherProfiles = await prisma.motherProfile.findMany({
    where: { onboardingCompletedAt: { not: null } },
    include: { babyProfile: true, user: { select: { preferredLanguage: true, isActive: true } } },
  });

  for (const profile of motherProfiles) {
    if (!profile.babyProfile || !profile.user.isActive) continue;

    const week = computeStudyWeek(profile.babyProfile.dischargeDate, today);
    if (week > 26) continue;

    const language = profile.user.preferredLanguage === 'hi' || profile.user.preferredLanguage === 'en'
      ? profile.user.preferredLanguage
      : 'bn';
    const text = getTodayMessage(week, language as 'bn' | 'hi' | 'en');
    if (!text) continue;

    console.log(`[MockSMS] -> ${profile.participantCode ?? profile.id}: ${text}`);

    let careMessage = await prisma.careMessage.findUnique({
      where: { weekNumber_type: { weekNumber: Math.min(week, 26), type: 'daily' } },
    });
    if (!careMessage) {
      careMessage = await prisma.careMessage.upsert({
        where: { weekNumber_type: { weekNumber: Math.min(week, 26), type: 'daily' } },
        update: {},
        create: { weekNumber: Math.min(week, 26), type: 'daily', textBn: text },
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
