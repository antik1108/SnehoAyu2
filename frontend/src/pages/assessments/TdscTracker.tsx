import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { getTdscItems, submitTdscAssessment } from '../../features/tdsc/api';
import type { TdscItem, TdscResult, TdscSubmissionResult } from '../../features/tdsc/types';
import { normalizeApiError } from '../../lib/apiError';
import { InlineFormError } from '../../components/feedback/InlineFormError';

export const TdscTracker: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<TdscItem[]>([]);
  const [results, setResults] = useState<Record<string, TdscResult>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submission, setSubmission] = useState<TdscSubmissionResult | null>(null);

  useEffect(() => {
    getTdscItems()
      .then((res) => setItems(res.items))
      .catch((err) => setError(normalizeApiError(err).message))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (id: number, result: TdscResult) => {
    setResults((prev) => ({ ...prev, [id]: result }));
  };

  const handleSubmit = async () => {
    if (Object.keys(results).length < items.length) {
      setError(t('tdsc.validationError'));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitTdscAssessment('baseline', results);
      setSubmission(res);
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submission) {
    return (
      <AppShell title={t('tdsc.title')} subtitle={t('tdsc.subtitle')}>
        <div className={`rounded-xl border p-5 ${submission.suspectedDelay ? 'border-amber-300 bg-amber-50' : 'border-teal-200 bg-teal-50'}`}>
          <h2 className="font-sans text-base font-bold text-text">{t('tdsc.submittedTitle')}</h2>
          <p className="mt-2 text-sm text-text-muted">
            {submission.suspectedDelay ? t('tdsc.delayFlagged') : t('tdsc.noConcerns')}
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={t('tdsc.title')} subtitle={t('tdsc.subtitle')}>
      <div className="space-y-4">
        {error && <InlineFormError message={error} />}
        {loading ? (
          <div className="py-12 text-center text-sm text-text-muted">{t('tdsc.loading')}</div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-xl border border-border bg-surface p-4">
                  <p className="text-sm font-semibold text-text">{item.task}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelect(item.id, 'pass')}
                      className={`flex flex-1 min-h-12 items-center justify-center gap-1.5 rounded-lg border text-sm font-semibold ${
                        results[item.id] === 'pass'
                          ? 'border-teal-600 bg-teal-600 text-white'
                          : 'border-border bg-white text-text'
                      }`}
                    >
                      <Check className="h-4 w-4" aria-hidden="true" /> {t('tdsc.pass')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelect(item.id, 'fail')}
                      className={`flex flex-1 min-h-12 items-center justify-center gap-1.5 rounded-lg border text-sm font-semibold ${
                        results[item.id] === 'fail'
                          ? 'border-red-600 bg-red-600 text-white'
                          : 'border-border bg-white text-text'
                      }`}
                    >
                      <X className="h-4 w-4" aria-hidden="true" /> {t('tdsc.fail')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="w-full min-h-12 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50"
            >
              {submitting ? t('breastfeeding.submitting') : t('tdsc.submit')}
            </button>
          </>
        )}
      </div>
    </AppShell>
  );
};
