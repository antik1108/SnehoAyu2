export interface ValidationErrors {
  breastfeedingDone?: string;
  feedsCount?: string;
  volumeMl?: string;
  kmcMinutes?: string;
  temperatureMorningC?: string;
  temperatureEveningC?: string;
  weightGrams?: string;
  medicationNotes?: string;
}

export function validateBreastfeeding(feedsCount: string, volumeMl: string): { feedsCount?: string; volumeMl?: string; valid: boolean } {
  const errors: { feedsCount?: string; volumeMl?: string } = {};

  if (feedsCount.trim() !== '') {
    const val = Number(feedsCount);
    if (!Number.isInteger(val) || val < 0 || val > 30) {
      errors.feedsCount = 'feedsCount';
    }
  }

  if (volumeMl.trim() !== '') {
    const val = Number(volumeMl);
    if (!Number.isInteger(val) || val < 0 || val > 2000) {
      errors.volumeMl = 'volumeMl';
    }
  }

  return {
    ...errors,
    valid: Object.keys(errors).length === 0,
  };
}

export function validateKmc(minutes: string): { minutes?: string; valid: boolean } {
  const errors: { minutes?: string } = {};

  if (minutes.trim() !== '') {
    const val = Number(minutes);
    if (!Number.isInteger(val) || val < 0 || val > 1440) {
      errors.minutes = 'kmcMinutes';
    }
  }

  return {
    ...errors,
    valid: Object.keys(errors).length === 0,
  };
}

export function validateTemperature(morning: string, evening: string): { morning?: string; evening?: string; valid: boolean } {
  const errors: { morning?: string; evening?: string } = {};

  const validateSingleTemp = (valStr: string) => {
    if (valStr.trim() === '') return undefined;
    const val = Number(valStr);
    if (isNaN(val) || val < 30.0 || val > 43.0) {
      return 'invalidRange';
    }
    // Check for at most one decimal place
    const decimalParts = valStr.split('.');
    if (decimalParts.length > 1 && decimalParts[1].length > 1) {
      return 'invalidPrecision';
    }
    return undefined;
  };

  const mErr = validateSingleTemp(morning);
  if (mErr) errors.morning = mErr;

  const eErr = validateSingleTemp(evening);
  if (eErr) errors.evening = eErr;

  return {
    ...errors,
    valid: Object.keys(errors).length === 0,
  };
}

export function validateWeight(grams: string): { grams?: string; valid: boolean } {
  const errors: { grams?: string } = {};

  if (grams.trim() !== '') {
    const val = Number(grams);
    if (!Number.isInteger(val) || val < 400 || val > 7000) {
      errors.grams = 'weightGrams';
    }
  }

  return {
    ...errors,
    valid: Object.keys(errors).length === 0,
  };
}

// Phase 3 — KB §4.4
export function validateUrinationCount(count: string): { count?: string; valid: boolean } {
  const errors: { count?: string } = {};
  if (count.trim() !== '') {
    const val = Number(count);
    if (!Number.isInteger(val) || val < 0 || val > 30) {
      errors.count = 'urinationCount';
    }
  }
  return { ...errors, valid: Object.keys(errors).length === 0 };
}

export function validateMedication(notes: string): { notes?: string; valid: boolean } {  const errors: { notes?: string } = {};

  if (notes.length > 300) {
    errors.notes = 'maxLength';
  }

  return {
    ...errors,
    valid: Object.keys(errors).length === 0,
  };
}
