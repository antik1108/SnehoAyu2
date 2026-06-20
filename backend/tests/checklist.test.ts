import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';

const { prismaMock } = vi.hoisted(() => {
  const mock = {
    user: {
      findUnique: vi.fn(),
    },
    motherProfile: {
      findUnique: vi.fn(),
    },
    dailyLog: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      findMany: vi.fn(),
    },
  };
  return { prismaMock: mock };
});

vi.mock('../src/lib/prisma.js', () => ({ default: prismaMock }));

let getChecklistToday: typeof import('../src/controllers/checklistController.js').getChecklistToday;
let postChecklistLog: typeof import('../src/controllers/checklistController.js').postChecklistLog;
let getChecklistHistory: typeof import('../src/controllers/checklistController.js').getChecklistHistory;

function makeUser(overrides: Record<string, unknown> = {}) {
  return {
    id: 'user-mother-id',
    phone: '+919876543210',
    role: 'mother',
    preferredLanguage: 'en',
    isActive: true,
    ...overrides,
  };
}

function makeMotherProfile(overrides: Record<string, unknown> = {}) {
  return {
    id: 'mother-profile-uuid',
    userId: 'user-mother-id',
    participantCode: 'BNK-S-001',
    studyGroup: 'study',
    hospitalId: 'hospital-uuid',
    hospital: { id: 'hospital-uuid', code: 'BNK', name: 'Test Hospital' },
    babyProfile: {
      id: 'baby-profile-uuid',
      motherProfileId: 'mother-profile-uuid',
      babyName: 'Test Baby',
      sex: 'female',
      dateOfBirth: new Date(),
    },
    onboardingCompletedAt: new Date(),
    ...overrides,
  };
}

function makeResponse() {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };
  res.status.mockReturnValue(res as never);
  return res as unknown as Response & { status: ReturnType<typeof vi.fn>; json: ReturnType<typeof vi.fn> };
}

beforeAll(async () => {
  process.env['DATABASE_URL'] = 'postgresql://postgres:postgres@localhost:5432/snehoayu_test';
  process.env['NODE_ENV'] = 'test';
  ({ getChecklistToday, postChecklistLog, getChecklistHistory } = await import('../src/controllers/checklistController.js'));
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Checklist Backend Integration tests', () => {
  describe('Authentication & Roles', () => {
    it('returns 401 when req.user is missing', async () => {
      const req = {} as Request;
      const res = makeResponse();
      const next = vi.fn() as NextFunction;

      await getChecklistToday(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 401, code: 'AUTH_TOKEN_REQUIRED' })
      );
    });

    it('returns 403 when user role is not mother', async () => {
      const req = { user: makeUser({ role: 'nurse' }) } as unknown as Request;
      const res = makeResponse();
      const next = vi.fn() as NextFunction;

      await getChecklistToday(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 403, code: 'MOTHER_ROLE_REQUIRED' })
      );
    });

    it('returns 409 when mother profile is missing', async () => {
      const req = { user: makeUser() } as unknown as Request;
      prismaMock.motherProfile.findUnique.mockResolvedValue(null);
      const res = makeResponse();
      const next = vi.fn() as NextFunction;

      await getChecklistToday(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 409, code: 'MOTHER_PROFILE_REQUIRED' })
      );
    });

    it('returns 409 when onboarding is incomplete', async () => {
      const req = { user: makeUser() } as unknown as Request;
      prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile({ onboardingCompletedAt: null }));
      const res = makeResponse();
      const next = vi.fn() as NextFunction;

      await getChecklistToday(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 409, code: 'ONBOARDING_INCOMPLETE' })
      );
    });
  });

  describe('GET /today', () => {
    it('returns empty default state when no log row exists', async () => {
      const req = { user: makeUser() } as unknown as Request;
      prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
      prismaMock.dailyLog.findUnique.mockResolvedValue(null);
      const res = makeResponse();
      const next = vi.fn() as NextFunction;

      await getChecklistToday(req, res, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          completion: { completedCount: 0, totalCount: 5, percent: 0 },
          items: expect.objectContaining({
            breastfeeding: { done: false, feedsCount: null, volumeMl: null },
            kmc: { done: false, minutes: null },
            temperature: { done: false, morningC: null, eveningC: null },
            weight: { done: false, grams: null, optional: true },
            skinCordCare: { done: false },
            medication: { done: null, notes: null, optional: true },
            dangerSigns: { reviewed: false },
          }),
        }),
      });
      // Verify that no internal IDs are returned in data root
      const body = res.json.mock.calls[0][0];
      expect(body.data.id).toBeUndefined();
      expect(body.data.motherProfileId).toBeUndefined();
    });

    it('returns saved checklist states with correct completion calculation', async () => {
      const req = { user: makeUser() } as unknown as Request;
      prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
      prismaMock.dailyLog.findUnique.mockResolvedValue({
        id: 'some-log-id',
        motherProfileId: 'mother-profile-uuid',
        careDate: new Date(),
        breastfeedingDone: true,
        breastfeedingFeedsCount: 8,
        breastfeedingVolumeMl: null,
        kmcDone: true,
        kmcMinutes: 90,
        temperatureDone: false,
        temperatureMorningC: null,
        temperatureEveningC: null,
        weightCheckDone: true,
        weightGrams: 2800,
        skinCordCareDone: true,
        medicationDone: true,
        medicationNotes: 'Vitamins',
        dangerSignsReviewed: true,
      });

      const res = makeResponse();
      const next = vi.fn() as NextFunction;

      await getChecklistToday(req, res, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          completion: { completedCount: 4, totalCount: 5, percent: 80 }, // 4 out of 5 required are done: bf, kmc, skin, danger (temp is false)
          items: expect.objectContaining({
            breastfeeding: { done: true, feedsCount: 8, volumeMl: null },
            kmc: { done: true, minutes: 90 },
            temperature: { done: false, morningC: null, eveningC: null },
            weight: { done: true, grams: 2800, optional: true },
            skinCordCare: { done: true },
            medication: { done: true, notes: 'Vitamins', optional: true },
            dangerSigns: { reviewed: true },
          }),
        }),
      });
    });
  });

  describe('POST /log validation and processing', () => {
    it('accepts partial updates and updates database via upsert', async () => {
      const req = {
        user: makeUser(),
        body: {
          breastfeeding: { feedsCount: 10 },
          kmc: { minutes: 120 },
        },
      } as unknown as Request;

      prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
      prismaMock.dailyLog.findUnique.mockResolvedValue(null);
      prismaMock.dailyLog.upsert.mockResolvedValue({
        id: 'some-log-id',
        motherProfileId: 'mother-profile-uuid',
        careDate: new Date(),
        breastfeedingDone: true,
        breastfeedingFeedsCount: 10,
        kmcDone: true,
        kmcMinutes: 120,
        temperatureDone: false,
        weightCheckDone: false,
        skinCordCareDone: false,
        dangerSignsReviewed: false,
      });

      const res = makeResponse();
      const next = vi.fn() as NextFunction;

      await postChecklistLog(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(prismaMock.dailyLog.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Object),
          create: expect.objectContaining({
            breastfeedingDone: true,
            breastfeedingFeedsCount: 10,
            kmcDone: true,
            kmcMinutes: 120,
          }),
          update: expect.objectContaining({
            breastfeedingDone: true,
            breastfeedingFeedsCount: 10,
            kmcDone: true,
            kmcMinutes: 120,
          }),
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('rejects invalid fields in input', async () => {
      const req = {
        user: makeUser(),
        body: {
          someUnknownField: 'value',
        },
      } as unknown as Request;

      prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
      const res = makeResponse();
      const next = vi.fn() as NextFunction;

      await postChecklistLog(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 400, code: 'INVALID_REQUEST' })
      );
    });

    it('rejects invalid data ranges (e.g. breastfeeding count > 30)', async () => {
      const req = {
        user: makeUser(),
        body: {
          breastfeeding: { feedsCount: 31 },
        },
      } as unknown as Request;

      prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
      const res = makeResponse();
      const next = vi.fn() as NextFunction;

      await postChecklistLog(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          code: 'INVALID_REQUEST',
          message: expect.stringContaining('breastfeeding.feedsCount'),
        })
      );
    });

    it('rejects invalid temperature (e.g. 29C)', async () => {
      const req = {
        user: makeUser(),
        body: {
          temperature: { morningC: 29.5 },
        },
      } as unknown as Request;

      prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
      const res = makeResponse();
      const next = vi.fn() as NextFunction;

      await postChecklistLog(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 400, code: 'INVALID_REQUEST' })
      );
    });

    it('rejects temperature with invalid precision (e.g. 36.55C)', async () => {
      const req = {
        user: makeUser(),
        body: {
          temperature: { morningC: 36.55 },
        },
      } as unknown as Request;

      prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
      const res = makeResponse();
      const next = vi.fn() as NextFunction;

      await postChecklistLog(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 400, code: 'INVALID_REQUEST' })
      );
    });

    it('rejects medication notes longer than 300 chars', async () => {
      const req = {
        user: makeUser(),
        body: {
          medication: { notes: 'a'.repeat(301) },
        },
      } as unknown as Request;

      prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
      const res = makeResponse();
      const next = vi.fn() as NextFunction;

      await postChecklistLog(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 400, code: 'INVALID_REQUEST' })
      );
    });
  });

  describe('GET /history', () => {
    it('returns history records for default days (7)', async () => {
      const req = { user: makeUser(), query: {} } as unknown as Request;
      prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
      prismaMock.dailyLog.findMany.mockResolvedValue([
        {
          careDate: new Date('2026-06-19'),
          breastfeedingDone: true,
          kmcDone: true,
          temperatureDone: true,
          skinCordCareDone: true,
          dangerSignsReviewed: true,
        },
      ]);
      const res = makeResponse();
      const next = vi.fn() as NextFunction;

      await getChecklistHistory(req, res, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          days: 7,
          records: [
            expect.objectContaining({
              careDate: '2026-06-19',
              completedCount: 5,
              totalCount: 5,
              completionPercent: 100,
            }),
          ],
        },
      });
    });

    it('rejects invalid history range (e.g. days=10)', async () => {
      const req = { user: makeUser(), query: { days: '10' } } as unknown as Request;
      prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
      const res = makeResponse();
      const next = vi.fn() as NextFunction;

      await getChecklistHistory(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 400, code: 'INVALID_REQUEST' })
      );
    });
  });
});
