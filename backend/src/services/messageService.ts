import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';
import { getTodayMessage } from '../content/careMessages.js';

type RequestUser = { id: string; role: string; preferredLanguage: string };

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

export function resolveDailyMessageForMother(dischargeDate: Date, referenceDate: Date, language: 'bn' | 'hi' | 'en') {
  const week = computeStudyWeek(dischargeDate, referenceDate);
  return { week, text: getTodayMessage(week, language) };
}
