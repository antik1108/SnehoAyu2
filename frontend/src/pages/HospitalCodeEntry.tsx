import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OnboardingPageShell } from '../components/onboarding/OnboardingPageShell';
import { linkHospital, getParticipantCode, completeOnboarding } from '../features/onboarding/api';
import { HospitalInfo, ParticipantCodeAllocation } from '../features/onboarding/types';
import { ROUTES } from '../routes/paths';
import { InlineFormError } from '../components/feedback/InlineFormError';
import { normalizeApiError } from '../lib/apiError';

type StepStatus = 'idle' | 'verifying' | 'verified' | 'allocating' | 'completing' | 'error';

export const HospitalCodeEntry: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [status, setStatus] = useState<StepStatus>('idle');
  const [verifiedHospital, setVerifiedHospital] = useState<HospitalInfo | null>(null);
  const [allocationInfo, setAllocationInfo] = useState<ParticipantCodeAllocation | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCode(val);
    if (validationError) setValidationError(null);
    if (error) setError(null);
  };

  const validateCode = (trimmedCode: string): boolean => {
    if (!trimmedCode) {
      setValidationError(t('onboarding.validation.hospitalCodeRequired', 'Hospital code is required.'));
      inputRef.current?.focus();
      return false;
    }
    if (!/^[a-zA-Z0-9]{2,10}$/.test(trimmedCode)) {
      setValidationError(t('onboarding.validation.hospitalCodeFormat', 'Hospital code must contain only letters and numbers, between 2 and 10 characters.'));
      inputRef.current?.focus();
      return false;
    }
    return true;
  };

  const handleVerifyAndOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'idle' && status !== 'error') return;

    setError(null);
    setValidationError(null);

    const formattedCode = code.trim().toUpperCase();
    if (!validateCode(formattedCode)) return;

    setStatus('verifying');
    let hospital: HospitalInfo | null = verifiedHospital;

    try {
      // 1. Link Hospital
      if (!hospital) {
        const verifyRes = await linkHospital(formattedCode);
        if (verifyRes.success && verifyRes.data) {
          hospital = verifyRes.data;
          setVerifiedHospital(hospital);
        } else {
          throw new Error(t('onboarding.errors.invalidHospitalCode', 'The hospital code is invalid.'));
        }
      }

      // 2. Allocate Participant Code
      setStatus('allocating');
      const allocRes = await getParticipantCode();
      if (!allocRes.success || !allocRes.data) {
        throw new Error(t('onboarding.errors.studyGroupRequired', 'The researcher must assign the study group before onboarding can be completed.'));
      }
      const allocation = allocRes.data;
      setAllocationInfo(allocation);

      // 3. Complete Onboarding
      setStatus('completing');
      const completeRes = await completeOnboarding();
      if (!completeRes.success) {
        throw new Error(completeRes.message || t('auth.errors.unexpected', 'Something went wrong. Please try again.'));
      }

      // On onboarding completion, navigate to complete screen passing details in router state
      navigate(ROUTES.SIGNUP_COMPLETE, {
        replace: true,
        state: {
          participantCode: allocation.participantCode,
          studyGroup: allocation.studyGroup,
          hospitalName: hospital.name,
        },
      });
    } catch (err: unknown) {
      setStatus('error');
      const apiErr = normalizeApiError(err);
      if (apiErr.code === 'INVALID_HOSPITAL_CODE' || apiErr.code === 'HOSPITAL_NOT_FOUND' || apiErr.code === 'HOSPITAL_CODE_INVALID') {
        setError(t('onboarding.errors.invalidHospitalCode', 'The hospital code is invalid.'));
      } else if (apiErr.code === 'HOSPITAL_ENROLLMENT_CLOSED' || apiErr.code === 'ENROLLMENT_CLOSED') {
        setError(t('onboarding.errors.hospitalEnrollmentClosed', 'Enrolment at this hospital is currently closed.'));
      } else if (apiErr.code === 'STUDY_GROUP_REQUIRED') {
        setError(t('onboarding.errors.studyGroupRequired', 'The researcher must assign the study group before onboarding can be completed.'));
      } else if (apiErr.code === 'HOSPITAL_LINK_LOCKED') {
        setError(t('onboarding.errors.hospitalLinkLocked', 'The hospital cannot be changed after the participant code has been assigned.'));
      } else {
        setError(apiErr.message || t('auth.errors.unexpected', 'Something went wrong. Please try again.'));
      }
    }
  };

  const handleRetryOnboard = async () => {
    if (!verifiedHospital) {
      setStatus('idle');
      return;
    }
    setError(null);
    setStatus('allocating');

    try {
      let allocation = allocationInfo;
      if (!allocation) {
        const allocRes = await getParticipantCode();
        if (!allocRes.success || !allocRes.data) {
          throw new Error(t('onboarding.errors.studyGroupRequired', 'The researcher must assign the study group before onboarding can be completed.'));
        }
        allocation = allocRes.data;
        setAllocationInfo(allocation);
      }

      setStatus('completing');
      const completeRes = await completeOnboarding();
      if (!completeRes.success) {
        throw new Error(completeRes.message || t('auth.errors.unexpected', 'Something went wrong. Please try again.'));
      }

      navigate(ROUTES.SIGNUP_COMPLETE, {
        replace: true,
        state: {
          participantCode: allocation.participantCode,
          studyGroup: allocation.studyGroup,
          hospitalName: verifiedHospital.name,
        },
      });
    } catch (err: unknown) {
      setStatus('error');
      const apiErr = normalizeApiError(err);
      if (apiErr.code === 'STUDY_GROUP_REQUIRED') {
        setError(t('onboarding.errors.studyGroupRequired', 'The researcher must assign the study group before onboarding can be completed.'));
      } else {
        setError(apiErr.message || t('auth.errors.unexpected', 'Something went wrong. Please try again.'));
      }
    }
  };

  const isLoading =
    status === 'verifying' || status === 'allocating' || status === 'completing';

  return (
    <OnboardingPageShell
      title={t('onboarding.hospital.title', 'Enter Hospital Code')}
      subtitle={t('onboarding.hospital.subtitle', 'This code is provided by the study coordinator.')}
      currentStep={3}
      onBack={() => navigate(ROUTES.BABY_PROFILE)}
      showBackButton={!isLoading && !verifiedHospital}
    >
      <div className="mt-2 flex flex-col gap-4">
        {error && <InlineFormError message={error} />}

        {verifiedHospital ? (
          /* Verified Hospital View & Progress */
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-5 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 mb-3">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-sans text-sm font-bold text-teal-900">
                {t('onboarding.hospital.verifiedHeading', 'Hospital Verified')}
              </h3>
              <p className="mt-2 text-base font-semibold text-text">{verifiedHospital.name}</p>
              <p className="text-xs text-text-muted mt-0.5">
                {t('onboarding.hospital.codeLabel', 'Hospital Code')}: {verifiedHospital.code}
              </p>
            </div>

            {/* Progress/Error States */}
            {status === 'allocating' && (
              <div className="flex items-center justify-center gap-3 p-4 rounded-xl border border-border bg-slate-50 text-sm text-text-muted font-medium">
                <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>{t('onboarding.hospital.allocationProgress', 'Generating participant code…')}</span>
              </div>
            )}

            {status === 'completing' && (
              <div className="flex items-center justify-center gap-3 p-4 rounded-xl border border-border bg-slate-50 text-sm text-text-muted font-medium">
                <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>{t('onboarding.hospital.completionProgress', 'Completing onboarding…')}</span>
              </div>
            )}

            {status === 'error' && (
              <button
                type="button"
                onClick={handleRetryOnboard}
                className="btn-primary-care w-full text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t('onboarding.common.retry', 'Retry')}
              </button>
            )}
          </div>
        ) : (
          /* Initial Code Verification Form */
          <form onSubmit={handleVerifyAndOnboard} noValidate className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="hospitalCode" className="font-sans text-xs font-semibold text-text">
                {t('onboarding.hospital.inputLabel')} *
              </label>
              <input
                id="hospitalCode"
                ref={inputRef}
                type="text"
                autoComplete="off"
                autoCapitalize="characters"
                value={code}
                onChange={handleCodeChange}
                placeholder={t('onboarding.hospital.placeholder', 'e.g. BNK')}
                disabled={isLoading}
                aria-invalid={validationError ? 'true' : 'false'}
                className={`w-full min-h-[48px] px-4 rounded-xl border font-technical text-sm tracking-wider uppercase transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 ${
                  validationError ? 'border-error bg-error/5 text-error focus-visible:outline-error' : 'border-border bg-surface text-text'
                }`}
              />
              {validationError && (
                <span className="font-sans text-xs text-error font-medium" role="alert">
                  {validationError}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="btn-primary-care mt-2 w-full text-center disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {isLoading ? t('onboarding.hospital.submitting', 'Verifying…') : t('onboarding.hospital.submit', 'Verify Hospital')}
            </button>
          </form>
        )}
      </div>
    </OnboardingPageShell>
  );
};
