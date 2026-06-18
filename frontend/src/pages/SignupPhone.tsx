import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { markAuthenticatedPreviously } from '../lib/authStorage';
import { ROUTES } from '../routes/paths';
import { AuthPageShell } from '../components/auth/AuthPageShell';
import { PhoneNumberField } from '../components/auth/PhoneNumberField';
import { PasswordField } from '../components/auth/PasswordField';
import { InlineFormError } from '../components/feedback/InlineFormError';

export const SignupPhone: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { registerWithPassword } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Phone Validation
    if (!phone) {
      errors.phone = t('auth.validation.phoneRequired', 'Phone number is required.');
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      errors.phone = t('auth.validation.phoneInvalid', 'Enter a valid 10-digit Indian mobile number.');
    }

    // Password Validation
    if (!password) {
      errors.password = t('auth.validation.passwordRequired', 'Password is required.');
    } else {
      if (password.length < 8 || password.length > 72) {
        errors.password = t('auth.validation.passwordLength', 'Password must be between 8 and 72 characters.');
      } else {
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasDigit = /[0-9]/.test(password);
        if (!hasUpper || !hasLower || !hasDigit) {
          errors.password = t('auth.validation.passwordLength', 'Password must be between 8 and 72 characters.'); // Using general msg or custom complex rule
        }
      }
    }

    // Confirm Password Validation
    if (!confirmPassword) {
      errors.confirmPassword = t('auth.validation.confirmRequired', 'Confirm your password.');
    } else if (password !== confirmPassword) {
      errors.confirmPassword = t('auth.validation.passwordMismatch', 'Passwords do not match.');
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError(null);
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await registerWithPassword(phone, password, confirmPassword);
      markAuthenticatedPreviously();
      navigate(ROUTES.CREATE_PIN, { replace: true });
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error.code === 'PHONE_ALREADY_REGISTERED' || error.code === 'USER_ALREADY_EXISTS') {
        setFormError(t('auth.errors.phoneAlreadyRegistered', 'This mobile number already has an account. Log in instead.'));
      } else if (error.code === 'NETWORK_ERROR') {
        setFormError(t('auth.errors.network', 'Check your internet connection and try again.'));
      } else {
        setFormError(error.message || t('auth.errors.unexpected', 'Something went wrong. Please try again.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageShell
      title={t('auth.register.title', 'Create your account')}
      subtitle={t('auth.register.subtitle', 'Enter your mobile number and create a secure password.')}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4" noValidate>
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

        <PasswordField
          id="password"
          value={password}
          onChange={(val) => {
            setPassword(val);
            if (fieldErrors.password) {
              setFieldErrors((prev) => ({ ...prev, password: '' }));
            }
          }}
          label={t('auth.common.password', 'Password')}
          placeholder={t('auth.common.passwordPlaceholder', 'Enter password')}
          error={fieldErrors.password}
          autoComplete="new-password"
          disabled={isSubmitting}
        />

        <PasswordField
          id="confirmPassword"
          value={confirmPassword}
          onChange={(val) => {
            setConfirmPassword(val);
            if (fieldErrors.confirmPassword) {
              setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }
          }}
          label={t('auth.common.confirmPassword', 'Confirm password')}
          placeholder={t('auth.common.confirmPasswordPlaceholder', 'Confirm password')}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
          disabled={isSubmitting}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="w-full min-h-[48px] mt-2 py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-center transition-all cursor-pointer hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {isSubmitting ? t('auth.register.submitting', 'Creating Account…') : t('auth.register.submit', 'Create Account')}
        </button>

        <div className="text-center text-xs text-text-muted mt-2">
          {t('auth.register.footerText', 'Already have an account?')}{' '}
          <button
            type="button"
            onClick={() => navigate(ROUTES.LOGIN)}
            disabled={isSubmitting}
            className="font-semibold text-primary hover:underline cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t('auth.register.footerLink', 'Log in')}
          </button>
        </div>
      </form>
    </AuthPageShell>
  );
};
