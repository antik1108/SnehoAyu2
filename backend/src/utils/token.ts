/**
 * @file utils/token.ts
 * @description JWT access-token and cryptographic refresh-token utilities.
 *
 * ## Security model
 * - Access tokens: short-lived signed JWTs. The raw token is returned to the
 *   client but NEVER stored in the database.
 * - Refresh tokens: 32-byte cryptographically random values. Only the
 *   SHA-256 hash is stored in the `RefreshToken` table; the raw token is
 *   returned to the client exactly once.
 *
 * SECURITY: Never log `accessToken`, `rawRefreshToken`, or `tokenHash`.
 */

import jwt from 'jsonwebtoken';
import { createHash, randomBytes } from 'crypto';
import { env } from '../config/env.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** The claims embedded in every access token. */
export interface AccessTokenPayload {
  sub: string; // user UUID
  phone: string; // +91XXXXXXXXXX
  role: string;
  tokenType: 'access';
}

/** Data returned after generating a full token pair. */
export interface TokenPair {
  /** Raw signed JWT — return to client in response body. */
  accessToken: string;
  /** Raw random refresh token — return to client; store only the hash. */
  rawRefreshToken: string;
  /** SHA-256 hash of rawRefreshToken — persist this in the DB. */
  tokenHash: string;
  /** Absolute UTC timestamp when the refresh token expires. */
  refreshExpiresAt: Date;
}

// ---------------------------------------------------------------------------
// Access token
// ---------------------------------------------------------------------------

/**
 * Signs and returns a new access token JWT.
 *
 * @param payload - Claims to embed (`sub`, `phone`, `role`).
 * @returns Signed JWT string.
 */
export function generateAccessToken(
  payload: Omit<AccessTokenPayload, 'tokenType'>
): string {
  const claims: AccessTokenPayload = { ...payload, tokenType: 'access' };
  return jwt.sign(claims, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    algorithm: 'HS256',
  });
}

/**
 * Verifies an access token and returns the decoded payload.
 *
 * @param token - The raw JWT string from the Authorization header.
 * @returns The verified `AccessTokenPayload`.
 * @throws `JsonWebTokenError | TokenExpiredError` when verification fails.
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
    algorithms: ['HS256'],
  }) as AccessTokenPayload;

  if (decoded.tokenType !== 'access') {
    throw new jwt.JsonWebTokenError(
      'Token type mismatch: expected "access" token.'
    );
  }

  return decoded;
}

// ---------------------------------------------------------------------------
// Refresh token
// ---------------------------------------------------------------------------

/**
 * Generates a cryptographically secure refresh token.
 *
 * @returns Object containing:
 *   - `rawRefreshToken` – 64-hex-char (32-byte) random string for the client.
 *   - `tokenHash`       – SHA-256 hex digest to store in the database.
 *   - `expiresAt`       – Expiry `Date` object.
 */
export function generateRefreshToken(): {
  rawRefreshToken: string;
  tokenHash: string;
  expiresAt: Date;
} {
  const raw = randomBytes(32).toString('hex'); // 64 hex chars
  const hash = hashRefreshToken(raw);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.REFRESH_TOKEN_EXPIRES_IN_DAYS);

  return { rawRefreshToken: raw, tokenHash: hash, expiresAt };
}

/**
 * Hashes a raw refresh token with SHA-256.
 * Used to look up and revoke tokens without storing the plaintext.
 */
export function hashRefreshToken(rawToken: string): string {
  return createHash('sha256').update(rawToken).digest('hex');
}

// ---------------------------------------------------------------------------
// Full token pair (convenience)
// ---------------------------------------------------------------------------

/**
 * Generates both an access token and a refresh token in one call.
 *
 * @param payload - User identifiers to embed in the access token.
 * @returns `TokenPair` — pass `rawRefreshToken` to the client and persist `tokenHash`.
 */
export function generateTokenPair(
  payload: Omit<AccessTokenPayload, 'tokenType'>
): TokenPair {
  const accessToken = generateAccessToken(payload);
  const { rawRefreshToken, tokenHash, expiresAt } = generateRefreshToken();

  return {
    accessToken,
    rawRefreshToken,
    tokenHash,
    refreshExpiresAt: expiresAt,
  };
}
