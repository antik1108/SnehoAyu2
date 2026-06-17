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
// Types
// ---------------------------------------------------------------------------

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult<T> {
  valid: boolean;
  errors: ValidationError[];
  data?: T;
}

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
} as const;

/**
 * Validates a password against the project password policy.
 * Returns a list of constraint messages that were violated.
 *
 * SECURITY: Never log the raw password or return it in responses.
 */
export function validatePasswordPolicy(password: string): string[] {
  const violations: string[] = [];

  if (password.length < PASSWORD_POLICY.MIN_LENGTH) {
    violations.push(
      `Password must be at least ${PASSWORD_POLICY.MIN_LENGTH} characters long.`
    );
  }

  if (password.length > PASSWORD_POLICY.MAX_LENGTH) {
    violations.push(
      `Password must not exceed ${PASSWORD_POLICY.MAX_LENGTH} characters.`
    );
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

// ---------------------------------------------------------------------------
// Register validator
// ---------------------------------------------------------------------------

export interface RegisterInput {
  phone: string;
  password: string;
  confirmPassword: string;
}

/**
 * Validates the `POST /api/auth/register` request body.
 *
 * Does NOT normalise the phone here — normalisation happens in the service
 * so the same canonical value flows through all layers.
 */
export function validateRegisterInput(
  body: Record<string, unknown>
): ValidationResult<RegisterInput> {
  const errors: ValidationError[] = [];

  // ── phone ──────────────────────────────────────────────────────────────────
  if (!body['phone'] || typeof body['phone'] !== 'string' || body['phone'].trim() === '') {
    errors.push({ field: 'phone', message: 'Phone number is required.' });
  }

  // ── password ───────────────────────────────────────────────────────────────
  if (!body['password'] || typeof body['password'] !== 'string') {
    errors.push({ field: 'password', message: 'Password is required.' });
  } else {
    // Never trim passwords — spaces may be intentional
    const policyViolations = validatePasswordPolicy(body['password']);
    for (const msg of policyViolations) {
      errors.push({ field: 'password', message: msg });
    }
  }

  // ── confirmPassword ────────────────────────────────────────────────────────
  if (
    !body['confirmPassword'] ||
    typeof body['confirmPassword'] !== 'string'
  ) {
    errors.push({
      field: 'confirmPassword',
      message: 'Password confirmation is required.',
    });
  } else if (
    body['password'] &&
    typeof body['password'] === 'string' &&
    body['confirmPassword'] !== body['password']
  ) {
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
      phone: body['phone'] as string,
      password: body['password'] as string,
      confirmPassword: body['confirmPassword'] as string,
    },
  };
}

// ---------------------------------------------------------------------------
// Login validator
// ---------------------------------------------------------------------------

export interface LoginInput {
  phone: string;
  password: string;
}

export interface CreatePinInput {
  pin: string;
  confirmPin: string;
  currentPassword?: string;
}

export interface LoginPinInput {
  phone: string;
  pin: string;
}

export interface ChangePinInput {
  currentPassword: string;
  newPin: string;
  confirmNewPin: string;
}

export interface RemovePinInput {
  currentPassword: string;
}

/**
 * Validates the `POST /api/auth/login` request body.
 *
 * Returns minimal field-level errors. Generic auth-failure messages are
 * generated later in the service to prevent user-enumeration attacks.
 */
export function validateLoginInput(
  body: Record<string, unknown>
): ValidationResult<LoginInput> {
  const errors: ValidationError[] = [];

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
      phone: body['phone'] as string,
      password: body['password'] as string,
    },
  };
}

// ---------------------------------------------------------------------------
// PIN validators
// ---------------------------------------------------------------------------

export const PIN_POLICY = {
  DIGITS: /^\d{4}$/,
} as const;

export function validatePinFormat(pin: unknown, field: string): ValidationError[] {
  if (typeof pin !== 'string') {
    return [{ field, message: 'PIN must be a string.' }];
  }

  if (!PIN_POLICY.DIGITS.test(pin)) {
    return [{ field, message: 'PIN must contain exactly four digits.' }];
  }

  return [];
}

function validateRequiredPassword(
  value: unknown,
  field: string
): ValidationError[] {
  if (!value || typeof value !== 'string') {
    return [{ field, message: 'Current password is required.' }];
  }

  return [];
}

export function validateCreatePinInput(
  body: Record<string, unknown>
): ValidationResult<CreatePinInput> {
  const errors: ValidationError[] = [];

  errors.push(...validatePinFormat(body['pin'], 'pin'));

  if (typeof body['confirmPin'] !== 'string') {
    errors.push({ field: 'confirmPin', message: 'PIN confirmation is required.' });
  } else if (typeof body['pin'] === 'string' && body['confirmPin'] !== body['pin']) {
    errors.push({ field: 'confirmPin', message: 'PINs do not match.' });
  }

  if (
    body['currentPassword'] !== undefined &&
    typeof body['currentPassword'] !== 'string'
  ) {
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
      pin: body['pin'] as string,
      confirmPin: body['confirmPin'] as string,
      currentPassword: body['currentPassword'] as string | undefined,
    },
  };
}

export function validateLoginPinInput(
  body: Record<string, unknown>
): ValidationResult<LoginPinInput> {
  const errors: ValidationError[] = [];

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
      phone: body['phone'] as string,
      pin: body['pin'] as string,
    },
  };
}

export function validateChangePinInput(
  body: Record<string, unknown>
): ValidationResult<ChangePinInput> {
  const errors: ValidationError[] = [];

  errors.push(...validateRequiredPassword(body['currentPassword'], 'currentPassword'));
  errors.push(...validatePinFormat(body['newPin'], 'newPin'));

  if (typeof body['confirmNewPin'] !== 'string') {
    errors.push({
      field: 'confirmNewPin',
      message: 'New PIN confirmation is required.',
    });
  } else if (
    typeof body['newPin'] === 'string' &&
    body['confirmNewPin'] !== body['newPin']
  ) {
    errors.push({ field: 'confirmNewPin', message: 'PINs do not match.' });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: {
      currentPassword: body['currentPassword'] as string,
      newPin: body['newPin'] as string,
      confirmNewPin: body['confirmNewPin'] as string,
    },
  };
}

export function validateRemovePinInput(
  body: Record<string, unknown>
): ValidationResult<RemovePinInput> {
  const errors = validateRequiredPassword(
    body['currentPassword'],
    'currentPassword'
  );

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: {
      currentPassword: body['currentPassword'] as string,
    },
  };
}
