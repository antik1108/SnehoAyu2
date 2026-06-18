import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext, type AuthContextValue } from '../context/AuthContext';
import { SignupPhone } from '../pages/SignupPhone';
import { HAS_AUTHENTICATED_KEY } from '../lib/authStorage';
import i18n from '../i18n';

describe('SignupPhone Page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    i18n.changeLanguage('en');
  });

  const renderSignup = (authValue: Partial<AuthContextValue> = {}) => {
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
        <MemoryRouter initialEntries={['/signup/phone']}>
          <Routes>
            <Route path="/signup/phone" element={<SignupPhone />} />
            <Route path="/signup/create-pin" element={<div>Create PIN Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  it('renders all form fields and inputs correctly', () => {
    renderSignup();
    expect(screen.getByLabelText('Mobile number')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Password')[0]).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
  });

  it('shows validation errors for invalid inputs', async () => {
    renderSignup();

    fireEvent.click(screen.getByText('Create Account'));

    await waitFor(() => {
      expect(screen.getByText('Phone number is required.')).toBeInTheDocument();
      expect(screen.getByText('Password is required.')).toBeInTheDocument();
      expect(screen.getByText('Confirm your password.')).toBeInTheDocument();
    });
  });

  it('shows error for mismatched passwords', async () => {
    renderSignup();

    fireEvent.change(screen.getByLabelText('Mobile number'), { target: { value: '9876543210' } });
    fireEvent.change(screen.getAllByLabelText('Password')[0], { target: { value: 'SecurePass123' } });
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'WrongPass123' } });

    fireEvent.click(screen.getByText('Create Account'));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    });
  });

  it('normalizes pasted phone numbers and accepts valid submissions', async () => {
    const registerMock = vi.fn().mockResolvedValue({ id: '1' });
    renderSignup({ registerWithPassword: registerMock });

    fireEvent.change(screen.getByLabelText('Mobile number'), { target: { value: '9876543210' } });
    fireEvent.change(screen.getAllByLabelText('Password')[0], { target: { value: 'SecurePass123' } });
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'SecurePass123' } });

    fireEvent.click(screen.getByText('Create Account'));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith('9876543210', 'SecurePass123', 'SecurePass123');
      expect(localStorage.getItem(HAS_AUTHENTICATED_KEY)).toBe('true');
      expect(screen.getByText('Create PIN Page')).toBeInTheDocument();
    });
  });
});
