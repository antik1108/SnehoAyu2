import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';

const { prismaMock } = vi.hoisted(() => {
  const mock = {
    motherProfile: { findUnique: vi.fn() },
    followUpSchedule: { findUnique: vi.fn() },
    psocAssessment: { findUnique: vi.fn(), create: vi.fn() },
  };
  return { prismaMock: mock };
});

vi.mock('../src/lib/prisma.js', () => ({ default: prismaMock }));

let getPsocQuestions: typeof import('../src/controllers/psocAssessmentController.js').getPsocQuestions;
let postPsocSubmission: typeof import('../src/controllers/psocAssessmentController.js').postPsocSubmission;
let scorePsoc: typeof import('../src/utils/psocScoring.js').scorePsoc;

function makeUser(overrides: Record<string, unknown> = {}) {
  return { id: 'user-id', phone: '+919876543210', role: 'mother', preferredLanguage: 'en', isActive: true, ...overrides };
}

function makeMotherProfile(overrides: Record<string, unknown> = {}) {
  return { id: 'mother-id', userId: 'user-id', babyProfile: { id: 'baby-id' }, onboardingCompletedAt: new Date(), ...overrides };
}

function makeResponse() {
  const res = { status: vi.fn(), json: vi.fn() };
  res.status.mockReturnValue(res as never);
  return res as unknown as Response & { status: ReturnType<typeof vi.fn>; json: ReturnType<typeof vi.fn> };
}

function psocResponses(value: number) {
  return Object.fromEntries(Array.from({ length: 17 }, (_, index) => [`q${index + 1}`, value]));
}

beforeAll(async () => {
  process.env['DATABASE_URL'] = 'postgresql://postgres:postgres@localhost:5432/snehoayu_test';
  process.env['NODE_ENV'] = 'test';
  ({ getPsocQuestions, postPsocSubmission } = await import('../src/controllers/psocAssessmentController.js'));
  ({ scorePsoc } = await import('../src/utils/psocScoring.js'));
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('PSOC assessment backend', () => {
  it('returns 17 items and 1-6 scale without reverse-scoring details', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
    prismaMock.followUpSchedule.findUnique.mockResolvedValue({ id: 'follow-up-id' });
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    await getPsocQuestions({ user: makeUser(), query: { timePoint: 'baseline', lang: 'en' } } as unknown as Request, res, next);

    expect(next).not.toHaveBeenCalled();
    const body = res.json.mock.calls[0][0];
    expect(body.data.contentReady).toBe(false);
    expect(body.data.questions).toHaveLength(17);
    expect(body.data.scale.map((option: { value: number }) => option.value)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(body.data.questions[1].scoringDirection).toBeUndefined();
    expect(body.data.questions[1].subscale).toBeUndefined();
  });

  it('rejects values outside 1-6', async () => {
    const res = makeResponse();
    const next = vi.fn() as NextFunction;
    await postPsocSubmission({
      user: makeUser(),
      body: { timePoint: 'baseline', responses: { ...psocResponses(4), q17: 7 } },
    } as unknown as Request, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400, code: 'INVALID_PSOC_RESPONSES' }));
  });

  it('rejects client-submitted scoring fields', async () => {
    const res = makeResponse();
    const next = vi.fn() as NextFunction;
    await postPsocSubmission({
      user: makeUser(),
      body: { timePoint: 'baseline', responses: psocResponses(4), totalScore: 99 },
    } as unknown as Request, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400, code: 'INVALID_PSOC_RESPONSES' }));
  });

  it('blocks submission while approved PSOC content is unavailable', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
    prismaMock.followUpSchedule.findUnique.mockResolvedValue({ id: 'follow-up-id' });
    const res = makeResponse();
    const next = vi.fn() as NextFunction;
    await postPsocSubmission({
      user: makeUser(),
      body: { timePoint: 'baseline', responses: psocResponses(4) },
    } as unknown as Request, res, next);
    expect(prismaMock.psocAssessment.create).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400, code: 'ASSESSMENT_CONTENT_NOT_CONFIGURED' }));
  });

  it('scores direct and reverse PSOC items with subscales', () => {
    const result = scorePsoc(psocResponses(6) as Parameters<typeof scorePsoc>[0]);
    expect(result.efficacyScore).toBe(48);
    expect(result.satisfactionScore).toBe(9);
    expect(result.totalScore).toBe(57);
    expect(result.maxScore).toBe(102);
    expect(result.classification).toBeNull();
    expect(result.classificationMethod).toBe('requires_cohort_norms');
  });
});
