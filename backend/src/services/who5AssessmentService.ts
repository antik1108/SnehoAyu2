import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';
import { isWho5ContentReady, who5Questions, who5Scale, WHO5_MAX_SCORE, type Who5QuestionId, type Who5ResponseValue } from '../content/who5Questions.js';
import type { KnowledgeLanguage, KnowledgeTimePoint } from '../content/knowledgeQuestions.js';
import type { Who5SubmitInput } from '../validators/who5AssessmentValidator.js';
import { scoreWho5 } from '../utils/who5Scoring.js';
import {
  assertMotherAssessmentUser,
  resolveAssessmentFollowUpSchedule,
  resolveAssessmentMotherContext,
  type AssessmentRequestUser,
} from './assessmentPrerequisites.js';

function textForLanguage(text: Partial<Record<KnowledgeLanguage, string>>, language: KnowledgeLanguage): string | null {
  return text[language] ?? text.en ?? null;
}

function publicQuestions(language: KnowledgeLanguage) {
  return who5Questions.map((question) => ({
    id: question.id,
    order: question.order,
    text: textForLanguage(question.text, language),
    contentStatus: question.contentStatus,
  }));
}

function publicScale(language: KnowledgeLanguage) {
  return who5Scale.map((option) => ({
    value: option.value,
    label: option.label[language] ?? option.label.en,
  }));
}

function mapWho5Record(record: {
  timePoint: string;
  responses: unknown;
  rawScore: number;
  maxScore: number;
  percentageScore: number;
  poorWellbeingFlag: boolean;
  interpretation: string;
  submittedAt: Date;
}) {
  return {
    timePoint: record.timePoint,
    responses: record.responses as Record<Who5QuestionId, Who5ResponseValue>,
    rawScore: record.rawScore,
    maxScore: record.maxScore,
    percentageScore: record.percentageScore,
    poorWellbeingFlag: record.poorWellbeingFlag,
    interpretation: record.interpretation,
    submittedAt: record.submittedAt.toISOString(),
    locked: true,
  };
}

export async function getWho5QuestionsForMother(user: AssessmentRequestUser, timePoint: KnowledgeTimePoint, language: KnowledgeLanguage) {
  const currentUser = assertMotherAssessmentUser(user);
  const motherProfile = await resolveAssessmentMotherContext(currentUser);
  await resolveAssessmentFollowUpSchedule(motherProfile.id, timePoint);

  return {
    success: true,
    data: {
      timePoint,
      contentReady: isWho5ContentReady(),
      questions: publicQuestions(language),
      scale: publicScale(language),
    },
  };
}

export async function getWho5StatusForMother(user: AssessmentRequestUser, timePoint: KnowledgeTimePoint) {
  const currentUser = assertMotherAssessmentUser(user);
  const motherProfile = await resolveAssessmentMotherContext(currentUser);
  await resolveAssessmentFollowUpSchedule(motherProfile.id, timePoint);

  const existing = await prisma.who5Assessment.findUnique({
    where: { motherProfileId_timePoint: { motherProfileId: motherProfile.id, timePoint } },
  });

  return {
    success: true,
    data: {
      timePoint,
      available: true,
      submitted: Boolean(existing),
      locked: Boolean(existing),
      rawScore: existing?.rawScore ?? null,
      maxScore: WHO5_MAX_SCORE,
      percentageScore: existing?.percentageScore ?? null,
      poorWellbeingFlag: existing?.poorWellbeingFlag ?? null,
      interpretation: existing?.interpretation ?? null,
      submittedAt: existing?.submittedAt.toISOString() ?? null,
      contentReady: isWho5ContentReady(),
    },
  };
}

export async function getWho5SubmissionForMother(user: AssessmentRequestUser, timePoint: KnowledgeTimePoint) {
  const currentUser = assertMotherAssessmentUser(user);
  const motherProfile = await resolveAssessmentMotherContext(currentUser);
  await resolveAssessmentFollowUpSchedule(motherProfile.id, timePoint);

  const existing = await prisma.who5Assessment.findUnique({
    where: { motherProfileId_timePoint: { motherProfileId: motherProfile.id, timePoint } },
  });

  if (!existing) {
    throw createError(404, 'ASSESSMENT_NOT_FOUND', 'No submitted WHO-5 assessment was found for this time point.');
  }

  return { success: true, data: mapWho5Record(existing) };
}

export async function submitWho5AssessmentForMother(user: AssessmentRequestUser, input: Who5SubmitInput) {
  const currentUser = assertMotherAssessmentUser(user);
  const motherProfile = await resolveAssessmentMotherContext(currentUser);
  const followUpSchedule = await resolveAssessmentFollowUpSchedule(motherProfile.id, input.timePoint);

  if (!isWho5ContentReady()) {
    throw createError(400, 'ASSESSMENT_CONTENT_NOT_CONFIGURED', 'Approved WHO-5 assessment content and translations are required before submission.');
  }

  const existing = await prisma.who5Assessment.findUnique({
    where: { motherProfileId_timePoint: { motherProfileId: motherProfile.id, timePoint: input.timePoint } },
  });

  if (existing) {
    throw createError(409, 'ASSESSMENT_ALREADY_SUBMITTED', 'This WHO-5 assessment has already been submitted and is locked.');
  }

  const scored = scoreWho5(input.responses);

  try {
    const record = await prisma.who5Assessment.create({
      data: {
        motherProfileId: motherProfile.id,
        followUpScheduleId: followUpSchedule.id,
        timePoint: input.timePoint,
        responses: input.responses,
        rawScore: scored.rawScore,
        maxScore: scored.maxScore,
        percentageScore: scored.percentageScore,
        poorWellbeingFlag: scored.poorWellbeingFlag,
        interpretation: scored.interpretation,
      },
    });

    return {
      success: true,
      message: 'WHO-5 assessment submitted successfully.',
      data: mapWho5Record(record),
    };
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2002') {
      throw createError(409, 'ASSESSMENT_ALREADY_SUBMITTED', 'This WHO-5 assessment has already been submitted and is locked.');
    }
    throw error;
  }
}
