import React from 'react';

interface PhoneNumberFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  error?: string;
  id?: string;
  disabled?: boolean;
}

export const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({
  value,
  onChange,
  label,
  placeholder = '9876543210',
  error,
  id = 'phone-input',
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Extract only digits
    const cleaned = rawVal.replace(/\D/g, '');
    // Take at most 10 digits
    const limited = cleaned.slice(0, 10);
    onChange(limited);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    // Normalize pasted value: remove country code prefixes and non-digits
    let digits = pastedData.replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length > 10) {
      digits = digits.slice(2);
    }
    const limited = digits.slice(0, 10);
    onChange(limited);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="font-sans text-xs font-semibold text-text">
        {label}
      </label>
      <div className="relative flex items-center w-full">
        {/* Country Code Prefix */}
        <span className="absolute left-4 font-sans text-sm font-semibold text-text-muted select-none">
          +91
        </span>
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={10}
          value={value}
          onChange={handleChange}
          onPaste={handlePaste}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full min-h-[48px] pl-12 pr-4 rounded-xl border font-technical text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            error ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border bg-surface text-text'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      </div>
      {error && (
        <span id={`${id}-error`} className="font-sans text-xs text-error font-medium" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
