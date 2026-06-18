import { describe, it, expect, beforeEach } from 'vitest';
import {
  readAuthSession,
  writeAuthSession,
  clearAuthSession,
  getStoredLanguage,
  setStoredLanguage,
  isSupportedLanguage,
  type AuthUser,
} from '../lib/authStorage';

describe('authStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockUser: AuthUser = {
    id: 'user-id',
    phone: '+919876543210',
    role: 'mother',
    preferredLanguage: 'bn',
    hasPin: false,
  };

  it('writes and reads auth session successfully', () => {
    writeAuthSession({ refreshToken: 'ref-token', user: mockUser });
    const session = readAuthSession();
    expect(session).not.toBeNull();
    expect(session?.refreshToken).toBe('ref-token');
    expect(session?.user.id).toBe('user-id');
    expect(session?.user.role).toBe('mother');
  });

  it('clears auth session', () => {
    writeAuthSession({ refreshToken: 'ref-token', user: mockUser });
    clearAuthSession();
    expect(readAuthSession()).toBeNull();
  });

  it('handles corrupt JSON safely by returning null', () => {
    localStorage.setItem('snehoayu.auth.session.v1', 'invalid-json');
    expect(readAuthSession()).toBeNull();
  });

  it('handles missing storage key by returning null', () => {
    expect(readAuthSession()).toBeNull();
  });

  it('validates supported language codes', () => {
    expect(isSupportedLanguage('bn')).toBe(true);
    expect(isSupportedLanguage('hi')).toBe(true);
    expect(isSupportedLanguage('en')).toBe(true);
    expect(isSupportedLanguage('fr')).toBe(false);
    expect(isSupportedLanguage(null)).toBe(false);
  });

  it('gets and sets stored language preference', () => {
    expect(getStoredLanguage()).toBeNull();
    setStoredLanguage('hi');
    expect(getStoredLanguage()).toBe('hi');
  });
});
