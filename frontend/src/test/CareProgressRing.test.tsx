import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CareProgressRing } from '../components/dashboard/CareProgressRing';
import i18n from '../i18n';

void i18n.changeLanguage('en');

describe('CareProgressRing', () => {
  it('renders and clamps values into the valid range', () => {
    render(<CareProgressRing percent={150} completedCount={8} totalCount={10} label="Today’s Care" />);
    expect(screen.getByLabelText('Today’s Care 100% complete')).toBeInTheDocument();
    expect(screen.getAllByText('100%').length).toBeGreaterThan(0);
  });

  it('renders zero percent', () => {
    render(<CareProgressRing percent={0} completedCount={0} totalCount={10} label="Today’s Care" />);
    expect(screen.getAllByText('0%').length).toBeGreaterThan(0);
  });
});
