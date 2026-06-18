import bcrypt from 'bcrypt';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';

interface MockUser {
  id: string;
  phone: string;
  phoneVerified: boolean;
  passwordHash: string | null;
  pinHash: string | null;
  role: string;
  preferredLanguage: string;
  isActive: boolean;
  failedPasswordAttempts: number;
  passwordLockedUntil: Date | null;
  failedPinAttempts: number;
  pinLockedUntil: Date | null;
}

const { prismaMock, txMock } = vi.hoisted(() => {
  const tx = {
    user: {
      create: vi.fn(),
      update: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      update: vi.fn(),
    },
  };

  return {
    txMock: tx,
    prismaMock: {
      user: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      refreshToken: {
        findUnique: vi.fn(),
        create: vi.fn(),
        updateMany: vi.fn(),
      },
      $transaction: vi.fn(async (callback: (transaction: typeof tx) => unknown) =>
        callback(tx)
      ),
    },
  };
});

vi.mock('../src/lib/prisma.js', () => ({ default: prismaMock }));

let registerUser: typeof import('../src/services/authService.js').registerUser;
let loginUser: typeof import('../src/services/authService.js').loginUser;
let createOrUpdatePin: typeof import('../src/services/authService.js').createOrUpdatePin;
let loginWithPin: typeof import('../src/services/authService.js').loginWithPin;
let changePin: typeof import('../src/services/authService.js').changePin;
let removePin: typeof import('../src/services/authService.js').removePin;
let refreshSessionToken: typeof import('../src/services/authService.js').refreshSessionToken;
let logoutUser: typeof import('../src/services/authService.js').logoutUser;
let normalizePhone: typeof import('../src/utils/phoneNumber.js').normalizePhone;
let validateRegisterInput: typeof import('../src/validators/authValidator.js').validateRegisterInput;
let validateLoginInput: typeof import('../src/validators/authValidator.js').validateLoginInput;
let validateCreatePinInput: typeof import('../src/validators/authValidator.js').validateCreatePinInput;
let validateLoginPinInput: typeof import('../src/validators/authValidator.js').validateLoginPinInput;
let requireAuth: typeof import('../src/middlewares/authMiddleware.js').requireAuth;

function makeUser(overrides: Partial<MockUser> = {}): MockUser {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    phone: '+919876543210',
    phoneVerified: false,
    passwordHash: null,
    pinHash: null,
    role: 'mother',
    preferredLanguage: 'bn',
    isActive: true,
    failedPasswordAttempts: 0,
    passwordLockedUntil: null,
    failedPinAttempts: 0,
    pinLockedUntil: null,
    ...overrides,
  };
}

function expectNoSecrets(value: unknown): void {
  const json = JSON.stringify(value);

  expect(json).not.toContain('passwordHash');
  expect(json).not.toContain('pinHash');
  expect(json).not.toContain('tokenHash');
  expect(json).not.toContain('SecurePass123');
  expect(json).not.toContain('4826');
}

beforeAll(async () => {
  process.env['DATABASE_URL'] =
    'postgresql://postgres:postgres@localhost:5432/snehoayu_test';
  process.env['JWT_ACCESS_SECRET'] =
    'test-access-secret-that-is-long-enough-for-local-tests';
  process.env['ACCESS_TOKEN_EXPIRES_IN'] = '24h';
  process.env['REFRESH_TOKEN_EXPIRES_IN_DAYS'] = '30';
  process.env['BCRYPT_PASSWORD_ROUNDS'] = '12';
  process.env['NODE_ENV'] = 'test';

  ({
    registerUser,
    loginUser,
    createOrUpdatePin,
    loginWithPin,
    changePin,
    removePin,
    refreshSessionToken,
    logoutUser,
  } = await import('../src/services/authService.js'));
  ({ normalizePhone } = await import('../src/utils/phoneNumber.js'));
  ({
    validateRegisterInput,
    validateLoginInput,
    validateCreatePinInput,
    validateLoginPinInput,
  } = await import(
    '../src/validators/authValidator.js'
  ));
  ({ requireAuth } = await import('../src/middlewares/authMiddleware.js'));
});

beforeEach(() => {
  vi.clearAllMocks();
  prismaMock.$transaction.mockImplementation(
    async (callback: (transaction: typeof txMock) => unknown) => callback(txMock)
  );
});

describe('phone normalization', () => {
  it('normalizes a valid 10-digit Indian mobile number', () => {
    expect(normalizePhone('9876543210')).toBe('+919876543210');
  });

  it('rejects invalid Indian phone numbers', () => {
    expect(() => normalizePhone('5876543210')).toThrow(/start with 6, 7, 8, or 9/i);
    expect(() => normalizePhone('987654321')).toThrow(/exactly 10 digits/i);
    expect(() => normalizePhone('98765432101')).toThrow(/exactly 10 digits/i);
    expect(() => normalizePhone('98765abc10')).toThrow(/without letters or symbols/i);
    expect(() => normalizePhone('+919876543210')).toThrow(
      /without letters or symbols/i
    );
  });
});

describe('auth validation', () => {
  it('fails the password policy when required complexity is missing', () => {
    const result = validateRegisterInput({
      phone: '9876543210',
      password: 'password',
      confirmPassword: 'password',
    });

    expect(result.valid).toBe(false);
    expect(result.errors.map((error) => error.message).join(' ')).toContain(
      'uppercase'
    );
    expect(result.errors.map((error) => error.message).join(' ')).toContain(
      'number'
    );
  });

  it('fails when password and confirmation do not match', () => {
    const result = validateRegisterInput({
      phone: '9876543210',
      password: 'SecurePass123',
      confirmPassword: 'SecurePass124',
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'confirmPassword',
      message: 'Passwords do not match.',
    });
  });

  it('validates login input without changing the submitted password', () => {
    const result = validateLoginInput({
      phone: '9876543210',
      password: '  SecurePass123  ',
    });

    expect(result.valid).toBe(true);
    expect(result.data?.password).toBe('  SecurePass123  ');
  });

  it('rejects PINs shorter than four digits', () => {
    const result = validateCreatePinInput({ pin: '527', confirmPin: '527' });

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.message).toContain('exactly four digits');
  });

  it('rejects PINs longer than four digits', () => {
    const result = validateCreatePinInput({ pin: '05271', confirmPin: '05271' });

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.message).toContain('exactly four digits');
  });

  it('rejects non-numeric PINs', () => {
    const result = validateLoginPinInput({ phone: '9876543210', pin: '05a7' });

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.message).toContain('exactly four digits');
  });

  it('rejects mismatched PIN confirmation', () => {
    const result = validateCreatePinInput({ pin: '0527', confirmPin: '0528' });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'confirmPin',
      message: 'PINs do not match.',
    });
  });
});

describe('registration', () => {
  it('registers a mother, stores only hashes, and returns CREATE_PIN', async () => {
    const user = makeUser({
      passwordHash: await bcrypt.hash('SecurePass123', 12),
    });
    prismaMock.user.findUnique.mockResolvedValue(null);
    txMock.user.create.mockResolvedValue(user);
    txMock.refreshToken.create.mockResolvedValue({ id: 'refresh-id' });

    const result = await registerUser('9876543210', 'SecurePass123');

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { phone: '+919876543210' },
    });
    expect(txMock.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        phone: '+919876543210',
        phoneVerified: false,
        pinHash: null,
        role: 'mother',
        preferredLanguage: 'bn',
        failedPasswordAttempts: 0,
        failedPinAttempts: 0,
      }),
    });
    expect(txMock.user.create.mock.calls[0][0].data.passwordHash).not.toBe(
      'SecurePass123'
    );
    expect(txMock.refreshToken.create.mock.calls[0][0].data.tokenHash).toMatch(
      /^[a-f0-9]{64}$/
    );
    expect(result.user).toEqual({
      id: user.id,
      phone: '+919876543210',
      phoneVerified: false,
      role: 'mother',
      preferredLanguage: 'bn',
      hasPin: false,
    });
    expect(result.nextStep).toBe('CREATE_PIN');
    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshToken).toMatch(/^[a-f0-9]{64}$/);
    expectNoSecrets(result);
  });

  it('rejects duplicate registration with HTTP 409 metadata', async () => {
    prismaMock.user.findUnique.mockResolvedValue(makeUser());

    await expect(registerUser('9876543210', 'SecurePass123')).rejects.toMatchObject({
      statusCode: 409,
      code: 'PHONE_ALREADY_REGISTERED',
    });
  });
});

describe('password login', () => {
  it('logs in successfully and returns CREATE_PIN when no PIN exists', async () => {
    const user = makeUser({
      passwordHash: await bcrypt.hash('SecurePass123', 12),
    });
    prismaMock.user.findUnique.mockResolvedValue(user);
    txMock.user.update.mockResolvedValue({ ...user, failedPasswordAttempts: 0 });
    txMock.refreshToken.create.mockResolvedValue({ id: 'refresh-id' });

    const result = await loginUser('9876543210', 'SecurePass123');

    expect(txMock.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: {
        failedPasswordAttempts: 0,
        passwordLockedUntil: null,
        lastLoginAt: expect.any(Date),
      },
    });
    expect(result.nextStep).toBe('CREATE_PIN');
    expect(result.user.hasPin).toBe(false);
    expectNoSecrets(result);
  });

  it('returns DASHBOARD when the user already has a PIN', async () => {
    const user = makeUser({
      passwordHash: await bcrypt.hash('SecurePass123', 12),
      pinHash: await bcrypt.hash('1234', 12),
    });
    prismaMock.user.findUnique.mockResolvedValue(user);
    txMock.user.update.mockResolvedValue(user);
    txMock.refreshToken.create.mockResolvedValue({ id: 'refresh-id' });

    const result = await loginUser('9876543210', 'SecurePass123');

    expect(result.nextStep).toBe('DASHBOARD');
    expect(result.user.hasPin).toBe(true);
  });

  it('rejects an incorrect password with a generic message', async () => {
    const user = makeUser({
      passwordHash: await bcrypt.hash('SecurePass123', 12),
    });
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue({ failedPasswordAttempts: 1 });

    await expect(loginUser('9876543210', 'WrongPass123')).rejects.toMatchObject({
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid phone number or password.',
    });
  });

  it('rejects an unknown phone with the same generic message', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(loginUser('9876543210', 'SecurePass123')).rejects.toMatchObject({
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid phone number or password.',
    });
  });

  it('locks the account on the fifth failed password attempt', async () => {
    const user = makeUser({
      passwordHash: await bcrypt.hash('SecurePass123', 12),
      failedPasswordAttempts: 4,
    });
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.update
      .mockResolvedValueOnce({ failedPasswordAttempts: 5 })
      .mockResolvedValueOnce({ passwordLockedUntil: new Date() });

    await expect(loginUser('9876543210', 'WrongPass123')).rejects.toMatchObject({
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
    });

    expect(prismaMock.user.update).toHaveBeenNthCalledWith(2, {
      where: { id: user.id },
      data: {
        passwordLockedUntil: expect.any(Date),
      },
    });
  });

  it('rejects login while the password lock is active', async () => {
    prismaMock.user.findUnique.mockResolvedValue(
      makeUser({
        passwordHash: await bcrypt.hash('SecurePass123', 12),
        passwordLockedUntil: new Date(Date.now() + 30 * 60 * 1000),
      })
    );

    await expect(loginUser('9876543210', 'SecurePass123')).rejects.toMatchObject({
      statusCode: 423,
      code: 'ACCOUNT_LOCKED',
    });
  });

  it('allows successful login after the password lock has expired', async () => {
    const user = makeUser({
      passwordHash: await bcrypt.hash('SecurePass123', 12),
      failedPasswordAttempts: 5,
      passwordLockedUntil: new Date(Date.now() - 1_000),
    });
    prismaMock.user.findUnique.mockResolvedValue(user);
    txMock.user.update.mockResolvedValue(user);
    txMock.refreshToken.create.mockResolvedValue({ id: 'refresh-id' });

    const result = await loginUser('9876543210', 'SecurePass123');

    expect(result.nextStep).toBe('CREATE_PIN');
    expect(txMock.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: {
        failedPasswordAttempts: 0,
        passwordLockedUntil: null,
        lastLoginAt: expect.any(Date),
      },
    });
  });

  it('rejects inactive users with a generic message', async () => {
    prismaMock.user.findUnique.mockResolvedValue(
      makeUser({
        isActive: false,
        passwordHash: await bcrypt.hash('SecurePass123', 12),
      })
    );

    await expect(loginUser('9876543210', 'SecurePass123')).rejects.toMatchObject({
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid phone number or password.',
    });
  });

  it('allows password login while PIN login is locked', async () => {
    const user = makeUser({
      passwordHash: await bcrypt.hash('SecurePass123', 12),
      pinHash: await bcrypt.hash('4826', 12),
      failedPinAttempts: 5,
      pinLockedUntil: new Date(Date.now() + 30 * 60 * 1000),
    });
    prismaMock.user.findUnique.mockResolvedValue(user);
    txMock.user.update.mockResolvedValue(user);
    txMock.refreshToken.create.mockResolvedValue({ id: 'refresh-id' });

    const result = await loginUser('9876543210', 'SecurePass123');

    expect(result.nextStep).toBe('DASHBOARD');
    expect(txMock.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: {
        failedPasswordAttempts: 0,
        passwordLockedUntil: null,
        lastLoginAt: expect.any(Date),
      },
    });
  });
});

describe('PIN protected endpoint authentication', () => {
  it('rejects protected PIN routes when the access token is missing', async () => {
    const next = vi.fn() as NextFunction;
    const req = { headers: {} } as Request;

    await requireAuth(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        code: 'AUTH_TOKEN_REQUIRED',
      })
    );
  });

  it('rejects protected PIN routes when the access token is invalid', async () => {
    const next = vi.fn() as NextFunction;
    const req = {
      headers: { authorization: 'Bearer not-a-valid-token' },
    } as Request;

    await requireAuth(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        code: 'AUTH_TOKEN_INVALID',
      })
    );
  });
});

describe('PIN setup and management', () => {
  it('creates a PIN successfully and stores only a bcrypt hash', async () => {
    const user = makeUser({
      passwordHash: await bcrypt.hash('SecurePass123', 12),
    });
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue({ ...user, pinHash: 'hash' });

    const result = await createOrUpdatePin(user.id, '4826');

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: {
        pinHash: expect.any(String),
        failedPinAttempts: 0,
        pinLockedUntil: null,
      },
    });
    expect(prismaMock.user.update.mock.calls[0][0].data.pinHash).not.toBe('4826');
    expect(result).toEqual({ hasPin: true, nextStep: 'DASHBOARD' });
    expectNoSecrets(result);
  });

  it('preserves leading-zero PINs as strings', async () => {
    const user = makeUser({
      passwordHash: await bcrypt.hash('SecurePass123', 12),
    });
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue({ ...user, pinHash: 'hash' });

    const result = await createOrUpdatePin(user.id, '0527');

    expect(result.hasPin).toBe(true);
    expect(prismaMock.user.update.mock.calls[0][0].data.pinHash).not.toBe('0527');
  });

  it('rejects weak PINs', async () => {
    prismaMock.user.findUnique.mockResolvedValue(
      makeUser({ passwordHash: await bcrypt.hash('SecurePass123', 12) })
    );

    await expect(createOrUpdatePin('user-id', '1234')).rejects.toMatchObject({
      statusCode: 400,
      code: 'WEAK_PIN',
    });
  });

  it('changes a PIN with the correct password', async () => {
    const user = makeUser({
      passwordHash: await bcrypt.hash('SecurePass123', 12),
      pinHash: await bcrypt.hash('4826', 12),
    });
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue({ ...user, pinHash: 'new-hash' });

    const result = await changePin(user.id, 'SecurePass123', '5937');

    expect(result).toEqual({ hasPin: true, nextStep: 'DASHBOARD' });
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: {
        pinHash: expect.any(String),
        failedPinAttempts: 0,
        pinLockedUntil: null,
      },
    });
  });

  it('rejects PIN change with an incorrect password', async () => {
    const user = makeUser({
      passwordHash: await bcrypt.hash('SecurePass123', 12),
      pinHash: await bcrypt.hash('4826', 12),
    });
    prismaMock.user.findUnique.mockResolvedValue(user);

    await expect(changePin(user.id, 'WrongPass123', '5937')).rejects.toMatchObject({
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
    });
  });

  it('removes a PIN after password confirmation', async () => {
    const user = makeUser({
      passwordHash: await bcrypt.hash('SecurePass123', 12),
      pinHash: await bcrypt.hash('4826', 12),
    });
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue({ ...user, pinHash: null });

    const result = await removePin(user.id, 'SecurePass123');

    expect(result).toEqual({ hasPin: false, nextStep: 'CREATE_PIN' });
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: {
        pinHash: null,
        failedPinAttempts: 0,
        pinLockedUntil: null,
      },
    });
  });
});

describe('PIN login', () => {
  it('logs in successfully with PIN and returns DASHBOARD', async () => {
    const user = makeUser({
      passwordHash: await bcrypt.hash('SecurePass123', 12),
      pinHash: await bcrypt.hash('4826', 12),
    });
    prismaMock.user.findUnique.mockResolvedValue(user);
    txMock.user.update.mockResolvedValue(user);
    txMock.refreshToken.create.mockResolvedValue({ id: 'refresh-id' });

    const result = await loginWithPin('9876543210', '4826');

    expect(result.nextStep).toBe('DASHBOARD');
    expect(result.user).toMatchObject({
      id: user.id,
      phone: '+919876543210',
      hasPin: true,
    });
    expect(txMock.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: {
        failedPinAttempts: 0,
        pinLockedUntil: null,
        lastLoginAt: expect.any(Date),
      },
    });
    expect(txMock.refreshToken.create.mock.calls[0][0].data.tokenHash).toMatch(
      /^[a-f0-9]{64}$/
    );
    expectNoSecrets(result);
  });

  it('rejects an incorrect PIN with a generic message', async () => {
    const user = makeUser({
      passwordHash: await bcrypt.hash('SecurePass123', 12),
      pinHash: await bcrypt.hash('4826', 12),
    });
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue({ failedPinAttempts: 1 });

    await expect(loginWithPin('9876543210', '4827')).rejects.toMatchObject({
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid phone number or PIN.',
    });
  });

  it('rejects an unknown phone with the same generic message', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(loginWithPin('9876543210', '4826')).rejects.toMatchObject({
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid phone number or PIN.',
    });
  });

  it('rejects a user without a PIN with the same generic message', async () => {
    prismaMock.user.findUnique.mockResolvedValue(
      makeUser({ passwordHash: await bcrypt.hash('SecurePass123', 12) })
    );

    await expect(loginWithPin('9876543210', '4826')).rejects.toMatchObject({
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid phone number or PIN.',
    });
  });

  it('locks PIN login on the fifth failed attempt', async () => {
    const user = makeUser({
      passwordHash: await bcrypt.hash('SecurePass123', 12),
      pinHash: await bcrypt.hash('4826', 12),
      failedPinAttempts: 4,
    });
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.update
      .mockResolvedValueOnce({ failedPinAttempts: 5 })
      .mockResolvedValueOnce({ pinLockedUntil: new Date() });

    await expect(loginWithPin('9876543210', '4827')).rejects.toMatchObject({
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
    });

    expect(prismaMock.user.update).toHaveBeenNthCalledWith(2, {
      where: { id: user.id },
      data: {
        pinLockedUntil: expect.any(Date),
      },
    });
  });

  it('rejects PIN login while locked', async () => {
    prismaMock.user.findUnique.mockResolvedValue(
      makeUser({
        passwordHash: await bcrypt.hash('SecurePass123', 12),
        pinHash: await bcrypt.hash('4826', 12),
        pinLockedUntil: new Date(Date.now() + 30 * 60 * 1000),
      })
    );

    await expect(loginWithPin('9876543210', '4826')).rejects.toMatchObject({
      statusCode: 423,
      code: 'PIN_LOCKED',
    });
  });

  it('allows correct PIN after the lock has expired', async () => {
    const user = makeUser({
      passwordHash: await bcrypt.hash('SecurePass123', 12),
      pinHash: await bcrypt.hash('4826', 12),
      failedPinAttempts: 5,
      pinLockedUntil: new Date(Date.now() - 1_000),
    });
    prismaMock.user.findUnique.mockResolvedValue(user);
    txMock.user.update.mockResolvedValue(user);
    txMock.refreshToken.create.mockResolvedValue({ id: 'refresh-id' });

    const result = await loginWithPin('9876543210', '4826');

    expect(result.nextStep).toBe('DASHBOARD');
    expect(txMock.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: {
        failedPinAttempts: 0,
        pinLockedUntil: null,
        lastLoginAt: expect.any(Date),
      },
    });
  });

  it('updates failed PIN attempts atomically without touching password counters', async () => {
    const user = makeUser({
      passwordHash: await bcrypt.hash('SecurePass123', 12),
      pinHash: await bcrypt.hash('4826', 12),
    });
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.update.mockResolvedValue({ failedPinAttempts: 1 });

    await expect(loginWithPin('9876543210', '4827')).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    });

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: {
        failedPinAttempts: { increment: 1 },
      },
      select: { failedPinAttempts: true },
    });
  });

  describe('refreshSessionToken', () => {
    it('refreshes token successfully and rotates refresh token', async () => {
      const user = makeUser();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const tokenRecord = {
        id: 'token-uuid',
        userId: user.id,
        tokenHash: 'some-hash',
        expiresAt,
        revokedAt: null,
        user,
      };

      prismaMock.refreshToken.findUnique.mockResolvedValue(tokenRecord);
      txMock.refreshToken.update.mockResolvedValue({});
      txMock.refreshToken.create.mockResolvedValue({});

      const result = await refreshSessionToken('some-token');

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user.id).toBe(user.id);
      expect(txMock.refreshToken.update).toHaveBeenCalledWith({
        where: { id: 'token-uuid' },
        data: { revokedAt: expect.any(Date) },
      });
      expect(txMock.refreshToken.create).toHaveBeenCalled();
    });

    it('rejects expired or revoked refresh token', async () => {
      prismaMock.refreshToken.findUnique.mockResolvedValue({
        id: 'token-uuid',
        revokedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      await expect(refreshSessionToken('some-token')).rejects.toMatchObject({
        code: 'INVALID_REFRESH_TOKEN',
      });
    });
  });

  describe('logoutUser', () => {
    it('revokes refresh token', async () => {
      prismaMock.refreshToken.updateMany.mockResolvedValue({ count: 1 });
      await logoutUser('some-token');
      expect(prismaMock.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { tokenHash: expect.any(String) },
        data: { revokedAt: expect.any(Date) },
      });
    });
  });
});
