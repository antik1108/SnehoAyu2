import {
  knowledgeQuestions,
  isKnowledgeLanguage,
  isKnowledgeTimePoint,
  type KnowledgeOptionId,
  type KnowledgeQuestionId,
  type KnowledgeTimePoint,
  type KnowledgeLanguage,
} from '../content/knowledgeQuestions.js';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult<T> {
  valid: boolean;
  data?: T;
  errors: ValidationError[];
}

export interface KnowledgeSubmitInput {
  timePoint: KnowledgeTimePoint;
  responses: Record<KnowledgeQuestionId, KnowledgeOptionId>;
}

const FORBIDDEN_SUBMIT_FIELDS = new Set([
  'score',
  'maxScore',
  'percentage',
  'grade',
  'correctAnswers',
  'correctOptionId',
  'isCorrect',
  'userId',
  'motherProfileId',
  'participantCode',
  'followUpScheduleId',
  'submittedAt',
]);

const questionIds = knowledgeQuestions.map((question) => question.id);
const questionIdSet = new Set<string>(questionIds);

export function validateKnowledgeTimePoint(value: unknown): ValidationResult<KnowledgeTimePoint> {
  if (!isKnowledgeTimePoint(value)) {
    return {
      valid: false,
      errors: [{ field: 'timePoint', message: 'Invalid assessment time point.' }],
    };
  }

  return { valid: true, data: value, errors: [] };
}

export function validateKnowledgeLanguage(value: unknown, fallback: string): KnowledgeLanguage {
  if (isKnowledgeLanguage(value)) {
    return value;
  }

  if (isKnowledgeLanguage(fallback)) {
    return fallback;
  }

  return 'bn';
}

export function validateKnowledgeSubmitInput(body: unknown): ValidationResult<KnowledgeSubmitInput> {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {
      valid: false,
      errors: [{ field: 'body', message: 'Request body must be an object.' }],
    };
  }

  const input = body as Record<string, unknown>;

  for (const field of Object.keys(input)) {
    if (FORBIDDEN_SUBMIT_FIELDS.has(field)) {
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
      errors.push({
        field: 'responses',
        message: 'responses must include exactly one answer for each approved question id.',
      });
    }

    for (const question of knowledgeQuestions) {
      const selected = responseMap[question.id];
      if (selected === undefined) continue;
      if (typeof selected !== 'string') {
        errors.push({ field: `responses.${question.id}`, message: 'Selected option id must be a string.' });
        continue;
      }
      if (question.options.length > 0 && !question.options.some((option) => option.id === selected)) {
        errors.push({ field: `responses.${question.id}`, message: 'Selected option id is not valid for this question.' });
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
      responses: responses as Record<KnowledgeQuestionId, KnowledgeOptionId>,
    },
    errors: [],
  };
}
