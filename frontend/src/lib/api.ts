import axios, { type InternalAxiosRequestConfig, type AxiosRequestConfig } from 'axios';

export interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let activeAccessToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;
let refreshPromise: Promise<string> | null = null;

export function setAccessToken(token: string | null): void {
  activeAccessToken = token;
}

export function getAccessToken(): string | null {
  return activeAccessToken;
}

export function registerUnauthorizedHandler(callback: () => void): void {
  unauthorizedHandler = callback;
}

api.interceptors.request.use(
  (config: RetryableAxiosRequestConfig) => {
    if (activeAccessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${activeAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableAxiosRequestConfig | undefined;

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh
    ) {
      const url = originalRequest.url || '';
      if (
        url.includes('/auth/login') ||
        url.includes('/auth/register') ||
        url.includes('/auth/login-pin') ||
        url.includes('/auth/refresh')
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        let resolveRefresh: (token: string) => void;
        let rejectRefresh: (err: unknown) => void;

        refreshPromise = new Promise<string>((resolve, reject) => {
          resolveRefresh = resolve;
          rejectRefresh = reject;
        });

        (async () => {
          try {
            const { readAuthSession, writeAuthSession } = await import('./authStorage');
            const session = readAuthSession();
            const refreshToken = session?.refreshToken;

            if (!refreshToken) {
              if (unauthorizedHandler) unauthorizedHandler();
              rejectRefresh(error);
              return;
            }

            const res = await api.post<{ success: boolean; data: { accessToken: string; refreshToken: string } }>(
              '/auth/refresh',
              { refreshToken },
              { skipAuthRefresh: true } as AxiosRequestConfig & { skipAuthRefresh?: boolean }
            );

            const { accessToken, refreshToken: newRefreshToken } = res.data.data;
            setAccessToken(accessToken);
            if (session) {
              writeAuthSession({
                ...session,
                refreshToken: newRefreshToken,
              });
            }
            resolveRefresh(accessToken);
          } catch (err) {
            const { clearAuthSession } = await import('./authStorage');
            clearAuthSession();
            setAccessToken(null);
            if (unauthorizedHandler) unauthorizedHandler();
            rejectRefresh(err);
          } finally {
            refreshPromise = null;
          }
        })();
      }

      try {
        const token = await refreshPromise;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return api(originalRequest);
      } catch (retryErr) {
        return Promise.reject(retryErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
