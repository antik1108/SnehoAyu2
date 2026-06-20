import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';
import { recordAudit } from './auditService.js';

type RequestUser = { id: string; role: string };

export async function createTelehealthSession(
  researcher: RequestUser,
  motherProfileId: string,
  scheduledAt?: string,
  notes?: string
) {
  if (researcher.role !== 'researcher') {
    throw createError(403, 'RESEARCHER_ROLE_REQUIRED', 'Only researchers can schedule telehealth sessions.');
  }

  const motherProfile = await prisma.motherProfile.findUnique({ where: { id: motherProfileId } });
  if (!motherProfile) {
    throw createError(404, 'PARTICIPANT_NOT_FOUND', 'Participant not found.');
  }

  const session = await prisma.videoCallSession.create({
    data: {
      motherProfileId,
      initiatedByUserId: researcher.id,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
      channel: 'whatsapp',
      notes: notes ?? null,
    },
  });

  void recordAudit({
    actorId: researcher.id,
    actorRole: researcher.role,
    action: 'telehealth.session_scheduled',
    entityType: 'VideoCallSession',
    entityId: session.id,
    metadata: { motherProfileId },
  });

  return {
    success: true,
    message: 'Telehealth session logged successfully.',
    data: { id: session.id, scheduledAt: session.scheduledAt?.toISOString() ?? null },
  };
}

export async function getActiveTelehealthSessionForMother(user: { id: string; role: string }) {
  if (user.role !== 'mother') {
    throw createError(403, 'MOTHER_ROLE_REQUIRED', 'Only authenticated mothers can access this resource.');
  }

  const motherProfile = await prisma.motherProfile.findUnique({ where: { userId: user.id } });
  if (!motherProfile) {
    throw createError(409, 'MOTHER_PROFILE_REQUIRED', 'Complete the mother profile first.');
  }

  const upcoming = await prisma.videoCallSession.findFirst({
    where: { motherProfileId: motherProfile.id, startedAt: null },
    orderBy: { scheduledAt: 'asc' },
  });

  if (!upcoming) {
    return { success: true, data: null };
  }

  return {
    success: true,
    data: {
      id: upcoming.id,
      scheduledAt: upcoming.scheduledAt?.toISOString() ?? null,
    },
  };
}
