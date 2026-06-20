import React from 'react';
import { useTranslation } from 'react-i18next';
import type { DashboardDailyMessage } from '../../features/dashboard/types';

interface DailyMessageCardProps {
  dailyMessage: DashboardDailyMessage;
}

export const DailyMessageCard: React.FC<DailyMessageCardProps> = ({ dailyMessage }) => {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold text-text">{t('dashboard.dailyMessage.title')}</h2>
      {dailyMessage.available && dailyMessage.text ? (
        <p className="mt-3 text-sm leading-6 text-text-muted">{dailyMessage.text}</p>
      ) : (
        <p className="mt-3 text-sm leading-6 text-text-muted">{t('dashboard.dailyMessage.empty')}</p>
      )}
    </section>
  );
};
