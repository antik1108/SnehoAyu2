import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';
import {
  KNOWLEDGE_MAX_SCORE,
  knowledgeQuestions,
  isKnowledgeContentReady,
  type KnowledgeGrade,
  type KnowledgeLanguage,
  type KnowledgeQuestionId,
  type KnowledgeTimePoint,
} from '../content/knowledgeQuestions.js';
import type { KnowledgeSubmitInput } from '../validators/knowledgeAssessmentValidator.js';

type RequestUser = {
  id: string;
  role: string;
  preferredLanguage: string;
};

export interface PublicKnowledgeQuestion {
  id: KnowledgeQuestionId;
  order: number;
  topic: string;
  text: string | null;
  contentStatus: 'approved' | 'approval_required';
  options: Array<{
    id: string;
    text: string | null;
  }>;
}

function assertMotherUser(user: RequestUser | undefined): RequestUser {
  if (!user) {
    throw createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.');
  }

  if (user.role !== 'mother') {
    throw createError(403, 'MOTHER_ROLE_REQUIRED', 'Only authenticated mothers can access assessments.');
  }

  return user;
}

async function resolveMotherContext(user: RequestUser) {
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

async function resolveFollowUpSchedule(motherProfileId: string, timePoint: KnowledgeTimePoint) {
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

function textForLanguage(text: Partial<Record<KnowledgeLanguage, string>>, language: KnowledgeLanguage): string | null {
  return text[language] ?? text.en ?? null;
}

function publicQuestions(language: KnowledgeLanguage): PublicKnowledgeQuestion[] {
  return knowledgeQuestions
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((question) => ({
      id: question.id,
      order: question.order,
      topic: question.topic,
      text: textForLanguage(question.text, language),
      contentStatus: question.contentStatus,
      options: question.options.map((option) => ({
        id: option.id,
        text: textForLanguage(option.text, language),
      })),
    }));
}

function calculateGrade(score: number): KnowledgeGrade {
  if (score <= 5) return 'poor';
  if (score <= 10) return 'moderate';
  return 'good';
}

function calculateScore(responses: KnowledgeSubmitInput['responses']): number {
  return knowledgeQuestions.reduce((score, question) => {
    if (question.correctOptionId !== null && responses[question.id] === question.correctOptionId) {
      return score + 1;
    }
    return score;
  }, 0);
}

function mapAssessment(record: {
  timePoint: string;
  responses: unknown;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  submittedAt: Date;
}) {
  return {
    timePoint: record.timePoint,
    responses: record.responses,
    score: record.score,
    maxScore: record.maxScore,
    percentage: record.percentage,
    grade: record.grade,
    submittedAt: record.submittedAt.toISOString(),
    locked: true,
  };
}

export async function getKnowledgeQuestionsForMother(
  user: RequestUser,
  timePoint: KnowledgeTimePoint,
  language: KnowledgeLanguage
) {
  const currentUser = assertMotherUser(user);
  const motherProfile = await resolveMotherContext(currentUser);
  await resolveFollowUpSchedule(motherProfile.id, timePoint);

  return {
    success: true,
    data: {
      timePoint,
      contentReady: isKnowledgeContentReady(),
      questions: publicQuestions(language),
    },
  };
}

export async function getKnowledgeStatusForMother(user: RequestUser, timePoint: KnowledgeTimePoint) {
  const currentUser = assertMotherUser(user);
  const motherProfile = await resolveMotherContext(currentUser);
  await resolveFollowUpSchedule(motherProfile.id, timePoint);

  const existing = await prisma.knowledgeAssessment.findUnique({
    where: {
      motherProfileId_timePoint: {
        motherProfileId: motherProfile.id,
        timePoint,
      },
    },
  });

  return {
    success: true,
    data: {
      timePoint,
      available: true,
      submitted: Boolean(existing),
      locked: Boolean(existing),
      score: existing?.score ?? null,
      maxScore: KNOWLEDGE_MAX_SCORE,
      percentage: existing?.percentage ?? null,
      grade: existing?.grade ?? null,
      submittedAt: existing?.submittedAt.toISOString() ?? null,
      contentReady: isKnowledgeContentReady(),
    },
  };
}

export async function getKnowledgeSubmissionForMother(user: RequestUser, timePoint: KnowledgeTimePoint) {
  const currentUser = assertMotherUser(user);
  const motherProfile = await resolveMotherContext(currentUser);
  await resolveFollowUpSchedule(motherProfile.id, timePoint);

  const existing = await prisma.knowledgeAssessment.findUnique({
    where: {
      motherProfileId_timePoint: {
        motherProfileId: motherProfile.id,
        timePoint,
      },
    },
  });

  if (!existing) {
    throw createError(404, 'ASSESSMENT_NOT_FOUND', 'No submitted knowledge assessment was found for this time point.');
  }

  return {
    success: true,
    data: mapAssessment(existing),
  };
}

export async function submitKnowledgeAssessmentForMother(user: RequestUser, input: KnowledgeSubmitInput) {
  const currentUser = assertMotherUser(user);
  const motherProfile = await resolveMotherContext(currentUser);
  const followUpSchedule = await resolveFollowUpSchedule(motherProfile.id, input.timePoint);

  if (!isKnowledgeContentReady()) {
    throw createError(
      400,
      'KNOWLEDGE_CONTENT_NOT_CONFIGURED',
      'Approved Knowledge Assessment Tool III question wording and answer options are required before submission.'
    );
  }

  const existing = await prisma.knowledgeAssessment.findUnique({
    where: {
      motherProfileId_timePoint: {
        motherProfileId: motherProfile.id,
        timePoint: input.timePoint,
      },
    },
  });

  if (existing) {
    throw createError(409, 'ASSESSMENT_ALREADY_SUBMITTED', 'This knowledge assessment has already been submitted and is locked.');
  }

  const score = calculateScore(input.responses);
  const percentage = Math.round((score / KNOWLEDGE_MAX_SCORE) * 100);
  const grade = calculateGrade(score);

  try {
    const record = await prisma.knowledgeAssessment.create({
      data: {
        motherProfileId: motherProfile.id,
        followUpScheduleId: followUpSchedule.id,
        timePoint: input.timePoint,
        responses: input.responses,
        score,
        maxScore: KNOWLEDGE_MAX_SCORE,
        percentage,
        grade,
      },
    });

    return {
      success: true,
      message: 'Knowledge assessment submitted successfully.',
      data: {
        timePoint: record.timePoint,
        score: record.score,
        maxScore: record.maxScore,
        percentage: record.percentage,
        grade: record.grade,
        submittedAt: record.submittedAt.toISOString(),
        locked: true,
      },
    };
  } catch (error) {
    if (
      typeof error === 'object'
      && error !== null
      && 'code' in error
      && (error as { code?: string }).code === 'P2002'
    ) {
      throw createError(409, 'ASSESSMENT_ALREADY_SUBMITTED', 'This knowledge assessment has already been submitted and is locked.');
    }

    throw error;
  }
}
