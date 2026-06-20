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
