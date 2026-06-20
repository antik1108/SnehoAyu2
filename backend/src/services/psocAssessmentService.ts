import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';
import { isPsocContentReady, psocQuestions, psocScale, PSOC_MAX_SCORE, type PsocQuestionId, type PsocResponseValue } from '../content/psocQuestions.js';
import type { KnowledgeLanguage, KnowledgeTimePoint } from '../content/knowledgeQuestions.js';
import type { PsocSubmitInput } from '../validators/psocAssessmentValidator.js';
import { scorePsoc } from '../utils/psocScoring.js';
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
  return psocQuestions.map((question) => ({
    id: question.id,
    order: question.order,
    text: textForLanguage(question.text, language),
    contentStatus: question.contentStatus,
  }));
}

function publicScale(language: KnowledgeLanguage) {
  return psocScale.map((option) => ({
    value: option.value,
    label: option.label[language] ?? option.label.en,
  }));
}

function mapPsocRecord(record: {
  timePoint: string;
  rawResponses?: unknown;
  scoredResponses?: unknown;
  efficacyScore: number;
  satisfactionScore: number;
  totalScore: number;
  maxScore: number;
  classification: string | null;
  classificationMethod: string | null;
  submittedAt: Date;
}) {
  return {
    timePoint: record.timePoint,
    responses: record.rawResponses as Record<PsocQuestionId, PsocResponseValue> | undefined,
    efficacyScore: record.efficacyScore,
    satisfactionScore: record.satisfactionScore,
    totalScore: record.totalScore,
    maxScore: record.maxScore,
    classification: record.classification,
    classificationMethod: record.classificationMethod,
    submittedAt: record.submittedAt.toISOString(),
    locked: true,
  };
}

export async function getPsocQuestionsForMother(user: AssessmentRequestUser, timePoint: KnowledgeTimePoint, language: KnowledgeLanguage) {
  const currentUser = assertMotherAssessmentUser(user);
  const motherProfile = await resolveAssessmentMotherContext(currentUser);
  await resolveAssessmentFollowUpSchedule(motherProfile.id, timePoint);

  return {
    success: true,
    data: {
      timePoint,
      contentReady: isPsocContentReady(),
      questions: publicQuestions(language),
      scale: publicScale(language),
    },
  };
}

export async function getPsocStatusForMother(user: AssessmentRequestUser, timePoint: KnowledgeTimePoint) {
  const currentUser = assertMotherAssessmentUser(user);
  const motherProfile = await resolveAssessmentMotherContext(currentUser);
  await resolveAssessmentFollowUpSchedule(motherProfile.id, timePoint);

  const existing = await prisma.psocAssessment.findUnique({
    where: { motherProfileId_timePoint: { motherProfileId: motherProfile.id, timePoint } },
  });

  return {
    success: true,
    data: {
      timePoint,
      available: true,
      submitted: Boolean(existing),
      locked: Boolean(existing),
      efficacyScore: existing?.efficacyScore ?? null,
      satisfactionScore: existing?.satisfactionScore ?? null,
      totalScore: existing?.totalScore ?? null,
      maxScore: PSOC_MAX_SCORE,
      classification: existing?.classification ?? null,
      classificationMethod: existing?.classificationMethod ?? 'requires_cohort_norms',
      submittedAt: existing?.submittedAt.toISOString() ?? null,
      contentReady: isPsocContentReady(),
    },
  };
}

export async function getPsocSubmissionForMother(user: AssessmentRequestUser, timePoint: KnowledgeTimePoint) {
  const currentUser = assertMotherAssessmentUser(user);
  const motherProfile = await resolveAssessmentMotherContext(currentUser);
  await resolveAssessmentFollowUpSchedule(motherProfile.id, timePoint);

  const existing = await prisma.psocAssessment.findUnique({
    where: { motherProfileId_timePoint: { motherProfileId: motherProfile.id, timePoint } },
  });

  if (!existing) {
    throw createError(404, 'ASSESSMENT_NOT_FOUND', 'No submitted PSOC assessment was found for this time point.');
  }

  return { success: true, data: mapPsocRecord(existing) };
}

export async function submitPsocAssessmentForMother(user: AssessmentRequestUser, input: PsocSubmitInput) {
  const currentUser = assertMotherAssessmentUser(user);
  const motherProfile = await resolveAssessmentMotherContext(currentUser);
  const followUpSchedule = await resolveAssessmentFollowUpSchedule(motherProfile.id, input.timePoint);

  if (!isPsocContentReady()) {
    throw createError(400, 'ASSESSMENT_CONTENT_NOT_CONFIGURED', 'Approved PSOC assessment content and translations are required before submission.');
  }

  const existing = await prisma.psocAssessment.findUnique({
    where: { motherProfileId_timePoint: { motherProfileId: motherProfile.id, timePoint: input.timePoint } },
  });

  if (existing) {
    throw createError(409, 'ASSESSMENT_ALREADY_SUBMITTED', 'This PSOC assessment has already been submitted and is locked.');
  }

  const scored = scorePsoc(input.responses);

  try {
    const record = await prisma.psocAssessment.create({
      data: {
        motherProfileId: motherProfile.id,
        followUpScheduleId: followUpSchedule.id,
        timePoint: input.timePoint,
        rawResponses: input.responses,
        scoredResponses: scored.scoredResponses,
        efficacyScore: scored.efficacyScore,
        satisfactionScore: scored.satisfactionScore,
        totalScore: scored.totalScore,
        maxScore: scored.maxScore,
        classification: scored.classification,
        classificationMethod: scored.classificationMethod,
      },
    });

    return {
      success: true,
      message: 'PSOC assessment submitted successfully.',
      data: mapPsocRecord(record),
    };
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'P2002') {
      throw createError(409, 'ASSESSMENT_ALREADY_SUBMITTED', 'This PSOC assessment has already been submitted and is locked.');
    }
    throw error;
  }
}
