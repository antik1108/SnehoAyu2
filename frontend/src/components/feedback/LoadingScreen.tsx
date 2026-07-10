import React from 'react';
import { useTranslation } from 'react-i18next';

export const LoadingScreen: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div
      className="flex h-screen w-screen items-center justify-center bg-background text-text"
      aria-live="polite"
      style={{ minHeight: '100vh' }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="font-sans text-sm font-medium">{t('common.loading', 'Loading…')}</p>
      </div>
    </div>
  );
};
