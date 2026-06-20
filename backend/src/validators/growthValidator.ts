import { isKnowledgeTimePoint, type KnowledgeTimePoint } from '../content/knowledgeQuestions.js';
import { isValidDateOnly } from '../utils/dateOnly.js';
import type { ValidationError, ValidationResult } from './knowledgeAssessmentValidator.js';

export interface CreateGrowthReadingInput {
  readingDate?: string;
  weightGrams: number;
  lengthCm: number;
  headCircumferenceCm: number;
  timePoint?: KnowledgeTimePoint | null;
  notes?: string | null;
}

const forbiddenFields = new Set([
  'userId',
  'motherProfileId',
  'babyProfileId',
  'participantCode',
  'hospitalId',
  'studyGroup',
  'recordedByUserId',
]);

function decimalPlaces(value: number): number {
  if (!Number.isFinite(value)) return Infinity;
  const text = String(value);
  if (!text.includes('.')) return 0;
  return text.split('.')[1]?.length ?? 0;
}

function isOneDecimalNumber(value: unknown, min: number, max: number): boolean {
  return typeof value === 'number'
    && Number.isFinite(value)
    && value >= min
    && value <= max
    && decimalPlaces(value) <= 1;
}

export function validateCreateGrowthReadingInput(body: unknown): ValidationResult<CreateGrowthReadingInput> {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { valid: false, errors: [{ field: 'body', message: 'Request body must be an object.' }] };
  }

  const input = body as Record<string, unknown>;
  const allowedFields = new Set(['readingDate', 'weightGrams', 'lengthCm', 'headCircumferenceCm', 'timePoint', 'notes']);

  for (const field of Object.keys(input)) {
    if (forbiddenFields.has(field) || !allowedFields.has(field)) {
      errors.push({ field, message: `${field} is not allowed.` });
    }
  }

  if (input['readingDate'] !== undefined && (typeof input['readingDate'] !== 'string' || !isValidDateOnly(input['readingDate']))) {
    errors.push({ field: 'readingDate', message: 'readingDate must use YYYY-MM-DD format.' });
  }

  if (!Number.isInteger(input['weightGrams']) || typeof input['weightGrams'] !== 'number' || input['weightGrams'] < 400 || input['weightGrams'] > 8000) {
    errors.push({ field: 'weightGrams', message: 'weightGrams must be an integer from 400 to 8000.' });
  }

  if (!isOneDecimalNumber(input['lengthCm'], 20, 80)) {
    errors.push({ field: 'lengthCm', message: 'lengthCm must be a number from 20.0 to 80.0 with at most one decimal place.' });
  }

  if (!isOneDecimalNumber(input['headCircumferenceCm'], 15, 55)) {
    errors.push({ field: 'headCircumferenceCm', message: 'headCircumferenceCm must be a number from 15.0 to 55.0 with at most one decimal place.' });
  }

  if (input['timePoint'] !== undefined && input['timePoint'] !== null && !isKnowledgeTimePoint(input['timePoint'])) {
    errors.push({ field: 'timePoint', message: 'Invalid growth reading time point.' });
  }

  if (input['notes'] !== undefined && input['notes'] !== null && (typeof input['notes'] !== 'string' || input['notes'].length > 300)) {
    errors.push({ field: 'notes', message: 'notes must be 300 characters or fewer.' });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      readingDate: input['readingDate'] as string | undefined,
      weightGrams: input['weightGrams'] as number,
      lengthCm: input['lengthCm'] as number,
      headCircumferenceCm: input['headCircumferenceCm'] as number,
      timePoint: input['timePoint'] as KnowledgeTimePoint | null | undefined,
      notes: input['notes'] as string | null | undefined,
    },
    errors: [],
  };
}

export function validateGrowthHistoryLimit(value: unknown): ValidationResult<number> {
  if (value === undefined) {
    return { valid: true, data: 30, errors: [] };
  }

  const parsed = typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) {
    return {
      valid: false,
      errors: [{ field: 'limit', message: 'limit must be an integer from 1 to 100.' }],
    };
  }

  return { valid: true, data: parsed, errors: [] };
}
