/**
 * @file services/authService.ts
 * @description Business logic for authentication endpoints.
 *
 * Responsibilities:
 *  - Phone normalisation
 *  - Password hashing / comparison (bcrypt)
 *  - User creation inside a Prisma transaction
 *  - Token pair generation
 *  - Failed-attempt tracking with atomic Prisma updates
 *  - Account-lock enforcement
 *
 * ## Security guarantees
 * - Raw passwords, password hashes, raw JWTs, and raw refresh tokens are
 *   NEVER stored in the database or written to logs.
 * - The login flow returns the same generic message for unknown phone and
 *   wrong password to prevent user-enumeration.
 * - Failed-attempt counters are incremented with Prisma `update` (atomic
 *   DB operation) rather than read-modify-write in application code.
 */

import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import { normalizePhone } from '../utils/phoneNumber.js';
import { generateTokenPair } from '../utils/token.js';
import { env } from '../config/env.js';
import { createError } from '../middlewares/errorHandler.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Safe user object that is returned to clients — no secrets included. */
export interface PublicUser {
  id: string;
  phone: string;
  phoneVerified: boolean;
  role: string;
  preferredLanguage: string;
  hasPin: boolean;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string; // raw value — only returned to client
  user: PublicUser;
  nextStep: 'CREATE_PIN' | 'DASHBOARD';
}

export interface PinMutationResult {
  hasPin: boolean;
  nextStep: 'DASHBOARD' | 'CREATE_PIN';
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_PASSWORD_ATTEMPTS = 5;
const MAX_PIN_ATTEMPTS = 5;
const LOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const DUMMY_PASSWORD_HASH =
  '$2b$12$oXG9rX4h9d39H0SAbc6xCe/51Kdy4/4tpOFoFFYaJdHng2lHEzS0S';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Converts a `User` row into the public-safe object that we return in API
 * responses. Sensitive fields (`passwordHash`, `pinHash`, lock fields) are
 * explicitly excluded.
 */
function toPublicUser(user: {
  id: string;
  phone: string | null;
  phoneVerified: boolean;
  role: string;
  preferredLanguage: string;
  pinHash: string | null;
}): PublicUser {
  return {
    id: user.id,
    phone: user.phone ?? '',
    phoneVerified: user.phoneVerified,
    role: user.role,
    preferredLanguage: user.preferredLanguage,
    hasPin: user.pinHash !== null,
  };
}

function validatePinStrength(pin: string, phone: string): void {
  const repeated = /^(\d)\1{3}$/.test(pin);
  const ascending = '0123456789'.includes(pin);
  const descending = '9876543210'.includes(pin);
  const barePhone = phone.replace(/^\+91/, '');

  if (repeated || ascending || descending) {
    throw createError(
      400,
      'WEAK_PIN',
      'Choose a less predictable PIN.'
    );
  }

  if (barePhone.includes(pin)) {
    throw createError(
      400,
      'WEAK_PIN',
      'PIN must not contain part of your phone number.'
    );
  }
}

async function verifyCurrentPassword(
  password: string,
  passwordHash: string
): Promise<void> {
  const matches = await bcrypt.compare(password, passwordHash);

  if (!matches) {
    throw createError(
      401,
      'INVALID_CREDENTIALS',
      'Invalid current password.'
    );
  }
}

async function findActiveUserById(userId: string): Promise<{
  id: string;
  phone: string;
  phoneVerified: boolean;
  passwordHash: string;
  pinHash: string | null;
  role: string;
  preferredLanguage: string;
  isActive: boolean;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      phone: true,
      phoneVerified: true,
      passwordHash: true,
      pinHash: true,
      role: true,
      preferredLanguage: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    throw createError(401, 'INVALID_TOKEN', 'Authentication required. Please log in.');
  }

  return user;
}

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------

/**
 * Creates a new user account.
 *
 * Steps:
 *  1. Normalize phone
 *  2. Check for duplicates (409 if exists)
 *  3. Hash password (bcrypt, configured rounds)
 *  4. Create user + refresh token in a single Prisma transaction
 *  5. Return tokens and sanitised user object
 */
export async function registerUser(
  rawPhone: string,
  password: string
): Promise<AuthResult> {
  // 1. Normalize
  const phone = normalizePhone(rawPhone);

  // 2. Duplicate check
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    throw createError(
      409,
      'PHONE_ALREADY_REGISTERED',
      'An account with this phone number already exists.'
    );
  }

  // 3. Hash password — bcrypt silently truncates at 72 bytes, which is why
  //    the validator enforces MAX_LENGTH = 72.
  const passwordHash = await bcrypt.hash(password, env.BCRYPT_PASSWORD_ROUNDS);

  // 4. Create user + store hashed refresh token (Prisma transaction)
  // We need the user id for the token — so we create the user first inside the
  // transaction and then generate tokens using the real id.
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        phone,
        phoneVerified: false,
        passwordHash,
        pinHash: null,
        role: 'mother',
        preferredLanguage: 'bn',
        isActive: true,
        failedPasswordAttempts: 0,
        passwordLockedUntil: null,
        failedPinAttempts: 0,
        pinLockedUntil: null,
      },
    });

    const tokens = generateTokenPair({
      sub: user.id,
      phone: user.phone ?? phone,
      role: user.role,
    });

    await tx.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: tokens.tokenHash,
        expiresAt: tokens.refreshExpiresAt,
      },
    });

    return { user, tokens };
  });

  // 5. Build response (SECURITY: never include passwordHash, pinHash, or tokenHash)
  return {
    accessToken: result.tokens.accessToken,
    refreshToken: result.tokens.rawRefreshToken,
    user: toPublicUser(result.user),
    nextStep: 'CREATE_PIN',
  };
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

/**
 * Authenticates an existing user with phone + password.
 *
 * SECURITY: Returns the same generic error for both "unknown phone" and
 * "wrong password" to prevent user-enumeration attacks.
 */
export async function loginUser(
  rawPhone: string,
  password: string
): Promise<AuthResult> {
  const GENERIC_MESSAGE = 'Invalid phone number or password.';

  // 1. Normalize
  const phone = normalizePhone(rawPhone);

  // 2. Look up user
  const user = await prisma.user.findUnique({ where: { phone } });

  // 3. Unknown phone — use bcrypt dummy compare to maintain constant time
  if (!user) {
    // Perform a dummy compare to prevent timing attacks that could reveal
    // whether an account exists based on response time differences.
    await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
    throw createError(401, 'INVALID_CREDENTIALS', GENERIC_MESSAGE);
  }

  // 4. Inactive account
  if (!user.isActive) {
    throw createError(401, 'INVALID_CREDENTIALS', GENERIC_MESSAGE);
  }

  // 5. Check password lock
  if (user.passwordLockedUntil && user.passwordLockedUntil > new Date()) {
    const remainingMs = user.passwordLockedUntil.getTime() - Date.now();
    const remainingMinutes = Math.ceil(remainingMs / 60_000);
    throw createError(
      423,
      'ACCOUNT_LOCKED',
      `Account is temporarily locked due to too many failed attempts. ` +
        `Try again in ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'}.`
    );
  }

  // 6. Verify passwordHash exists (registration without password shouldn't happen
  //    but guard defensively)
  if (!user.passwordHash) {
    throw createError(401, 'INVALID_CREDENTIALS', GENERIC_MESSAGE);
  }

  // 7. Compare password
  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        failedPasswordAttempts: { increment: 1 },
      },
      select: { failedPasswordAttempts: true },
    });

    if (updatedUser.failedPasswordAttempts >= MAX_PASSWORD_ATTEMPTS) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordLockedUntil: new Date(Date.now() + LOCK_DURATION_MS),
        },
      });
    }

    throw createError(401, 'INVALID_CREDENTIALS', GENERIC_MESSAGE);
  }

  // 8. Correct password — reset lock state and create new token pair
  const tokens = generateTokenPair({
    sub: user.id,
    phone: user.phone ?? phone,
    role: user.role,
  });

  await prisma.$transaction(async (tx) => {
    // Reset failed attempts and lock
    await tx.user.update({
      where: { id: user.id },
      data: {
        failedPasswordAttempts: 0,
        passwordLockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    // Persist only the hash of the refresh token
    await tx.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: tokens.tokenHash,
        expiresAt: tokens.refreshExpiresAt,
      },
    });
  });

  const publicUser = toPublicUser(user);

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.rawRefreshToken,
    user: publicUser,
    nextStep: publicUser.hasPin ? 'DASHBOARD' : 'CREATE_PIN',
  };
}

// ---------------------------------------------------------------------------
// PIN setup / mutation
// ---------------------------------------------------------------------------

export async function createOrUpdatePin(
  userId: string,
  pin: string,
  currentPassword?: string
): Promise<PinMutationResult> {
  const user = await findActiveUserById(userId);

  validatePinStrength(pin, user.phone);

  if (user.pinHash) {
    if (!currentPassword) {
      throw createError(
        400,
        'CURRENT_PASSWORD_REQUIRED',
        'Current password is required to update an existing PIN.'
      );
    }

    await verifyCurrentPassword(currentPassword, user.passwordHash);
  }

  const pinHash = await bcrypt.hash(pin, env.BCRYPT_PASSWORD_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      pinHash,
      failedPinAttempts: 0,
      pinLockedUntil: null,
    },
  });

  return {
    hasPin: true,
    nextStep: 'DASHBOARD',
  };
}

export async function changePin(
  userId: string,
  currentPassword: string,
  newPin: string
): Promise<PinMutationResult> {
  const user = await findActiveUserById(userId);

  await verifyCurrentPassword(currentPassword, user.passwordHash);
  validatePinStrength(newPin, user.phone);

  const pinHash = await bcrypt.hash(newPin, env.BCRYPT_PASSWORD_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      pinHash,
      failedPinAttempts: 0,
      pinLockedUntil: null,
    },
  });

  return {
    hasPin: true,
    nextStep: 'DASHBOARD',
  };
}

export async function removePin(
  userId: string,
  currentPassword: string
): Promise<PinMutationResult> {
  const user = await findActiveUserById(userId);

  await verifyCurrentPassword(currentPassword, user.passwordHash);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      pinHash: null,
      failedPinAttempts: 0,
      pinLockedUntil: null,
    },
  });

  return {
    hasPin: false,
    nextStep: 'CREATE_PIN',
  };
}

// ---------------------------------------------------------------------------
// PIN login
// ---------------------------------------------------------------------------

export async function loginWithPin(
  rawPhone: string,
  pin: string
): Promise<AuthResult> {
  const GENERIC_MESSAGE = 'Invalid phone number or PIN.';
  const phone = normalizePhone(rawPhone);

  const user = await prisma.user.findUnique({ where: { phone } });

  if (!user || !user.isActive || !user.pinHash) {
    await bcrypt.compare(pin, DUMMY_PASSWORD_HASH);
    throw createError(401, 'INVALID_CREDENTIALS', GENERIC_MESSAGE);
  }

  if (user.pinLockedUntil && user.pinLockedUntil > new Date()) {
    const remainingMs = user.pinLockedUntil.getTime() - Date.now();
    const remainingMinutes = Math.ceil(remainingMs / 60_000);
    throw createError(
      423,
      'PIN_LOCKED',
      `PIN login is temporarily locked. Try again in ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'}.`
    );
  }

  const pinMatches = await bcrypt.compare(pin, user.pinHash);

  if (!pinMatches) {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        failedPinAttempts: { increment: 1 },
      },
      select: { failedPinAttempts: true },
    });

    if (updatedUser.failedPinAttempts >= MAX_PIN_ATTEMPTS) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          pinLockedUntil: new Date(Date.now() + LOCK_DURATION_MS),
        },
      });
    }

    throw createError(401, 'INVALID_CREDENTIALS', GENERIC_MESSAGE);
  }

  const tokens = generateTokenPair({
    sub: user.id,
    phone: user.phone ?? phone,
    role: user.role,
  });

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: {
        failedPinAttempts: 0,
        pinLockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    await tx.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: tokens.tokenHash,
        expiresAt: tokens.refreshExpiresAt,
      },
    });
  });

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.rawRefreshToken,
    user: toPublicUser(user),
    nextStep: 'DASHBOARD',
  };
}
