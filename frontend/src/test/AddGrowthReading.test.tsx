import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AddReading } from '../pages/growth/AddReading';
import i18n from '../i18n';

const navigateMock = vi.hoisted(() => vi.fn());
const growthApiMock = vi.hoisted(() => ({
  createGrowthReading: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('../features/growth/api', () => growthApiMock);

beforeEach(() => {
  vi.clearAllMocks();
  void i18n.changeLanguage('en');
});

function field(id: string) {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing field ${id}`);
  return element;
}

describe('Add growth reading page', () => {
  it('validates required ranges before calling API', async () => {
    render(
      <MemoryRouter>
        <AddReading />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save Reading' }));

    expect(await screen.findByText('Weight must be between 400 g and 8000 g.')).toBeInTheDocument();
    expect(screen.getByText('Length must be between 20.0 cm and 80.0 cm.')).toBeInTheDocument();
    expect(screen.getByText('Head circumference must be between 15.0 cm and 55.0 cm.')).toBeInTheDocument();
    expect(growthApiMock.createGrowthReading).not.toHaveBeenCalled();
  });

  it('submits only growth reading fields and navigates back to growth', async () => {
    growthApiMock.createGrowthReading.mockResolvedValue({});
    render(
      <MemoryRouter>
        <AddReading />
      </MemoryRouter>
    );

    fireEvent.change(field('readingDate'), { target: { value: '2026-06-19' } });
    fireEvent.change(field('weightGrams'), { target: { value: '2200' } });
    fireEvent.change(field('lengthCm'), { target: { value: '45.5' } });
    fireEvent.change(field('headCircumferenceCm'), { target: { value: '32.1' } });
    fireEvent.change(field('timePoint'), { target: { value: '1_month' } });
    fireEvent.change(field('notes'), { target: { value: 'Synthetic test note' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Reading' }));

    await waitFor(() => expect(growthApiMock.createGrowthReading).toHaveBeenCalledWith({
      readingDate: '2026-06-19',
      weightGrams: 2200,
      lengthCm: 45.5,
      headCircumferenceCm: 32.1,
      timePoint: '1_month',
      notes: 'Synthetic test note',
    }));
    expect(JSON.stringify(growthApiMock.createGrowthReading.mock.calls[0][0])).not.toContain('userId');
    expect(JSON.stringify(growthApiMock.createGrowthReading.mock.calls[0][0])).not.toContain('babyProfileId');
    expect(navigateMock).toHaveBeenCalledWith('/growth', { replace: true });
  });
});
