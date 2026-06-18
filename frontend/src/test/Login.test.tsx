/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext, type AuthContextValue } from '../context/AuthContext';
import { Login } from '../pages/Login';
import { HAS_AUTHENTICATED_KEY } from '../lib/authStorage';
import i18n from '../i18n';

describe('Login Page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    i18n.changeLanguage('en');
  });

  const renderLogin = (authValue: Partial<AuthContextValue> = {}, locationState?: any) => {
    const defaultAuth: AuthContextValue = {
      status: 'unauthenticated',
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      registerWithPassword: vi.fn(),
      loginWithPassword: vi.fn(),
      loginWithPin: vi.fn(),
      createPin: vi.fn(),
      refreshSession: vi.fn(),
      logout: vi.fn(),
      clearAuthError: vi.fn(),
      ...authValue,
    };

    return render(
      <AuthContext.Provider value={defaultAuth}>
        <MemoryRouter initialEntries={[{ pathname: '/login', state: locationState }]}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            <Route path="/custom-route" element={<div>Custom Route Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  it('renders inputs and notice correctly', () => {
    renderLogin();
    expect(screen.getByLabelText('Mobile number')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('PIN login will be available after PIN setup.')).toBeInTheDocument();
  });

  it('validates fields on empty submit', async () => {
    renderLogin();
    fireEvent.click(screen.getByText('Log In'));

    await waitFor(() => {
      expect(screen.getByText('Phone number is required.')).toBeInTheDocument();
      expect(screen.getByText('Password is required.')).toBeInTheDocument();
    });
  });

  it('calls loginWithPassword and redirects to dashboard on successful submit', async () => {
    const loginMock = vi.fn().mockResolvedValue({ id: '1' });
    renderLogin({ loginWithPassword: loginMock });

    fireEvent.change(screen.getByLabelText('Mobile number'), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'SecurePass123' } });

    fireEvent.click(screen.getByText('Log In'));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('9876543210', 'SecurePass123');
      expect(localStorage.getItem(HAS_AUTHENTICATED_KEY)).toBe('true');
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });
  });

  it('redirects to the preserved internal location from router state on success', async () => {
    const loginMock = vi.fn().mockResolvedValue({ id: '1' });
    renderLogin({ loginWithPassword: loginMock }, { from: '/custom-route' });

    fireEvent.change(screen.getByLabelText('Mobile number'), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'SecurePass123' } });

    fireEvent.click(screen.getByText('Log In'));

    await waitFor(() => {
      expect(screen.getByText('Custom Route Page')).toBeInTheDocument();
    });
  });
});
