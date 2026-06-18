export interface AuthUser {
  id: string;
  phone: string;
  role: 'mother' | 'nurse' | 'researcher';
  preferredLanguage: 'bn' | 'hi' | 'en';
  hasPin: boolean;
}

export interface PersistedAuthSession {
  refreshToken?: string;
  user: AuthUser;
}

export type SupportedLanguage = 'bn' | 'hi' | 'en';

export const SESSION_KEY = 'snehoayu.auth.session.v1';
export const LANGUAGE_KEY = 'preferred_language';

export function readAuthSession(): PersistedAuthSession | null {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data) as PersistedAuthSession;
    if (
      parsed &&
      parsed.user &&
      typeof parsed.user.id === 'string' &&
      typeof parsed.user.role === 'string' &&
      (parsed.user.role === 'mother' || parsed.user.role === 'nurse' || parsed.user.role === 'researcher')
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function writeAuthSession(session: PersistedAuthSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to write auth session to localStorage', err);
  }
}

export function clearAuthSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.error('Failed to clear auth session from localStorage', err);
  }
}

export function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return value === 'bn' || value === 'hi' || value === 'en';
}

export function getStoredLanguage(): SupportedLanguage | null {
  try {
    const lang = localStorage.getItem(LANGUAGE_KEY);
    if (isSupportedLanguage(lang)) {
      return lang;
    }
    return null;
  } catch {
    return null;
  }
}

export function setStoredLanguage(language: SupportedLanguage): void {
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
  } catch (err) {
    console.error('Failed to write language to localStorage', err);
  }
}

export const HAS_AUTHENTICATED_KEY = 'snehoayu.has_authenticated.v1';

export function hasAuthenticatedPreviously(): boolean {
  try {
    return localStorage.getItem(HAS_AUTHENTICATED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markAuthenticatedPreviously(): void {
  try {
    localStorage.setItem(HAS_AUTHENTICATED_KEY, 'true');
  } catch (err) {
    console.error('Failed to mark previous authentication', err);
  }
}
