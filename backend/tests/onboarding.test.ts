import jwt from 'jsonwebtoken';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';

const { prismaMock } = vi.hoisted(() => {
  const mock = {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    motherProfile: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    babyProfile: {
      upsert: vi.fn(),
    },
    hospital: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    followUpSchedule: {
      createMany: vi.fn(),
      findMany: vi.fn(),
    },
    $transaction: vi.fn(),
  };
  mock.$transaction.mockImplementation(async (callback: (tx: typeof mock) => Promise<unknown>) => {
    return callback(mock);
  });
  return { prismaMock: mock };
});

vi.mock('../src/lib/prisma.js', () => ({ default: prismaMock }));

let requireAuth: typeof import('../src/middlewares/authMiddleware.js').requireAuth;
let saveMotherProfile: typeof import('../src/controllers/onboardingController.js').saveMotherProfile;
let saveBabyProfile: typeof import('../src/controllers/onboardingController.js').saveBabyProfile;
let linkHospital: typeof import('../src/controllers/onboardingController.js').linkHospital;
let getOrCreateParticipantCode: typeof import('../src/controllers/onboardingController.js').getOrCreateParticipantCode;
let completeOnboarding: typeof import('../src/controllers/onboardingController.js').completeOnboarding;
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
    ageRange: '18_25',
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
  ({
    saveMotherProfile,
    saveBabyProfile,
    linkHospital,
    getOrCreateParticipantCode,
    completeOnboarding,
  } = await import('../src/controllers/onboardingController.js'));
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
      expect.objectContaining({ statusCode: 401, code: 'AUTH_TOKEN_REQUIRED' })
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
      expect.objectContaining({ statusCode: 401, code: 'AUTH_TOKEN_INVALID' })
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
      expect.objectContaining({ statusCode: 401, code: 'AUTH_TOKEN_EXPIRED' })
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
      expect.objectContaining({ statusCode: 403, code: 'MOTHER_ROLE_REQUIRED' })
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
        data: expect.objectContaining({
          motherProfile: expect.objectContaining({ id: 'mother-profile-id' }),
          nextStep: 'baby_profile',
        }),
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

  it('rejects invalid ageRange', () => {
    const result = validateMotherProfileInput({
      ...validMotherBody(),
      ageRange: 'invalid-age-range',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'ageRange')).toBe(true);
  });

  it('rejects invalid educationMother', () => {
    const result = validateMotherProfileInput({
      ...validMotherBody(),
      educationMother: 'invalid-edu',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'educationMother')).toBe(true);
  });

  it('rejects invalid occupationFather', () => {
    const result = validateMotherProfileInput({
      ...validMotherBody(),
      occupationFather: 'invalid-occ',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'occupationFather')).toBe(true);
  });

  it('rejects family members count above 30', () => {
    const result = validateMotherProfileInput({
      ...validMotherBody(),
      familyMembersCount: 31,
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'familyMembersCount')).toBe(true);
  });

  it('normalizes contact number with spaces, hyphens, brackets and +91/91 prefix', () => {
    const result = validateMotherProfileInput({
      ...validMotherBody(),
      contactNumber: ' +91 98765-43210 ',
    });
    expect(result.valid).toBe(true);
    expect(result.data?.contactNumber).toBe('+919876543210');

    const result2 = validateMotherProfileInput({
      ...validMotherBody(),
      contactNumber: '919876543210',
    });
    expect(result2.valid).toBe(true);
    expect(result2.data?.contactNumber).toBe('+919876543210');
  });

  it('removes duplicate education sources', () => {
    const result = validateMotherProfileInput({
      ...validMotherBody(),
      prevPretermEducation: true,
      educationSource: ['health_worker', 'health_worker', 'family'],
    });
    expect(result.valid).toBe(true);
    expect(result.data?.educationSource).toEqual(['health_worker', 'family']);
  });

  it('clears stored education sources if prevPretermEducation is false', () => {
    const result = validateMotherProfileInput({
      ...validMotherBody(),
      prevPretermEducation: false,
      educationSource: ['health_worker'],
    });
    expect(result.valid).toBe(true);
    expect(result.data?.educationSource).toEqual([]);
  });

  it('preserves existing hospitalId, participantCode, and studyGroup on mother profile update', async () => {
    const existingRow = motherProfileRow({
      hospitalId: 'existing-hosp-id',
      participantCode: 'existing-code',
      studyGroup: 'existing-group',
    });
    prismaMock.motherProfile.upsert.mockResolvedValue(existingRow);
    const res = makeResponse();

    await saveMotherProfile(
      makeMotherRequest(validMotherBody()),
      res as unknown as Response,
      vi.fn() as NextFunction
    );

    // Verify that the database upsert is called with existing values omitted in update block
    expect(prismaMock.motherProfile.upsert).toHaveBeenCalledWith({
      where: { userId: '11111111-1111-1111-1111-111111111111' },
      create: expect.objectContaining({
        hospitalId: null,
        participantCode: null,
        studyGroup: null,
      }),
      update: expect.not.objectContaining({
        hospitalId: expect.anything(),
        participantCode: expect.anything(),
        studyGroup: expect.anything(),
      }),
    });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          motherProfile: expect.objectContaining({
            hospitalId: 'existing-hosp-id',
            participantCode: 'existing-code',
            studyGroup: 'existing-group',
          }),
        }),
      })
    );
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

  it('rejects invalid calendar dates', () => {
    const result = validateBabyProfileInput({
      ...validBabyBody(),
      dateOfBirth: '2026-02-30', // Feb 30
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'dateOfBirth')).toBe(true);
  });

  it('rejects gestational age with more than one decimal place', () => {
    const result = validateBabyProfileInput({
      ...validBabyBody(),
      gestationalAgeWeeks: 32.55,
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'gestationalAgeWeeks')).toBe(true);
  });

  it('rejects invalid discharge weight above 5000', () => {
    const result = validateBabyProfileInput({
      ...validBabyBody(),
      weightAtDischargeGrams: 5001,
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'weightAtDischargeGrams')).toBe(true);
  });

  it('rejects invalid nicu stay days outside 1-120 range', () => {
    const result = validateBabyProfileInput({
      ...validBabyBody(),
      nicuStayDays: 121,
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'nicuStayDays')).toBe(true);
  });

  it('rejects invalid feeding type', () => {
    const result = validateBabyProfileInput({
      ...validBabyBody(),
      feedingAtDischarge: 'invalid-feeding',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'feedingAtDischarge')).toBe(true);
  });

  it('recalculates birthWeightStratum when birth weight changes during update', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue({ id: 'mother-profile-id' });
    prismaMock.babyProfile.upsert.mockResolvedValue(
      babyProfileRow({ birthWeightGrams: 2600, birthWeightStratum: 'over_2500' })
    );
    const res = makeResponse();

    await saveBabyProfile(
      makeMotherRequest({ ...validBabyBody(), birthWeightGrams: 2600 }),
      res as unknown as Response,
      vi.fn() as NextFunction
    );

    expect(prismaMock.babyProfile.upsert).toHaveBeenCalledWith({
      where: { motherProfileId: 'mother-profile-id' },
      create: expect.objectContaining({
        birthWeightGrams: 2600,
        birthWeightStratum: 'over_2500',
      }),
      update: expect.objectContaining({
        birthWeightGrams: 2600,
        birthWeightStratum: 'over_2500',
      }),
    });
  });

  it('prevents one user from updating another user\'s baby profile by deriving identity from token', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(null);
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    const req = {
      body: validBabyBody(),
      user: {
        id: 'attacker-user-id',
        phone: '+919876543212',
        role: 'mother',
        preferredLanguage: 'bn',
        isActive: true,
      },
    } as Request;

    await saveBabyProfile(req, res as unknown as Response, next);

    expect(prismaMock.motherProfile.findUnique).toHaveBeenCalledWith({
      where: { userId: 'attacker-user-id' },
      select: { id: true },
    });
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        code: 'MOTHER_PROFILE_REQUIRED',
      })
    );
  });

  it('returns date-only fields without timezone shifting', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue({ id: 'mother-profile-id' });
    const row = babyProfileRow({
      dateOfBirth: new Date('2026-05-01T00:00:00.000Z'),
      dischargeDate: new Date('2026-05-22T00:00:00.000Z'),
    });
    prismaMock.babyProfile.upsert.mockResolvedValue(row);
    const res = makeResponse();

    await saveBabyProfile(
      makeMotherRequest(validBabyBody()),
      res as unknown as Response,
      vi.fn() as NextFunction
    );

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          babyProfile: expect.objectContaining({
            dateOfBirth: '2026-05-01',
            dischargeDate: '2026-05-22',
          }),
        }),
      })
    );
  });
});

describe('hospital code verification and linking', () => {
  it('rejects missing hospital code', async () => {
    const res = makeResponse();
    const next = vi.fn() as NextFunction;
    await linkHospital(
      makeMotherRequest({}),
      res as unknown as Response,
      next
    );
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        code: 'INVALID_REQUEST',
      })
    );
  });

  it('normalizes lowercase code to uppercase and trims whitespace', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(motherProfileRow());
    prismaMock.hospital.findUnique.mockResolvedValue({
      id: 'hosp-123',
      code: 'BNK',
      name: 'Bankura Medical',
      district: 'Bankura',
      state: 'West Bengal',
      type: 'primary_site',
      emergencyPhone: null,
      isActive: true,
    });
    prismaMock.user.update.mockResolvedValue({});
    prismaMock.motherProfile.update.mockResolvedValue({});

    const res = makeResponse();
    await linkHospital(
      makeMotherRequest({ code: ' bnk ' }),
      res as unknown as Response,
      vi.fn() as NextFunction
    );

    expect(prismaMock.hospital.findUnique).toHaveBeenCalledWith({
      where: { code: 'BNK' },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        alreadyLinked: false,
        data: expect.objectContaining({ code: 'BNK' }),
      })
    );
  });

  it('rejects unknown hospital code', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(motherProfileRow());
    prismaMock.hospital.findUnique.mockResolvedValue(null);

    const res = makeResponse();
    const next = vi.fn() as NextFunction;
    await linkHospital(
      makeMotherRequest({ code: 'XYZ' }),
      res as unknown as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        code: 'HOSPITAL_CODE_INVALID',
      })
    );
  });

  it('rejects inactive hospital for new enrollment', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(motherProfileRow());
    prismaMock.hospital.findUnique.mockResolvedValue({
      id: 'hosp-123',
      code: 'BNK',
      name: 'Bankura Medical',
      district: 'Bankura',
      state: 'West Bengal',
      type: 'primary_site',
      emergencyPhone: null,
      isActive: false, // Inactive!
    });

    const res = makeResponse();
    const next = vi.fn() as NextFunction;
    await linkHospital(
      makeMotherRequest({ code: 'BNK' }),
      res as unknown as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        code: 'HOSPITAL_ENROLLMENT_CLOSED',
      })
    );
  });

  it('returns alreadyLinked true if user is already linked to the same hospital', async () => {
    const mother = motherProfileRow({ hospitalId: 'hosp-123' });
    prismaMock.motherProfile.findUnique.mockResolvedValue(mother);
    prismaMock.hospital.findUnique.mockResolvedValue({
      id: 'hosp-123',
      code: 'BNK',
      name: 'Bankura Medical',
      district: 'Bankura',
      state: 'West Bengal',
      type: 'primary_site',
      emergencyPhone: null,
      isActive: true,
    });

    const req = makeMotherRequest({ code: 'BNK' });
    req.user = {
      id: '11111111-1111-1111-1111-111111111111',
      phone: '+919876543210',
      role: 'mother',
      preferredLanguage: 'bn',
      isActive: true,
      hospitalId: 'hosp-123', // Already linked in req.user too!
    };

    const res = makeResponse();
    await linkHospital(req, res as unknown as Response, vi.fn() as NextFunction);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Hospital is already linked.',
        alreadyLinked: true,
      })
    );
  });

  it('blocks changing hospital after participant code is generated', async () => {
    const mother = motherProfileRow({ participantCode: 'BNK-S-001' });
    prismaMock.motherProfile.findUnique.mockResolvedValue(mother);
    prismaMock.hospital.findUnique.mockResolvedValue({
      id: 'hosp-123',
      code: 'BNK',
      name: 'Bankura Medical',
      district: 'Bankura',
      state: 'West Bengal',
      type: 'primary_site',
      emergencyPhone: null,
      isActive: true,
    });

    const res = makeResponse();
    const next = vi.fn() as NextFunction;
    await linkHospital(
      makeMotherRequest({ code: 'BNK' }),
      res as unknown as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        code: 'HOSPITAL_LINK_LOCKED',
      })
    );
  });
});

describe('participant code generation', () => {
  it('returns existing participant code immediately if already assigned', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(
      motherProfileRow({
        participantCode: 'BNK-S-042',
        studyGroup: 'study',
        hospital: { id: 'hosp-123', code: 'BNK', name: 'Bankura Medical' },
        babyProfile: { birthWeightStratum: 'under_1500' },
      })
    );
    prismaMock.user.findUnique.mockResolvedValue({ hospitalId: 'hosp-123' });

    const res = makeResponse();
    await getOrCreateParticipantCode(
      makeMotherRequest({}),
      res as unknown as Response,
      vi.fn() as NextFunction
    );

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Participant code already assigned.',
        data: expect.objectContaining({
          participantCode: 'BNK-S-042',
          alreadyAssigned: true,
        }),
      })
    );
  });

  it('rejects if mother profile does not exist', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(null);

    const res = makeResponse();
    const next = vi.fn() as NextFunction;
    await getOrCreateParticipantCode(
      makeMotherRequest({}),
      res as unknown as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        code: 'MOTHER_PROFILE_REQUIRED',
      })
    );
  });

  it('rejects if baby profile does not exist', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue({
      id: 'mother-profile-id',
      participantCode: null,
      babyProfile: null, // No baby!
    });

    const res = makeResponse();
    const next = vi.fn() as NextFunction;
    await getOrCreateParticipantCode(
      makeMotherRequest({}),
      res as unknown as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        code: 'BABY_PROFILE_REQUIRED',
      })
    );
  });

  it('rejects if study group is missing and dev fallback is disabled', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue({
      id: 'mother-profile-id',
      participantCode: null,
      studyGroup: null, // Missing!
      hospitalId: 'hosp-123',
      hospital: { id: 'hosp-123', code: 'BNK', isActive: true },
      babyProfile: { birthWeightStratum: 'under_1500' },
    });
    prismaMock.user.findUnique.mockResolvedValue({ hospitalId: 'hosp-123' });

    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production'; // Falls back to production rules!

    const res = makeResponse();
    const next = vi.fn() as NextFunction;
    await getOrCreateParticipantCode(
      makeMotherRequest({}),
      res as unknown as Response,
      next
    );

    process.env.NODE_ENV = originalNodeEnv;

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        code: 'STUDY_GROUP_REQUIRED',
      })
    );
  });

  it('runs development random fallback when enabled', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue({
      id: 'mother-profile-id',
      participantCode: null,
      studyGroup: null, // Null study group!
      hospitalId: 'hosp-123',
      hospital: { id: 'hosp-123', code: 'BNK', isActive: true },
      babyProfile: { birthWeightStratum: 'under_1500' },
    });
    prismaMock.user.findUnique.mockResolvedValue({ hospitalId: 'hosp-123' });
    prismaMock.motherProfile.update.mockResolvedValue({});
    prismaMock.hospital.update.mockResolvedValue({
      code: 'BNK',
      nextParticipantNumber: 43, // Sequence will be 42
    });
    prismaMock.motherProfile.updateMany.mockResolvedValue({ count: 1 });

    const originalNodeEnv = process.env.NODE_ENV;
    const originalDevAssign = process.env.ENABLE_DEV_RANDOM_GROUP_ASSIGNMENT;
    process.env.NODE_ENV = 'development';
    process.env.ENABLE_DEV_RANDOM_GROUP_ASSIGNMENT = 'true';

    const res = makeResponse();
    await getOrCreateParticipantCode(
      makeMotherRequest({}),
      res as unknown as Response,
      vi.fn() as NextFunction
    );

    process.env.NODE_ENV = originalNodeEnv;
    process.env.ENABLE_DEV_RANDOM_GROUP_ASSIGNMENT = originalDevAssign;

    expect(prismaMock.motherProfile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'mother-profile-id' },
        data: { studyGroup: expect.stringMatching(/^(study|control)$/) },
      })
    );
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          participantCode: expect.stringMatching(/^BNK-[SC]-042$/),
          alreadyAssigned: false,
          assignmentSource: 'development_random',
        }),
      })
    );
  });

  it('generates a concurrency-safe participant code and updates the database', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue({
      id: 'mother-profile-id',
      participantCode: null,
      studyGroup: 'study',
      hospitalId: 'hosp-123',
      hospital: { id: 'hosp-123', code: 'BNK', isActive: true },
      babyProfile: { birthWeightStratum: 'under_1500' },
    });
    prismaMock.user.findUnique.mockResolvedValue({ hospitalId: 'hosp-123' });
    prismaMock.hospital.update.mockResolvedValue({
      code: 'BNK',
      nextParticipantNumber: 2, // sequence = 1
    });
    prismaMock.motherProfile.updateMany.mockResolvedValue({ count: 1 });

    const res = makeResponse();
    await getOrCreateParticipantCode(
      makeMotherRequest({}),
      res as unknown as Response,
      vi.fn() as NextFunction
    );

    expect(prismaMock.hospital.update).toHaveBeenCalledWith({
      where: { id: 'hosp-123' },
      data: { nextParticipantNumber: { increment: 1 } },
      select: { code: true, nextParticipantNumber: true },
    });
    expect(prismaMock.motherProfile.updateMany).toHaveBeenCalledWith({
      where: { id: 'mother-profile-id', participantCode: null },
      data: { participantCode: 'BNK-S-001' },
    });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          participantCode: 'BNK-S-001',
          alreadyAssigned: false,
          sequenceNumber: 1,
        }),
      })
    );
  });
});

describe('onboarding completion and follow-up schedules', () => {
  function mockCompleteMotherProfile(overrides: Record<string, unknown> = {}) {
    return {
      id: 'mother-profile-id',
      userId: '11111111-1111-1111-1111-111111111111',
      participantCode: 'BNK-S-001',
      studyGroup: 'study',
      hospitalId: 'hosp-123',
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
      prevPretermEducation: false,
      educationSource: [],
      enrolledAt: new Date('2026-06-01T00:00:00.000Z'),
      onboardingCompletedAt: null,
      user: {
        id: '11111111-1111-1111-1111-111111111111',
        phone: '+919876543210',
        role: 'mother',
        preferredLanguage: 'bn',
        isActive: true,
        hospitalId: 'hosp-123',
        deletedAt: null,
      },
      hospital: {
        id: 'hosp-123',
        code: 'BNK',
        name: 'Bankura Medical',
        district: 'Bankura',
        state: 'West Bengal',
        type: 'primary_site',
        emergencyPhone: null,
        isActive: true,
      },
      babyProfile: {
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
        dischargeDate: new Date('2026-06-01T00:00:00.000Z'),
      },
      followUpSchedules: [],
      ...overrides,
    };
  }

  it('rejects if mother profile does not exist', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(null);
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    await completeOnboarding(
      makeMotherRequest({}),
      res as unknown as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        code: 'MOTHER_PROFILE_REQUIRED',
      })
    );
  });

  it('rejects with ONBOARDING_INCOMPLETE if required demographic or link fields are missing', async () => {
    const incompleteProfile = mockCompleteMotherProfile({
      hospitalId: null,
      babyProfile: null,
      ageRange: '',
    });
    prismaMock.motherProfile.findUnique.mockResolvedValue(incompleteProfile);
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    await completeOnboarding(
      makeMotherRequest({}),
      res as unknown as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        code: 'ONBOARDING_INCOMPLETE',
        details: expect.arrayContaining([
          expect.objectContaining({ section: 'motherProfile', field: 'ageRange' }),
          expect.objectContaining({ section: 'hospital', field: 'hospitalId' }),
          expect.objectContaining({ section: 'babyProfile', field: 'id' }),
        ]),
      })
    );
  });

  it('rejects if baby birth date is after discharge date', async () => {
    const profile = mockCompleteMotherProfile();
    profile.babyProfile.dateOfBirth = new Date('2026-06-02T00:00:00.000Z');
    profile.babyProfile.dischargeDate = new Date('2026-06-01T00:00:00.000Z');
    prismaMock.motherProfile.findUnique.mockResolvedValue(profile);
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    await completeOnboarding(
      makeMotherRequest({}),
      res as unknown as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        code: 'ONBOARDING_INCOMPLETE',
        details: expect.arrayContaining([
          expect.objectContaining({ section: 'babyProfile', field: 'dischargeDate' }),
        ]),
      })
    );
  });

  it('rejects inactive hospital for new finalization', async () => {
    const profile = mockCompleteMotherProfile();
    profile.hospital.isActive = false;
    prismaMock.motherProfile.findUnique.mockResolvedValue(profile);
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    await completeOnboarding(
      makeMotherRequest({}),
      res as unknown as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        code: 'HOSPITAL_ENROLLMENT_CLOSED',
      })
    );
  });

  it('rejects inconsistent participant code', async () => {
    const profile = mockCompleteMotherProfile({
      participantCode: 'BWN-S-001',
    });
    prismaMock.motherProfile.findUnique.mockResolvedValue(profile);
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    await completeOnboarding(
      makeMotherRequest({}),
      res as unknown as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        code: 'PARTICIPANT_CODE_INCONSISTENT',
      })
    );
  });

  it('finalizes onboarding atomically, creates exactly 4 schedules, and returns HTTP 200', async () => {
    const profile = mockCompleteMotherProfile();
    prismaMock.motherProfile.findUnique.mockResolvedValue(profile);
    prismaMock.followUpSchedule.createMany.mockResolvedValue({ count: 4 });
    prismaMock.motherProfile.update.mockResolvedValue({
      ...profile,
      onboardingCompletedAt: new Date('2026-06-18T10:30:00.000Z'),
    });

    const expectedSchedules = [
      { id: '1', timePoint: 'baseline', scheduledDate: new Date('2026-06-01T00:00:00.000Z'), status: 'pending', dataComplete: false, actualDate: null },
      { id: '2', timePoint: '1_month', scheduledDate: new Date('2026-07-01T00:00:00.000Z'), status: 'pending', dataComplete: false, actualDate: null },
      { id: '3', timePoint: '3_months', scheduledDate: new Date('2026-08-30T00:00:00.000Z'), status: 'pending', dataComplete: false, actualDate: null },
      { id: '4', timePoint: '6_months', scheduledDate: new Date('2026-11-28T00:00:00.000Z'), status: 'pending', dataComplete: false, actualDate: null },
    ];
    prismaMock.followUpSchedule.findMany.mockResolvedValue(expectedSchedules);

    const res = makeResponse();
    await completeOnboarding(
      makeMotherRequest({}),
      res as unknown as Response,
      vi.fn() as NextFunction
    );

    expect(prismaMock.followUpSchedule.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({ timePoint: 'baseline', scheduledDate: new Date('2026-06-01T00:00:00.000Z') }),
        expect.objectContaining({ timePoint: '1_month', scheduledDate: new Date('2026-07-01T00:00:00.000Z') }),
        expect.objectContaining({ timePoint: '3_months', scheduledDate: new Date('2026-08-30T00:00:00.000Z') }),
        expect.objectContaining({ timePoint: '6_months', scheduledDate: new Date('2026-11-28T00:00:00.000Z') }),
      ]),
    });
    expect(prismaMock.motherProfile.update).toHaveBeenCalledWith({
      where: { id: 'mother-profile-id' },
      data: { onboardingCompletedAt: expect.any(Date) },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          onboarding: expect.objectContaining({
            completed: true,
            alreadyCompleted: false,
            participantCode: 'BNK-S-001',
          }),
          followUpSchedules: [
            { timePoint: 'baseline', scheduledDate: '2026-06-01', actualDate: null, status: 'pending', dataComplete: false },
            { timePoint: '1_month', scheduledDate: '2026-07-01', actualDate: null, status: 'pending', dataComplete: false },
            { timePoint: '3_months', scheduledDate: '2026-08-30', actualDate: null, status: 'pending', dataComplete: false },
            { timePoint: '6_months', scheduledDate: '2026-11-28', actualDate: null, status: 'pending', dataComplete: false },
          ],
        }),
      })
    );
  });

  it('supports leap year date calculations', async () => {
    const profile = mockCompleteMotherProfile();
    profile.babyProfile.dischargeDate = new Date('2028-02-29T00:00:00.000Z');
    prismaMock.motherProfile.findUnique.mockResolvedValue(profile);
    prismaMock.followUpSchedule.createMany.mockResolvedValue({ count: 4 });
    prismaMock.motherProfile.update.mockResolvedValue({
      ...profile,
      onboardingCompletedAt: new Date('2026-06-18T10:30:00.000Z'),
    });

    const expectedSchedules = [
      { id: '1', timePoint: 'baseline', scheduledDate: new Date('2028-02-29T00:00:00.000Z'), status: 'pending', dataComplete: false, actualDate: null },
      { id: '2', timePoint: '1_month', scheduledDate: new Date('2028-03-30T00:00:00.000Z'), status: 'pending', dataComplete: false, actualDate: null },
      { id: '3', timePoint: '3_months', scheduledDate: new Date('2028-05-29T00:00:00.000Z'), status: 'pending', dataComplete: false, actualDate: null },
      { id: '4', timePoint: '6_months', scheduledDate: new Date('2028-08-27T00:00:00.000Z'), status: 'pending', dataComplete: false, actualDate: null },
    ];
    prismaMock.followUpSchedule.findMany.mockResolvedValue(expectedSchedules);

    const res = makeResponse();
    await completeOnboarding(
      makeMotherRequest({}),
      res as unknown as Response,
      vi.fn() as NextFunction
    );

    expect(prismaMock.followUpSchedule.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({ timePoint: '1_month', scheduledDate: new Date('2028-03-30T00:00:00.000Z') }),
      ]),
    });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          followUpSchedules: expect.arrayContaining([
            expect.objectContaining({ timePoint: '1_month', scheduledDate: '2028-03-30' }),
          ]),
        }),
      })
    );
  });

  it('supports idempotency (repeated call returns alreadyCompleted true and does not recreate schedules)', async () => {
    const completedAt = new Date('2026-06-18T10:30:00.000Z');
    const expectedSchedules = [
      { id: '1', timePoint: 'baseline', scheduledDate: new Date('2026-06-01T00:00:00.000Z'), status: 'completed', dataComplete: true, actualDate: new Date('2026-06-01T00:00:00.000Z'), notes: 'test notes' },
      { id: '2', timePoint: '1_month', scheduledDate: new Date('2026-07-01T00:00:00.000Z'), status: 'pending', dataComplete: false, actualDate: null },
      { id: '3', timePoint: '3_months', scheduledDate: new Date('2026-08-30T00:00:00.000Z'), status: 'pending', dataComplete: false, actualDate: null },
      { id: '4', timePoint: '6_months', scheduledDate: new Date('2026-11-28T00:00:00.000Z'), status: 'pending', dataComplete: false, actualDate: null },
    ];

    const profile = mockCompleteMotherProfile({
      onboardingCompletedAt: completedAt,
      followUpSchedules: expectedSchedules,
    });
    prismaMock.motherProfile.findUnique.mockResolvedValue(profile);
    prismaMock.followUpSchedule.findMany.mockResolvedValue(expectedSchedules);

    const res = makeResponse();
    await completeOnboarding(
      makeMotherRequest({}),
      res as unknown as Response,
      vi.fn() as NextFunction
    );

    expect(prismaMock.followUpSchedule.createMany).not.toHaveBeenCalled();
    expect(prismaMock.motherProfile.update).not.toHaveBeenCalled();

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Onboarding was already completed.',
        data: expect.objectContaining({
          onboarding: expect.objectContaining({
            completed: true,
            alreadyCompleted: true,
            completedAt: completedAt.toISOString(),
          }),
          followUpSchedules: [
            expect.objectContaining({ timePoint: 'baseline', status: 'completed', actualDate: '2026-06-01' }),
            expect.objectContaining({ timePoint: '1_month', status: 'pending' }),
            expect.objectContaining({ timePoint: '3_months', status: 'pending' }),
            expect.objectContaining({ timePoint: '6_months', status: 'pending' }),
          ],
        }),
      })
    );
  });

  it('repairs missing schedules for already completed onboarding safely', async () => {
    const completedAt = new Date('2026-06-18T10:30:00.000Z');
    const partialSchedules = [
      { id: '1', timePoint: 'baseline', scheduledDate: new Date('2026-06-01T00:00:00.000Z'), status: 'completed', dataComplete: true, actualDate: new Date('2026-06-01T00:00:00.000Z') },
    ];

    const profile = mockCompleteMotherProfile({
      onboardingCompletedAt: completedAt,
      followUpSchedules: partialSchedules,
    });
    prismaMock.motherProfile.findUnique.mockResolvedValue(profile);
    prismaMock.followUpSchedule.createMany.mockResolvedValue({ count: 3 });

    const expectedFinalSchedules = [
      { id: '1', timePoint: 'baseline', scheduledDate: new Date('2026-06-01T00:00:00.000Z'), status: 'completed', dataComplete: true, actualDate: new Date('2026-06-01T00:00:00.000Z') },
      { id: '2', timePoint: '1_month', scheduledDate: new Date('2026-07-01T00:00:00.000Z'), status: 'pending', dataComplete: false, actualDate: null },
      { id: '3', timePoint: '3_months', scheduledDate: new Date('2026-08-30T00:00:00.000Z'), status: 'pending', dataComplete: false, actualDate: null },
      { id: '4', timePoint: '6_months', scheduledDate: new Date('2026-11-28T00:00:00.000Z'), status: 'pending', dataComplete: false, actualDate: null },
    ];
    prismaMock.followUpSchedule.findMany.mockResolvedValue(expectedFinalSchedules);

    const res = makeResponse();
    await completeOnboarding(
      makeMotherRequest({}),
      res as unknown as Response,
      vi.fn() as NextFunction
    );

    expect(prismaMock.followUpSchedule.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({ timePoint: '1_month' }),
        expect.objectContaining({ timePoint: '3_months' }),
        expect.objectContaining({ timePoint: '6_months' }),
      ]),
    });
    expect(prismaMock.followUpSchedule.createMany.mock.calls[0][0].data.length).toBe(3);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          onboarding: expect.objectContaining({
            completed: true,
            alreadyCompleted: true,
            repairedMissingSchedules: true,
          }),
        }),
      })
    );
  });
});
