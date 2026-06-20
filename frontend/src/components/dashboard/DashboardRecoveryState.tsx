import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface DashboardRecoveryStateProps {
  message: string;
  actionLabel: string;
  to: string;
}

export const DashboardRecoveryState: React.FC<DashboardRecoveryStateProps> = ({ message, actionLabel, to }) => {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-border bg-surface p-4" aria-live="polite">
      <h2 className="text-sm font-semibold text-text">{t('dashboard.recovery.title')}</h2>
      <p className="mt-2 text-sm leading-6 text-text-muted">{message}</p>
      <Link
        to={to}
        className="mt-4 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {actionLabel}
      </Link>
    </section>
  );
};
