import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SignupComplete } from '../pages/SignupComplete';
import { getParticipantCode } from '../features/onboarding/api';
import i18n from '../i18n';

// Mock the API calls
vi.mock('../features/onboarding/api', () => ({
  getParticipantCode: vi.fn(),
}));

describe('SignupComplete Page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    i18n.changeLanguage('en');
  });

  const renderWithState = (stateVal: unknown) => {
    return render(
      <MemoryRouter initialEntries={[{ pathname: '/signup/complete', state: stateVal }]}>
        <Routes>
          <Route path="/signup/complete" element={<SignupComplete />} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders details passed via router state', () => {
    renderWithState({
      participantCode: 'BSMC-999',
      studyGroup: 'control',
      hospitalName: 'Bankura Sammilani Medical College',
    });

    expect(screen.getByText('BSMC-999')).toBeInTheDocument();
    expect(screen.getByText('Bankura Sammilani Medical College')).toBeInTheDocument();
    expect(screen.getByText('Control Group')).toBeInTheDocument();
  });

  it('fetches details from API if router state is empty', async () => {
    const apiMock = vi.mocked(getParticipantCode).mockResolvedValue({
      success: true,
      data: {
        participantCode: 'BSMC-002',
        studyGroup: 'study',
        hospital: { id: 'h1', name: 'Bankura Hospital', code: 'BSMC' },
      },
    });

    renderWithState(null);

    // Should show loading initially
    expect(screen.getByText('Loading…')).toBeInTheDocument();

    await waitFor(() => {
      expect(apiMock).toHaveBeenCalled();
      expect(screen.getByText('BSMC-002')).toBeInTheDocument();
      expect(screen.getByText('Bankura Hospital')).toBeInTheDocument();
      expect(screen.getAllByText('Study Group')[0]).toBeInTheDocument();
    });
  });

  it('shows error state if API fetch fails and allows retry', async () => {
    const apiMock = vi.mocked(getParticipantCode).mockRejectedValue({
      message: 'Failed to load code info',
    });

    renderWithState(null);

    await waitFor(() => {
      expect(apiMock).toHaveBeenCalled();
      expect(screen.getByText('Failed to load code info')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    // Setup successful retry
    apiMock.mockResolvedValue({
      success: true,
      data: {
        participantCode: 'BSMC-777',
        studyGroup: 'control',
        hospital: { id: 'h1', name: 'BS Medical College', code: 'BSMC' },
      },
    });

    fireEvent.click(screen.getByText('Retry'));

    await waitFor(() => {
      expect(screen.getByText('BSMC-777')).toBeInTheDocument();
      expect(screen.getByText('BS Medical College')).toBeInTheDocument();
    });
  });

  it('navigates to dashboard when Go to Home button is clicked', async () => {
    renderWithState({
      participantCode: 'BSMC-999',
      studyGroup: 'control',
      hospitalName: 'Bankura Sammilani Medical College',
    });

    fireEvent.click(screen.getByText('Go to Home'));
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });
});
