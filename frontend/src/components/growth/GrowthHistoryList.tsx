import React from 'react';
import { useTranslation } from 'react-i18next';
import type { GrowthReading } from '../../features/growth/types';
import { GrowthReadingCard } from './GrowthReadingCard';
import { GrowthEmptyState } from './GrowthEmptyState';

interface GrowthHistoryListProps {
  baseline: GrowthReading | null;
  readings: GrowthReading[];
}

export const GrowthHistoryList: React.FC<GrowthHistoryListProps> = ({ baseline, readings }) => {
  const { t } = useTranslation();

  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold text-text">{t('growth.history.title')}</h2>
      {readings.length === 0 ? <GrowthEmptyState /> : null}
      {readings.map((reading) => (
        <GrowthReadingCard key={`${reading.readingDate}-${reading.createdAt ?? 'manual'}`} reading={reading} />
      ))}
      {baseline ? (
        <div className="pt-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">{t('growth.history.baseline')}</p>
          <GrowthReadingCard reading={baseline} />
        </div>
      ) : null}
    </section>
  );
};
