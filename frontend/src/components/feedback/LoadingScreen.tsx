import React from 'react';
import { useTranslation } from 'react-i18next';

export const LoadingScreen: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div
      className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-background text-text"
      aria-live="polite"
    >
      {/* Branded loader */}
      <div className="flex flex-col items-center gap-5">
        {/* Pulsing logo mark */}
        <div className="relative flex h-14 w-14 items-center justify-center">
          {/* Outer ring pulse */}
          <span className="absolute inset-0 animate-ping rounded-full bg-secondary/25" />
          {/* Inner brand circle */}
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#111]">
            {/* Simple heart-like mark */}
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-secondary" aria-hidden="true">
              <path
                d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 14 21 12 21Z"
                fill="currentColor"
                opacity="0.9"
              />
            </svg>
          </span>
        </div>

        {/* Spinner */}
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />

        <p className="text-sm font-semibold text-text-muted">
          {t('common.loading', 'Loading…')}
        </p>
      </div>
    </div>
  );
};
