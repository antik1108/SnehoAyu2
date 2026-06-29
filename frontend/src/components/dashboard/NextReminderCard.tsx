import React from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarClock } from 'lucide-react';
import type { DashboardReminderSummary } from '../../features/dashboard/types';
import { formatDashboardDate } from '../../features/dashboard/date';

interface NextReminderCardProps {
  nextReminder: DashboardReminderSummary;
}

export const NextReminderCard: React.FC<NextReminderCardProps> = ({ nextReminder }) => {
  const { t } = useTranslation();
  const hasReminder = nextReminder.type !== 'none' && nextReminder.date;

  return (
    <section className="interactive-card rounded-2xl border border-border bg-surface p-5 lg:col-span-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-extrabold text-text">{t('dashboard.reminder.title')}</h2>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/20 text-primary">
          <CalendarClock className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      {hasReminder ? (
        <div className="mt-4 space-y-1 text-sm text-text-muted">
          <p className="font-extrabold text-text">{nextReminder.title}</p>
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
