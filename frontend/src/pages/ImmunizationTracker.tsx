import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AppShell } from '../components/layout/AppShell';
import { getImmunizationSchedule, markVaccineComplete } from '../features/immunization/api';
import type { ImmunizationScheduleResponse, VaccineEntry } from '../features/immunization/types';
import { normalizeApiError } from '../lib/apiError';
import { InlineFormError } from '../components/feedback/InlineFormError';

export const ImmunizationTracker: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<ImmunizationScheduleResponse | null>(null);
  const [tab, setTab] = useState<'pending' | 'completed'>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<VaccineEntry | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getImmunizationSchedule();
      setData(res);
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleMarkDone = async (vaccineId: string) => {
    try {
      await markVaccineComplete(vaccineId);
      await load();
    } catch (err) {
      setError(normalizeApiError(err).message);
    }
  };

  const list = data?.vaccines.filter((v) => v.status === tab) ?? [];

  return (
    <AppShell title={t('immunization.title')} subtitle={t('immunization.subtitle')}>
      <div className="space-y-4">
        {error && <InlineFormError message={error} />}

        {loading ? (
          <div className="py-12 text-center text-sm text-text-muted">{t('tdsc.loading')}</div>
        ) : (
          <>
            <div className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center justify-between text-sm font-semibold text-text">
                <span>{data?.completedCount ?? 0} {t('immunization.completedOf')} {data?.totalCount ?? 0} {t('immunization.completedLabel')}</span>
                <span>{data?.progressPercent ?? 0}%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${data?.progressPercent ?? 0}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTab('pending')}
                className={`flex-1 min-h-10 rounded-lg text-sm font-semibold ${tab === 'pending' ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-text-muted'}`}
              >
                {t('immunization.pending')}
              </button>
              <button
                type="button"
                onClick={() => setTab('completed')}
                className={`flex-1 min-h-10 rounded-lg text-sm font-semibold ${tab === 'completed' ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-text-muted'}`}
              >
                {t('immunization.completed')}
              </button>
            </div>

            <div className="space-y-2">
              {list.length === 0 ? (
                <p className="py-8 text-center text-sm text-text-muted">{t('immunization.noVaccines')}</p>
              ) : (
                list.map((v) => (
                  <div key={v.vaccineId} className="rounded-xl border border-border bg-surface p-4">
                    <button type="button" className="w-full text-left" onClick={() => setDetail(v)}>
                      <p className="text-sm font-semibold text-text">{v.name}</p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {v.status === 'completed' ? `${t('immunization.given')} ${v.completedDate}` : `${t('immunization.due')} ${v.dueDate}`}
                      </p>
                    </button>
                    {v.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => handleMarkDone(v.vaccineId)}
                        className="mt-3 w-full min-h-10 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary/5"
                      >
                        {t('immunization.markDone')}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {detail && (
          <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={() => setDetail(null)}>
            <div
              className="w-full rounded-t-2xl bg-surface p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-bold text-text">{detail.name}</h3>
              <p className="mt-2 text-sm text-text-muted">{detail.description}</p>
              <p className="mt-3 text-xs font-semibold text-text">{t('immunization.sideEffects')}</p>
              <p className="text-sm text-text-muted">{detail.sideEffects}</p>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="mt-4 w-full min-h-12 rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                {t('immunization.close')}
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};
