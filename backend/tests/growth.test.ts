import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';

const { prismaMock } = vi.hoisted(() => {
  const mock = {
    motherProfile: { findUnique: vi.fn() },
    growthReading: { create: vi.fn(), findMany: vi.fn(), findFirst: vi.fn() },
  };
  return { prismaMock: mock };
});

vi.mock('../src/lib/prisma.js', () => ({ default: prismaMock }));

let postGrowthLog: typeof import('../src/controllers/growthController.js').postGrowthLog;
let getGrowthHistory: typeof import('../src/controllers/growthController.js').getGrowthHistory;
let getGrowthLatest: typeof import('../src/controllers/growthController.js').getGrowthLatest;

function makeUser(overrides: Record<string, unknown> = {}) {
  return { id: 'user-id', phone: '+919876543210', role: 'mother', preferredLanguage: 'en', isActive: true, ...overrides };
}

function makeMotherProfile(overrides: Record<string, unknown> = {}) {
  return {
    id: 'mother-id',
    userId: 'user-id',
    onboardingCompletedAt: new Date('2026-06-01T00:00:00.000Z'),
    babyProfile: {
      id: 'baby-id',
      motherProfileId: 'mother-id',
      dateOfBirth: new Date('2026-05-01T00:00:00.000Z'),
      dischargeDate: new Date('2026-05-22T00:00:00.000Z'),
      gestationalAgeWeeks: { toString: () => '32.5' },
      weightAtDischargeGrams: 1650,
    },
    ...overrides,
  };
}

function makeReading(overrides: Record<string, unknown> = {}) {
  return {
    id: 'growth-id',
    babyProfileId: 'baby-id',
    motherProfileId: 'mother-id',
    recordedByUserId: 'user-id',
    readingDate: new Date('2026-06-19T00:00:00.000Z'),
    weightGrams: 2200,
    lengthCm: { toString: () => '45.5' },
    headCircumferenceCm: { toString: () => '32.1' },
    chronologicalAgeDays: 49,
    chronologicalAgeWeeks: { toString: () => '7' },
    correctedAgeDays: 0,
    correctedAgeWeeks: { toString: () => '0' },
    timePoint: '1_month',
    source: 'manual',
    notes: null,
    createdAt: new Date('2026-06-19T10:30:00.000Z'),
    ...overrides,
  };
}

function makeResponse() {
  const res = { status: vi.fn(), json: vi.fn() };
  res.status.mockReturnValue(res as never);
  return res as unknown as Response & { status: ReturnType<typeof vi.fn>; json: ReturnType<typeof vi.fn> };
}

beforeAll(async () => {
  process.env['DATABASE_URL'] = 'postgresql://postgres:postgres@localhost:5432/snehoayu_test';
  process.env['NODE_ENV'] = 'test';
  ({ postGrowthLog, getGrowthHistory, getGrowthLatest } = await import('../src/controllers/growthController.js'));
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('growth tracking backend', () => {
  it('returns 401 when req.user is missing', async () => {
    const res = makeResponse();
    const next = vi.fn() as NextFunction;
    await getGrowthLatest({} as Request, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401, code: 'AUTH_TOKEN_REQUIRED' }));
  });

  it('returns 403 for non-mother role', async () => {
    const res = makeResponse();
    const next = vi.fn() as NextFunction;
    await getGrowthLatest({ user: makeUser({ role: 'nurse' }) } as unknown as Request, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403, code: 'MOTHER_ROLE_REQUIRED' }));
  });

  it('creates a valid growth reading without exposing internal IDs', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
    prismaMock.growthReading.create.mockResolvedValue(makeReading());
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    await postGrowthLog({
      user: makeUser(),
      body: {
        readingDate: '2026-06-19',
        weightGrams: 2200,
        lengthCm: 45.5,
        headCircumferenceCm: 32.1,
        timePoint: '1_month',
      },
    } as unknown as Request, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(prismaMock.growthReading.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        motherProfileId: 'mother-id',
        babyProfileId: 'baby-id',
        recordedByUserId: 'user-id',
        chronologicalAgeDays: 49,
      }),
    }));
    const body = res.json.mock.calls[0][0];
    expect(JSON.stringify(body)).not.toContain('growth-id');
    expect(JSON.stringify(body)).not.toContain('mother-id');
    expect(body.data.weightGrams).toBe(2200);
  });

  it('rejects client-provided ownership fields and invalid measurements', async () => {
    const res = makeResponse();
    const next = vi.fn() as NextFunction;
    await postGrowthLog({
      user: makeUser(),
      body: {
        motherProfileId: 'mother-id',
        readingDate: '2026-06-19',
        weightGrams: 2200.5,
        lengthCm: 45.55,
        headCircumferenceCm: 32.1,
      },
    } as unknown as Request, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400, code: 'INVALID_GROWTH_READING' }));
  });

  it('rejects reading dates before DOB and future dates', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
    const res = makeResponse();
    const next = vi.fn() as NextFunction;
    await postGrowthLog({
      user: makeUser(),
      body: { readingDate: '2026-04-30', weightGrams: 2200, lengthCm: 45.5, headCircumferenceCm: 32.1 },
    } as unknown as Request, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400, code: 'INVALID_READING_DATE' }));
  });

  it('maps duplicate database errors to 409', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
    prismaMock.growthReading.create.mockRejectedValue({ code: 'P2002' });
    const res = makeResponse();
    const next = vi.fn() as NextFunction;
    await postGrowthLog({
      user: makeUser(),
      body: { readingDate: '2026-06-19', weightGrams: 2200, lengthCm: 45.5, headCircumferenceCm: 32.1 },
    } as unknown as Request, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 409, code: 'GROWTH_READING_ALREADY_EXISTS' }));
  });

  it('returns history newest first with discharge baseline', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
    prismaMock.growthReading.findMany.mockResolvedValue([makeReading()]);
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    await getGrowthHistory({ user: makeUser(), query: { limit: '30' } } as unknown as Request, res, next);

    expect(prismaMock.growthReading.findMany).toHaveBeenCalledWith(expect.objectContaining({
      orderBy: [{ readingDate: 'desc' }, { createdAt: 'desc' }],
      take: 30,
    }));
    const body = res.json.mock.calls[0][0];
    expect(body.data.baseline.source).toBe('discharge');
    expect(body.data.readings).toHaveLength(1);
  });

  it('returns latest growth source when available and discharge fallback otherwise', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
    prismaMock.growthReading.findFirst.mockResolvedValueOnce(makeReading());
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    await getGrowthLatest({ user: makeUser() } as unknown as Request, res, next);
    expect(res.json.mock.calls[0][0].data.source).toBe('growth');

    const res2 = makeResponse();
    prismaMock.growthReading.findFirst.mockResolvedValueOnce(null);
    await getGrowthLatest({ user: makeUser() } as unknown as Request, res2, next);
    expect(res2.json.mock.calls[0][0].data.source).toBe('discharge');
  });
});
