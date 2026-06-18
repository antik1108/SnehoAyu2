import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingStepIndicator } from './OnboardingStepIndicator';

interface OnboardingPageShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  currentStep: number;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const OnboardingPageShell: React.FC<OnboardingPageShellProps> = ({
  children,
  title,
  subtitle,
  currentStep,
  showBackButton = true,
  onBack,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-background p-4"
      style={{ minHeight: '100dvh' }}
    >
      <main className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
        {/* Back Button */}
        {showBackButton && (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Branding header */}
        <div className={`flex flex-col items-center text-center ${showBackButton ? 'mt-8' : ''} mb-4`}>
          <h1 className="font-sans text-2xl font-bold text-primary mb-1" lang="bn">
            স্নেহআয়ু
          </h1>
          <div className="h-px w-12 bg-border my-2" />
          <h2 className="font-sans text-xl font-semibold text-text">{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-text-muted">{subtitle}</p>}
        </div>

        {/* Step Indicator */}
        <OnboardingStepIndicator currentStep={currentStep} />

        {/* Form/Page Content */}
        {children}
      </main>
    </div>
  );
};
