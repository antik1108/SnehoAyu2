import { isKnowledgeTimePoint, type KnowledgeTimePoint } from '../content/knowledgeQuestions.js';
import { who5Questions, type Who5QuestionId, type Who5ResponseValue } from '../content/who5Questions.js';
import type { ValidationError, ValidationResult } from './knowledgeAssessmentValidator.js';

export interface Who5SubmitInput {
  timePoint: KnowledgeTimePoint;
  responses: Record<Who5QuestionId, Who5ResponseValue>;
}

const forbiddenFields = new Set([
  'rawScore',
  'maxScore',
  'percentageScore',
  'poorWellbeingFlag',
  'interpretation',
  'motherProfileId',
  'userId',
  'participantCode',
  'followUpScheduleId',
  'submittedAt',
]);

const questionIds = who5Questions.map((question) => question.id);
const questionIdSet = new Set<string>(questionIds);

function isWho5ResponseValue(value: unknown): value is Who5ResponseValue {
  return Number.isInteger(value) && typeof value === 'number' && value >= 0 && value <= 5;
}

export function validateWho5SubmitInput(body: unknown): ValidationResult<Who5SubmitInput> {
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
    errors.push({ field: 'responses', message: 'responses must be an object keyed by question id.' });
  } else {
    const responseMap = responses as Record<string, unknown>;
    const responseKeys = Object.keys(responseMap);
    const extraKeys = responseKeys.filter((key) => !questionIdSet.has(key));
    const missingKeys = questionIds.filter((key) => !(key in responseMap));

    if (responseKeys.length !== questionIds.length || extraKeys.length > 0 || missingKeys.length > 0) {
      errors.push({ field: 'responses', message: 'responses must include exactly one answer for each WHO-5 item.' });
    }

    for (const question of who5Questions) {
      const selected = responseMap[question.id];
      if (selected === undefined) continue;
      if (!isWho5ResponseValue(selected)) {
        errors.push({ field: `responses.${question.id}`, message: 'WHO-5 responses must be integer values from 0 to 5.' });
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
      responses: responses as Record<Who5QuestionId, Who5ResponseValue>,
    },
    errors: [],
  };
}
