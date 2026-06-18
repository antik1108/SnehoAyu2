import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { markAuthenticatedPreviously } from '../lib/authStorage';
import { getSafeInternalRedirect } from '../lib/redirect';
import { ROUTES } from '../routes/paths';
import { AuthPageShell } from '../components/auth/AuthPageShell';
import { PhoneNumberField } from '../components/auth/PhoneNumberField';
import { PinDots } from '../components/auth/PinDots';
import { NumericKeypad } from '../components/auth/NumericKeypad';
import { InlineFormError } from '../components/feedback/InlineFormError';

export const PinLogin: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithPin } = useAuth();

  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!phone) {
      errors.phone = t('auth.validation.phoneRequired', 'Phone number is required.');
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      errors.phone = t('auth.validation.phoneInvalid', 'Enter a valid 10-digit Indian mobile number.');
    }

    if (!pin) {
      errors.pin = t('auth.pin.validation.pinRequired', 'PIN is required.');
    } else if (pin.length !== 4) {
      errors.pin = t('auth.pin.validation.pinDigits', 'PIN must contain exactly four digits.');
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDigit = (digit: string) => {
    if (isSubmitting) return;
    setFormError(null);
    setPin((prev) => {
      const updated = prev + digit;
      if (updated.length > 4) return prev;
      return updated;
    });
  };

  const handleBackspace = () => {
    if (isSubmitting) return;
    setFormError(null);
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (isSubmitting) return;
    setFormError(null);
    setPin('');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    setFormError(null);
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await loginWithPin(phone, pin);
      markAuthenticatedPreviously();

      // Retrieve post-login redirect destination
      const state = location.state as { from?: string | { pathname: string } } | null;
      const from = state?.from;
      const targetPath = getSafeInternalRedirect(from, ROUTES.DASHBOARD);

      navigate(targetPath, { replace: true });
    } catch (err: unknown) {
      // Clear PIN on error
      setPin('');

      const error = err as { code?: string; status?: number; message?: string };
      if (error.code === 'INVALID_CREDENTIALS' || error.status === 401) {
        setFormError(t('auth.errors.invalidCredentials', 'The mobile number or PIN is incorrect.'));
      } else if (error.code === 'PIN_NOT_CONFIGURED') {
        setFormError(t('auth.pin.login.pinNotConfigured', 'PIN login is not set up for this account. Log in with your password first.'));
      } else if (error.code === 'TOO_MANY_PIN_ATTEMPTS' || error.code === 'ACCOUNT_LOCKED' || error.status === 429) {
        setFormError(t('auth.errors.network', 'Too many attempts. Please try again later.')); // Using standard rate limit message
      } else if (error.code === 'NETWORK_ERROR') {
        setFormError(t('auth.errors.network', 'Check your internet connection and try again.'));
      } else {
        setFormError(error.message || t('auth.errors.unexpected', 'Something went wrong. Please try again.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit automatically when 4 digits are entered and phone is valid
  useEffect(() => {
    if (pin.length === 4 && phone.length === 10 && /^[6-9]\d{9}$/.test(phone)) {
      const timer = setTimeout(() => {
        handleSubmit();
      }, 0);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  // Physical keyboard listeners (only capture if phone field is not active)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitting) return;

      const activeElementId = document.activeElement?.id;
      if (activeElementId === 'phone-input') return;

      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, phone, isSubmitting]);

  // Clear PIN state on unmount
  useEffect(() => {
    return () => {
      setPin('');
    };
  }, []);

  const getDotsLabel = () => {
    return t('auth.pin.dotsLabel', '{{count}} of 4 digits entered', { count: pin.length });
  };

  return (
    <AuthPageShell
      title={t('auth.pin.login.title', 'Log in with PIN')}
      subtitle={t('auth.pin.login.subtitle', 'Enter your mobile number and 4-digit PIN.')}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-5 mt-4"
        noValidate
      >
        {formError && <InlineFormError message={formError} />}

        <PhoneNumberField
          value={phone}
          onChange={(val) => {
            setPhone(val);
            if (fieldErrors.phone) {
              setFieldErrors((prev) => ({ ...prev, phone: '' }));
            }
          }}
          label={t('auth.common.mobileNumber', 'Mobile number')}
          placeholder={t('auth.common.phonePlaceholder', 'Enter 10-digit number')}
          error={fieldErrors.phone}
          disabled={isSubmitting}
        />

        <div className="flex flex-col gap-1.5 w-full">
          <span className="font-sans text-xs font-semibold text-text">
            {t('auth.pin.login.pinLabel', 'PIN')}
          </span>
          <PinDots
            filledCount={pin.length}
            label={getDotsLabel()}
            hasError={!!fieldErrors.pin}
          />
          {fieldErrors.pin && (
            <span className="font-sans text-xs text-error font-medium text-center" role="alert">
              {fieldErrors.pin}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <div className="text-left text-[11px] text-text-muted bg-background/50 p-2.5 rounded-lg border border-border">
            {t('auth.pin.login.forgotPinNotice', 'Forgot your PIN? Log in with your password.')}
          </div>

          <button
            type="button"
            onClick={() => navigate(ROUTES.LOGIN, { state: location.state })}
            disabled={isSubmitting}
            className="text-left text-xs font-semibold text-primary hover:underline cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary self-start"
          >
            {t('auth.pin.login.linkPassword', 'Log in with password')}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="w-full min-h-[48px] py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-center transition-all cursor-pointer hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {isSubmitting ? t('auth.pin.login.submitting', 'Logging In…') : t('auth.pin.login.submit', 'Log In')}
        </button>

        <div className="w-full mt-2">
          <NumericKeypad
            onDigit={handleDigit}
            onBackspace={handleBackspace}
            onClear={handleClear}
            disabled={isSubmitting}
            maxLengthReached={pin.length === 4}
          />
        </div>

        <div className="text-center text-xs text-text-muted mt-2">
          {t('auth.login.footerText', 'New to SnehoAyu?')}{' '}
          <button
            type="button"
            onClick={() => navigate(ROUTES.SIGNUP_PHONE)}
            disabled={isSubmitting}
            className="font-semibold text-primary hover:underline cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t('auth.login.footerLink', 'Create an account')}
          </button>
        </div>
      </form>
    </AuthPageShell>
  );
};
