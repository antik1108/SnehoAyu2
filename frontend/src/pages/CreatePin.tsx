import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { ROUTES, getHomeRouteForRole } from '../routes/paths';
import { AuthPageShell } from '../components/auth/AuthPageShell';
import { PinDots } from '../components/auth/PinDots';
import { NumericKeypad } from '../components/auth/NumericKeypad';

type PinSetupStep = 'create' | 'confirm';

export const CreatePin: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createPin, user } = useAuth();

  const [step, setStep] = useState<PinSetupStep>('create');
  const [firstPin, setFirstPin] = useState('');
  const [confirmationPin, setConfirmationPin] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activePin = step === 'create' ? firstPin : confirmationPin;

  const validatePinStrength = (pin: string): string | null => {
    const repeated = /^(\d)\1{3}$/.test(pin);
    const ascending = '0123456789'.includes(pin);
    const descending = '9876543210'.includes(pin);

    if (repeated || ascending || descending) {
      return t('auth.pin.validation.weakPin', 'This PIN is easy to guess.');
    }

    if (user?.phone) {
      const barePhone = user.phone.replace(/^\+91/, '');
      if (barePhone.includes(pin)) {
        return t('auth.pin.validation.weakPin', 'This PIN is easy to guess.');
      }
    }

    return null;
  };

  const handleDigit = (digit: string) => {
    if (isSubmitting) return;
    setFormError(null);

    const updated = activePin + digit;
    if (updated.length > 4) return;

    if (step === 'create') {
      setFirstPin(updated);
      if (updated.length === 4) {
        // Run strength validation immediately
        const strengthError = validatePinStrength(updated);
        if (strengthError) {
          setFormError(strengthError);
          setFirstPin('');
          return;
        }
        // Proceed to confirmation
        setTimeout(() => {
          setStep('confirm');
        }, 300);
      }
    } else {
      setConfirmationPin(updated);
      if (updated.length === 4) {
        if (firstPin !== updated) {
          // Mismatch
          setTimeout(() => {
            setFormError(t('auth.pin.validation.mismatch', 'The PINs do not match. Please try again.'));
            setFirstPin('');
            setConfirmationPin('');
            setStep('create');
          }, 300);
        } else {
          // Success setup submission
          submitPin(firstPin);
        }
      }
    }
  };

  const handleBackspace = () => {
    if (isSubmitting) return;
    setFormError(null);

    if (step === 'create') {
      setFirstPin((prev) => prev.slice(0, -1));
    } else {
      setConfirmationPin((prev) => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (isSubmitting) return;
    setFormError(null);

    if (step === 'create') {
      setFirstPin('');
    } else {
      setConfirmationPin('');
    }
  };

  const submitPin = async (pinValue: string) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      await createPin(pinValue);
      const targetPath = user?.role === 'mother' ? ROUTES.MOTHER_PROFILE : getHomeRouteForRole(user?.role);
      navigate(targetPath, { replace: true });
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      // Reset input state
      setFirstPin('');
      setConfirmationPin('');
      setStep('create');

      if (error.code === 'WEAK_PIN') {
        setFormError(t('auth.pin.validation.weakPin', 'This PIN is easy to guess.'));
      } else if (error.code === 'NETWORK_ERROR') {
        setFormError(t('auth.errors.network', 'Check your internet connection and try again.'));
      } else {
        setFormError(error.message || t('auth.errors.unexpected', 'Something went wrong. Please try again.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Physical keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitting) return;

      // Only listen if no other text input is focused (should be none on this page)
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePin, step, isSubmitting]);

  // Clear PIN state on unmount
  useEffect(() => {
    return () => {
      setFirstPin('');
      setConfirmationPin('');
    };
  }, []);

  const getDotsLabel = () => {
    const entered = activePin.length;
    return t('auth.pin.dotsLabel', '{{count}} of 4 digits entered', { count: entered });
  };

  return (
    <AuthPageShell
      title={
        step === 'create'
          ? t('auth.pin.create.title', 'Create a 4-digit PIN')
          : t('auth.pin.create.promptConfirm', 'Confirm your PIN')
      }
      subtitle={
        step === 'create'
          ? t('auth.pin.create.subtitle', 'Use this PIN for faster login.')
          : t('auth.pin.create.promptConfirmSubtitle', 'Enter the same PIN again.')
      }
    >
      <div className="flex flex-col items-center gap-6 mt-6">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
          {step === 'create'
            ? t('auth.pin.create.step1', 'Step 1 of 2')
            : t('auth.pin.create.step2', 'Step 2 of 2')}
        </span>

        {formError && (
          <div className="w-full text-center" role="alert">
            <span className="text-xs text-error font-medium">{formError}</span>
          </div>
        )}

        <PinDots
          filledCount={activePin.length}
          label={getDotsLabel()}
          hasError={!!formError}
        />

        <div className="w-full mt-4">
          <NumericKeypad
            onDigit={handleDigit}
            onBackspace={handleBackspace}
            onClear={handleClear}
            disabled={isSubmitting}
            maxLengthReached={activePin.length === 4}
          />
        </div>

        {isSubmitting && (
          <div className="flex items-center gap-2 mt-2" aria-busy="true">
            <span className="text-xs text-text-muted">
              {t('auth.pin.create.submitting', 'Setting up your PIN…')}
            </span>
          </div>
        )}
      </div>
    </AuthPageShell>
  );
};
