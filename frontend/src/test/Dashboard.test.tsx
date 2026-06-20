import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import i18n from '../i18n';

const dashboardMock = vi.hoisted(() => ({
  getDashboardHome: vi.fn(),
}));

vi.mock('../features/dashboard/api', () => dashboardMock);

function renderDashboard() {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/checklist" element={<div>Checklist Page</div>} />
        <Route path="/signup/mother-profile" element={<div>Mother Profile Page</div>} />
        <Route path="/signup/baby-profile" element={<div>Baby Profile Page</div>} />
        <Route path="/signup/hospital-code" element={<div>Hospital Code Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Dashboard page', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('preferred_language', 'en');
    void i18n.changeLanguage('en');
    vi.clearAllMocks();
  });

  it('renders loading state and then dashboard content', async () => {
    dashboardMock.getDashboardHome.mockResolvedValue({
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
    });

    renderDashboard();

    expect(screen.getByText(/Your baby’s care today/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Baby Status')).toBeInTheDocument();
      expect(screen.getByText('Maya')).toBeInTheDocument();
      expect(screen.getByText('Log Feeding')).toBeInTheDocument();
    });
  });

  it('shows recovery state for incomplete onboarding', async () => {
    dashboardMock.getDashboardHome.mockRejectedValue({
      code: 'BABY_PROFILE_REQUIRED',
      message: 'Complete the baby profile before opening the dashboard.',
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Complete onboarding to view your dashboard.')).toBeInTheDocument();
      expect(screen.getByText('Complete the baby profile first.')).toBeInTheDocument();
    });
  });

  it('shows retryable error state on network failures', async () => {
    dashboardMock.getDashboardHome.mockRejectedValue({
      code: 'NETWORK_ERROR',
      message: 'Network error. Please check your connection and try again.',
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('We could not load the dashboard.')).toBeInTheDocument();
    });
  });
});
