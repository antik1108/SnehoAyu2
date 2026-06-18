/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useRef } from 'react';
import api, { setAccessToken, registerUnauthorizedHandler } from '../lib/api';
import {
  readAuthSession,
  writeAuthSession,
  clearAuthSession,
  SESSION_KEY,
  type AuthUser,
} from '../lib/authStorage';
import { normalizeApiError, type AppApiError } from '../lib/apiError';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AppApiError | null;

  registerWithPassword: (phone: string, password: string, confirmPassword?: string) => Promise<AuthUser>;
  loginWithPassword: (phone: string, password: string) => Promise<AuthUser>;
  loginWithPin: (phone: string, pin: string) => Promise<AuthUser>;
  createPin: (pin: string) => Promise<void>;
  refreshSession: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<AppApiError | null>(null);
  const bootstrapStarted = useRef(false);

  const clearAuthError = () => setError(null);

  const establishSession = (accessToken: string, refreshToken: string, userData: AuthUser) => {
    setAccessToken(accessToken);
    setUser(userData);
    setStatus('authenticated');
    writeAuthSession({ refreshToken, user: userData });
  };

  const destroyLocalSession = () => {
    setAccessToken(null);
    setUser(null);
    setStatus('unauthenticated');
    clearAuthSession();
  };

  const registerWithPassword = async (phone: string, password: string, confirmPassword?: string): Promise<AuthUser> => {
    setError(null);
    try {
      const res = await api.post<{
        success: boolean;
        data: { accessToken: string; refreshToken: string; user: AuthUser };
      }>('/auth/register', { phone, password, confirmPassword: confirmPassword || password });
      const { accessToken, refreshToken, user: userData } = res.data.data;
      establishSession(accessToken, refreshToken, userData);
      return userData;
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized);
      throw normalized;
    }
  };

  const loginWithPassword = async (phone: string, password: string): Promise<AuthUser> => {
    setError(null);
    try {
      const res = await api.post<{
        success: boolean;
        data: { accessToken: string; refreshToken: string; user: AuthUser };
      }>('/auth/login', { phone, password });
      const { accessToken, refreshToken, user: userData } = res.data.data;
      establishSession(accessToken, refreshToken, userData);
      return userData;
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized);
      throw normalized;
    }
  };

  const loginWithPin = async (phone: string, pin: string): Promise<AuthUser> => {
    setError(null);
    try {
      const res = await api.post<{
        success: boolean;
        data: { accessToken: string; refreshToken: string; user: AuthUser };
      }>('/auth/login-pin', { phone, pin });
      const { accessToken, refreshToken, user: userData } = res.data.data;
      establishSession(accessToken, refreshToken, userData);
      return userData;
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized);
      throw normalized;
    }
  };

  const createPin = async (pin: string): Promise<void> => {
    setError(null);
    try {
      await api.post('/auth/create-pin', { pin, confirmPin: pin });
      if (user) {
        const updatedUser = { ...user, hasPin: true };
        setUser(updatedUser);
        const session = readAuthSession();
        if (session) {
          writeAuthSession({ ...session, user: updatedUser });
        }
      }
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized);
      throw normalized;
    }
  };

  const refreshSession = async (): Promise<boolean> => {
    setError(null);
    const session = readAuthSession();
    const refreshToken = session?.refreshToken;
    if (!refreshToken) {
      destroyLocalSession();
      return false;
    }

    try {
      const res = await api.post<{
        success: boolean;
        data: { accessToken: string; refreshToken: string; user: AuthUser };
      }>('/auth/refresh', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken, user: userData } = res.data.data;
      establishSession(accessToken, newRefreshToken, userData);
      return true;
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized);

      if (normalized.status === 401 || normalized.code === 'INVALID_REFRESH_TOKEN') {
        destroyLocalSession();
      } else {
        setStatus('unauthenticated');
      }
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setError(null);
    const session = readAuthSession();
    const refreshToken = session?.refreshToken;

    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch {
      // Ignore API failures and proceed with local storage cleanup
    } finally {
      destroyLocalSession();
    }
  };

  useEffect(() => {
    if (bootstrapStarted.current) return;
    bootstrapStarted.current = true;

    const bootstrap = async () => {
      const session = readAuthSession();
      if (session?.refreshToken) {
        await refreshSession();
      } else {
        setStatus('unauthenticated');
      }
    };

    bootstrap();

    registerUnauthorizedHandler(() => {
      destroyLocalSession();
    });

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SESSION_KEY && !e.newValue) {
        destroyLocalSession();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        status,
        user,
        isAuthenticated: status === 'authenticated',
        isLoading: status === 'loading',
        error,
        registerWithPassword,
        loginWithPassword,
        loginWithPin,
        createPin,
        refreshSession,
        logout,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
