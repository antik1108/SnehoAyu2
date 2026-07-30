/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';
import api, { setAccessToken } from '../lib/api';

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    setAccessToken(null);
    vi.restoreAllMocks();
  });

  const TestComponent = () => {
    const { status, user, isAuthenticated, loginWithPassword, logout } = useAuth();
    return (
      <div>
        <div data-testid="status">{status}</div>
        <div data-testid="authenticated">{isAuthenticated ? 'yes' : 'no'}</div>
        <div data-testid="username">{user?.phone || 'none'}</div>
        <button data-testid="login-btn" onClick={() => loginWithPassword('9876543210', 'Password123')}>Login</button>
        <button data-testid="logout-btn" onClick={logout}>Logout</button>
      </div>
    );
  };

  it('throws error when useAuth is used outside AuthProvider', () => {
    const BadComponent = () => {
      useAuth();
      return null;
    };

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<BadComponent />)).toThrow('useAuth must be used within an AuthProvider.');
    spy.mockRestore();
  });

  it('resolves to unauthenticated when no stored session exists', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('unauthenticated');
    });
    expect(screen.getByTestId('authenticated').textContent).toBe('no');
  });

  it('restores authenticated state on mount if valid session exists', async () => {
    const mockSession = { refreshToken: 'valid-ref', user: { id: '1', phone: '+919876543210', role: 'mother', hasPin: false } };
    localStorage.setItem('snehoayu.auth.session.v1', JSON.stringify(mockSession));

    api.defaults.adapter = async (config) => {
      if (config.url === '/auth/refresh') {
        return {
          data: {
            success: true,
            data: { accessToken: 'new-acc', refreshToken: 'new-ref', user: mockSession.user },
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        } as any;
      }
      return Promise.reject(new Error('Unknown url'));
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('authenticated');
    });
    expect(screen.getByTestId('username').textContent).toBe('+919876543210');
  });

  it('clears session on 401 refresh failure', async () => {
    const mockSession = { refreshToken: 'expired-ref', user: { id: '1', phone: '+919876543210', role: 'mother', hasPin: false } };
    localStorage.setItem('snehoayu.auth.session.v1', JSON.stringify(mockSession));

    api.defaults.adapter = async (config) => {
      if (config.url === '/auth/refresh') {
        return Promise.reject({
          response: { status: 401, data: { code: 'INVALID_REFRESH_TOKEN', message: 'Expired' } },
          config,
          isAxiosError: true,
        });
      }
      return Promise.reject(new Error('Unknown url'));
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('unauthenticated');
    });
    expect(localStorage.getItem('snehoayu.auth.session.v1')).toBeNull();
  });

  it('keeps stored session on network refresh failure', async () => {
    const mockSession = { refreshToken: 'some-ref', user: { id: '1', phone: '+919876543210', role: 'mother', hasPin: false } };
    localStorage.setItem('snehoayu.auth.session.v1', JSON.stringify(mockSession));

    api.defaults.adapter = async (config) => {
      if (config.url === '/auth/refresh') {
        return Promise.reject({
          code: 'ERR_NETWORK',
          config,
          isAxiosError: true,
        });
      }
      return Promise.reject(new Error('Unknown url'));
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('authenticated');
    });
    expect(localStorage.getItem('snehoayu.auth.session.v1')).not.toBeNull();
  });
});
