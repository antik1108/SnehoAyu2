import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { markAuthenticatedPreviously } from '../lib/authStorage';
import { getSafeInternalRedirect } from '../lib/redirect';
import { ROUTES, getHomeRouteForRole } from '../routes/paths';
import { AuthPageShell } from '../components/auth/AuthPageShell';
import { PhoneNumberField } from '../components/auth/PhoneNumberField';
import { PasswordField } from '../components/auth/PasswordField';
import { InlineFormError } from '../components/feedback/InlineFormError';

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithPassword } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

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

    if (!password) {
      errors.password = t('auth.validation.passwordRequired', 'Password is required.');
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
      const loggedInUser = await loginWithPassword(phone, password);
      markAuthenticatedPreviously();

      // Retrieve post-login redirect destination
      const state = location.state as { from?: string | { pathname: string } } | null;
      const from = state?.from;
      const targetPath = getSafeInternalRedirect(from, getHomeRouteForRole(loggedInUser.role));

      navigate(targetPath, { replace: true });
    } catch (err: unknown) {
      const error = err as { code?: string; status?: number; message?: string };
      if (error.code === 'INVALID_CREDENTIALS' || error.status === 401) {
        setFormError(t('auth.errors.invalidCredentials', 'The mobile number or password is incorrect.'));
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
      title={t('auth.login.title', 'Welcome back')}
      subtitle={t('auth.login.subtitle', 'Log in using your mobile number and password.')}
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
          autoComplete="current-password"
          disabled={isSubmitting}
        />

        <div className="flex flex-col gap-3">
          <div className="text-left text-[11px] text-text-muted bg-background/50 p-2.5 rounded-lg border border-border">
            {t('auth.login.pinNotice', 'PIN login will be available after PIN setup.')}
          </div>

          <button
            type="button"
            onClick={() => navigate(ROUTES.PIN_LOGIN, { state: location.state })}
            disabled={isSubmitting}
            className="text-left text-xs font-semibold text-primary hover:underline cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary self-start"
          >
            {t('auth.pin.login.link', 'Log in with PIN')}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="w-full min-h-[48px] py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-center transition-all cursor-pointer hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {isSubmitting ? t('auth.login.submitting', 'Logging In…') : t('auth.login.submit', 'Log In')}
        </button>

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
