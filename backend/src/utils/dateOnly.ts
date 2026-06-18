/**
 * @file utils/dateOnly.ts
 * @description Timezone-neutral UTC date-only utility helpers.
 */

/**
 * Adds a specific number of days to a Date object in a timezone-neutral UTC-safe way.
 * Sets time components to exactly midnight UTC.
 */
export function addUtcDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  result.setUTCHours(0, 0, 0, 0);
  return result;
}

/**
 * Formats a Date object as a timezone-neutral YYYY-MM-DD string using UTC functions.
 */
export function formatDateOnly(date: Date): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
