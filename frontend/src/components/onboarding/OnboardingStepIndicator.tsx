import React from 'react';
import { useTranslation } from 'react-i18next';

interface OnboardingStepIndicatorProps {
  currentStep: number; // 1 to 4
}

export const OnboardingStepIndicator: React.FC<OnboardingStepIndicatorProps> = ({ currentStep }) => {
  const { t } = useTranslation();

  const steps = [
    { num: 1, labelKey: 'onboarding.steps.mother', fallback: 'Mother’s Details' },
    { num: 2, labelKey: 'onboarding.steps.baby', fallback: 'Baby’s Details' },
    { num: 3, labelKey: 'onboarding.steps.hospital', fallback: 'Hospital Code' },
    { num: 4, labelKey: 'onboarding.steps.complete', fallback: 'Signup Complete' },
  ];

  const currentStepInfo = steps.find((s) => s.num === currentStep) || steps[0];
  const translatedLabel = t(currentStepInfo.labelKey, currentStepInfo.fallback);

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center text-xs text-text-muted mb-2 font-medium">
        <span>
          {t('onboarding.steps.indicator', {
            step: currentStep,
            label: translatedLabel,
          })}
        </span>
        <span className="font-semibold text-primary">{Math.round((currentStep / 4) * 100)}%</span>
      </div>
      <div className="flex h-1.5 w-full gap-1 rounded-full bg-slate-100 overflow-hidden">
        {steps.map((step) => (
          <div
            key={step.num}
            className={`h-full flex-1 transition-all duration-300 ${
              step.num <= currentStep ? 'bg-primary' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
