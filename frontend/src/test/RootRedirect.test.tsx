import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext, type AuthContextValue } from '../context/AuthContext';
import { RootRedirect } from '../routes/RootRedirect';
import { HAS_AUTHENTICATED_KEY, LANGUAGE_KEY } from '../lib/authStorage';

describe('RootRedirect, LanguageGate & GuestOnlyRoute', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  const renderWithAuth = (element: React.ReactNode, authValue: Partial<AuthContextValue>, initialEntry = '/') => {
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
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route path="/" element={element} />
            <Route path="/language-select" element={<div>Language Select Page</div>} />
            <Route path="/welcome" element={<div>Welcome Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  it('redirects to /language-select when language is missing', async () => {
    renderWithAuth(<RootRedirect />, { status: 'unauthenticated' });
    await waitFor(() => {
      expect(screen.getByText('Language Select Page')).toBeInTheDocument();
    });
  });

  it('redirects to /welcome when language exists but not authenticated and first launch', async () => {
    localStorage.setItem(LANGUAGE_KEY, 'bn');
    renderWithAuth(<RootRedirect />, { status: 'unauthenticated' });
    await waitFor(() => {
      expect(screen.getByText('Welcome Page')).toBeInTheDocument();
    });
  });

  it('redirects to /login when language exists and previously authenticated but currently logged out', async () => {
    localStorage.setItem(LANGUAGE_KEY, 'bn');
    localStorage.setItem(HAS_AUTHENTICATED_KEY, 'true');
    renderWithAuth(<RootRedirect />, { status: 'unauthenticated' });
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('redirects to /dashboard when language exists and authenticated', async () => {
    localStorage.setItem(LANGUAGE_KEY, 'bn');
    renderWithAuth(<RootRedirect />, { status: 'authenticated', isAuthenticated: true });
    await waitFor(() => {
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });
  });
});
