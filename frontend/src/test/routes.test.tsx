import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext, type AuthContextValue } from '../context/AuthContext';
import { AppRoutes } from '../routes/AppRoutes';
import i18n from '../i18n';

vi.mock('../features/dashboard/api', () => ({
  getDashboardHome: vi.fn().mockResolvedValue({
    status: 'ok',
    data: {
      onboardingState: 'complete',
      baby: {
        name: 'Maya',
        displayName: 'Maya',
        sex: 'female',
        dateOfBirth: '2026-05-01',
        dischargeDate: '2026-05-22',
        gestationalAgeWeeks: 32.5,
        chronologicalAgeDays: 42,
        chronologicalAgeWeeks: 6,
        correctedAgeDays: 7,
        correctedAgeWeeks: 1,
        ageDisplay: '6 weeks',
        correctedAgeDisplay: '1 week',
        latestWeightGrams: 1650,
        latestWeightSource: 'discharge',
      },
      participant: { participantCode: 'BNK-S-001', studyGroup: 'study' },
      hospital: { code: 'BNK', name: 'Bankura Medical College', emergencyPhone: null },
      careToday: { date: '2026-06-19', available: false, completedCount: 0, totalCount: 0, completionPercent: 0, source: 'not_configured' },
      feeding: { available: false, completedFeeds: null, targetFeedsMin: 8, targetFeedsMax: 12, source: 'not_configured' },
      healthStats: { lastTemperatureC: null, lastWeightGrams: 1650, lastSpO2Percent: null, weightSource: 'discharge' },
      nextReminder: { type: 'follow_up', title: '1_month', date: '2026-07-01', daysRemaining: 12, status: 'pending' },
      dailyMessage: { available: false, text: null, language: 'en', source: 'not_configured' },
    },
  }),
}));

describe('AppRoutes routing and guards', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('preferred_language', 'en');
    void i18n.changeLanguage('en');
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

  it('renders LanguageSelect on /language-select', async () => {
    renderWithAuth('/language-select', {});
    expect(await screen.findByText('Select Language')).toBeInTheDocument();
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
    expect(await screen.findByText('Welcome back')).toBeInTheDocument();
  });

  it('renders content on protected routes when authenticated', async () => {
    renderWithAuth('/dashboard', {
      status: 'authenticated',
      isAuthenticated: true,
      user: { id: '1', phone: '+919876543210', role: 'mother', preferredLanguage: 'bn', hasPin: true },
    });
    expect(await screen.findByRole('heading', { name: 'Home' })).toBeInTheDocument();
  });
});
