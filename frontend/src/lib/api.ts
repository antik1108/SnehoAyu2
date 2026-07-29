import axios, { type InternalAxiosRequestConfig, type AxiosRequestConfig } from 'axios';
import { setServerDown } from './serverStatus';
import { readAuthSession, writeAuthSession, clearAuthSession } from './authStorage';

export interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
  skipAuthRefresh?: boolean;
}

export function resolveApiBaseUrl(): string {
  let configuredUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configuredUrl) {
    configuredUrl = configuredUrl.replace(/\/+$/, '');
    if (!configuredUrl.endsWith('/api')) {
      configuredUrl = `${configuredUrl}/api`;
    }
    return configuredUrl;
  }

  if (import.meta.env.PROD) {
    throw new Error(
      'VITE_API_BASE_URL is required for production builds. ' +
        'Set it to your backend API URL, for example https://api.snehoayu.in/api.'
    );
  }

  return 'http://localhost:4000/api';
}

const apiBaseUrl = resolveApiBaseUrl();

const api = axios.create({
  baseURL: apiBaseUrl,
  // 30 seconds — enough for slow mobile connections without hanging the UI
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// How long to wait before retrying a failed network/timeout request (ms)
const RETRY_DELAY_MS = 1500;
// Maximum number of automatic retries for safe (read-only) requests
const MAX_RETRIES = 2;

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
  (response) => {
    setServerDown(false);
    return response;
  },
  async (error) => {
    // Grab the original request config upfront — used in both retry paths below.
    const originalRequest = error.config as RetryableAxiosRequestConfig | undefined;

    // Only treat genuine connectivity/server failures as "the server is
    // down" — not ordinary 4xx application errors (wrong password, 404,
    // validation, etc.), which mean the server is working fine.
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const isConnectivityFailure =
        !error.response || // no response at all = network/CORS/DNS failure
        error.code === 'ERR_NETWORK' ||
        error.code === 'ECONNABORTED' || // timeout
        status === 502 ||
        status === 503 ||
        status === 504;
      setServerDown(isConnectivityFailure);

      // ── Automatic retry for transient network/timeout errors ──────────────
      // Only retry safe (GET/HEAD) requests to avoid duplicate mutations.
      if (
        isConnectivityFailure &&
        originalRequest &&
        !originalRequest.skipAuthRefresh &&
        (originalRequest.method?.toUpperCase() === 'GET' ||
          originalRequest.method?.toUpperCase() === 'HEAD')
      ) {
        const retryCount = originalRequest._retryCount ?? 0;
        if (retryCount < MAX_RETRIES) {
          originalRequest._retryCount = retryCount + 1;
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
          return api(originalRequest);
        }
      }
    }

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
