/**
 * @file config/env.ts
 * @description Validates and exports required environment variables at startup.
 *
 * Throws immediately if any required variable is absent, preventing the server
 * from starting in a broken state where auth would silently fail.
 *
 * SECURITY: Never log the values of secrets — only their names.
 */

const REQUIRED_VARS = [
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'ACCESS_TOKEN_EXPIRES_IN',
  'REFRESH_TOKEN_EXPIRES_IN_DAYS',
  'BCRYPT_PASSWORD_ROUNDS',
] as const;

type RequiredVar = (typeof REQUIRED_VARS)[number];

function requireEnv(name: RequiredVar): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(
      `[Config] Missing required environment variable: ${name}. ` +
        'Set it in your .env file before starting the server.'
    );
  }
  return value;
}

function validateAllEnvVars(): void {
  const missing: string[] = [];
  for (const name of REQUIRED_VARS) {
    if (!process.env[name] || process.env[name]!.trim() === '') {
      missing.push(name);
    }
  }
  if (missing.length > 0) {
    throw new Error(
      `[Config] Missing required environment variables: ${missing.join(', ')}. ` +
        'Set them in your .env file before starting the server.'
    );
  }
}

function parsePositiveInteger(name: RequiredVar): number {
  const value = Number.parseInt(requireEnv(name), 10);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(
      `[Config] ${name} must be a positive integer.`
    );
  }

  return value;
}

function parseBcryptRounds(): number {
  const rounds = parsePositiveInteger('BCRYPT_PASSWORD_ROUNDS');

  if (rounds < 12) {
    throw new Error(
      '[Config] BCRYPT_PASSWORD_ROUNDS must be at least 12.'
    );
  }

  return rounds;
}

// Validate at module load time so the error surfaces at startup, not mid-request.
validateAllEnvVars();

export const env = {
  DATABASE_URL: requireEnv('DATABASE_URL'),
  JWT_ACCESS_SECRET: requireEnv('JWT_ACCESS_SECRET'),
  ACCESS_TOKEN_EXPIRES_IN: requireEnv('ACCESS_TOKEN_EXPIRES_IN'),
  REFRESH_TOKEN_EXPIRES_IN_DAYS: parsePositiveInteger(
    'REFRESH_TOKEN_EXPIRES_IN_DAYS'
  ),
  BCRYPT_PASSWORD_ROUNDS: parseBcryptRounds(),
  PORT: parseInt(process.env['PORT'] ?? '4000', 10),
  NODE_ENV: process.env['NODE_ENV'] ?? 'development',
  CORS_ORIGINS: process.env['CORS_ORIGINS'] ?? '',
} as const;
