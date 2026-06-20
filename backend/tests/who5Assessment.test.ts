import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';

const { prismaMock } = vi.hoisted(() => {
  const mock = {
    motherProfile: { findUnique: vi.fn() },
    followUpSchedule: { findUnique: vi.fn() },
    who5Assessment: { findUnique: vi.fn(), create: vi.fn() },
  };
  return { prismaMock: mock };
});

vi.mock('../src/lib/prisma.js', () => ({ default: prismaMock }));

let getWho5Questions: typeof import('../src/controllers/who5AssessmentController.js').getWho5Questions;
let postWho5Submission: typeof import('../src/controllers/who5AssessmentController.js').postWho5Submission;
let scoreWho5: typeof import('../src/utils/who5Scoring.js').scoreWho5;

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

beforeAll(async () => {
  process.env['DATABASE_URL'] = 'postgresql://postgres:postgres@localhost:5432/snehoayu_test';
  process.env['NODE_ENV'] = 'test';
  ({ getWho5Questions, postWho5Submission } = await import('../src/controllers/who5AssessmentController.js'));
  ({ scoreWho5 } = await import('../src/utils/who5Scoring.js'));
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('WHO-5 assessment backend', () => {
  it('returns 401 when req.user is missing', async () => {
    const res = makeResponse();
    const next = vi.fn() as NextFunction;
    await getWho5Questions({ query: { timePoint: 'baseline' } } as unknown as Request, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401, code: 'AUTH_TOKEN_REQUIRED' }));
  });

  it('returns 403 when user role is not mother', async () => {
    const res = makeResponse();
    const next = vi.fn() as NextFunction;
    await getWho5Questions({ user: makeUser({ role: 'nurse' }), query: { timePoint: 'baseline' } } as unknown as Request, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403, code: 'MOTHER_ROLE_REQUIRED' }));
  });

  it('returns 5 items and 0-5 scale without scoring output', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
    prismaMock.followUpSchedule.findUnique.mockResolvedValue({ id: 'follow-up-id' });
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    await getWho5Questions({ user: makeUser(), query: { timePoint: 'baseline', lang: 'en' } } as unknown as Request, res, next);

    expect(next).not.toHaveBeenCalled();
    const body = res.json.mock.calls[0][0];
    expect(body.data.contentReady).toBe(true);
    expect(body.data.questions).toHaveLength(5);
    expect(body.data.scale.map((option: { value: number }) => option.value)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(body.data.questions[0].rawScore).toBeUndefined();
  });

  it('rejects string-number responses', async () => {
    const res = makeResponse();
    const next = vi.fn() as NextFunction;
    await postWho5Submission({
      user: makeUser(),
      body: { timePoint: 'baseline', responses: { q1: '1', q2: 1, q3: 1, q4: 1, q5: 1 } },
    } as unknown as Request, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400, code: 'INVALID_WHO5_RESPONSES' }));
  });

  it('allows submission now that approved translations are available', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
    prismaMock.followUpSchedule.findUnique.mockResolvedValue({ id: 'follow-up-id' });
    prismaMock.who5Assessment.findUnique.mockResolvedValue(null);
    prismaMock.who5Assessment.create.mockResolvedValue({
      id: 'who5-id',
      motherProfileId: 'mother-id',
      followUpScheduleId: 'follow-up-id',
      timePoint: 'baseline',
      responses: { q1: 1, q2: 2, q3: 3, q4: 4, q5: 5 },
      rawScore: 15,
      maxScore: 25,
      percentageScore: 60,
      poorWellbeingFlag: false,
      interpretation: 'no_flag',
      submittedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
    const res = makeResponse();
    const next = vi.fn() as NextFunction;
    await postWho5Submission({
      user: makeUser(),
      body: { timePoint: 'baseline', responses: { q1: 1, q2: 2, q3: 3, q4: 4, q5: 5 } },
    } as unknown as Request, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(prismaMock.who5Assessment.create).toHaveBeenCalled();
  });

  it('scores WHO-5 using backend-only rules', () => {
    expect(scoreWho5({ q1: 3, q2: 3, q3: 3, q4: 2, q5: 2 })).toEqual({
      rawScore: 13,
      maxScore: 25,
      percentageScore: 52,
      poorWellbeingFlag: false,
      interpretation: 'no_flag',
    });
    expect(scoreWho5({ q1: 2, q2: 2, q3: 2, q4: 2, q5: 2 }).poorWellbeingFlag).toBe(true);
  });
});
