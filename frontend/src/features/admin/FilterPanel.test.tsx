import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FilterPanel } from './FilterPanel';
import { FilterContextProvider } from './FilterContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <FilterContextProvider>{children}</FilterContextProvider>
    </QueryClientProvider>
  );
};

describe('FilterPanel component tests', () => {
  it('renders all filter controls properly', () => {
    render(<FilterPanel />, { wrapper: createWrapper() });

    expect(screen.getByText('Cohort Filter Controls')).toBeInTheDocument();
    expect(screen.getByText('Clear all filters')).toBeInTheDocument();
    expect(screen.getByText('Site')).toBeInTheDocument();
    expect(screen.getByText('Group')).toBeInTheDocument();
    expect(screen.getByText('Stratum')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Checkpoint Window')).toBeInTheDocument();
    expect(screen.getByText('Enrolled Date Range')).toBeInTheDocument();
    expect(screen.getByText('Engagement Tier')).toBeInTheDocument();
  });

  it('validates start date > end date and displays inline error', () => {
    render(<FilterPanel />, { wrapper: createWrapper() });

    const dateInputs = screen.getAllByDisplayValue('')
      .filter((input) => input.getAttribute('type') === 'date');

    const startDateInput = dateInputs[0];
    const endDateInput = dateInputs[1];

    fireEvent.change(startDateInput, { target: { value: '2025-06-01' } });
    fireEvent.change(endDateInput, { target: { value: '2025-05-01' } });

    expect(screen.getByText('Start date cannot be after end date')).toBeInTheDocument();
  });
});
