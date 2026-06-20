import type { CreateGrowthReadingInput, GrowthTimePoint } from './types';

export interface GrowthFormState {
  readingDate: string;
  weightGrams: string;
  lengthCm: string;
  headCircumferenceCm: string;
  timePoint: '' | GrowthTimePoint;
  notes: string;
}

export interface GrowthValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof GrowthFormState, string>>;
  data?: CreateGrowthReadingInput;
}

const timePoints = new Set(['baseline', '1_month', '3_months', '6_months']);

function isDateOnly(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00.000Z`).getTime());
}

function hasOneDecimal(value: string): boolean {
  return /^\d+(\.\d)?$/.test(value);
}

export function validateGrowthForm(state: GrowthFormState, today: string): GrowthValidationResult {
  const errors: GrowthValidationResult['errors'] = {};

  if (!state.readingDate || !isDateOnly(state.readingDate)) {
    errors.readingDate = 'invalidDate';
  } else if (state.readingDate > today) {
    errors.readingDate = 'futureDate';
  }

  if (!/^\d+$/.test(state.weightGrams)) {
    errors.weightGrams = 'weightRange';
  } else {
    const weight = Number(state.weightGrams);
    if (!Number.isInteger(weight) || weight < 400 || weight > 8000) {
      errors.weightGrams = 'weightRange';
    }
  }

  if (!hasOneDecimal(state.lengthCm)) {
    errors.lengthCm = 'lengthRange';
  } else {
    const length = Number(state.lengthCm);
    if (!Number.isFinite(length) || length < 20 || length > 80) {
      errors.lengthCm = 'lengthRange';
    }
  }

  if (!hasOneDecimal(state.headCircumferenceCm)) {
    errors.headCircumferenceCm = 'headRange';
  } else {
    const head = Number(state.headCircumferenceCm);
    if (!Number.isFinite(head) || head < 15 || head > 55) {
      errors.headCircumferenceCm = 'headRange';
    }
  }

  if (state.timePoint && !timePoints.has(state.timePoint)) {
    errors.timePoint = 'invalidTimePoint';
  }

  if (state.notes.length > 300) {
    errors.notes = 'notesLength';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    data: {
      readingDate: state.readingDate,
      weightGrams: Number(state.weightGrams),
      lengthCm: Number(state.lengthCm),
      headCircumferenceCm: Number(state.headCircumferenceCm),
      timePoint: state.timePoint || null,
      notes: state.notes.trim() || null,
    },
  };
}
