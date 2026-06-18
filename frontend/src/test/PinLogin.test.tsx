import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext, type AuthContextValue } from '../context/AuthContext';
import { PinLogin } from '../pages/PinLogin';
import { HAS_AUTHENTICATED_KEY } from '../lib/authStorage';
import i18n from '../i18n';

describe('PinLogin Page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    i18n.changeLanguage('en');
  });

  const renderPinLogin = (authValue: Partial<AuthContextValue> = {}, locationState?: unknown) => {
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
        <MemoryRouter initialEntries={[{ pathname: '/login/pin', state: locationState }]}>
          <Routes>
            <Route path="/login/pin" element={<PinLogin />} />
            <Route path="/login" element={<div>Password Login Page</div>} />
            <Route path="/signup/phone" element={<div>Signup Phone Page</div>} />
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  it('renders phone input, keypad, and action links correctly', () => {
    renderPinLogin();
    expect(screen.getByLabelText('Mobile number')).toBeInTheDocument();
    expect(screen.getByText('PIN')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByText('Log in with password')).toBeInTheDocument();
  });

  it('validates fields on empty submit', async () => {
    renderPinLogin();
    fireEvent.click(screen.getByText('Log In'));

    await waitFor(() => {
      expect(screen.getByText('Phone number is required.')).toBeInTheDocument();
      expect(screen.getByText('PIN is required.')).toBeInTheDocument();
    });
  });

  it('calls loginWithPin and redirects to dashboard on successful submit', async () => {
    const loginPinMock = vi.fn().mockResolvedValue({ id: '1' });
    renderPinLogin({ loginWithPin: loginPinMock });

    // Enter phone
    fireEvent.change(screen.getByLabelText('Mobile number'), { target: { value: '9876543210' } });

    // Tap PIN: 0, 5, 2, 7
    fireEvent.click(screen.getByText('0'));
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('7'));

    await waitFor(() => {
      expect(loginPinMock).toHaveBeenCalledWith('9876543210', '0527');
      expect(localStorage.getItem(HAS_AUTHENTICATED_KEY)).toBe('true');
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });
  });

  it('handles PIN not configured error safely', async () => {
    const loginPinMock = vi.fn().mockRejectedValue({ code: 'PIN_NOT_CONFIGURED' });
    renderPinLogin({ loginWithPin: loginPinMock });

    fireEvent.change(screen.getByLabelText('Mobile number'), { target: { value: '9876543210' } });
    fireEvent.click(screen.getByText('0'));
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('7'));

    await waitFor(() => {
      expect(screen.getByText('PIN login is not set up for this account. Log in with your password first.')).toBeInTheDocument();
    });
  });

  it('navigates to password login screen when tapping the link', async () => {
    renderPinLogin();
    fireEvent.click(screen.getByText('Log in with password'));

    await waitFor(() => {
      expect(screen.getByText('Password Login Page')).toBeInTheDocument();
    });
  });

  it('navigates to registration screen when tapping signup link', async () => {
    renderPinLogin();
    fireEvent.click(screen.getByText('Create an account'));

    await waitFor(() => {
      expect(screen.getByText('Signup Phone Page')).toBeInTheDocument();
    });
  });
});
