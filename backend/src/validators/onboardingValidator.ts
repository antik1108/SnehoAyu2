import { normalizePhone } from '../utils/phoneNumber.js';
import { todayIstDateOnly } from '../utils/dateOnly.js';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult<T> {
  valid: boolean;
  errors: ValidationError[];
  data?: T;
}

export type BirthWeightStratum =
  | 'under_1500'
  | '1500_to_2500'
  | 'over_2500';

export interface MotherProfileInput {
  fullName?: string;
  ageRange: string;
  educationMother: string;
  educationFather: string;
  occupationMother: string;
  occupationFather: string;
  incomeClass: string;
  familyType: string;
  familyMembersCount: string;
  religion: string;
  residenceType: string;
  contactNumber?: string;
  prevPretermEducation: boolean;
  educationSource: string[];
}

export interface BabyProfileInput {
  babyName?: string;
  sex: 'male' | 'female';
  dateOfBirth: Date;
  gestationalAgeWeeks: number;
  birthWeightGrams: number;
  weightAtDischargeGrams: number;
  placeOfDelivery: 'hospital' | 'home';
  nicuStayDays: number;
  skinToSkinAtBirth: boolean;
  kmcInNicu: boolean;
  feedingAtDischarge: 'exclusive_bf' | 'exclusive_formula' | 'mixed';
  criedAtBirth: boolean;
  neededResuscitation: boolean;
  dischargeDate: Date;
  birthWeightStratum: BirthWeightStratum;
}

const MOTHER_KEYS = new Set([
  'fullName',
  'ageRange',
  'educationMother',
  'educationFather',
  'occupationMother',
  'occupationFather',
  'incomeClass',
  'familyType',
  'familyMembersCount',
  'religion',
  'residenceType',
  'contactNumber',
  'prevPretermEducation',
  'educationSource',
]);

const BABY_KEYS = new Set([
  'babyName',
  'sex',
  'dateOfBirth',
  'gestationalAgeWeeks',
  'birthWeightGrams',
  'weightAtDischargeGrams',
  'placeOfDelivery',
  'nicuStayDays',
  'skinToSkinAtBirth',
  'kmcInNicu',
  'feedingAtDischarge',
  'criedAtBirth',
  'neededResuscitation',
  'dischargeDate',
]);

const EDUCATION_SOURCES = new Set([
  'health_worker',
  'family',
  'peer',
  'workshop',
  'magazine',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function unknownKeyErrors(
  body: Record<string, unknown>,
  allowedKeys: Set<string>
): ValidationError[] {
  return Object.keys(body)
    .filter((key) => !allowedKeys.has(key))
    .map((key) => ({
      field: key,
      message: `Unknown field "${key}" is not allowed.`,
    }));
}

function readRequiredText(
  body: Record<string, unknown>,
  field: string
): { value?: string; error?: ValidationError } {
  const raw = body[field];

  if (typeof raw !== 'string') {
    return { error: { field, message: `${field} must be a string.` } };
  }

  const value = raw.trim();
  if (value === '') {
    return { error: { field, message: `${field} must not be blank.` } };
  }

  return { value };
}

function readOptionalText(
  body: Record<string, unknown>,
  field: string
): { value?: string; error?: ValidationError } {
  const raw = body[field];

  if (raw === undefined || raw === null) {
    return {};
  }

  if (typeof raw !== 'string') {
    return { error: { field, message: `${field} must be a string.` } };
  }

  const value = raw.trim();
  return value === '' ? {} : { value };
}

function readBoolean(
  body: Record<string, unknown>,
  field: string
): { value?: boolean; error?: ValidationError } {
  const raw = body[field];

  if (typeof raw !== 'boolean') {
    return { error: { field, message: `${field} must be a boolean.` } };
  }

  return { value: raw };
}

function readFiniteNumber(
  body: Record<string, unknown>,
  field: string
): { value?: number; error?: ValidationError } {
  const raw = body[field];

  if (typeof raw !== 'number' || !Number.isFinite(raw)) {
    return { error: { field, message: `${field} must be a finite number.` } };
  }

  return { value: raw };
}

function readIntegerInRange(
  body: Record<string, unknown>,
  field: string,
  min: number,
  max: number
): { value?: number; error?: ValidationError } {
  const result = readFiniteNumber(body, field);

  if (result.error || result.value === undefined) {
    return result;
  }

  if (!Number.isInteger(result.value) || result.value < min || result.value > max) {
    return {
      error: {
        field,
        message: `${field} must be an integer between ${min} and ${max}.`,
      },
    };
  }

  return result;
}

function readEnum<T extends string>(
  body: Record<string, unknown>,
  field: string,
  allowed: readonly T[]
): { value?: T; error?: ValidationError } {
  const text = readRequiredText(body, field);

  if (text.error || text.value === undefined) {
    return text as { value?: T; error?: ValidationError };
  }

  if (!(allowed as readonly string[]).includes(text.value)) {
    return {
      error: {
        field,
        message: `${field} must be one of: ${allowed.join(', ')}.`,
      },
    };
  }

  return { value: text.value as T };
}

function readIsoDate(
  body: Record<string, unknown>,
  field: string
): { value?: Date; error?: ValidationError } {
  const text = readRequiredText(body, field);

  if (text.error || text.value === undefined) {
    return text as { value?: Date; error?: ValidationError };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(text.value)) {
    return {
      error: { field, message: `${field} must use YYYY-MM-DD format.` },
    };
  }

  const [yearText, monthText, dayText] = text.value.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(`${text.value}T00:00:00.000Z`);

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return { error: { field, message: `${field} must be a real date.` } };
  }

  return { value: date };
}



export function calculateBirthWeightStratum(
  birthWeightGrams: number
): BirthWeightStratum {
  if (birthWeightGrams < 1500) {
    return 'under_1500';
  }

  if (birthWeightGrams <= 2500) {
    return '1500_to_2500';
  }

  return 'over_2500';
}

export function validateMotherProfileInput(
  value: unknown
): ValidationResult<MotherProfileInput> {
  if (!isRecord(value)) {
    return {
      valid: false,
      errors: [{ field: 'body', message: 'Request body must be an object.' }],
    };
  }

  const errors = unknownKeyErrors(value, MOTHER_KEYS);

  const ageRange = readEnum(value, 'ageRange', [
    'below_18',
    '18_25',
    '26_30',
    '31_35',
    '36_40',
    'above_40',
  ] as const);
  if (ageRange.error) errors.push(ageRange.error);

  const educationMother = readEnum(value, 'educationMother', [
    'no_formal',
    'primary',
    'secondary',
    'higher_secondary',
    'graduate',
    'postgraduate_plus',
  ] as const);
  if (educationMother.error) errors.push(educationMother.error);

  const educationFather = readEnum(value, 'educationFather', [
    'no_formal',
    'primary',
    'secondary',
    'higher_secondary',
    'graduate',
    'postgraduate_plus',
  ] as const);
  if (educationFather.error) errors.push(educationFather.error);

  const occupationMother = readEnum(value, 'occupationMother', [
    'homemaker',
    'govt_service',
    'private_service',
    'business',
    'daily_labour',
    'other',
  ] as const);
  if (occupationMother.error) errors.push(occupationMother.error);

  const occupationFather = readEnum(value, 'occupationFather', [
    'unemployed',
    'govt_service',
    'private_service',
    'business',
    'daily_labour',
    'other',
  ] as const);
  if (occupationFather.error) errors.push(occupationFather.error);

  const religion = readEnum(value, 'religion', [
    'hindu',
    'muslim',
    'christian',
    'other',
  ] as const);
  if (religion.error) errors.push(religion.error);

  const fullName = readOptionalText(value, 'fullName');
  if (fullName.error) {
    errors.push(fullName.error);
  } else if (fullName.value && fullName.value.length > 255) {
    errors.push({
      field: 'fullName',
      message: 'fullName must not exceed 255 characters.',
    });
  }

  const contactNumber = readOptionalText(value, 'contactNumber');
  if (contactNumber.error) errors.push(contactNumber.error);

  let normalizedContactNumber: string | undefined;
  if (contactNumber.value) {
    let cleaned = contactNumber.value.replace(/[\s\-()+]/g, '');
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      cleaned = cleaned.slice(2);
    }
    try {
      normalizedContactNumber = normalizePhone(cleaned);
    } catch {
      errors.push({
        field: 'contactNumber',
        message: 'contactNumber must be a valid 10-digit Indian mobile number.',
      });
    }
  }

  const familyType = readEnum(value, 'familyType', [
    'nuclear',
    'joint',
    'extended',
  ] as const);
  if (familyType.error) errors.push(familyType.error);

  const incomeClass = readEnum(value, 'incomeClass', [
    'I',
    'II',
    'III',
    'IV',
    'V',
  ] as const);
  if (incomeClass.error) errors.push(incomeClass.error);

  const residenceType = readEnum(value, 'residenceType', [
    'urban',
    'rural',
    'semi_urban',
  ] as const);
  if (residenceType.error) errors.push(residenceType.error);

  const prevPretermEducation = readBoolean(value, 'prevPretermEducation');
  if (prevPretermEducation.error) errors.push(prevPretermEducation.error);

  const rawFamilyMembers = value['familyMembersCount'];
  let familyMembersCount: string | undefined;
  if (typeof rawFamilyMembers === 'number') {
    if (!Number.isInteger(rawFamilyMembers) || rawFamilyMembers < 1 || rawFamilyMembers > 30) {
      errors.push({
        field: 'familyMembersCount',
        message: 'familyMembersCount must be an integer between 1 and 30.',
      });
    } else {
      familyMembersCount = String(rawFamilyMembers);
    }
  } else if (typeof rawFamilyMembers === 'string') {
    const trimmed = rawFamilyMembers.trim();
    const num = Number(trimmed);
    if (!/^\d+$/.test(trimmed) || !Number.isInteger(num) || num < 1 || num > 30) {
      errors.push({
        field: 'familyMembersCount',
        message: 'familyMembersCount must be an integer between 1 and 30.',
      });
    } else {
      familyMembersCount = trimmed;
    }
  } else {
    errors.push({
      field: 'familyMembersCount',
      message: 'familyMembersCount must be a string or number representing an integer between 1 and 30.',
    });
  }

  let educationSource: string[] = [];
  const rawEducationSource = value['educationSource'];
  if (rawEducationSource !== undefined) {
    if (!Array.isArray(rawEducationSource)) {
      errors.push({
        field: 'educationSource',
        message: 'educationSource must be an array.',
      });
    } else {
      for (const item of rawEducationSource) {
        if (typeof item !== 'string' || !EDUCATION_SOURCES.has(item.trim())) {
          errors.push({
            field: 'educationSource',
            message: 'educationSource contains an unsupported value.',
          });
          break;
        }
        educationSource.push(item.trim());
      }
      educationSource = [...new Set(educationSource)];
    }
  }

  if (prevPretermEducation.value === true && educationSource.length === 0) {
    errors.push({
      field: 'educationSource',
      message:
        'educationSource is required when previous preterm education is true.',
    });
  }

  if (prevPretermEducation.value === false) {
    educationSource = [];
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: {
      fullName: fullName.value,
      ageRange: ageRange.value as string,
      educationMother: educationMother.value as string,
      educationFather: educationFather.value as string,
      occupationMother: occupationMother.value as string,
      occupationFather: occupationFather.value as string,
      incomeClass: incomeClass.value as string,
      familyType: familyType.value as string,
      familyMembersCount: familyMembersCount as string,
      religion: religion.value as string,
      residenceType: residenceType.value as string,
      contactNumber: normalizedContactNumber,
      prevPretermEducation: prevPretermEducation.value as boolean,
      educationSource,
    },
  };
}

export function validateBabyProfileInput(
  value: unknown
): ValidationResult<BabyProfileInput> {
  if (!isRecord(value)) {
    return {
      valid: false,
      errors: [{ field: 'body', message: 'Request body must be an object.' }],
    };
  }

  const errors = unknownKeyErrors(value, BABY_KEYS);

  const babyName = readOptionalText(value, 'babyName');
  if (babyName.error) {
    errors.push(babyName.error);
  } else if (babyName.value && babyName.value.length > 100) {
    errors.push({
      field: 'babyName',
      message: 'babyName must not exceed 100 characters.',
    });
  }

  const sex = readEnum(value, 'sex', ['male', 'female'] as const);
  if (sex.error) errors.push(sex.error);

  const dateOfBirth = readIsoDate(value, 'dateOfBirth');
  if (dateOfBirth.error) errors.push(dateOfBirth.error);

  const dischargeDate = readIsoDate(value, 'dischargeDate');
  if (dischargeDate.error) errors.push(dischargeDate.error);

  const gestationalAgeWeeks = readFiniteNumber(value, 'gestationalAgeWeeks');
  if (gestationalAgeWeeks.error) {
    errors.push(gestationalAgeWeeks.error);
  } else if (
    gestationalAgeWeeks.value === undefined ||
    gestationalAgeWeeks.value < 24 ||
    gestationalAgeWeeks.value >= 37
  ) {
    errors.push({
      field: 'gestationalAgeWeeks',
      message: 'gestationalAgeWeeks must be at least 24 and less than 37.',
    });
  } else {
    const str = String(gestationalAgeWeeks.value);
    const parts = str.split('.');
    if (parts.length > 1 && parts[1].length > 1) {
      errors.push({
        field: 'gestationalAgeWeeks',
        message: 'gestationalAgeWeeks must have at most one decimal place.',
      });
    }
  }

  const birthWeightGrams = readIntegerInRange(
    value,
    'birthWeightGrams',
    400,
    4000
  );
  if (birthWeightGrams.error) errors.push(birthWeightGrams.error);

  const weightAtDischargeGrams = readIntegerInRange(
    value,
    'weightAtDischargeGrams',
    400,
    5000
  );
  if (weightAtDischargeGrams.error) errors.push(weightAtDischargeGrams.error);

  const nicuStayDays = readIntegerInRange(value, 'nicuStayDays', 1, 120);
  if (nicuStayDays.error) errors.push(nicuStayDays.error);

  const placeOfDelivery = readEnum(value, 'placeOfDelivery', [
    'hospital',
    'home',
  ] as const);
  if (placeOfDelivery.error) errors.push(placeOfDelivery.error);

  const feedingAtDischarge = readEnum(value, 'feedingAtDischarge', [
    'exclusive_bf',
    'exclusive_formula',
    'mixed',
  ] as const);
  if (feedingAtDischarge.error) errors.push(feedingAtDischarge.error);

  const skinToSkinAtBirth = readBoolean(value, 'skinToSkinAtBirth');
  if (skinToSkinAtBirth.error) errors.push(skinToSkinAtBirth.error);

  const kmcInNicu = readBoolean(value, 'kmcInNicu');
  if (kmcInNicu.error) errors.push(kmcInNicu.error);

  const criedAtBirth = readBoolean(value, 'criedAtBirth');
  if (criedAtBirth.error) errors.push(criedAtBirth.error);

  const neededResuscitation = readBoolean(value, 'neededResuscitation');
  if (neededResuscitation.error) errors.push(neededResuscitation.error);

  // Compare against "today" in IST (the app's target timezone), not raw
  // server UTC time — otherwise a date that is today in India can appear to
  // be "in the future" whenever the server's UTC clock is still on the
  // previous calendar day (i.e. before ~5:30am IST).
  const todayIst = todayIstDateOnly();
  if (dateOfBirth.value && dateOfBirth.value > todayIst) {
    errors.push({
      field: 'dateOfBirth',
      message: 'dateOfBirth must not be in the future.',
    });
  }

  if (dischargeDate.value && dischargeDate.value > todayIst) {
    errors.push({
      field: 'dischargeDate',
      message: 'dischargeDate must not be in the future.',
    });
  }

  if (
    dateOfBirth.value &&
    dischargeDate.value &&
    dischargeDate.value < dateOfBirth.value
  ) {
    errors.push({
      field: 'dischargeDate',
      message: 'dischargeDate must not be earlier than dateOfBirth.',
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const birthWeight = birthWeightGrams.value as number;

  return {
    valid: true,
    errors: [],
    data: {
      babyName: babyName.value,
      sex: sex.value as 'male' | 'female',
      dateOfBirth: dateOfBirth.value as Date,
      gestationalAgeWeeks: gestationalAgeWeeks.value as number,
      birthWeightGrams: birthWeight,
      weightAtDischargeGrams: weightAtDischargeGrams.value as number,
      placeOfDelivery: placeOfDelivery.value as 'hospital' | 'home',
      nicuStayDays: nicuStayDays.value as number,
      skinToSkinAtBirth: skinToSkinAtBirth.value as boolean,
      kmcInNicu: kmcInNicu.value as boolean,
      feedingAtDischarge: feedingAtDischarge.value as
        | 'exclusive_bf'
        | 'exclusive_formula'
        | 'mixed',
      criedAtBirth: criedAtBirth.value as boolean,
      neededResuscitation: neededResuscitation.value as boolean,
      dischargeDate: dischargeDate.value as Date,
      birthWeightStratum: calculateBirthWeightStratum(birthWeight),
    },
  };
}

export interface HospitalCodeInput {
  code: string;
}

export function validateHospitalCodeInput(
  value: unknown
): ValidationResult<HospitalCodeInput> {
  if (!isRecord(value)) {
    return {
      valid: false,
      errors: [{ field: 'body', message: 'Request body must be an object.' }],
    };
  }

  const errors = unknownKeyErrors(value, new Set(['code']));

  const codeResult = readRequiredText(value, 'code');
  if (codeResult.error) {
    errors.push(codeResult.error);
  } else if (codeResult.value !== undefined) {
    const normalized = codeResult.value.trim().toUpperCase();
    if (!/^[A-Z0-9]{2,10}$/.test(normalized)) {
      errors.push({
        field: 'code',
        message: 'Hospital code must contain only letters and numbers, between 2 and 10 characters.',
      });
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: {
      code: codeResult.value!.trim().toUpperCase(),
    },
  };
}

export function validateCompleteOnboardingInput(body: unknown): ValidationResult<Record<string, never>> {
  if (!isRecord(body)) {
    return {
      valid: false,
      errors: [{ field: 'body', message: 'Request body must be an object.' }],
    };
  }

  const errors = unknownKeyErrors(body, new Set([]));

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: {},
  };
}
