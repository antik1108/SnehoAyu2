import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HospitalCodeEntry } from '../pages/HospitalCodeEntry';
import { linkHospital, getParticipantCode, completeOnboarding } from '../features/onboarding/api';
import i18n from '../i18n';

// Mock the API calls
vi.mock('../features/onboarding/api', () => ({
  linkHospital: vi.fn(),
  getParticipantCode: vi.fn(),
  completeOnboarding: vi.fn(),
}));

describe('HospitalCodeEntry Page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    i18n.changeLanguage('en');
  });

  const renderForm = () => {
    return render(
      <MemoryRouter initialEntries={['/signup/hospital-code']}>
        <Routes>
          <Route path="/signup/hospital-code" element={<HospitalCodeEntry />} />
          <Route path="/signup/complete" element={<div>Signup Complete Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders input for hospital code', () => {
    renderForm();
    expect(screen.getByLabelText(/Hospital code \*/i)).toBeInTheDocument();
  });

  it('validates empty and incorrect code format', async () => {
    renderForm();

    // Try submitting empty
    fireEvent.click(screen.getByText('Verify Hospital'));
    await waitFor(() => {
      expect(screen.getByText('Hospital code is required.')).toBeInTheDocument();
    });

    // Try submitting invalid format
    fireEvent.change(screen.getByLabelText(/Hospital code \*/i), { target: { value: 'A' } });
    fireEvent.click(screen.getByText('Verify Hospital'));
    await waitFor(() => {
      expect(screen.getByText('Hospital code must contain only letters and numbers, between 2 and 10 characters.')).toBeInTheDocument();
    });
  });

  it('links hospital, generates participant code, completes onboarding, and redirects', async () => {
    const linkMock = vi.mocked(linkHospital).mockResolvedValue({
      success: true,
      data: { id: 'h1', name: 'Bankura Sammilani Medical College', code: 'BSMC' },
    });
    const getCodeMock = vi.mocked(getParticipantCode).mockResolvedValue({
      success: true,
      data: {
        participantCode: 'BSMC-001',
        studyGroup: 'study',
        hospital: { id: 'h1', name: 'Bankura Sammilani Medical College', code: 'BSMC' },
      },
    });
    const completeMock = vi.mocked(completeOnboarding).mockResolvedValue({
      success: true,
      message: 'Onboarding complete',
    });

    renderForm();

    fireEvent.change(screen.getByLabelText(/Hospital code \*/i), { target: { value: 'BSMC' } });
    fireEvent.click(screen.getByText('Verify Hospital'));

    await waitFor(() => {
      expect(linkMock).toHaveBeenCalledWith('BSMC');
      expect(getCodeMock).toHaveBeenCalled();
      expect(completeMock).toHaveBeenCalled();
      expect(screen.getByText('Signup Complete Page')).toBeInTheDocument();
    });
  });

  it('handles verification error and displays appropriate error message', async () => {
    const linkMock = vi.mocked(linkHospital).mockRejectedValue({
      code: 'INVALID_HOSPITAL_CODE',
      message: 'Invalid hospital code',
    });

    renderForm();

    fireEvent.change(screen.getByLabelText(/Hospital code \*/i), { target: { value: 'WRONG' } });
    fireEvent.click(screen.getByText('Verify Hospital'));

    await waitFor(() => {
      expect(linkMock).toHaveBeenCalledWith('WRONG');
      expect(screen.getByText('The hospital code is invalid.')).toBeInTheDocument();
    });
  });

  it('handles participant allocation error and allows retry', async () => {
    vi.mocked(linkHospital).mockResolvedValue({
      success: true,
      data: { id: 'h1', name: 'Bankura Medical College', code: 'BSMC' },
    });
    const getCodeMock = vi.mocked(getParticipantCode).mockRejectedValue({
      code: 'STUDY_GROUP_REQUIRED',
      message: 'Study group assignment needed',
    });

    renderForm();

    fireEvent.change(screen.getByLabelText(/Hospital code \*/i), { target: { value: 'BSMC' } });
    fireEvent.click(screen.getByText('Verify Hospital'));

    // Wait for verify success and then study group error
    await waitFor(() => {
      expect(screen.getByText('The researcher must assign the study group before onboarding can be completed.')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    // Mock successful retry
    getCodeMock.mockResolvedValue({
      success: true,
      data: {
        participantCode: 'BSMC-001',
        studyGroup: 'study',
        hospital: { id: 'h1', name: 'Bankura Medical College', code: 'BSMC' },
      },
    });
    vi.mocked(completeOnboarding).mockResolvedValue({
      success: true,
      message: 'Success',
    });

    fireEvent.click(screen.getByText('Retry'));

    await waitFor(() => {
      expect(screen.getByText('Signup Complete Page')).toBeInTheDocument();
    });
  });
});
