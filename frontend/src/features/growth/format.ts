import type { GrowthAge } from './types';

export function formatMeasurement(value: number | null | undefined, unit: string, fallback: string): string {
  return value === null || value === undefined ? fallback : `${value} ${unit}`;
}

export function formatGrowthAge(age: GrowthAge | undefined, daysLabel: string, weeksLabel: string, fallback: string): string {
  if (!age) return fallback;
  return `${age.days} ${daysLabel} / ${age.weeks} ${weeksLabel}`;
}

export function todayDateInputValue(reference = new Date()): string {
  return reference.toISOString().slice(0, 10);
}
