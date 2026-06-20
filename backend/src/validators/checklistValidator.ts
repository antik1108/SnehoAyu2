export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult<T> {
  valid: boolean;
  errors: ValidationError[];
  data?: T;
}

export interface ChecklistLogInput {
  breastfeeding?: {
    done?: boolean;
    feedsCount?: number | null;
    volumeMl?: number | null;
  };
  kmc?: {
    done?: boolean;
    minutes?: number | null;
  };
  temperature?: {
    done?: boolean;
    morningC?: number | null;
    eveningC?: number | null;
  };
  weight?: {
    done?: boolean;
    grams?: number | null;
  };
  skinCordCare?: {
    done?: boolean;
  };
  medication?: {
    done?: boolean | null;
    notes?: string | null;
  };
  dangerSigns?: {
    reviewed?: boolean;
  };
}

const TOP_LEVEL_KEYS = new Set([
  'breastfeeding',
  'kmc',
  'temperature',
  'weight',
  'skinCordCare',
  'medication',
  'dangerSigns',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function unknownKeys(body: Record<string, unknown>, allowedKeys: Set<string>): ValidationError[] {
  return Object.keys(body)
    .filter((key) => !allowedKeys.has(key))
    .map((key) => ({ field: key, message: `Unknown field "${key}" is not allowed.` }));
}

function readSection(value: unknown, field: string): { value?: Record<string, unknown>; error?: ValidationError } {
  if (value === undefined) {
    return {};
  }

  if (!isRecord(value)) {
    return { error: { field, message: `${field} must be an object.` } };
  }

  return { value };
}

function readBoolean(value: unknown, field: string): { value?: boolean; error?: ValidationError } {
  if (value === undefined) return {};
  if (typeof value !== 'boolean') {
    return { error: { field, message: `${field} must be a boolean.` } };
  }
  return { value };
}

function readNullableBoolean(value: unknown, field: string): { value?: boolean | null; error?: ValidationError } {
  if (value === undefined) return {};
  if (value === null) return { value: null };
  if (typeof value !== 'boolean') {
    return { error: { field, message: `${field} must be a boolean or null.` } };
  }
  return { value };
}

function readNullableInteger(
  value: unknown,
  field: string,
  min: number,
  max: number
): { value?: number | null; error?: ValidationError } {
  if (value === undefined) return {};
  if (value === null) return { value: null };
  if (typeof value !== 'number' || !Number.isFinite(value) || !Number.isInteger(value)) {
    return { error: { field, message: `${field} must be an integer between ${min} and ${max}.` } };
  }
  if (value < min || value > max) {
    return { error: { field, message: `${field} must be an integer between ${min} and ${max}.` } };
  }
  return { value };
}

function readNullableDecimalOnePlace(
  value: unknown,
  field: string,
  min: number,
  max: number
): { value?: number | null; error?: ValidationError } {
  if (value === undefined) return {};
  if (value === null) return { value: null };
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return { error: { field, message: `${field} must be a number between ${min} and ${max}.` } };
  }
  const scaled = Math.round(value * 10);
  if (Math.abs(scaled / 10 - value) > 1e-9 || value < min || value > max) {
    return { error: { field, message: `${field} must be between ${min} and ${max} with at most one decimal place.` } };
  }
  return { value };
}

function readNullableText(value: unknown, field: string, maxLength: number): { value?: string | null; error?: ValidationError } {
  if (value === undefined) return {};
  if (value === null) return { value: null };
  if (typeof value !== 'string') {
    return { error: { field, message: `${field} must be a string or null.` } };
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    return { error: { field, message: `${field} must not exceed ${maxLength} characters.` } };
  }
  return { value: trimmed === '' ? null : trimmed };
}

function validateSectionUnknownKeys(section: Record<string, unknown>, allowed: string[], prefix: string): ValidationError[] {
  return Object.keys(section)
    .filter((key) => !allowed.includes(key))
    .map((key) => ({ field: `${prefix}.${key}`, message: `Unknown field "${key}" is not allowed.` }));
}

export function validateChecklistLogInput(value: unknown): ValidationResult<ChecklistLogInput> {
  if (!isRecord(value)) {
    return {
      valid: false,
      errors: [{ field: 'body', message: 'Request body must be an object.' }],
    };
  }

  const errors = unknownKeys(value, TOP_LEVEL_KEYS);
  const data: ChecklistLogInput = {};

  const breastfeeding = readSection(value.breastfeeding, 'breastfeeding');
  if (breastfeeding.error) {
    errors.push(breastfeeding.error);
  } else if (breastfeeding.value) {
    errors.push(...validateSectionUnknownKeys(breastfeeding.value, ['done', 'feedsCount', 'volumeMl'], 'breastfeeding'));
    const done = readBoolean(breastfeeding.value.done, 'breastfeeding.done');
    const feedsCount = readNullableInteger(breastfeeding.value.feedsCount, 'breastfeeding.feedsCount', 0, 30);
    const volumeMl = readNullableInteger(breastfeeding.value.volumeMl, 'breastfeeding.volumeMl', 0, 2000);
    if (done.error) errors.push(done.error);
    if (feedsCount.error) errors.push(feedsCount.error);
    if (volumeMl.error) errors.push(volumeMl.error);
    data.breastfeeding = {
      ...(done.value !== undefined ? { done: done.value } : {}),
      ...(feedsCount.value !== undefined ? { feedsCount: feedsCount.value } : {}),
      ...(volumeMl.value !== undefined ? { volumeMl: volumeMl.value } : {}),
    };
  }

  const kmc = readSection(value.kmc, 'kmc');
  if (kmc.error) {
    errors.push(kmc.error);
  } else if (kmc.value) {
    errors.push(...validateSectionUnknownKeys(kmc.value, ['done', 'minutes'], 'kmc'));
    const done = readBoolean(kmc.value.done, 'kmc.done');
    const minutes = readNullableInteger(kmc.value.minutes, 'kmc.minutes', 0, 1440);
    if (done.error) errors.push(done.error);
    if (minutes.error) errors.push(minutes.error);
    data.kmc = {
      ...(done.value !== undefined ? { done: done.value } : {}),
      ...(minutes.value !== undefined ? { minutes: minutes.value } : {}),
    };
  }

  const temperature = readSection(value.temperature, 'temperature');
  if (temperature.error) {
    errors.push(temperature.error);
  } else if (temperature.value) {
    errors.push(...validateSectionUnknownKeys(temperature.value, ['done', 'morningC', 'eveningC'], 'temperature'));
    const done = readBoolean(temperature.value.done, 'temperature.done');
    const morningC = readNullableDecimalOnePlace(temperature.value.morningC, 'temperature.morningC', 30, 43);
    const eveningC = readNullableDecimalOnePlace(temperature.value.eveningC, 'temperature.eveningC', 30, 43);
    if (done.error) errors.push(done.error);
    if (morningC.error) errors.push(morningC.error);
    if (eveningC.error) errors.push(eveningC.error);
    data.temperature = {
      ...(done.value !== undefined ? { done: done.value } : {}),
      ...(morningC.value !== undefined ? { morningC: morningC.value } : {}),
      ...(eveningC.value !== undefined ? { eveningC: eveningC.value } : {}),
    };
  }

  const weight = readSection(value.weight, 'weight');
  if (weight.error) {
    errors.push(weight.error);
  } else if (weight.value) {
    errors.push(...validateSectionUnknownKeys(weight.value, ['done', 'grams'], 'weight'));
    const done = readBoolean(weight.value.done, 'weight.done');
    const grams = readNullableInteger(weight.value.grams, 'weight.grams', 400, 7000);
    if (done.error) errors.push(done.error);
    if (grams.error) errors.push(grams.error);
    data.weight = {
      ...(done.value !== undefined ? { done: done.value } : {}),
      ...(grams.value !== undefined ? { grams: grams.value } : {}),
    };
  }

  const skinCordCare = readSection(value.skinCordCare, 'skinCordCare');
  if (skinCordCare.error) {
    errors.push(skinCordCare.error);
  } else if (skinCordCare.value) {
    errors.push(...validateSectionUnknownKeys(skinCordCare.value, ['done'], 'skinCordCare'));
    const done = readBoolean(skinCordCare.value.done, 'skinCordCare.done');
    if (done.error) errors.push(done.error);
    data.skinCordCare = {
      ...(done.value !== undefined ? { done: done.value } : {}),
    };
  }

  const medication = readSection(value.medication, 'medication');
  if (medication.error) {
    errors.push(medication.error);
  } else if (medication.value) {
    errors.push(...validateSectionUnknownKeys(medication.value, ['done', 'notes'], 'medication'));
    const done = readNullableBoolean(medication.value.done, 'medication.done');
    const notes = readNullableText(medication.value.notes, 'medication.notes', 300);
    if (done.error) errors.push(done.error);
    if (notes.error) errors.push(notes.error);
    data.medication = {
      ...(done.value !== undefined ? { done: done.value } : {}),
      ...(notes.value !== undefined ? { notes: notes.value } : {}),
    };
  }

  const dangerSigns = readSection(value.dangerSigns, 'dangerSigns');
  if (dangerSigns.error) {
    errors.push(dangerSigns.error);
  } else if (dangerSigns.value) {
    errors.push(...validateSectionUnknownKeys(dangerSigns.value, ['reviewed'], 'dangerSigns'));
    const reviewed = readBoolean(dangerSigns.value.reviewed, 'dangerSigns.reviewed');
    if (reviewed.error) errors.push(reviewed.error);
    data.dangerSigns = {
      ...(reviewed.value !== undefined ? { reviewed: reviewed.value } : {}),
    };
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? data : undefined,
  };
}

export function validateChecklistHistoryDays(value: unknown): ValidationResult<7 | 30> {
  if (value === undefined || value === null || value === '') {
    return { valid: true, errors: [], data: 7 };
  }

  const numericValue = typeof value === 'string' ? Number(value) : value;
  if (numericValue !== 7 && numericValue !== 30) {
    return {
      valid: false,
      errors: [{ field: 'days', message: 'days must be either 7 or 30.' }],
    };
  }

  return { valid: true, errors: [], data: numericValue as 7 | 30 };
}