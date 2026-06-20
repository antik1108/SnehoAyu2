import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BabyStatusCard } from '../components/dashboard/BabyStatusCard';
import i18n from '../i18n';

describe('BabyStatusCard', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('preferred_language', 'en');
    void i18n.changeLanguage('en');
  });

  it('renders baby information without internal IDs', () => {
    render(
      <BabyStatusCard
        baby={{
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
        }}
        participant={{ participantCode: 'BNK-S-001', studyGroup: 'study' }}
        hospital={{ code: 'BNK', name: 'Bankura Medical College', emergencyPhone: null }}
      />
    );

    expect(screen.getByText('Maya')).toBeInTheDocument();
    expect(screen.getByText(/1650 g/)).toBeInTheDocument();
    expect(screen.getByText(/BNK-S-001/)).toBeInTheDocument();
    expect(screen.queryByText(/motherProfileId/i)).not.toBeInTheDocument();
  });
});
