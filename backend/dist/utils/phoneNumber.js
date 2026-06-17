/**
 * @file utils/phoneNumber.ts
 * @description Indian mobile phone number normalisation and validation.
 *
 * ## Rules
 * - Accept ONLY 10-digit strings that begin with 6, 7, 8, or 9.
 * - Reject letters, unsupported symbols, empty input, and wrong lengths.
 * - Store and compare ONLY the normalised +91XXXXXXXXXX form so the DB
 *   always contains one canonical representation.
 *
 * ## Examples
 * ```ts
 * normalizePhone('9876543210')   // '+919876543210'
 * normalizePhone('+919876543210') // throws PhoneValidationError
 * normalizePhone('09876543210')  // throws PhoneValidationError
 * normalizePhone('12345')        // throws PhoneValidationError
 * normalizePhone('1876543210')   // throws PhoneValidationError (starts with 1)
 * ```
 */
// ---------------------------------------------------------------------------
// Error type
// ---------------------------------------------------------------------------
/** Thrown when a phone number cannot be normalised to +91XXXXXXXXXX. */
export class PhoneValidationError extends Error {
    code = 'INVALID_PHONE';
    statusCode = 400;
    isOperational = true;
    constructor(message) {
        super(message);
        this.name = 'PhoneValidationError';
    }
}
// ---------------------------------------------------------------------------
// Normalisation
// ---------------------------------------------------------------------------
/** Regex for exactly 10 digits that start with 6, 7, 8, or 9. */
const VALID_INDIAN_MOBILE = /^[6-9]\d{9}$/;
/**
 * Validates and normalises an Indian mobile phone number.
 *
 * @param rawPhone - The raw value from the request body.
 * @returns The canonical `+91XXXXXXXXXX` string.
 * @throws {PhoneValidationError} when the number is invalid.
 */
export function normalizePhone(rawPhone) {
    if (rawPhone === null || rawPhone === undefined || rawPhone === '') {
        throw new PhoneValidationError('Phone number is required.');
    }
    if (typeof rawPhone !== 'string') {
        throw new PhoneValidationError('Phone number must be a string.');
    }
    const trimmed = rawPhone.trim();
    if (trimmed === '') {
        throw new PhoneValidationError('Phone number must not be blank.');
    }
    if (!/^\d+$/.test(trimmed)) {
        throw new PhoneValidationError('Phone number must contain exactly 10 digits without letters or symbols.');
    }
    if (trimmed.length !== 10) {
        throw new PhoneValidationError(`Phone number must be exactly 10 digits (received ${trimmed.length}).`);
    }
    if (!VALID_INDIAN_MOBILE.test(trimmed)) {
        throw new PhoneValidationError('Phone number must start with 6, 7, 8, or 9 for a valid Indian mobile number.');
    }
    return `+91${trimmed}`;
}
/**
 * Returns `true` when `rawPhone` can be normalised without throwing.
 * Useful for lightweight guard checks.
 */
export function isValidIndianPhone(rawPhone) {
    try {
        normalizePhone(rawPhone);
        return true;
    }
    catch {
        return false;
    }
}
