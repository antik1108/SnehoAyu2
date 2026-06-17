import jwt from 'jsonwebtoken';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    user: {
      findUnique: vi.fn(),
    },
    motherProfile: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
    },
    babyProfile: {
      upsert: vi.fn(),
    },
  },
}));

vi.mock('../src/lib/prisma.js', () => ({ default: prismaMock }));

let requireAuth: typeof import('../src/middlewares/authMiddleware.js').requireAuth;
let saveMotherProfile: typeof import('../src/controllers/onboardingController.js').saveMotherProfile;
let saveBabyProfile: typeof import('../src/controllers/onboardingController.js').saveBabyProfile;
let calculateBirthWeightStratum: typeof import('../src/validators/onboardingValidator.js').calculateBirthWeightStratum;
let validateMotherProfileInput: typeof import('../src/validators/onboardingValidator.js').validateMotherProfileInput;
let validateBabyProfileInput: typeof import('../src/validators/onboardingValidator.js').validateBabyProfileInput;
let generateAccessToken: typeof import('../src/utils/token.js').generateAccessToken;

interface ResponseMock {
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
}

function makeResponse(): ResponseMock {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };
  res.status.mockReturnValue(res);
  return res;
}

function makeMotherRequest(body: Record<string, unknown>): Request {
  return {
    body,
    user: {
      id: '11111111-1111-1111-1111-111111111111',
      phone: '+919876543210',
      role: 'mother',
      preferredLanguage: 'bn',
      isActive: true,
    },
  } as Request;
}

function validMotherBody(): Record<string, unknown> {
  return {
    fullName: ' Test Mother ',
    ageRange: '18-25',
    educationMother: 'secondary',
    educationFather: 'secondary',
    occupationMother: 'homemaker',
    occupationFather: 'private_service',
    incomeClass: 'III',
    familyType: 'nuclear',
    familyMembersCount: '3',
    religion: 'hindu',
    residenceType: 'semi_urban',
    contactNumber: '9876543210',
    prevPretermEducation: true,
    educationSource: ['health_worker'],
  };
}

function validBabyBody(): Record<string, unknown> {
  return {
    babyName: 'Maya',
    sex: 'female',
    dateOfBirth: '2026-05-01',
    gestationalAgeWeeks: 32.5,
    birthWeightGrams: 1450,
    weightAtDischargeGrams: 1650,
    placeOfDelivery: 'hospital',
    nicuStayDays: 21,
    skinToSkinAtBirth: true,
    kmcInNicu: true,
    feedingAtDischarge: 'exclusive_bf',
    criedAtBirth: true,
    neededResuscitation: false,
    dischargeDate: '2026-05-22',
  };
}

function motherProfileRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'mother-profile-id',
    userId: '11111111-1111-1111-1111-111111111111',
    participantCode: null,
    studyGroup: null,
    hospitalId: null,
    fullName: 'Test Mother',
    ageRange: '18-25',
    educationMother: 'secondary',
    educationFather: 'secondary',
    occupationMother: 'homemaker',
    occupationFather: 'private_service',
    incomeClass: 'III',
    familyType: 'nuclear',
    familyMembersCount: '3',
    religion: 'hindu',
    residenceType: 'semi_urban',
    contactNumber: '+919876543210',
    prevPretermEducation: true,
    educationSource: ['health_worker'],
    enrolledAt: new Date('2026-06-01T00:00:00.000Z'),
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    updatedAt: new Date('2026-06-01T00:00:00.000Z'),
    ...overrides,
  };
}

function babyProfileRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'baby-profile-id',
    motherProfileId: 'mother-profile-id',
    babyName: 'Maya',
    sex: 'female',
    dateOfBirth: new Date('2026-05-01T00:00:00.000Z'),
    gestationalAgeWeeks: { toString: () => '32.5' },
    birthWeightGrams: 1450,
    weightAtDischargeGrams: 1650,
    placeOfDelivery: 'hospital',
    nicuStayDays: 21,
    skinToSkinAtBirth: true,
    kmcInNicu: true,
    feedingAtDischarge: 'exclusive_bf',
    criedAtBirth: true,
    neededResuscitation: false,
    birthWeightStratum: 'under_1500',
    dischargeDate: new Date('2026-05-22T00:00:00.000Z'),
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    updatedAt: new Date('2026-06-01T00:00:00.000Z'),
    ...overrides,
  };
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

  ({ requireAuth } = await import('../src/middlewares/authMiddleware.js'));
  ({ saveMotherProfile, saveBabyProfile } = await import(
    '../src/controllers/onboardingController.js'
  ));
  ({
    calculateBirthWeightStratum,
    validateMotherProfileInput,
    validateBabyProfileInput,
  } = await import('../src/validators/onboardingValidator.js'));
  ({ generateAccessToken } = await import('../src/utils/token.js'));
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('birth-weight stratum helper', () => {
  it('calculates exact boundary strata', () => {
    expect(calculateBirthWeightStratum(1499)).toBe('under_1500');
    expect(calculateBirthWeightStratum(1500)).toBe('1500_to_2500');
    expect(calculateBirthWeightStratum(2500)).toBe('1500_to_2500');
    expect(calculateBirthWeightStratum(2501)).toBe('over_2500');
  });
});

describe('authentication middleware for onboarding', () => {
  it('rejects a missing Authorization header', async () => {
    const next = vi.fn() as NextFunction;
    await requireAuth({ headers: {} } as Request, {} as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401, code: 'MISSING_TOKEN' })
    );
  });

  it('rejects a wrong authentication scheme', async () => {
    const next = vi.fn() as NextFunction;
    await requireAuth(
      { headers: { authorization: 'Basic token' } } as Request,
      {} as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    );
  });

  it('rejects an invalid token', async () => {
    const next = vi.fn() as NextFunction;
    await requireAuth(
      { headers: { authorization: 'Bearer invalid-token' } } as Request,
      {} as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401, code: 'INVALID_TOKEN' })
    );
  });

  it('rejects an expired token', async () => {
    const token = jwt.sign(
      {
        sub: '11111111-1111-1111-1111-111111111111',
        phone: '+919876543210',
        role: 'mother',
        tokenType: 'access',
      },
      process.env['JWT_ACCESS_SECRET'] as string,
      { expiresIn: '-1s', algorithm: 'HS256' }
    );
    const next = vi.fn() as NextFunction;

    await requireAuth(
      { headers: { authorization: `Bearer ${token}` } } as Request,
      {} as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401, code: 'TOKEN_EXPIRED' })
    );
  });

  it('accepts a valid access token and attaches req.user', async () => {
    const token = generateAccessToken({
      sub: '11111111-1111-1111-1111-111111111111',
      phone: '+919876543210',
      role: 'mother',
    });
    prismaMock.user.findUnique.mockResolvedValue({
      id: '11111111-1111-1111-1111-111111111111',
      phone: '+919876543210',
      role: 'mother',
      preferredLanguage: 'bn',
      isActive: true,
      deletedAt: null,
    });
    const req = { headers: { authorization: `Bearer ${token}` } } as Request;
    const next = vi.fn() as NextFunction;

    await requireAuth(req, {} as Response, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user).toMatchObject({
      id: '11111111-1111-1111-1111-111111111111',
      role: 'mother',
    });
  });

  it('rejects non-mother roles from onboarding controllers', async () => {
    const req = {
      body: validMotherBody(),
      user: {
        id: 'nurse-user-id',
        phone: '+919876543211',
        role: 'nurse',
        preferredLanguage: 'bn',
        isActive: true,
      },
    } as Request;
    const next = vi.fn() as NextFunction;

    await saveMotherProfile(req, makeResponse() as unknown as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 403, code: 'FORBIDDEN' })
    );
  });
});

describe('mother profile validation and persistence', () => {
  it('creates a valid mother profile', async () => {
    prismaMock.motherProfile.upsert.mockResolvedValue(motherProfileRow());
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    await saveMotherProfile(
      makeMotherRequest(validMotherBody()),
      res as unknown as Response,
      next
    );

    expect(next).not.toHaveBeenCalled();
    expect(prismaMock.motherProfile.upsert).toHaveBeenCalledWith({
      where: { userId: '11111111-1111-1111-1111-111111111111' },
      create: expect.objectContaining({
        userId: '11111111-1111-1111-1111-111111111111',
        fullName: 'Test Mother',
        contactNumber: '+919876543210',
      }),
      update: expect.objectContaining({
        fullName: 'Test Mother',
        contactNumber: '+919876543210',
      }),
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: { motherProfile: expect.objectContaining({ id: 'mother-profile-id' }) },
      })
    );
  });

  it('uses upsert so a second submission updates the same record', async () => {
    prismaMock.motherProfile.upsert.mockResolvedValue(
      motherProfileRow({ fullName: 'Updated Mother' })
    );
    const res = makeResponse();

    await saveMotherProfile(
      makeMotherRequest({ ...validMotherBody(), fullName: 'Updated Mother' }),
      res as unknown as Response,
      vi.fn() as NextFunction
    );

    expect(prismaMock.motherProfile.upsert).toHaveBeenCalledTimes(1);
    expect(prismaMock.motherProfile.upsert.mock.calls[0][0].update).toMatchObject({
      fullName: 'Updated Mother',
    });
  });

  it('rejects invalid enum-like values', () => {
    const result = validateMotherProfileInput({
      ...validMotherBody(),
      familyType: 'single',
    });

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.field).toBe('familyType');
  });

  it('rejects invalid contact numbers', () => {
    const result = validateMotherProfileInput({
      ...validMotherBody(),
      contactNumber: '12345',
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.field === 'contactNumber')).toBe(
      true
    );
  });

  it('requires education source when previous education is true', () => {
    const result = validateMotherProfileInput({
      ...validMotherBody(),
      educationSource: [],
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.field === 'educationSource')).toBe(
      true
    );
  });

  it('rejects client attempts to assign another user ID', () => {
    const result = validateMotherProfileInput({
      ...validMotherBody(),
      userId: 'other-user-id',
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'userId',
      message: 'Unknown field "userId" is not allowed.',
    });
  });
});

describe('baby profile validation and persistence', () => {
  it('requires mother profile before saving a baby profile', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(null);
    const next = vi.fn() as NextFunction;

    await saveBabyProfile(
      makeMotherRequest(validBabyBody()),
      makeResponse() as unknown as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        code: 'MOTHER_PROFILE_REQUIRED',
      })
    );
  });

  it('creates a valid baby profile with server-calculated stratum', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue({ id: 'mother-profile-id' });
    prismaMock.babyProfile.upsert.mockResolvedValue(babyProfileRow());
    const res = makeResponse();

    await saveBabyProfile(
      makeMotherRequest(validBabyBody()),
      res as unknown as Response,
      vi.fn() as NextFunction
    );

    expect(prismaMock.babyProfile.upsert).toHaveBeenCalledWith({
      where: { motherProfileId: 'mother-profile-id' },
      create: expect.objectContaining({
        motherProfileId: 'mother-profile-id',
        birthWeightStratum: 'under_1500',
      }),
      update: expect.objectContaining({
        birthWeightStratum: 'under_1500',
      }),
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('uses upsert so a second baby submission updates the existing baby', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue({ id: 'mother-profile-id' });
    prismaMock.babyProfile.upsert.mockResolvedValue(
      babyProfileRow({ babyName: 'Updated Maya' })
    );

    await saveBabyProfile(
      makeMotherRequest({ ...validBabyBody(), babyName: 'Updated Maya' }),
      makeResponse() as unknown as Response,
      vi.fn() as NextFunction
    );

    expect(prismaMock.babyProfile.upsert).toHaveBeenCalledTimes(1);
    expect(prismaMock.babyProfile.upsert.mock.calls[0][0].update).toMatchObject({
      babyName: 'Updated Maya',
    });
  });

  it('rejects future birth dates', () => {
    const nextYear = new Date().getUTCFullYear() + 1;
    const result = validateBabyProfileInput({
      ...validBabyBody(),
      dateOfBirth: `${nextYear}-01-01`,
      dischargeDate: `${nextYear}-01-02`,
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.field === 'dateOfBirth')).toBe(
      true
    );
  });

  it('rejects discharge before birth', () => {
    const result = validateBabyProfileInput({
      ...validBabyBody(),
      dateOfBirth: '2026-05-10',
      dischargeDate: '2026-05-09',
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.field === 'dischargeDate')).toBe(
      true
    );
  });

  it('rejects gestational age of 37 or more', () => {
    const result = validateBabyProfileInput({
      ...validBabyBody(),
      gestationalAgeWeeks: 37,
    });

    expect(result.valid).toBe(false);
    expect(
      result.errors.some((error) => error.field === 'gestationalAgeWeeks')
    ).toBe(true);
  });

  it('rejects invalid weights', () => {
    const result = validateBabyProfileInput({
      ...validBabyBody(),
      birthWeightGrams: 399,
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.field === 'birthWeightGrams')).toBe(
      true
    );
  });

  it('rejects client-provided birthWeightStratum', () => {
    const result = validateBabyProfileInput({
      ...validBabyBody(),
      birthWeightStratum: 'over_2500',
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual({
      field: 'birthWeightStratum',
      message: 'Unknown field "birthWeightStratum" is not allowed.',
    });
  });
});
