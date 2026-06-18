import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NumericKeypad } from '../components/auth/NumericKeypad';

describe('NumericKeypad Component', () => {
  it('renders all digits 0-9 and action keys', () => {
    render(<NumericKeypad onDigit={vi.fn()} onBackspace={vi.fn()} onClear={vi.fn()} />);

    for (let i = 0; i <= 9; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
    expect(screen.getByLabelText('Delete last digit')).toBeInTheDocument();
    expect(screen.getByLabelText('Clear PIN')).toBeInTheDocument();
  });

  it('uses type="button" on all button keys', () => {
    const { container } = render(<NumericKeypad onDigit={vi.fn()} onBackspace={vi.fn()} onClear={vi.fn()} />);
    const buttons = container.querySelectorAll('button');
    buttons.forEach((btn) => {
      expect(btn.getAttribute('type')).toBe('button');
    });
  });

  it('triggers onDigit when digit buttons are pressed', () => {
    const onDigitMock = vi.fn();
    render(<NumericKeypad onDigit={onDigitMock} onBackspace={vi.fn()} onClear={vi.fn()} />);

    fireEvent.click(screen.getByText('5'));
    expect(onDigitMock).toHaveBeenCalledWith('5');
  });

  it('triggers onBackspace when backspace button is pressed', () => {
    const onBackspaceMock = vi.fn();
    render(<NumericKeypad onDigit={vi.fn()} onBackspace={onBackspaceMock} onClear={vi.fn()} />);

    fireEvent.click(screen.getByLabelText('Delete last digit'));
    expect(onBackspaceMock).toHaveBeenCalled();
  });

  it('triggers onClear when clear button is pressed', () => {
    const onClearMock = vi.fn();
    render(<NumericKeypad onDigit={vi.fn()} onBackspace={vi.fn()} onClear={onClearMock} />);

    fireEvent.click(screen.getByLabelText('Clear PIN'));
    expect(onClearMock).toHaveBeenCalled();
  });

  it('disables digit entries when disabled prop is true', () => {
    const onDigitMock = vi.fn();
    render(<NumericKeypad onDigit={onDigitMock} onBackspace={vi.fn()} onClear={vi.fn()} disabled={true} />);

    fireEvent.click(screen.getByText('8'));
    expect(onDigitMock).not.toHaveBeenCalled();
  });
});
