import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PinDots } from '../components/auth/PinDots';

describe('PinDots Component', () => {
  it('renders exactly four visual indicators', () => {
    const { container } = render(<PinDots filledCount={0} label="0 of 4 digits entered" />);
    // There are 4 dot containers representing the visual indicators
    const dots = container.querySelectorAll('[aria-hidden="true"] > div');
    expect(dots.length).toBe(4);
  });

  it('renders progress text for screen readers correctly', () => {
    render(<PinDots filledCount={2} label="2 of 4 digits entered" />);
    const srText = screen.getByText('2 of 4 digits entered');
    expect(srText).toBeInTheDocument();
    expect(srText).toHaveClass('sr-only');
  });

  it('never displays actual digit values in visible elements', () => {
    render(<PinDots filledCount={4} label="4 of 4 digits entered" />);
    const visibleDigits = screen.queryAllByText(/[0-9]/).filter(el => !el.classList.contains('sr-only'));
    expect(visibleDigits.length).toBe(0);
  });

  it('applies border styling or class for error state', () => {
    const { container } = render(<PinDots filledCount={1} label="1 of 4 digits entered" hasError={true} />);
    const shakeDiv = container.querySelector('.animate-shake');
    expect(shakeDiv).toBeInTheDocument();

    const filledDot = container.querySelector('.bg-error');
    expect(filledDot).toBeInTheDocument();
  });
});
