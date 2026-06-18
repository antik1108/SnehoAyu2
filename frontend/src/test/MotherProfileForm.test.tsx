import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MotherProfileForm } from '../pages/MotherProfileForm';
import { saveMotherProfile } from '../features/onboarding/api';
import i18n from '../i18n';

// Mock the API calls
vi.mock('../features/onboarding/api', () => ({
  saveMotherProfile: vi.fn(),
}));

describe('MotherProfileForm Page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    i18n.changeLanguage('en');
  });

  const renderForm = () => {
    return render(
      <MemoryRouter initialEntries={['/signup/mother-profile']}>
        <Routes>
          <Route path="/signup/mother-profile" element={<MotherProfileForm />} />
          <Route path="/signup/baby-profile" element={<div>Baby Profile Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders all form fields correctly', () => {
    renderForm();

    expect(screen.getByLabelText(/Full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age range \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mother’s education \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Father’s education \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mother’s occupation \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Father’s occupation \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Family income class \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Family type \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of family members \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Religion \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Residence type \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Alternate contact number/i)).toBeInTheDocument();
  });

  it('validates required fields upon submit', async () => {
    renderForm();

    fireEvent.click(screen.getByText(/Save and Continue/i));

    await waitFor(() => {
      expect(screen.getAllByText('This field is required.').length).toBeGreaterThan(0);
    });
  });

  it('toggles conditional information source field and validates it', async () => {
    renderForm();

    // Checkbox field should not be visible initially
    expect(screen.queryByText('Source of information *')).not.toBeInTheDocument();

    // Click 'Yes' for Preterm Care Education
    fireEvent.click(screen.getByLabelText('Yes'));

    // Checkbox group header should be visible now
    expect(screen.getByText('Source of information *')).toBeInTheDocument();

    // Submit without checking any source
    fireEvent.click(screen.getByText(/Save and Continue/i));

    await waitFor(() => {
      expect(screen.getByText('At least one source of information must be selected.')).toBeInTheDocument();
    });

    // Check one source
    fireEvent.click(screen.getByLabelText('Health worker'));

    // The validation error for source should disappear or not block
    fireEvent.click(screen.getByText(/Save and Continue/i));

    await waitFor(() => {
      expect(screen.queryByText('At least one source of information must be selected.')).not.toBeInTheDocument();
    });
  });

  it('validates contact number format and family count bounds', async () => {
    renderForm();

    // Fill invalid family members
    fireEvent.change(screen.getByLabelText(/Number of family members \*/i), { target: { value: '35' } });
    // Fill invalid alternate number
    fireEvent.change(screen.getByLabelText(/Alternate contact number/i), { target: { value: '1234' } });

    fireEvent.click(screen.getByText(/Save and Continue/i));

    await waitFor(() => {
      expect(screen.getByText('Family members count must be an integer between 1 and 30.')).toBeInTheDocument();
      expect(screen.getByText('Contact number must be a valid 10-digit Indian mobile number.')).toBeInTheDocument();
    });
  });

  it('submits form payload and redirects to baby profile page on success', async () => {
    const saveMock = vi.mocked(saveMotherProfile).mockResolvedValue({ success: true });
    renderForm();

    // Fill all fields
    fireEvent.change(screen.getByLabelText(/Full name/i), { target: { value: 'Ayesha Begum' } });
    fireEvent.change(screen.getByLabelText(/Age range \*/i), { target: { value: '26_30' } });
    fireEvent.change(screen.getByLabelText(/Mother’s education \*/i), { target: { value: 'secondary' } });
    fireEvent.change(screen.getByLabelText(/Father’s education \*/i), { target: { value: 'secondary' } });
    fireEvent.change(screen.getByLabelText(/Mother’s occupation \*/i), { target: { value: 'homemaker' } });
    fireEvent.change(screen.getByLabelText(/Father’s occupation \*/i), { target: { value: 'daily_labour' } });
    fireEvent.change(screen.getByLabelText(/Family income class \*/i), { target: { value: 'IV' } });
    fireEvent.change(screen.getByLabelText(/Family type \*/i), { target: { value: 'nuclear' } });
    fireEvent.change(screen.getByLabelText(/Number of family members \*/i), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText(/Religion \*/i), { target: { value: 'muslim' } });
    fireEvent.change(screen.getByLabelText(/Residence type \*/i), { target: { value: 'rural' } });
    fireEvent.change(screen.getByLabelText(/Alternate contact number/i), { target: { value: '9876543210' } });

    // Select preterm education = false
    fireEvent.click(screen.getByLabelText('No'));

    fireEvent.click(screen.getByText(/Save and Continue/i));

    await waitFor(() => {
      expect(saveMock).toHaveBeenCalledWith({
        fullName: 'Ayesha Begum',
        ageRange: '26_30',
        educationMother: 'secondary',
        educationFather: 'secondary',
        occupationMother: 'homemaker',
        occupationFather: 'daily_labour',
        incomeClass: 'IV',
        familyType: 'nuclear',
        familyMembersCount: 4,
        religion: 'muslim',
        residenceType: 'rural',
        contactNumber: '9876543210',
        prevPretermEducation: false,
        educationSource: [],
      });
      expect(screen.getByText('Baby Profile Page')).toBeInTheDocument();
    });
  });
});
