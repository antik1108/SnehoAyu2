import React, { useState } from 'react';

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  error?: string;
  id?: string;
  autoComplete?: 'current-password' | 'new-password';
  disabled?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  value,
  onChange,
  label,
  placeholder = '••••••••',
  error,
  id = 'password-input',
  autoComplete = 'current-password',
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="font-sans text-xs font-semibold text-text">
        {label}
      </label>
      <div className="relative flex items-center w-full">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full min-h-[48px] pl-4 pr-12 rounded-xl border font-technical text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            error ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border bg-surface text-text'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {/* Toggle Button */}
        <button
          type="button"
          onClick={toggleShowPassword}
          disabled={disabled}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-lg text-text-muted hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer disabled:opacity-50"
        >
          {showPassword ? (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <span id={`${id}-error`} className="font-sans text-xs text-error font-medium" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
