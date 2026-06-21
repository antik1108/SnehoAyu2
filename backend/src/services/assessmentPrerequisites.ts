import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';
import type { KnowledgeTimePoint } from '../content/knowledgeQuestions.js';

export type AssessmentRequestUser = {
  id: string;
  role: string;
  preferredLanguage: string;
};

export function assertMotherAssessmentUser(user: AssessmentRequestUser | undefined): AssessmentRequestUser {
  if (!user) {
    throw createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.');
  }

  if (user.role !== 'mother') {
    throw createError(403, 'MOTHER_ROLE_REQUIRED', 'Only authenticated mothers can access assessments.');
  }

  return user;
}

export async function resolveAssessmentMotherContext(user: AssessmentRequestUser) {
  const motherProfile = await prisma.motherProfile.findUnique({
    where: { userId: user.id },
    include: {
      babyProfile: true,
    },
  });

  if (!motherProfile) {
    throw createError(409, 'MOTHER_PROFILE_REQUIRED', 'Complete the mother profile before opening assessments.');
  }

  if (!motherProfile.babyProfile) {
    throw createError(409, 'BABY_PROFILE_REQUIRED', 'Complete the baby profile before opening assessments.');
  }

  if (!motherProfile.onboardingCompletedAt) {
    throw createError(409, 'ONBOARDING_INCOMPLETE', 'Complete onboarding before opening assessments.');
  }

  return motherProfile;
}

export type StaffUser = { id: string; role: string; hospitalId?: string | null };

/**
 * Resolves the mother/baby context for a *staff member entering data on the
 * participant's behalf* (nurse at a follow-up visit, researcher), as
 * opposed to the mother's own self-service session. A nurse may only act
 * on participants enrolled at her own hospital; a researcher may act on
 * any participant. Mirrors `resolveAssessmentMotherContext` but resolves
 * by `motherProfileId` (chosen from the participant list) instead of the
 * caller's own `userId`.
 */
export async function resolveStaffMotherContext(staffUser: StaffUser | undefined, motherProfileId: string) {
  if (!staffUser) {
    throw createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.');
  }

  if (staffUser.role !== 'nurse' && staffUser.role !== 'researcher') {
    throw createError(403, 'STAFF_ROLE_REQUIRED', 'Only nurses or researchers can record data on behalf of a participant.');
  }

  const motherProfile = await prisma.motherProfile.findUnique({
    where: { id: motherProfileId },
    include: { babyProfile: true },
  });

  if (!motherProfile) {
    throw createError(404, 'PARTICIPANT_NOT_FOUND', 'Participant not found.');
  }

  // Nurses are scoped to their own hospital — a 404 (not 403) avoids
  // confirming that a participant exists at a different hospital.
  if (staffUser.role === 'nurse' && motherProfile.hospitalId !== staffUser.hospitalId) {
    throw createError(404, 'PARTICIPANT_NOT_FOUND', 'Participant not found.');
  }

  if (!motherProfile.babyProfile) {
    throw createError(409, 'BABY_PROFILE_REQUIRED', "This participant hasn't completed the baby profile yet.");
  }

  return motherProfile;
}

export async function resolveAssessmentFollowUpSchedule(motherProfileId: string, timePoint: KnowledgeTimePoint) {
  const followUpSchedule = await prisma.followUpSchedule.findUnique({
    where: {
      motherProfileId_timePoint: {
        motherProfileId,
        timePoint,
      },
    },
  });

  if (!followUpSchedule) {
    throw createError(404, 'FOLLOW_UP_NOT_FOUND', 'No follow-up schedule exists for this assessment time point.');
  }

  return followUpSchedule;
}
