import React from 'react';
import { useTranslation } from 'react-i18next';

interface DashboardErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const DashboardErrorState: React.FC<DashboardErrorStateProps> = ({ message, onRetry }) => {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-border bg-surface p-4" role="alert">
      <h2 className="text-sm font-semibold text-text">{t('dashboard.errors.title')}</h2>
      <p className="mt-2 text-sm leading-6 text-text-muted">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 min-h-12 rounded-xl border border-border bg-background px-4 text-sm font-medium text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t('dashboard.errors.retry')}
      </button>
    </section>
  );
};
