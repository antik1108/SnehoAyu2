import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';

const { prismaMock } = vi.hoisted(() => {
  const mock = {
    motherProfile: {
      findUnique: vi.fn(),
    },
    dailyLog: {
      findUnique: vi.fn(),
    },
    growthReading: {
      findFirst: vi.fn(),
    },
  };
  return { prismaMock: mock };
});

vi.mock('../src/lib/prisma.js', () => ({ default: prismaMock }));

let getDashboardHomeForMother: typeof import('../src/services/dashboardService.js').getDashboardHomeForMother;
let getDashboardHome: typeof import('../src/controllers/dashboardController.js').getDashboardHome;

function makeUser(overrides: Record<string, unknown> = {}) {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    role: 'mother',
    preferredLanguage: 'bn',
    ...overrides,
  };
}

function makeMotherProfile(overrides: Record<string, unknown> = {}) {
  return {
    id: 'mother-profile-id',
    userId: '11111111-1111-1111-1111-111111111111',
    participantCode: 'BNK-S-001',
    studyGroup: 'study',
    hospitalId: 'hospital-id',
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
    onboardingCompletedAt: new Date('2026-06-18T00:00:00.000Z'),
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    updatedAt: new Date('2026-06-18T00:00:00.000Z'),
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
      dischargeDate: new Date('2026-05-22T00:00:00.000Z'),
      createdAt: new Date('2026-06-01T00:00:00.000Z'),
      updatedAt: new Date('2026-06-01T00:00:00.000Z'),
    },
    hospital: {
      id: 'hospital-id',
      code: 'BNK',
      name: 'Bankura Medical College',
      district: 'Bankura',
      state: 'West Bengal',
      type: 'Medical College',
      emergencyPhone: '+913212345678',
      isActive: true,
      nextParticipantNumber: 2,
      createdAt: new Date('2026-06-01T00:00:00.000Z'),
      updatedAt: new Date('2026-06-01T00:00:00.000Z'),
    },
    followUpSchedules: [
      {
        id: 'followup-1',
        motherProfileId: 'mother-profile-id',
        timePoint: '1_month',
        scheduledDate: new Date('2026-07-01T00:00:00.000Z'),
        actualDate: null,
        status: 'pending',
        dataComplete: false,
        collectedByUserId: null,
        notes: null,
        createdAt: new Date('2026-06-01T00:00:00.000Z'),
        updatedAt: new Date('2026-06-01T00:00:00.000Z'),
      },
    ],
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
  ({ getDashboardHomeForMother } = await import('../src/services/dashboardService.js'));
  ({ getDashboardHome } = await import('../src/controllers/dashboardController.js'));
});

beforeEach(() => {
  vi.clearAllMocks();
  prismaMock.dailyLog.findUnique.mockResolvedValue(null);
  prismaMock.growthReading.findFirst.mockResolvedValue(null);
});

describe('dashboard summary service', () => {
  it('returns a safe summary for completed onboarding', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());

    const result = await getDashboardHomeForMother(makeUser());

    expect(result.data.baby?.displayName).toBe('Maya');
    expect(result.data.baby?.latestWeightGrams).toBe(1650);
    expect(result.data.careToday.completionPercent).toBe(0);
    expect(result.data.nextReminder.title).toBe('1_month');
    expect(JSON.stringify(result)).not.toContain('mother-profile-id');
    expect(JSON.stringify(result)).not.toContain('baby-profile-id');
  });

  it('clamps corrected age to zero for display', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(
      makeMotherProfile({
        babyProfile: {
          ...makeMotherProfile().babyProfile,
          dateOfBirth: new Date('2026-06-18T00:00:00.000Z'),
          gestationalAgeWeeks: { toString: () => '24.0' },
        },
      })
    );

    const result = await getDashboardHomeForMother(makeUser());
    expect(result.data.baby?.correctedAgeDays).toBe(0);
    expect(result.data.baby?.correctedAgeDisplay).toBe('0 days');
  });

  it('prefers the latest growth reading over discharge and checklist weights', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
    prismaMock.growthReading.findFirst.mockResolvedValue({
      weightGrams: 2300,
    });

    const result = await getDashboardHomeForMother(makeUser());

    expect(result.data.baby?.latestWeightGrams).toBe(2300);
    expect(result.data.baby?.latestWeightSource).toBe('growth');
    expect(result.data.healthStats.lastWeightGrams).toBe(2300);
    expect(result.data.healthStats.weightSource).toBe('growth');
  });

  it('rejects missing mother profile', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(null);

    await expect(getDashboardHomeForMother(makeUser())).rejects.toMatchObject({
      statusCode: 409,
      code: 'MOTHER_PROFILE_REQUIRED',
    });
  });
});

describe('dashboard controller', () => {
  it('returns the dashboard summary payload', async () => {
    prismaMock.motherProfile.findUnique.mockResolvedValue(makeMotherProfile());
    const req = { user: makeUser() } as Request;
    const res = makeResponse();
    const next = vi.fn() as NextFunction;

    await getDashboardHome(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'ok' })
    );
  });
});
