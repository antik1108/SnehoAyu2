import { isKnowledgeTimePoint, type KnowledgeTimePoint } from '../content/knowledgeQuestions.js';
import { psocQuestions, type PsocQuestionId, type PsocResponseValue } from '../content/psocQuestions.js';
import type { ValidationError, ValidationResult } from './knowledgeAssessmentValidator.js';

export interface PsocSubmitInput {
  timePoint: KnowledgeTimePoint;
  responses: Record<PsocQuestionId, PsocResponseValue>;
}

const forbiddenFields = new Set([
  'rawResponses',
  'scoredResponses',
  'efficacyScore',
  'satisfactionScore',
  'totalScore',
  'maxScore',
  'classification',
  'classificationMethod',
  'motherProfileId',
  'userId',
  'participantCode',
  'followUpScheduleId',
  'submittedAt',
]);

const questionIds = psocQuestions.map((question) => question.id);
const questionIdSet = new Set<string>(questionIds);

function isPsocResponseValue(value: unknown): value is PsocResponseValue {
  return Number.isInteger(value) && typeof value === 'number' && value >= 1 && value <= 6;
}

export function validatePsocSubmitInput(body: unknown): ValidationResult<PsocSubmitInput> {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { valid: false, errors: [{ field: 'body', message: 'Request body must be an object.' }] };
  }

  const input = body as Record<string, unknown>;
  for (const field of Object.keys(input)) {
    if (forbiddenFields.has(field)) {
      errors.push({ field, message: `${field} must not be submitted by the client.` });
    }
  }

  if (!isKnowledgeTimePoint(input['timePoint'])) {
    errors.push({ field: 'timePoint', message: 'Invalid assessment time point.' });
  }

  const responses = input['responses'];
  if (!responses || typeof responses !== 'object' || Array.isArray(responses)) {
    errors.push({ field: 'responses', message: 'responses must be an object keyed by item id.' });
  } else {
    const responseMap = responses as Record<string, unknown>;
    const responseKeys = Object.keys(responseMap);
    const extraKeys = responseKeys.filter((key) => !questionIdSet.has(key));
    const missingKeys = questionIds.filter((key) => !(key in responseMap));

    if (responseKeys.length !== questionIds.length || extraKeys.length > 0 || missingKeys.length > 0) {
      errors.push({ field: 'responses', message: 'responses must include exactly one answer for each PSOC item.' });
    }

    for (const question of psocQuestions) {
      const selected = responseMap[question.id];
      if (selected === undefined) continue;
      if (!isPsocResponseValue(selected)) {
        errors.push({ field: `responses.${question.id}`, message: 'PSOC responses must be integer values from 1 to 6.' });
      }
    }
  }

  if (errors.length > 0 || !isKnowledgeTimePoint(input['timePoint']) || !responses || typeof responses !== 'object' || Array.isArray(responses)) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      timePoint: input['timePoint'],
      responses: responses as Record<PsocQuestionId, PsocResponseValue>,
    },
    errors: [],
  };
}
