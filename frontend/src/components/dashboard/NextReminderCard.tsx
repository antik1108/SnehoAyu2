import React from 'react';
import { useTranslation } from 'react-i18next';
import type { DashboardReminderSummary } from '../../features/dashboard/types';
import { formatDashboardDate } from '../../features/dashboard/date';

interface NextReminderCardProps {
  nextReminder: DashboardReminderSummary;
}

export const NextReminderCard: React.FC<NextReminderCardProps> = ({ nextReminder }) => {
  const { t } = useTranslation();
  const hasReminder = nextReminder.type !== 'none' && nextReminder.date;

  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold text-text">{t('dashboard.reminder.title')}</h2>
      {hasReminder ? (
        <div className="mt-3 space-y-1 text-sm text-text-muted">
          <p className="font-semibold text-text">{nextReminder.title}</p>
          <p>{formatDashboardDate(nextReminder.date!)}</p>
          <p>{t('dashboard.reminder.daysRemaining', { count: nextReminder.daysRemaining ?? 0 })}</p>
          <p>{nextReminder.status}</p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-text-muted">{t('dashboard.reminder.empty')}</p>
      )}
    </section>
  );
};
