import { ROUTES } from '../routes/paths';

/**
 * Validates a redirection target path to prevent open redirect vulnerabilities.
 * Ensures the target is a relative path starting with '/' but not '//' or '\\'.
 */
export function getSafeInternalRedirect(candidate: unknown, fallback: string = ROUTES.DASHBOARD): string {
  if (!candidate) return fallback;

  if (typeof candidate === 'string') {
    const trimmed = candidate.trim();
    if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.startsWith('\\')) {
      // Basic check to prevent JavaScript protocol or external schemes
      if (!/:|javascript/i.test(trimmed)) {
        return trimmed;
      }
    }
  } else if (candidate && typeof candidate === 'object') {
    const obj = candidate as { pathname?: string };
    if (typeof obj.pathname === 'string') {
      const trimmed = obj.pathname.trim();
      if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.startsWith('\\')) {
        if (!/:|javascript/i.test(trimmed)) {
          return trimmed;
        }
      }
    }
  }

  return fallback;
}
