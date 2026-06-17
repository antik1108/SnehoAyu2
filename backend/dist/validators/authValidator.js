/**
 * @file validators/authValidator.ts
 * @description Request-body validators for authentication endpoints.
 *
 * Uses plain TypeScript (no heavy validation library) to keep the dependency
 * surface small and align with the existing project style.
 *
 * All validation errors are returned as an array of field-level messages so
 * the client can highlight the specific fields that failed.
 */
// ---------------------------------------------------------------------------
// Password policy
// ---------------------------------------------------------------------------
/** Password policy constants (mirrors the requirements spec). */
export const PASSWORD_POLICY = {
    MIN_LENGTH: 8,
    MAX_LENGTH: 72, // bcrypt silently truncates at 72 bytes
    UPPERCASE: /[A-Z]/,
    LOWERCASE: /[a-z]/,
    DIGIT: /[0-9]/,
};
/**
 * Validates a password against the project password policy.
 * Returns a list of constraint messages that were violated.
 *
 * SECURITY: Never log the raw password or return it in responses.
 */
export function validatePasswordPolicy(password) {
    const violations = [];
    if (password.length < PASSWORD_POLICY.MIN_LENGTH) {
        violations.push(`Password must be at least ${PASSWORD_POLICY.MIN_LENGTH} characters long.`);
    }
    if (password.length > PASSWORD_POLICY.MAX_LENGTH) {
        violations.push(`Password must not exceed ${PASSWORD_POLICY.MAX_LENGTH} characters.`);
    }
    if (!PASSWORD_POLICY.UPPERCASE.test(password)) {
        violations.push('Password must contain at least one uppercase letter.');
    }
    if (!PASSWORD_POLICY.LOWERCASE.test(password)) {
        violations.push('Password must contain at least one lowercase letter.');
    }
    if (!PASSWORD_POLICY.DIGIT.test(password)) {
        violations.push('Password must contain at least one number.');
    }
    return violations;
}
/**
 * Validates the `POST /api/auth/register` request body.
 *
 * Does NOT normalise the phone here — normalisation happens in the service
 * so the same canonical value flows through all layers.
 */
export function validateRegisterInput(body) {
    const errors = [];
    // ── phone ──────────────────────────────────────────────────────────────────
    if (!body['phone'] || typeof body['phone'] !== 'string' || body['phone'].trim() === '') {
        errors.push({ field: 'phone', message: 'Phone number is required.' });
    }
    // ── password ───────────────────────────────────────────────────────────────
    if (!body['password'] || typeof body['password'] !== 'string') {
        errors.push({ field: 'password', message: 'Password is required.' });
    }
    else {
        // Never trim passwords — spaces may be intentional
        const policyViolations = validatePasswordPolicy(body['password']);
        for (const msg of policyViolations) {
            errors.push({ field: 'password', message: msg });
        }
    }
    // ── confirmPassword ────────────────────────────────────────────────────────
    if (!body['confirmPassword'] ||
        typeof body['confirmPassword'] !== 'string') {
        errors.push({
            field: 'confirmPassword',
            message: 'Password confirmation is required.',
        });
    }
    else if (body['password'] &&
        typeof body['password'] === 'string' &&
        body['confirmPassword'] !== body['password']) {
        errors.push({
            field: 'confirmPassword',
            message: 'Passwords do not match.',
        });
    }
    if (errors.length > 0) {
        return { valid: false, errors };
    }
    return {
        valid: true,
        errors: [],
        data: {
            phone: body['phone'],
            password: body['password'],
            confirmPassword: body['confirmPassword'],
        },
    };
}
/**
 * Validates the `POST /api/auth/login` request body.
 *
 * Returns minimal field-level errors. Generic auth-failure messages are
 * generated later in the service to prevent user-enumeration attacks.
 */
export function validateLoginInput(body) {
    const errors = [];
    if (!body['phone'] || typeof body['phone'] !== 'string' || body['phone'].trim() === '') {
        errors.push({ field: 'phone', message: 'Phone number is required.' });
    }
    if (!body['password'] || typeof body['password'] !== 'string' || body['password'] === '') {
        errors.push({ field: 'password', message: 'Password is required.' });
    }
    if (errors.length > 0) {
        return { valid: false, errors };
    }
    return {
        valid: true,
        errors: [],
        data: {
            phone: body['phone'],
            password: body['password'],
        },
    };
}
// ---------------------------------------------------------------------------
// PIN validators
// ---------------------------------------------------------------------------
export const PIN_POLICY = {
    DIGITS: /^\d{4}$/,
};
export function validatePinFormat(pin, field) {
    if (typeof pin !== 'string') {
        return [{ field, message: 'PIN must be a string.' }];
    }
    if (!PIN_POLICY.DIGITS.test(pin)) {
        return [{ field, message: 'PIN must contain exactly four digits.' }];
    }
    return [];
}
function validateRequiredPassword(value, field) {
    if (!value || typeof value !== 'string') {
        return [{ field, message: 'Current password is required.' }];
    }
    return [];
}
export function validateCreatePinInput(body) {
    const errors = [];
    errors.push(...validatePinFormat(body['pin'], 'pin'));
    if (typeof body['confirmPin'] !== 'string') {
        errors.push({ field: 'confirmPin', message: 'PIN confirmation is required.' });
    }
    else if (typeof body['pin'] === 'string' && body['confirmPin'] !== body['pin']) {
        errors.push({ field: 'confirmPin', message: 'PINs do not match.' });
    }
    if (body['currentPassword'] !== undefined &&
        typeof body['currentPassword'] !== 'string') {
        errors.push({
            field: 'currentPassword',
            message: 'Current password must be a string.',
        });
    }
    if (errors.length > 0) {
        return { valid: false, errors };
    }
    return {
        valid: true,
        errors: [],
        data: {
            pin: body['pin'],
            confirmPin: body['confirmPin'],
            currentPassword: body['currentPassword'],
        },
    };
}
export function validateLoginPinInput(body) {
    const errors = [];
    if (!body['phone'] || typeof body['phone'] !== 'string' || body['phone'].trim() === '') {
        errors.push({ field: 'phone', message: 'Phone number is required.' });
    }
    errors.push(...validatePinFormat(body['pin'], 'pin'));
    if (errors.length > 0) {
        return { valid: false, errors };
    }
    return {
        valid: true,
        errors: [],
        data: {
            phone: body['phone'],
            pin: body['pin'],
        },
    };
}
export function validateChangePinInput(body) {
    const errors = [];
    errors.push(...validateRequiredPassword(body['currentPassword'], 'currentPassword'));
    errors.push(...validatePinFormat(body['newPin'], 'newPin'));
    if (typeof body['confirmNewPin'] !== 'string') {
        errors.push({
            field: 'confirmNewPin',
            message: 'New PIN confirmation is required.',
        });
    }
    else if (typeof body['newPin'] === 'string' &&
        body['confirmNewPin'] !== body['newPin']) {
        errors.push({ field: 'confirmNewPin', message: 'PINs do not match.' });
    }
    if (errors.length > 0) {
        return { valid: false, errors };
    }
    return {
        valid: true,
        errors: [],
        data: {
            currentPassword: body['currentPassword'],
            newPin: body['newPin'],
            confirmNewPin: body['confirmNewPin'],
        },
    };
}
export function validateRemovePinInput(body) {
    const errors = validateRequiredPassword(body['currentPassword'], 'currentPassword');
    if (errors.length > 0) {
        return { valid: false, errors };
    }
    return {
        valid: true,
        errors: [],
        data: {
            currentPassword: body['currentPassword'],
        },
    };
}
