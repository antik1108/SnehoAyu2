import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { BabyProfileForm } from '../pages/BabyProfileForm';
import { saveBabyProfile } from '../features/onboarding/api';
import i18n from '../i18n';

// Mock the API calls
vi.mock('../features/onboarding/api', () => ({
  saveBabyProfile: vi.fn(),
}));

describe('BabyProfileForm Page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    i18n.changeLanguage('en');
  });

  const renderForm = () => {
    return render(
      <MemoryRouter initialEntries={['/signup/baby-profile']}>
        <Routes>
          <Route path="/signup/baby-profile" element={<BabyProfileForm />} />
          <Route path="/signup/mother-profile" element={<div>Mother Profile Page</div>} />
          <Route path="/signup/hospital-code" element={<div>Hospital Code Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders all baby profile fields correctly', () => {
    renderForm();

    expect(screen.getByLabelText(/Baby’s name/i)).toBeInTheDocument();
    expect(screen.getByText(/Sex \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of birth \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gestational age at birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Birth weight/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Weight at discharge/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Place of delivery/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/NICU stay/i)).toBeInTheDocument();
    expect(screen.getByText(/Skin-to-skin contact at birth\?/i)).toBeInTheDocument();
    expect(screen.getByText(/KMC provided in NICU\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Feeding type at discharge/i)).toBeInTheDocument();
    expect(screen.getByText(/Cried after birth\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Needed resuscitation\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Discharge date \*/i)).toBeInTheDocument();
  });

  it('validates ranges and inputs correctly', async () => {
    renderForm();

    // Fill invalid ranges
    fireEvent.change(screen.getByLabelText(/Gestational age at birth/i), { target: { value: '42' } });
    fireEvent.change(screen.getByLabelText(/Birth weight/i), { target: { value: '200' } });
    fireEvent.change(screen.getByLabelText(/Weight at discharge/i), { target: { value: '6000' } });
    fireEvent.change(screen.getByLabelText(/NICU stay/i), { target: { value: '150' } });

    fireEvent.click(screen.getByText(/Save and Continue/i));

    await waitFor(() => {
      expect(screen.getByText('Gestational age must be between 24.0 and 36.9 weeks (at most one decimal place).')).toBeInTheDocument();
      expect(screen.getByText('Birth weight must be between 400 and 4000 grams.')).toBeInTheDocument();
      expect(screen.getByText('Discharge weight must be between 400 and 5000 grams.')).toBeInTheDocument();
      expect(screen.getByText('NICU stay must be between 1 and 120 days.')).toBeInTheDocument();
    });
  });

  it('validates dates constraints', async () => {
    renderForm();

    // Set discharge date earlier than birth date
    fireEvent.change(screen.getByLabelText(/Date of birth \*/i), { target: { value: '2026-06-18' } });
    fireEvent.change(screen.getByLabelText(/Discharge date \*/i), { target: { value: '2026-06-15' } });

    fireEvent.click(screen.getByText(/Save and Continue/i));

    await waitFor(() => {
      expect(screen.getByText('Discharge date must not be earlier than birth date.')).toBeInTheDocument();
    });

    // Set birth date in the future
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const futureDateStr = futureDate.toISOString().split('T')[0];

    fireEvent.change(screen.getByLabelText(/Date of birth \*/i), { target: { value: futureDateStr } });

    fireEvent.click(screen.getByText(/Save and Continue/i));

    await waitFor(() => {
      expect(screen.getByText('Date must not be in the future.')).toBeInTheDocument();
    });
  });

  it('submits valid data and navigates to the hospital code page', async () => {
    const saveMock = vi.mocked(saveBabyProfile).mockResolvedValue({ success: true });
    renderForm();

    fireEvent.change(screen.getByLabelText(/Baby’s name/i), { target: { value: 'Ananya' } });
    fireEvent.click(screen.getByLabelText('Female'));
    fireEvent.change(screen.getByLabelText(/Date of birth \*/i), { target: { value: '2026-06-01' } });
    fireEvent.change(screen.getByLabelText(/Gestational age at birth/i), { target: { value: '31.2' } });
    fireEvent.change(screen.getByLabelText(/Birth weight/i), { target: { value: '1500' } });
    fireEvent.change(screen.getByLabelText(/Weight at discharge/i), { target: { value: '1900' } });
    fireEvent.change(screen.getByLabelText(/Place of delivery/i), { target: { value: 'hospital' } });
    fireEvent.change(screen.getByLabelText(/NICU stay/i), { target: { value: '14' } });

    // Radio fields
    fireEvent.click(screen.getAllByLabelText('Yes')[0]); // skinToSkinAtBirth
    fireEvent.click(screen.getAllByLabelText('Yes')[1]); // kmcInNicu

    fireEvent.change(screen.getByLabelText(/Feeding type at discharge/i), { target: { value: 'exclusive_bf' } });

    fireEvent.click(screen.getAllByLabelText('Yes')[2]); // criedAtBirth
    fireEvent.click(screen.getAllByLabelText('No')[3]); // neededResuscitation

    fireEvent.change(screen.getByLabelText(/Discharge date \*/i), { target: { value: '2026-06-15' } });

    fireEvent.click(screen.getByText(/Save and Continue/i));

    await waitFor(() => {
      expect(saveMock).toHaveBeenCalledWith({
        babyName: 'Ananya',
        sex: 'female',
        dateOfBirth: '2026-06-01',
        gestationalAgeWeeks: 31.2,
        birthWeightGrams: 1500,
        weightAtDischargeGrams: 1900,
        placeOfDelivery: 'hospital',
        nicuStayDays: 14,
        skinToSkinAtBirth: true,
        kmcInNicu: true,
        feedingAtDischarge: 'exclusive_bf',
        criedAtBirth: true,
        neededResuscitation: false,
        dischargeDate: '2026-06-15',
      });
      expect(screen.getByText('Hospital Code Page')).toBeInTheDocument();
    });
  });
});
