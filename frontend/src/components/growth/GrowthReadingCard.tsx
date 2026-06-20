import React from 'react';
import { useTranslation } from 'react-i18next';
import type { GrowthReading } from '../../features/growth/types';
import { formatMeasurement } from '../../features/growth/format';
import { AgeSummary } from './AgeSummary';

interface GrowthReadingCardProps {
  reading: GrowthReading;
}

export const GrowthReadingCard: React.FC<GrowthReadingCardProps> = ({ reading }) => {
  const { t } = useTranslation();
  const fallback = t('growth.current.notAvailable');

  return (
    <article className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text">{reading.readingDate ?? fallback}</h3>
          <p className="mt-1 text-xs text-text-muted">{t(`growth.source.${reading.source}`)}</p>
        </div>
        {reading.timePoint ? (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {t(`growth.timePoint.${reading.timePoint}`)}
          </span>
        ) : null}
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div>
          <dt className="text-xs text-text-muted">{t('growth.current.weight')}</dt>
          <dd className="font-semibold text-text">{formatMeasurement(reading.weightGrams, t('growth.units.grams'), fallback)}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-muted">{t('growth.current.length')}</dt>
          <dd className="font-semibold text-text">{formatMeasurement(reading.lengthCm, t('growth.units.cm'), fallback)}</dd>
        </div>
        <div>
          <dt className="text-xs text-text-muted">{t('growth.current.head')}</dt>
          <dd className="font-semibold text-text">{formatMeasurement(reading.headCircumferenceCm, t('growth.units.cm'), fallback)}</dd>
        </div>
      </dl>
      {reading.chronologicalAge || reading.correctedAge ? (
        <div className="mt-3">
          <AgeSummary chronologicalAge={reading.chronologicalAge} correctedAge={reading.correctedAge} />
        </div>
      ) : null}
    </article>
  );
};
