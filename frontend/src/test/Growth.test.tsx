import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Growth } from '../pages/Growth';
import i18n from '../i18n';

const growthApiMock = vi.hoisted(() => ({
  getLatestGrowthReading: vi.fn(),
  getGrowthHistory: vi.fn(),
}));

vi.mock('../features/growth/api', () => growthApiMock);

beforeEach(() => {
  vi.clearAllMocks();
  void i18n.changeLanguage('en');
});

describe('Growth page', () => {
  it('renders current measurements and history without z-scores or charts', async () => {
    growthApiMock.getLatestGrowthReading.mockResolvedValue({
      source: 'growth',
      readingDate: '2026-06-19',
      weightGrams: 2200,
      lengthCm: 45.5,
      headCircumferenceCm: 32.1,
      chronologicalAge: { days: 49, weeks: 7 },
      correctedAge: { days: 0, weeks: 0 },
    });
    growthApiMock.getGrowthHistory.mockResolvedValue({
      baseline: {
        source: 'discharge',
        readingDate: '2026-05-22',
        weightGrams: 1650,
        lengthCm: null,
        headCircumferenceCm: null,
      },
      readings: [{
        source: 'manual',
        readingDate: '2026-06-19',
        weightGrams: 2200,
        lengthCm: 45.5,
        headCircumferenceCm: 32.1,
        chronologicalAge: { days: 49, weeks: 7 },
        correctedAge: { days: 0, weeks: 0 },
        timePoint: '1_month',
      }],
    });

    render(
      <MemoryRouter>
        <Growth />
      </MemoryRouter>
    );

    expect(await screen.findByText('Current Measurements')).toBeInTheDocument();
    expect(screen.getAllByText('2200 g').length).toBeGreaterThan(0);
    expect(screen.getByText('Growth History')).toBeInTheDocument();
    expect(screen.queryByText(/z-score/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/chart/i)).not.toBeInTheDocument();
  });

  it('renders error state with retry', async () => {
    growthApiMock.getLatestGrowthReading.mockRejectedValue(new Error('Nope'));
    growthApiMock.getGrowthHistory.mockRejectedValue(new Error('Nope'));

    render(
      <MemoryRouter>
        <Growth />
      </MemoryRouter>
    );

    expect(await screen.findByText('We could not load growth readings.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(growthApiMock.getLatestGrowthReading).toHaveBeenCalledTimes(2);
  });
});
