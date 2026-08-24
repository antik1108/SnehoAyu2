import React from 'react';
import { useTranslation } from 'react-i18next';
import { Milk } from 'lucide-react';
import type { DashboardFeedingSummary } from '../../features/dashboard/types';

interface FeedingSummaryCardProps {
  feeding: DashboardFeedingSummary;
}

export const FeedingSummaryCard: React.FC<FeedingSummaryCardProps> = ({ feeding }) => {
  const { t } = useTranslation();

  return (
    <section className="interactive-card rounded-2xl border border-[#8d9e59] bg-[#94a45f] p-5 text-[#181715] md:col-span-5 lg:col-span-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-extrabold">{t('dashboard.feeding.title')}</h2>
        <Milk className="h-5 w-5" aria-hidden="true" />
      </div>
      {feeding.available && feeding.completedFeeds !== null ? (
        <p className="mt-3 text-sm font-bold text-[#181715]/72">
          {t('dashboard.feeding.progress', { completed: feeding.completedFeeds, min: feeding.targetFeedsMin, max: feeding.targetFeedsMax })}
        </p>
      ) : (
        <p className="mt-3 text-sm font-bold text-[#181715]/72">{t('dashboard.feeding.empty')}</p>
      )}
    </section>
  );
};
