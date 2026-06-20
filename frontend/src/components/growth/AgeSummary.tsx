import React from 'react';
import { useTranslation } from 'react-i18next';
import type { GrowthAge } from '../../features/growth/types';
import { formatGrowthAge } from '../../features/growth/format';

interface AgeSummaryProps {
  chronologicalAge?: GrowthAge;
  correctedAge?: GrowthAge;
}

export const AgeSummary: React.FC<AgeSummaryProps> = ({ chronologicalAge, correctedAge }) => {
  const { t } = useTranslation();
  const fallback = t('growth.current.notAvailable');

  return (
    <div className="grid grid-cols-1 gap-2">
      <div className="rounded-xl border border-border bg-background p-3">
        <p className="text-xs font-medium text-text-muted">{t('growth.age.chronological')}</p>
        <p className="mt-1 text-sm font-semibold text-text">
          {formatGrowthAge(chronologicalAge, t('growth.units.days'), t('growth.units.weeks'), fallback)}
        </p>
      </div>
      <div className="rounded-xl border border-border bg-background p-3">
        <p className="text-xs font-medium text-text-muted">{t('growth.age.corrected')}</p>
        <p className="mt-1 text-sm font-semibold text-text">
          {formatGrowthAge(correctedAge, t('growth.units.days'), t('growth.units.weeks'), fallback)}
        </p>
      </div>
    </div>
  );
};
