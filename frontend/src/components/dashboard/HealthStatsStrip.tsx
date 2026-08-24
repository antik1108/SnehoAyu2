import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, Scale, Thermometer } from 'lucide-react';
import type { DashboardHealthStats } from '../../features/dashboard/types';

interface HealthStatsStripProps {
  healthStats: DashboardHealthStats;
}

function formatTemperature(value: number | null, fallback: string): string {
  return value === null ? fallback : `${value.toFixed(1)} °C`;
}

function formatWeight(value: number | null, fallback: string): string {
  return value === null ? fallback : `${value} g`;
}

function formatSpo2(value: number | null, fallback: string): string {
  return value === null ? fallback : `${value}%`;
}

export const HealthStatsStrip: React.FC<HealthStatsStripProps> = ({ healthStats }) => {
  const { t } = useTranslation();

  const items = [
    {
      label: t('dashboard.healthStats.temperature'),
      value: formatTemperature(healthStats.lastTemperatureC, t('dashboard.common.notLoggedYet')),
      Icon: Thermometer,
    },
    {
      label: t('dashboard.healthStats.weight'),
      value: formatWeight(healthStats.lastWeightGrams, t('dashboard.common.notLoggedYet')),
      Icon: Scale,
    },
    {
      label: t('dashboard.healthStats.spO2'),
      value: formatSpo2(healthStats.lastSpO2Percent, t('dashboard.common.notLoggedYet')),
      Icon: Activity,
    },
  ];

  return (
    <section className="interactive-card rounded-2xl border border-border bg-surface p-5 md:col-span-7 lg:col-span-7">
      <h2 className="text-sm font-extrabold text-text">{t('dashboard.healthStats.title')}</h2>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-background p-3">
            <item.Icon className="mb-3 h-4 w-4 text-secondary" aria-hidden="true" />
            <p className="text-xs font-bold text-text-muted">{item.label}</p>
            <p className="mt-2 text-xs sm:text-sm font-extrabold text-text">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
