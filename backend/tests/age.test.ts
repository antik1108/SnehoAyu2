import { describe, expect, it } from 'vitest';
import { calculateChronologicalAgeDays, calculateCorrectedAge } from '../src/utils/age.js';

describe('age utilities', () => {
  it('calculates same-day and one-day chronological age', () => {
    expect(calculateChronologicalAgeDays('2026-06-01', '2026-06-01')).toBe(0);
    expect(calculateChronologicalAgeDays('2026-06-01', '2026-06-02')).toBe(1);
  });

  it('handles month, year, and leap-year boundaries without timezone drift', () => {
    expect(calculateChronologicalAgeDays('2026-01-31', '2026-02-01')).toBe(1);
    expect(calculateChronologicalAgeDays('2025-12-31', '2026-01-01')).toBe(1);
    expect(calculateChronologicalAgeDays('2024-02-28', '2024-03-01')).toBe(2);
  });

  it('calculates corrected age using decimal gestational age and clamps display days', () => {
    const result = calculateCorrectedAge({
      dateOfBirth: '2026-05-01',
      gestationalAgeWeeks: 32.5,
      referenceDate: '2026-06-19',
    });

    expect(result.chronologicalAgeDays).toBe(49);
    expect(result.prematurityAdjustmentDays).toBe(53);
    expect(result.correctedAgeDaysRaw).toBe(-4);
    expect(result.correctedAgeDays).toBe(0);
    expect(result.correctedAgeWeeks).toBe(0);
  });

  it('throws for invalid dates and reference dates before birth', () => {
    expect(() => calculateChronologicalAgeDays('not-a-date', '2026-06-01')).toThrow();
    expect(() => calculateChronologicalAgeDays('2026-06-01', 'bad-date')).toThrow();
    expect(() => calculateChronologicalAgeDays('2026-06-02', '2026-06-01')).toThrow();
  });
});
