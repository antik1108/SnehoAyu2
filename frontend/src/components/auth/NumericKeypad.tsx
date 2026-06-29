import React from 'react';
import { Delete } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NumericKeypadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onClear?: () => void;
  disabled?: boolean;
  maxLengthReached?: boolean;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({
  onDigit,
  onBackspace,
  onClear,
  disabled = false,
  maxLengthReached = false,
}) => {
  const { t } = useTranslation();

  const handleDigitClick = (digit: string) => {
    if (disabled || (maxLengthReached && digit !== '')) return;
    onDigit(digit);
  };

  const handleBackspaceClick = () => {
    if (disabled) return;
    onBackspace();
  };

  const handleClearClick = () => {
    if (disabled || !onClear) return;
    onClear();
  };

  const keys = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-[280px] mx-auto py-2">
      {/* 1 to 9 */}
      {keys.map((key) => (
        <button
          key={key.value}
          type="button"
          onClick={() => handleDigitClick(key.value)}
          disabled={disabled || (maxLengthReached && !disabled)}
          className="interactive-card flex min-h-[56px] w-full items-center justify-center rounded-xl border border-border bg-surface text-lg font-extrabold text-text active:bg-secondary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:border-border disabled:bg-background disabled:opacity-50"
        >
          {key.label}
        </button>
      ))}

      {/* Clear Key */}
      <button
        type="button"
        onClick={handleClearClick}
        disabled={disabled || !onClear}
        aria-label={t('auth.pin.keypad.clear', 'Clear PIN')}
        className="interactive-card flex min-h-[56px] w-full items-center justify-center rounded-xl border border-border bg-surface text-sm font-extrabold text-text-muted active:bg-secondary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t('auth.pin.keypad.clearLabel', 'Clear')}
      </button>

      {/* 0 Key */}
      <button
        type="button"
        onClick={() => handleDigitClick('0')}
        disabled={disabled || (maxLengthReached && !disabled)}
        className="interactive-card flex min-h-[56px] w-full items-center justify-center rounded-xl border border-border bg-surface text-lg font-extrabold text-text active:bg-secondary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:border-border disabled:bg-background disabled:opacity-50"
      >
        0
      </button>

      {/* Backspace Key */}
      <button
        type="button"
        onClick={handleBackspaceClick}
        disabled={disabled}
        aria-label={t('auth.pin.keypad.backspace', 'Delete last digit')}
        className="interactive-card flex min-h-[56px] w-full items-center justify-center rounded-xl border border-border bg-surface text-text-muted active:bg-secondary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Delete className="h-5 w-5" />
      </button>
    </div>
  );
};
