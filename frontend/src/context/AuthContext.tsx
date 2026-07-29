/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
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
  // Tracks whether we have a valid refresh token but couldn't reach the server
  // (network offline / timeout). We keep the user "authenticated" with cached
  // data and silently retry when connectivity is restored.
  const pendingNetworkRefresh = useRef(false);

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

  const refreshSession = useCallback(async (silent = false): Promise<boolean> => {
    if (!silent) setError(null);
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
      pendingNetworkRefresh.current = false;
      establishSession(accessToken, newRefreshToken, userData);
      return true;
    } catch (err) {
      const normalized = normalizeApiError(err);

      // Genuine auth failure (token expired/revoked) → force the user to log in
      if (normalized.status === 401 || normalized.code === 'INVALID_REFRESH_TOKEN') {
        pendingNetworkRefresh.current = false;
        destroyLocalSession();
        return false;
      }

      // Network / timeout / server error → keep the user logged in using
      // cached data and retry silently when connectivity is restored.
      // We do NOT clear the session for transient connectivity problems.
      const isNetworkProblem =
        normalized.code === 'NETWORK_ERROR' ||
        normalized.code === 'ECONNABORTED' ||
        normalized.status === 502 ||
        normalized.status === 503 ||
        normalized.status === 504 ||
        !normalized.status; // no response at all = offline

      if (isNetworkProblem && session?.user) {
        pendingNetworkRefresh.current = true;
        // Restore cached user so the UI stays usable while offline
        setUser(session.user);
        setStatus('authenticated');
        return false; // access token not refreshed, but user stays logged in
      }

      if (!silent) setError(normalized);
      setStatus('unauthenticated');
      return false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    // When the device regains connectivity, silently refresh the session so
    // the user never sees a login screen just because they were offline.
    const handleOnline = () => {
      if (pendingNetworkRefresh.current) {
        refreshSession(true);
      }
    };
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('online', handleOnline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshSession]);

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
