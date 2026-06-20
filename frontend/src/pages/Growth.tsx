import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppShell } from '../components/layout/AppShell';
import { CurrentMeasurementsCard } from '../components/growth/CurrentMeasurementsCard';
import { GrowthHistoryList } from '../components/growth/GrowthHistoryList';
import { getGrowthHistory, getLatestGrowthReading } from '../features/growth/api';
import type { GrowthHistoryResponse, GrowthLatestResponse } from '../features/growth/types';
import { normalizeApiError, type AppApiError } from '../lib/apiError';
import { ROUTES } from '../routes/paths';

export const Growth: React.FC = () => {
  const { t } = useTranslation();
  const [latest, setLatest] = useState<GrowthLatestResponse | null>(null);
  const [history, setHistory] = useState<GrowthHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppApiError | null>(null);

  const loadGrowth = async () => {
    setLoading(true);
    setError(null);
    try {
      const [nextLatest, nextHistory] = await Promise.all([
        getLatestGrowthReading(),
        getGrowthHistory(30),
      ]);
      setLatest(nextLatest);
      setHistory(nextHistory);
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadGrowth();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (loading) {
    return (
      <AppShell title={t('growth.title')} subtitle={t('growth.subtitle')}>
        <div role="status" className="rounded-2xl border border-border bg-surface p-4 text-sm text-text-muted">
          {t('growth.loading')}
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title={t('growth.title')} subtitle={t('growth.subtitle')}>
        <section role="alert" className="rounded-2xl border border-error/30 bg-error/5 p-4">
          <h2 className="text-base font-semibold text-error">{t('growth.errors.load')}</h2>
          <p className="mt-2 text-sm leading-6 text-text-muted">{error.message}</p>
          <button
            type="button"
            onClick={loadGrowth}
            className="mt-4 min-h-12 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            {t('growth.errors.retry')}
          </button>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell title={t('growth.title')} subtitle={t('growth.subtitle')}>
      <div className="space-y-4">
        {latest ? <CurrentMeasurementsCard latest={latest} /> : null}
        <Link
          to={ROUTES.ADD_GROWTH_READING}
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          {t('growth.actions.addNew')}
        </Link>
        {history ? <GrowthHistoryList baseline={history.baseline} readings={history.readings} /> : null}
      </div>
    </AppShell>
  );
};
