import React from 'react';
import { useTranslation } from 'react-i18next';
import type { GrowthLatestResponse } from '../../features/growth/types';
import { formatMeasurement } from '../../features/growth/format';
import { AgeSummary } from './AgeSummary';

interface CurrentMeasurementsCardProps {
  latest: GrowthLatestResponse;
}

export const CurrentMeasurementsCard: React.FC<CurrentMeasurementsCardProps> = ({ latest }) => {
  const { t } = useTranslation();
  const fallback = t('growth.current.notAvailable');

  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <h2 className="text-base font-semibold text-text">{t('growth.current.title')}</h2>
      <div className="mt-4 grid grid-cols-1 gap-3">
        <div className="rounded-xl border border-border bg-background p-3">
          <p className="text-xs font-medium text-text-muted">{t('growth.current.weight')}</p>
          <p className="mt-1 text-lg font-semibold text-text">{formatMeasurement(latest.weightGrams, t('growth.units.grams'), fallback)}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-background p-3">
            <p className="text-xs font-medium text-text-muted">{t('growth.current.length')}</p>
            <p className="mt-1 text-sm font-semibold text-text">{formatMeasurement(latest.lengthCm, t('growth.units.cm'), fallback)}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-3">
            <p className="text-xs font-medium text-text-muted">{t('growth.current.head')}</p>
            <p className="mt-1 text-sm font-semibold text-text">{formatMeasurement(latest.headCircumferenceCm, t('growth.units.cm'), fallback)}</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-background p-3">
          <p className="text-xs font-medium text-text-muted">{t('growth.current.readingDate')}</p>
          <p className="mt-1 text-sm font-semibold text-text">{latest.readingDate ?? fallback}</p>
          <p className="mt-1 text-xs text-text-muted">{t(`growth.source.${latest.source}`)}</p>
        </div>
        <AgeSummary chronologicalAge={latest.chronologicalAge} correctedAge={latest.correctedAge} />
        {latest.weightGainNote && (
          <div className={`mt-2 rounded-xl border p-3 text-xs font-semibold ${
            latest.weightGainNote.flag === 'REVIEW'
              ? 'bg-red-50 border-red-200 text-red-700'
              : latest.weightGainNote.flag === 'INFO'
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            {t(latest.weightGainNote.messageKey)}
          </div>
        )}
      </div>
    </section>
  );
};
