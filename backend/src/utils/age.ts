/**
 * @file age.ts
 * @description Date-only age calculations for dashboard and growth tracking.
 */

import { daysBetweenDateOnly, formatDateOnly, isValidDateOnly } from './dateOnly.js';

export interface AgeCalculationInput {
  dateOfBirth: string | Date;
  gestationalAgeWeeks: number;
  referenceDate: string | Date;
}

export interface AgeCalculationResult {
  chronologicalAgeDays: number;
  chronologicalAgeWeeks: number;
  correctedAgeDaysRaw: number;
  correctedAgeDays: number;
  correctedAgeWeeks: number;
  prematurityAdjustmentDays: number;
}

function toDateOnlyString(value: string | Date, field: string): string {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new Error(`Invalid ${field}.`);
    }
    return formatDateOnly(value);
  }

  if (!isValidDateOnly(value)) {
    throw new Error(`Invalid ${field}.`);
  }

  return value;
}

function roundWeeks(days: number): number {
  return Math.round((days / 7) * 100) / 100;
}

export function toUtcDateOnly(value: Date): Date {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

export function parseDateOnly(value: string): Date {
  const parts = value.split('-').map((part) => Number(part));
  if (parts.length !== 3 || parts.some((part) => !Number.isInteger(part))) {
    throw new Error(`Invalid date-only value: ${value}`);
  }

  const [year, month, day] = parts;
  return new Date(Date.UTC(year, month - 1, day));
}

export function todayUtcDateOnly(reference = new Date()): Date {
  return new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth(), reference.getUTCDate()));
}

export function diffInDaysUtc(later: Date, earlier: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((toUtcDateOnly(later).getTime() - toUtcDateOnly(earlier).getTime()) / msPerDay);
}

export function calculateChronologicalAgeDays(dateOfBirth: string | Date, referenceDate: string | Date): number {
  const dob = toDateOnlyString(dateOfBirth, 'dateOfBirth');
  const reference = toDateOnlyString(referenceDate, 'referenceDate');
  const days = daysBetweenDateOnly(dob, reference);

  if (days < 0) {
    throw new Error('Reference date cannot be before date of birth.');
  }

  return days;
}

export function calculateCorrectedAge(input: AgeCalculationInput): AgeCalculationResult {
  if (!Number.isFinite(input.gestationalAgeWeeks) || input.gestationalAgeWeeks <= 0) {
    throw new Error('Invalid gestational age.');
  }

  const chronologicalAgeDays = calculateChronologicalAgeDays(input.dateOfBirth, input.referenceDate);
  const prematurityAdjustmentDays = Math.round(Math.max(0, 40 - input.gestationalAgeWeeks) * 7);
  const correctedAgeDaysRaw = chronologicalAgeDays - prematurityAdjustmentDays;
  const correctedAgeDays = Math.max(0, correctedAgeDaysRaw);

  return {
    chronologicalAgeDays,
    chronologicalAgeWeeks: roundWeeks(chronologicalAgeDays),
    correctedAgeDaysRaw,
    correctedAgeDays,
    correctedAgeWeeks: roundWeeks(correctedAgeDays),
    prematurityAdjustmentDays,
  };
}

export function formatAgeDays(days: number): string {
  const safeDays = Math.max(0, Math.floor(days));
  return `${safeDays} day${safeDays === 1 ? '' : 's'}`;
}

export function formatAgeWeeks(weeks: number): string {
  const safeWeeks = Math.max(0, Math.floor(weeks));
  return `${safeWeeks} week${safeWeeks === 1 ? '' : 's'}`;
}
