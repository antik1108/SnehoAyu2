import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext, type AuthContextValue } from '../context/AuthContext';
import { AppRoutes } from '../routes/AppRoutes';

describe('AppRoutes routing and guards', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('preferred_language', 'en');
  });

  const renderWithAuth = (initialEntry: string, authValue: Partial<AuthContextValue>) => {
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
          <AppRoutes />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  it('renders LanguageSelect on /language-select', () => {
    renderWithAuth('/language-select', {});
    expect(screen.getByText('Select Language')).toBeInTheDocument();
  });

  it('renders NotFound component on unknown paths', () => {
    renderWithAuth('/some-unknown-path', {});
    expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
  });

  it('shows loading state on protected routes when auth is loading', () => {
    renderWithAuth('/dashboard', { status: 'loading', isLoading: true });
    expect(screen.getByText(/Loading…/i)).toBeInTheDocument();
  });

  it('redirects to /login on protected routes when unauthenticated', async () => {
    renderWithAuth('/dashboard', { status: 'unauthenticated', isAuthenticated: false });
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('renders content on protected routes when authenticated', () => {
    renderWithAuth('/dashboard', {
      status: 'authenticated',
      isAuthenticated: true,
      user: { id: '1', phone: '+919876543210', role: 'mother', preferredLanguage: 'bn', hasPin: true },
    });
    expect(screen.getByText('Dashboard Page Placeholder')).toBeInTheDocument();
  });
});
