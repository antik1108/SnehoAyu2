import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';

const { prismaMock } = vi.hoisted(() => {
  const mock = {
    motherProfile: {
      findUnique: vi.fn(),
    },
    followUpSchedule: {
      findUnique: vi.fn(),
    },
    knowledgeAssessment: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  };
  return { prismaMock: mock };
});

vi.mock('../src/lib/prisma.js', () => ({ default: prismaMock }));

let getKnowledgeQuestions: typeof import('../src/controllers/knowledgeAssessmentController.js').getKnowledgeQuestions;
let getKnowledgeStatus: typeof import('../src/controllers/knowledgeAssessmentController.js').getKnowledgeStatus;
let postKnowledgeSubmission: typeof import('../src/controllers/knowledgeAssessmentController.js').postKnowledgeSubmission;

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
    babyProfile: { id: 'baby-profile-uuid' },
    onboardingCompletedAt: new Date('2026-06-01T00:00:00.000Z'),
    ...overrides,
  };
}

function makeFollowUp(overrides: Record<string, unknown> = {}) {
  return {
    id: 'follow-up-uuid',
    motherProfileId: 'mother-profile-uuid',
    timePoint: 'baseline',
    scheduledDate: new Date('2026-06-10T00:00:00.000Z'),
    status: 'pending',
    dataComplete: false,
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
  ({
    getKnowledgeQuestions,
    getKnowledgeStatus,
    postKnowledgeSubmission,
  } = await import('../src/controllers/knowledgeAssessmentController.js'));
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Knowledge Assessment Tool III backend', () => {
  it('returns 401 when req.user is missing', async () => {
    const req = { query: { timePoint: 'baseline' } } as unknown as Request;
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    await getKnowledgeStatus(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 401,
      code: 'AUTH_TOKEN_REQUIRED',
    }));
  });

  it('returns 403 when user is not a mother', async () => {
    const req = {
      user: makeUser({ role: 'nurse' }),
      query: { timePoint: 'baseline' },
    } as unknown as Request;
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    await getKnowledgeStatus(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 403,
      code: 'MOTHER_ROLE_REQUIRED',
    }));
  });

  it('returns public questions without correct answer keys and marks content not ready', async () => {
    const req = {
      user: makeUser(),
      query: { timePoint: 'baseline', lang: 'en' },
    } as unknown as Request;
    prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
    prismaMock.followUpSchedule.findUnique.mockResolvedValue(makeFollowUp());
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    await getKnowledgeQuestions(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    const body = res.json.mock.calls[0][0];
    expect(body.data.contentReady).toBe(false);
    expect(body.data.questions).toHaveLength(15);
    expect(body.data.questions[0].correctOptionId).toBeUndefined();
    expect(body.data.questions[0].approvedCorrectAnswerReference).toBeUndefined();
    expect(body.data.questions[0].contentStatus).toBe('approval_required');
  });

  it('requires a matching follow-up schedule', async () => {
    const req = {
      user: makeUser(),
      query: { timePoint: '3_months' },
    } as unknown as Request;
    prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
    prismaMock.followUpSchedule.findUnique.mockResolvedValue(null);
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    await getKnowledgeStatus(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 404,
      code: 'FOLLOW_UP_NOT_FOUND',
    }));
  });

  it('returns locked status for an existing submitted assessment', async () => {
    const submittedAt = new Date('2026-06-19T10:30:00.000Z');
    const req = {
      user: makeUser(),
      query: { timePoint: 'baseline' },
    } as unknown as Request;
    prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
    prismaMock.followUpSchedule.findUnique.mockResolvedValue(makeFollowUp());
    prismaMock.knowledgeAssessment.findUnique.mockResolvedValue({
      score: 12,
      maxScore: 15,
      percentage: 80,
      grade: 'good',
      submittedAt,
    });
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    await getKnowledgeStatus(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.objectContaining({
        submitted: true,
        locked: true,
        score: 12,
        percentage: 80,
        grade: 'good',
        submittedAt: submittedAt.toISOString(),
      }),
    });
  });

  it('blocks real submission while approved answer options are unavailable', async () => {
    const responses = Object.fromEntries(
      Array.from({ length: 15 }, (_, index) => [`q${index + 1}`, 'a'])
    );
    const req = {
      user: makeUser(),
      body: {
        timePoint: 'baseline',
        responses,
      },
    } as unknown as Request;
    prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
    prismaMock.followUpSchedule.findUnique.mockResolvedValue(makeFollowUp());
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    await postKnowledgeSubmission(req, res, next);

    expect(prismaMock.knowledgeAssessment.create).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 400,
      code: 'KNOWLEDGE_CONTENT_NOT_CONFIGURED',
    }));
  });

  it('rejects client-submitted score fields before persistence', async () => {
    const responses = Object.fromEntries(
      Array.from({ length: 15 }, (_, index) => [`q${index + 1}`, 'a'])
    );
    const req = {
      user: makeUser(),
      body: {
        timePoint: 'baseline',
        responses,
        score: 15,
      },
    } as unknown as Request;
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    await postKnowledgeSubmission(req, res, next);

    expect(prismaMock.knowledgeAssessment.create).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 400,
      code: 'INVALID_ASSESSMENT_RESPONSES',
    }));
  });
});
