import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OnboardingPageShell } from '../components/onboarding/OnboardingPageShell';
import { getParticipantCode } from '../features/onboarding/api';
import { ROUTES } from '../routes/paths';
import { InlineFormError } from '../components/feedback/InlineFormError';

interface RouterState {
  participantCode?: string;
  studyGroup?: 'study' | 'control';
  hospitalName?: string;
}

export const SignupComplete: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as RouterState | null;

  const [participantCode, setParticipantCode] = useState(state?.participantCode || '');
  const [studyGroup, setStudyGroup] = useState<'study' | 'control' | ''>(state?.studyGroup || '');
  const [hospitalName, setHospitalName] = useState(state?.hospitalName || '');

  const [loading, setLoading] = useState(!state?.participantCode);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    // If not passed in router state, fetch from API
    if (!state?.participantCode) {
      const fetchDetails = async () => {
        try {
          const res = await getParticipantCode();
          if (res.success && res.data) {
            setParticipantCode(res.data.participantCode);
            setStudyGroup(res.data.studyGroup);
            setHospitalName(res.data.hospital.name);
          } else {
            throw new Error(t('onboarding.errors.studyGroupRequired', 'The researcher must assign the study group before onboarding can be completed.'));
          }
        } catch (err: unknown) {
          const apiErr = err as { message?: string };
          setError(apiErr.message || t('auth.errors.unexpected', 'Something went wrong. Please try again.'));
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [state, t, retryTrigger]);

  const handleGoHome = () => {
    navigate(ROUTES.DASHBOARD, { replace: true });
  };

  return (
    <OnboardingPageShell
      title={t('onboarding.complete.title', 'You’re all set!')}
      subtitle={t('onboarding.complete.subtitle', 'Your account and study enrolment are ready.')}
      currentStep={4}
      showBackButton={false}
    >
      <div className="mt-2 flex flex-col gap-5 text-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-sm text-text-muted font-medium">{t('onboarding.common.loading', 'Loading…')}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col gap-4 py-4">
            <InlineFormError message={error} />
            <button
              type="button"
              onClick={() => {
                setError(null);
                setLoading(true);
                setRetryTrigger((prev) => prev + 1);
              }}
              className="w-full min-h-[48px] py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-center cursor-pointer transition-all hover:bg-teal-800"
            >
              {t('onboarding.common.retry', 'Retry')}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Visual Success Checkmark badge */}
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-inner">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Participant Code Panel */}
            <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 flex flex-col items-center">
              <span className="text-xs text-primary font-bold uppercase tracking-wider">
                {t('onboarding.complete.participantCode', 'Participant Code')}
              </span>
              <span className="mt-1 font-technical text-2xl font-black text-text tracking-widest selection:bg-primary/20">
                {participantCode}
              </span>
            </div>

            {/* Enrollment Summary Card */}
            <div className="rounded-xl border border-border bg-slate-50/50 p-4 text-left flex flex-col gap-3">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-text-muted">
                  {t('onboarding.complete.hospitalName', 'Hospital Name')}
                </span>
                <span className="text-sm font-bold text-text mt-0.5">{hospitalName}</span>
              </div>
              <div className="h-px bg-border/60" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-text-muted">
                  {t('onboarding.complete.studyGroup', 'Study Group')}
                </span>
                <span className="text-sm font-bold text-text mt-0.5">
                  {studyGroup === 'study'
                    ? t('onboarding.complete.groupLabels.study', 'Study Group')
                    : t('onboarding.complete.groupLabels.control', 'Control Group')}
                </span>
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed px-2">
              {t('onboarding.complete.infoMessage', 'SnehoAyu will support you and your baby throughout the next six months.')}
            </p>

            {/* Next Steps Button */}
            <button
              type="button"
              onClick={handleGoHome}
              className="w-full min-h-[48px] mt-2 py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-center transition-all cursor-pointer hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary shadow-sm"
            >
              {t('onboarding.complete.goHome', 'Go to Home')}
            </button>
          </div>
        )}
      </div>
    </OnboardingPageShell>
  );
};
