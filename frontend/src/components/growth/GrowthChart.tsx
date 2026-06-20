import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getGrowthChart } from '../../features/growth/api';
import type { GrowthChartResponse, GrowthMetric } from '../../features/growth/types';

const METRICS: { key: GrowthMetric; labelKey: string; fallback: string; unit: string }[] = [
  { key: 'weight', labelKey: 'growth.chart.weight', fallback: 'Weight', unit: 'kg' },
  { key: 'length', labelKey: 'growth.chart.length', fallback: 'Length', unit: 'cm' },
  { key: 'headCircumference', labelKey: 'growth.chart.headCircumference', fallback: 'Head Circ.', unit: 'cm' },
];

const WIDTH = 320;
const HEIGHT = 200;
const PAD = 28;

export const GrowthChart: React.FC = () => {
  const { t } = useTranslation();
  const [metric, setMetric] = useState<GrowthMetric>('weight');
  const [data, setData] = useState<GrowthChartResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getGrowthChart(metric)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [metric]);

  const activeMetric = METRICS.find((m) => m.key === metric)!;

  const renderChart = () => {
    if (!data || data.percentileCurve.length === 0) return null;

    const allValues = [
      ...data.percentileCurve.flatMap((p) => [p.p3, p.p97]),
      ...data.readings.map((r) => r.value),
    ];
    const minV = Math.min(...allValues);
    const maxV = Math.max(...allValues);
    const maxWeeks = data.percentileCurve[data.percentileCurve.length - 1].weeks;

    const x = (weeks: number) => PAD + (weeks / maxWeeks) * (WIDTH - PAD * 2);
    const y = (value: number) => HEIGHT - PAD - ((value - minV) / (maxV - minV || 1)) * (HEIGHT - PAD * 2);

    const pathFor = (key: 'p3' | 'p15' | 'p50' | 'p85' | 'p97') =>
      data.percentileCurve.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.weeks)} ${y(p[key])}`).join(' ');

    return (
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
        <path d={pathFor('p3')} fill="none" stroke="#fecaca" strokeWidth="1.5" />
        <path d={pathFor('p15')} fill="none" stroke="#fde68a" strokeWidth="1.5" />
        <path d={pathFor('p50')} fill="none" stroke="#0f766e" strokeWidth="2" />
        <path d={pathFor('p85')} fill="none" stroke="#fde68a" strokeWidth="1.5" />
        <path d={pathFor('p97')} fill="none" stroke="#fecaca" strokeWidth="1.5" />

        {data.readings.map((r, i) => (
          <circle
            key={i}
            cx={x(r.correctedAgeWeeks)}
            cy={y(r.value)}
            r="3.5"
            fill={r.zScore !== undefined && r.zScore < -2 ? '#dc2626' : '#0f766e'}
            stroke="white"
            strokeWidth="1"
          />
        ))}
      </svg>
    );
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex gap-2 mb-3">
        {METRICS.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMetric(m.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              metric === m.key ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-text-muted'
            }`}
          >
            {t(m.labelKey, m.fallback)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-sm text-text-muted">
          {t('common.loading', 'Loading…')}
        </div>
      ) : (
        <>
          {renderChart()}
          <p className="mt-2 text-xs text-text-muted">
            {t('growth.chart.unit', 'Unit')}: {activeMetric.unit} · {t('growth.chart.axisLabel', 'Corrected age (weeks)')}
          </p>
          {data?.alert && (
            <div className="mt-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs font-medium text-red-700">
              {t(
                'growth.chart.alert',
                'A recent reading falls below -2 SD. Please discuss with your healthcare provider.'
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
