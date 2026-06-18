import { normalizePhone } from '../utils/phoneNumber.js';
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
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function unknownKeyErrors(body, allowedKeys) {
    return Object.keys(body)
        .filter((key) => !allowedKeys.has(key))
        .map((key) => ({
        field: key,
        message: `Unknown field "${key}" is not allowed.`,
    }));
}
function readRequiredText(body, field) {
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
function readOptionalText(body, field) {
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
function readBoolean(body, field) {
    const raw = body[field];
    if (typeof raw !== 'boolean') {
        return { error: { field, message: `${field} must be a boolean.` } };
    }
    return { value: raw };
}
function readFiniteNumber(body, field) {
    const raw = body[field];
    if (typeof raw !== 'number' || !Number.isFinite(raw)) {
        return { error: { field, message: `${field} must be a finite number.` } };
    }
    return { value: raw };
}
function readIntegerInRange(body, field, min, max) {
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
function readEnum(body, field, allowed) {
    const text = readRequiredText(body, field);
    if (text.error || text.value === undefined) {
        return text;
    }
    if (!allowed.includes(text.value)) {
        return {
            error: {
                field,
                message: `${field} must be one of: ${allowed.join(', ')}.`,
            },
        };
    }
    return { value: text.value };
}
function readIsoDate(body, field) {
    const text = readRequiredText(body, field);
    if (text.error || text.value === undefined) {
        return text;
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
    if (date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day) {
        return { error: { field, message: `${field} must be a real date.` } };
    }
    return { value: date };
}
export function calculateBirthWeightStratum(birthWeightGrams) {
    if (birthWeightGrams < 1500) {
        return 'under_1500';
    }
    if (birthWeightGrams <= 2500) {
        return '1500_to_2500';
    }
    return 'over_2500';
}
export function validateMotherProfileInput(value) {
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
    ]);
    if (ageRange.error)
        errors.push(ageRange.error);
    const educationMother = readEnum(value, 'educationMother', [
        'no_formal',
        'primary',
        'secondary',
        'higher_secondary',
        'graduate',
        'postgraduate_plus',
    ]);
    if (educationMother.error)
        errors.push(educationMother.error);
    const educationFather = readEnum(value, 'educationFather', [
        'no_formal',
        'primary',
        'secondary',
        'higher_secondary',
        'graduate',
        'postgraduate_plus',
    ]);
    if (educationFather.error)
        errors.push(educationFather.error);
    const occupationMother = readEnum(value, 'occupationMother', [
        'homemaker',
        'govt_service',
        'private_service',
        'business',
        'daily_labour',
        'other',
    ]);
    if (occupationMother.error)
        errors.push(occupationMother.error);
    const occupationFather = readEnum(value, 'occupationFather', [
        'unemployed',
        'govt_service',
        'private_service',
        'business',
        'daily_labour',
        'other',
    ]);
    if (occupationFather.error)
        errors.push(occupationFather.error);
    const religion = readEnum(value, 'religion', [
        'hindu',
        'muslim',
        'christian',
        'other',
    ]);
    if (religion.error)
        errors.push(religion.error);
    const fullName = readOptionalText(value, 'fullName');
    if (fullName.error) {
        errors.push(fullName.error);
    }
    else if (fullName.value && fullName.value.length > 255) {
        errors.push({
            field: 'fullName',
            message: 'fullName must not exceed 255 characters.',
        });
    }
    const contactNumber = readOptionalText(value, 'contactNumber');
    if (contactNumber.error)
        errors.push(contactNumber.error);
    let normalizedContactNumber;
    if (contactNumber.value) {
        let cleaned = contactNumber.value.replace(/[\s\-()+]/g, '');
        if (cleaned.startsWith('91') && cleaned.length === 12) {
            cleaned = cleaned.slice(2);
        }
        try {
            normalizedContactNumber = normalizePhone(cleaned);
        }
        catch {
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
    ]);
    if (familyType.error)
        errors.push(familyType.error);
    const incomeClass = readEnum(value, 'incomeClass', [
        'I',
        'II',
        'III',
        'IV',
        'V',
    ]);
    if (incomeClass.error)
        errors.push(incomeClass.error);
    const residenceType = readEnum(value, 'residenceType', [
        'urban',
        'rural',
        'semi_urban',
    ]);
    if (residenceType.error)
        errors.push(residenceType.error);
    const prevPretermEducation = readBoolean(value, 'prevPretermEducation');
    if (prevPretermEducation.error)
        errors.push(prevPretermEducation.error);
    const rawFamilyMembers = value['familyMembersCount'];
    let familyMembersCount;
    if (typeof rawFamilyMembers === 'number') {
        if (!Number.isInteger(rawFamilyMembers) || rawFamilyMembers < 1 || rawFamilyMembers > 30) {
            errors.push({
                field: 'familyMembersCount',
                message: 'familyMembersCount must be an integer between 1 and 30.',
            });
        }
        else {
            familyMembersCount = String(rawFamilyMembers);
        }
    }
    else if (typeof rawFamilyMembers === 'string') {
        const trimmed = rawFamilyMembers.trim();
        const num = Number(trimmed);
        if (!/^\d+$/.test(trimmed) || !Number.isInteger(num) || num < 1 || num > 30) {
            errors.push({
                field: 'familyMembersCount',
                message: 'familyMembersCount must be an integer between 1 and 30.',
            });
        }
        else {
            familyMembersCount = trimmed;
        }
    }
    else {
        errors.push({
            field: 'familyMembersCount',
            message: 'familyMembersCount must be a string or number representing an integer between 1 and 30.',
        });
    }
    let educationSource = [];
    const rawEducationSource = value['educationSource'];
    if (rawEducationSource !== undefined) {
        if (!Array.isArray(rawEducationSource)) {
            errors.push({
                field: 'educationSource',
                message: 'educationSource must be an array.',
            });
        }
        else {
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
            message: 'educationSource is required when previous preterm education is true.',
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
            ageRange: ageRange.value,
            educationMother: educationMother.value,
            educationFather: educationFather.value,
            occupationMother: occupationMother.value,
            occupationFather: occupationFather.value,
            incomeClass: incomeClass.value,
            familyType: familyType.value,
            familyMembersCount: familyMembersCount,
            religion: religion.value,
            residenceType: residenceType.value,
            contactNumber: normalizedContactNumber,
            prevPretermEducation: prevPretermEducation.value,
            educationSource,
        },
    };
}
export function validateBabyProfileInput(value) {
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
    }
    else if (babyName.value && babyName.value.length > 100) {
        errors.push({
            field: 'babyName',
            message: 'babyName must not exceed 100 characters.',
        });
    }
    const sex = readEnum(value, 'sex', ['male', 'female']);
    if (sex.error)
        errors.push(sex.error);
    const dateOfBirth = readIsoDate(value, 'dateOfBirth');
    if (dateOfBirth.error)
        errors.push(dateOfBirth.error);
    const dischargeDate = readIsoDate(value, 'dischargeDate');
    if (dischargeDate.error)
        errors.push(dischargeDate.error);
    const gestationalAgeWeeks = readFiniteNumber(value, 'gestationalAgeWeeks');
    if (gestationalAgeWeeks.error) {
        errors.push(gestationalAgeWeeks.error);
    }
    else if (gestationalAgeWeeks.value === undefined ||
        gestationalAgeWeeks.value < 24 ||
        gestationalAgeWeeks.value >= 37) {
        errors.push({
            field: 'gestationalAgeWeeks',
            message: 'gestationalAgeWeeks must be at least 24 and less than 37.',
        });
    }
    else {
        const str = String(gestationalAgeWeeks.value);
        const parts = str.split('.');
        if (parts.length > 1 && parts[1].length > 1) {
            errors.push({
                field: 'gestationalAgeWeeks',
                message: 'gestationalAgeWeeks must have at most one decimal place.',
            });
        }
    }
    const birthWeightGrams = readIntegerInRange(value, 'birthWeightGrams', 400, 4000);
    if (birthWeightGrams.error)
        errors.push(birthWeightGrams.error);
    const weightAtDischargeGrams = readIntegerInRange(value, 'weightAtDischargeGrams', 400, 5000);
    if (weightAtDischargeGrams.error)
        errors.push(weightAtDischargeGrams.error);
    const nicuStayDays = readIntegerInRange(value, 'nicuStayDays', 1, 120);
    if (nicuStayDays.error)
        errors.push(nicuStayDays.error);
    const placeOfDelivery = readEnum(value, 'placeOfDelivery', [
        'hospital',
        'home',
    ]);
    if (placeOfDelivery.error)
        errors.push(placeOfDelivery.error);
    const feedingAtDischarge = readEnum(value, 'feedingAtDischarge', [
        'exclusive_bf',
        'exclusive_formula',
        'mixed',
    ]);
    if (feedingAtDischarge.error)
        errors.push(feedingAtDischarge.error);
    const skinToSkinAtBirth = readBoolean(value, 'skinToSkinAtBirth');
    if (skinToSkinAtBirth.error)
        errors.push(skinToSkinAtBirth.error);
    const kmcInNicu = readBoolean(value, 'kmcInNicu');
    if (kmcInNicu.error)
        errors.push(kmcInNicu.error);
    const criedAtBirth = readBoolean(value, 'criedAtBirth');
    if (criedAtBirth.error)
        errors.push(criedAtBirth.error);
    const neededResuscitation = readBoolean(value, 'neededResuscitation');
    if (neededResuscitation.error)
        errors.push(neededResuscitation.error);
    const now = new Date();
    if (dateOfBirth.value && dateOfBirth.value > now) {
        errors.push({
            field: 'dateOfBirth',
            message: 'dateOfBirth must not be in the future.',
        });
    }
    if (dischargeDate.value && dischargeDate.value > now) {
        errors.push({
            field: 'dischargeDate',
            message: 'dischargeDate must not be in the future.',
        });
    }
    if (dateOfBirth.value &&
        dischargeDate.value &&
        dischargeDate.value < dateOfBirth.value) {
        errors.push({
            field: 'dischargeDate',
            message: 'dischargeDate must not be earlier than dateOfBirth.',
        });
    }
    if (errors.length > 0) {
        return { valid: false, errors };
    }
    const birthWeight = birthWeightGrams.value;
    return {
        valid: true,
        errors: [],
        data: {
            babyName: babyName.value,
            sex: sex.value,
            dateOfBirth: dateOfBirth.value,
            gestationalAgeWeeks: gestationalAgeWeeks.value,
            birthWeightGrams: birthWeight,
            weightAtDischargeGrams: weightAtDischargeGrams.value,
            placeOfDelivery: placeOfDelivery.value,
            nicuStayDays: nicuStayDays.value,
            skinToSkinAtBirth: skinToSkinAtBirth.value,
            kmcInNicu: kmcInNicu.value,
            feedingAtDischarge: feedingAtDischarge.value,
            criedAtBirth: criedAtBirth.value,
            neededResuscitation: neededResuscitation.value,
            dischargeDate: dischargeDate.value,
            birthWeightStratum: calculateBirthWeightStratum(birthWeight),
        },
    };
}
export function validateHospitalCodeInput(value) {
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
    }
    else if (codeResult.value !== undefined) {
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
            code: codeResult.value.trim().toUpperCase(),
        },
    };
}
export function validateCompleteOnboardingInput(body) {
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
