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

const HERO_IMAGE = 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80';

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
    <div className="care-canvas flex min-h-screen w-full items-center justify-center p-4 lg:p-8" style={{ minHeight: '100dvh' }}>
      <main className="care-card relative grid w-full max-w-5xl overflow-hidden rounded-[28px] lg:min-h-[720px] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden min-h-full overflow-hidden lg:block">
          <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" loading="lazy" />
          <div className="care-photo-overlay absolute inset-0" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <p className="text-sm font-extrabold uppercase text-white/72">SnehoAyu</p>
            <h1 className="mt-2 max-w-md text-5xl font-extrabold leading-none">A calm setup for safer care.</h1>
          </div>
        </div>

        <div className="relative h-32 w-full overflow-hidden lg:hidden">
          <img
            src={HERO_IMAGE}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="care-photo-overlay absolute inset-0" />

          {showBackButton && (
            <button
              type="button"
              onClick={handleBack}
              aria-label="Go back"
              className="absolute left-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-text backdrop-blur hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div className="absolute bottom-3 left-6 right-6">
            <p className="font-sans text-base font-bold text-white drop-shadow" lang="bn">স্নেহআয়ু</p>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
          <div className="mb-4">
            <p className="text-xs font-extrabold uppercase text-secondary">Setup</p>
            <h2 className="care-shell-heading mt-2 text-3xl lg:text-4xl">{title}</h2>
            {subtitle && <p className="mt-2 max-w-md text-sm font-medium leading-relaxed text-text-muted">{subtitle}</p>}
          </div>

          <OnboardingStepIndicator currentStep={currentStep} />

          {children}
        </div>
      </main>
    </div>
  );
};
