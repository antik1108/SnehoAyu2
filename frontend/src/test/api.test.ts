/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import api, { setAccessToken, getAccessToken, registerUnauthorizedHandler } from '../lib/api';

describe('api client', () => {
  beforeEach(() => {
    setAccessToken(null);
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('attaches accessToken if present in memory', async () => {
    setAccessToken('test-token');
    const config = { headers: {} as any };
    const requestInterceptor = (api.interceptors.request as any).handlers[0].fulfilled;
    const resolved = requestInterceptor(config);
    expect(resolved.headers.Authorization).toBe('Bearer test-token');
  });

  it('does not attach accessToken if not present', async () => {
    const config = { headers: {} as any };
    const requestInterceptor = (api.interceptors.request as any).handlers[0].fulfilled;
    const resolved = requestInterceptor(config);
    expect(resolved.headers.Authorization).toBeUndefined();
  });

  it('performs token refresh on 401 error', async () => {
    const mockSession = { refreshToken: 'old-refresh-token', user: { id: '1', role: 'mother' } };
    localStorage.setItem('snehoayu.auth.session.v1', JSON.stringify(mockSession));

    let refreshCalled = false;
    let originalRequestRetried = false;

    api.defaults.adapter = async (config) => {
      if (config.url === '/auth/refresh') {
        refreshCalled = true;
        return {
          data: {
            success: true,
            data: { accessToken: 'new-access-token', refreshToken: 'new-refresh-token' },
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as any;
      }
      if (config.url === '/test-endpoint') {
        if (config.headers?.Authorization === 'Bearer new-access-token') {
          originalRequestRetried = true;
          return {
            data: { data: 'success' },
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          } as any;
        }
        return Promise.reject({
          response: { status: 401, data: {} },
          config,
          isAxiosError: true,
        });
      }
      return Promise.reject(new Error('Unknown url'));
    };

    const response = await api.get('/test-endpoint');
    expect(refreshCalled).toBe(true);
    expect(originalRequestRetried).toBe(true);
    expect(response.data.data).toBe('success');
    expect(getAccessToken()).toBe('new-access-token');
  });

  it('coordinates concurrent 401 failures into a single flight refresh request', async () => {
    const mockSession = { refreshToken: 'old-refresh-token', user: { id: '1', role: 'mother' } };
    localStorage.setItem('snehoayu.auth.session.v1', JSON.stringify(mockSession));

    let refreshCallCount = 0;

    api.defaults.adapter = async (config) => {
      if (config.url === '/auth/refresh') {
        refreshCallCount++;
        await new Promise((resolve) => setTimeout(resolve, 50));
        return {
          data: {
            success: true,
            data: { accessToken: 'new-access-token', refreshToken: 'new-refresh-token' },
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as any;
      }
      if (config.url === '/test-endpoint') {
        if (config.headers?.Authorization === 'Bearer new-access-token') {
          return {
            data: { data: 'success' },
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          } as any;
        }
        return Promise.reject({
          response: { status: 401, data: {} },
          config,
          isAxiosError: true,
        });
      }
      return Promise.reject(new Error('Unknown url'));
    };

    // Run concurrent requests
    const [res1, res2] = await Promise.all([api.get('/test-endpoint'), api.get('/test-endpoint')]);

    expect(refreshCallCount).toBe(1);
    expect(res1.data.data).toBe('success');
    expect(res2.data.data).toBe('success');
  });

  it('triggers unauthorized handler on refresh failure', async () => {
    const mockSession = { refreshToken: 'old-refresh-token', user: { id: '1', role: 'mother' } };
    localStorage.setItem('snehoayu.auth.session.v1', JSON.stringify(mockSession));

    let unauthorizedTriggered = false;
    registerUnauthorizedHandler(() => {
      unauthorizedTriggered = true;
    });

    api.defaults.adapter = async (config) => {
      if (config.url === '/auth/refresh') {
        return Promise.reject({
          response: { status: 401, data: { code: 'INVALID_REFRESH_TOKEN', message: 'Expired session' } },
          config,
          isAxiosError: true,
        });
      }
      if (config.url === '/test-endpoint') {
        return Promise.reject({
          response: { status: 401, data: {} },
          config,
          isAxiosError: true,
        });
      }
      return Promise.reject(new Error('Unknown url'));
    };

    await expect(api.get('/test-endpoint')).rejects.toBeDefined();
    expect(unauthorizedTriggered).toBe(true);
    expect(localStorage.getItem('snehoayu.auth.session.v1')).toBeNull();
  });

  it('does not refresh login or register endpoints', async () => {
    let refreshCalled = false;
    api.defaults.adapter = async (config) => {
      if (config.url === '/auth/refresh') {
        refreshCalled = true;
      }
      return Promise.reject({
        response: { status: 401, data: {} },
        config,
        isAxiosError: true,
      });
    };

    await expect(api.post('/auth/login', { phone: '123', password: '123' })).rejects.toBeDefined();
    expect(refreshCalled).toBe(false);
  });
});
