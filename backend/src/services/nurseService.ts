import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';
import { listParticipants, getParticipantDetail } from './adminService.js';

type RequestUser = { id: string; role: string; hospitalId?: string | null };

function assertNurseUser(user: RequestUser | undefined): RequestUser & { hospitalId: string } {
  if (!user) throw createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.');
  if (user.role !== 'nurse') throw createError(403, 'NURSE_ROLE_REQUIRED', 'Only authenticated nurses can access this resource.');
  if (!user.hospitalId) throw createError(409, 'NURSE_HOSPITAL_REQUIRED', 'This nurse account is not linked to a hospital.');
  return user as RequestUser & { hospitalId: string };
}

/**
 * Nurses only ever see their own hospital's enrollment progress — never
 * the full cross-hospital admin view, and never study-group assignment or
 * export (those stay researcher-only per the PRD's role split).
 */
export async function getNurseDashboard(user: RequestUser | undefined) {
  const nurse = assertNurseUser(user);

  const [hospital, participants] = await Promise.all([
    prisma.hospital.findUnique({ where: { id: nurse.hospitalId } }),
    listParticipants({ hospitalId: nurse.hospitalId }),
  ]);

  if (!hospital) {
    throw createError(404, 'HOSPITAL_NOT_FOUND', 'Linked hospital not found.');
  }

  const onboardedCount = participants.filter((p) => p.onboardingCompletedAt).length;

  return {
    hospital,
    stats: {
      totalEnrolled: participants.length,
      onboardedCount,
      pendingCount: participants.length - onboardedCount,
    },
    participants,
  };
}

export async function getNurseParticipantDetail(user: RequestUser | undefined, motherProfileId: string) {
  const nurse = assertNurseUser(user);
  const detail = await getParticipantDetail(motherProfileId);

  if (detail.hospitalId !== nurse.hospitalId) {
    // Don't leak whether the participant exists at another hospital.
    throw createError(404, 'PARTICIPANT_NOT_FOUND', 'Participant not found.');
  }

  return detail;
}
