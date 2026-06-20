import React from 'react';
import { useTranslation } from 'react-i18next';
import type { DashboardFeedingSummary } from '../../features/dashboard/types';

interface FeedingSummaryCardProps {
  feeding: DashboardFeedingSummary;
}

export const FeedingSummaryCard: React.FC<FeedingSummaryCardProps> = ({ feeding }) => {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold text-text">{t('dashboard.feeding.title')}</h2>
      {feeding.available && feeding.completedFeeds !== null ? (
        <p className="mt-3 text-sm text-text-muted">
          {t('dashboard.feeding.progress', { completed: feeding.completedFeeds, min: feeding.targetFeedsMin, max: feeding.targetFeedsMax })}
        </p>
      ) : (
        <p className="mt-3 text-sm text-text-muted">{t('dashboard.feeding.empty')}</p>
      )}
    </section>
  );
};
