import 'dotenv/config';
import { describe, it, expect } from 'vitest';
import {
  computeEngagementScore,
  computeEngagementTier,
  buildWhereClause,
  DailyLogRow,
} from '../src/services/analyticsService.js';

describe('analyticsService unit tests', () => {
  describe('computeEngagementScore', () => {
    it('returns 100 when all 28 days have >= 5 care tasks completed', () => {
      const fullLog: DailyLogRow = {
        breastfeedingDone: true,
        kmcDone: true,
        temperatureDone: true,
        weightCheckDone: true,
        skinCordCareDone: true,
        sleepDone: false,
        stoolDone: false,
      };
      const logs = Array(28).fill(fullLog);
      expect(computeEngagementScore(logs)).toBe(100);
    });

    it('returns 50 when 14 days out of 28 have >= 5 care tasks completed', () => {
      const fullLog: DailyLogRow = {
        breastfeedingDone: true,
        kmcDone: true,
        temperatureDone: true,
        weightCheckDone: true,
        skinCordCareDone: true,
        sleepDone: false,
        stoolDone: false,
      };
      const emptyLog: DailyLogRow = {
        breastfeedingDone: false,
        kmcDone: false,
        temperatureDone: false,
        weightCheckDone: false,
        skinCordCareDone: false,
        sleepDone: false,
        stoolDone: false,
      };
      const logs = [...Array(14).fill(fullLog), ...Array(14).fill(emptyLog)];
      expect(computeEngagementScore(logs)).toBe(50);
    });

    it('returns 0 when no logs have >= 5 care tasks completed', () => {
      const partialLog: DailyLogRow = {
        breastfeedingDone: true,
        kmcDone: true,
        temperatureDone: false,
        weightCheckDone: false,
        skinCordCareDone: false,
        sleepDone: false,
        stoolDone: false,
      };
      const logs = Array(28).fill(partialLog);
      expect(computeEngagementScore(logs)).toBe(0);
    });
  });

  describe('computeEngagementTier boundary tests (Property 1)', () => {
    it('maps score >= 75 to high', () => {
      expect(computeEngagementTier(75)).toBe('high');
      expect(computeEngagementTier(100)).toBe('high');
    });

    it('maps 40 <= score < 75 to medium', () => {
      expect(computeEngagementTier(74.99)).toBe('medium');
      expect(computeEngagementTier(40)).toBe('medium');
    });

    it('maps 10 <= score < 40 to low', () => {
      expect(computeEngagementTier(39.99)).toBe('low');
      expect(computeEngagementTier(10)).toBe('low');
    });

    it('maps score < 10 to inactive', () => {
      expect(computeEngagementTier(9.99)).toBe('inactive');
      expect(computeEngagementTier(0)).toBe('inactive');
    });
  });

  describe('buildWhereClause', () => {
    it('throws 400 error when enrolledAfter > enrolledBefore', () => {
      const enrolledAfter = new Date('2025-06-01');
      const enrolledBefore = new Date('2025-05-01');

      expect(() =>
        buildWhereClause({ enrolledAfter, enrolledBefore })
      ).toThrowError(/enrolledAfter cannot be later than enrolledBefore/);
    });

    it('constructs correct Prisma where clause for valid inputs', () => {
      const enrolledAfter = new Date('2025-01-01');
      const enrolledBefore = new Date('2025-06-01');

      const where = buildWhereClause({
        hospitalId: 'hosp-123',
        studyGroup: 'study',
        birthWeightStratum: 'under_1500',
        onboardingStatus: 'onboarded',
        enrolledAfter,
        enrolledBefore,
      });

      expect(where.hospitalId).toBe('hosp-123');
      expect(where.studyGroup).toBe('study');
      expect(where.babyProfile).toEqual({ birthWeightStratum: 'under_1500' });
      expect(where.onboardingCompletedAt).toEqual({ not: null });
      expect(where.enrolledAt).toEqual({ gte: enrolledAfter, lte: enrolledBefore });
    });
  });
});
