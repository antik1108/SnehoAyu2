/**
 * @file utils/dateOnly.ts
 * @description Timezone-neutral UTC date-only utility helpers.
 */

export const IST_TIME_ZONE = 'Asia/Kolkata';

function getDatePartsInTimeZone(reference: Date, timeZone: string): { year: number; month: number; day: number } {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(reference);
  const year = Number(parts.find((part) => part.type === 'year')?.value);
  const month = Number(parts.find((part) => part.type === 'month')?.value);
  const day = Number(parts.find((part) => part.type === 'day')?.value);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    throw new Error('Unable to resolve timezone-aware date parts.');
  }

  return { year, month, day };
}

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

export function addDateOnlyDays(date: Date, days: number): Date {
  return addUtcDays(date, days);
}

export function isValidDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map((part) => Number(part));
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day;
}

export function parseDateOnlyToUTCDate(value: string): Date {
  if (!isValidDateOnly(value)) {
    throw new Error(`Invalid date-only value: ${value}`);
  }

  const [year, month, day] = value.split('-').map((part) => Number(part));
  return new Date(Date.UTC(year, month - 1, day));
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

export function todayIstDateOnly(reference = new Date()): Date {
  const { year, month, day } = getDatePartsInTimeZone(reference, IST_TIME_ZONE);
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatIstDateOnly(reference = new Date()): string {
  return formatDateOnly(todayIstDateOnly(reference));
}

export function getTodayDateOnlyInIST(reference = new Date()): string {
  return formatIstDateOnly(reference);
}

export function compareDateOnly(a: string, b: string): number {
  const aTime = parseDateOnlyToUTCDate(a).getTime();
  const bTime = parseDateOnlyToUTCDate(b).getTime();
  return aTime === bTime ? 0 : aTime < bTime ? -1 : 1;
}

export function daysBetweenDateOnly(start: string, end: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const startTime = parseDateOnlyToUTCDate(start).getTime();
  const endTime = parseDateOnlyToUTCDate(end).getTime();
  return Math.floor((endTime - startTime) / msPerDay);
}
