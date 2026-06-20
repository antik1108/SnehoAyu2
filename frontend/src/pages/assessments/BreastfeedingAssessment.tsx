import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppShell } from '../../components/layout/AppShell';
import { submitBreastfeedingAssessment } from '../../features/breastfeeding/api';
import type { BreastfeedingResponses, BreastfeedingSubmissionResult } from '../../features/breastfeeding/types';
import { normalizeApiError } from '../../lib/apiError';
import { InlineFormError } from '../../components/feedback/InlineFormError';

const PROBLEM_OPTIONS = ['Sore nipples', 'Low milk supply', 'Latching difficulty', 'Engorgement'];

const initialResponses: BreastfeedingResponses = {
  currentlyBreastfeeding: 'exclusive',
  frequencyPer24h: 8,
  sessionDurationMinutes: 15,
  nightFeedsCount: 2,
  feedingOnCues: 'always',
  feedingProblems: [],
  expressedMilkUsed: false,
  alternativeFeedingMethodsUsed: false,
};

export const BreastfeedingAssessment: React.FC = () => {
  const { t } = useTranslation();
  const [responses, setResponses] = useState<BreastfeedingResponses>(initialResponses);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BreastfeedingSubmissionResult | null>(null);

  const toggleProblem = (problem: string) => {
    setResponses((prev) => ({
      ...prev,
      feedingProblems: prev.feedingProblems.includes(problem)
        ? prev.feedingProblems.filter((p) => p !== problem)
        : [...prev.feedingProblems, problem],
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitBreastfeedingAssessment('baseline', responses);
      setResult(res);
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <AppShell title={t('breastfeeding.title')} subtitle={t('breastfeeding.subtitle')}>
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-5">
          <h2 className="font-sans text-base font-bold text-text">{t('breastfeeding.submittedTitle')}</h2>
          <p className="mt-2 text-2xl font-bold text-text">{result.totalScore} / 28</p>
          <p className="mt-1 text-sm capitalize text-text-muted">{t('breastfeeding.grade')}: {result.grade}</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={t('breastfeeding.title')} subtitle={t('breastfeeding.subtitle')}>
      <div className="space-y-5">
        {error && <InlineFormError message={error} />}

        <div>
          <label className="text-xs font-semibold text-text">{t('breastfeeding.currentlyBreastfeeding')}</label>
          <select
            value={responses.currentlyBreastfeeding}
            onChange={(e) => setResponses((p) => ({ ...p, currentlyBreastfeeding: e.target.value as BreastfeedingResponses['currentlyBreastfeeding'] }))}
            className="mt-1 w-full min-h-12 rounded-xl border border-border px-3"
          >
            <option value="exclusive">{t('breastfeeding.exclusive')}</option>
            <option value="predominant">{t('breastfeeding.predominant')}</option>
            <option value="mixed">{t('breastfeeding.mixed')}</option>
            <option value="not_breastfeeding">{t('breastfeeding.notBreastfeeding')}</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-text">{t('breastfeeding.feedsPerDay')}</label>
          <input
            type="number"
            min={0}
            value={responses.frequencyPer24h}
            onChange={(e) => setResponses((p) => ({ ...p, frequencyPer24h: Number(e.target.value) }))}
            className="mt-1 w-full min-h-12 rounded-xl border border-border px-3"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-text">{t('breastfeeding.sessionDuration')}</label>
          <input
            type="number"
            min={0}
            value={responses.sessionDurationMinutes}
            onChange={(e) => setResponses((p) => ({ ...p, sessionDurationMinutes: Number(e.target.value) }))}
            className="mt-1 w-full min-h-12 rounded-xl border border-border px-3"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-text">{t('breastfeeding.nightFeeds')}</label>
          <input
            type="number"
            min={0}
            value={responses.nightFeedsCount}
            onChange={(e) => setResponses((p) => ({ ...p, nightFeedsCount: Number(e.target.value) }))}
            className="mt-1 w-full min-h-12 rounded-xl border border-border px-3"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-text">{t('breastfeeding.feedingOnCues')}</label>
          <select
            value={responses.feedingOnCues}
            onChange={(e) => setResponses((p) => ({ ...p, feedingOnCues: e.target.value as BreastfeedingResponses['feedingOnCues'] }))}
            className="mt-1 w-full min-h-12 rounded-xl border border-border px-3"
          >
            <option value="always">{t('breastfeeding.always')}</option>
            <option value="sometimes">{t('breastfeeding.sometimes')}</option>
            <option value="fixed_schedule">{t('breastfeeding.fixedSchedule')}</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-text">{t('breastfeeding.feedingProblems')}</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {PROBLEM_OPTIONS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => toggleProblem(p)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  responses.feedingProblems.includes(p) ? 'border-primary bg-primary/10 text-primary' : 'border-border text-text-muted'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-text">
          <input
            type="checkbox"
            checked={responses.expressedMilkUsed}
            onChange={(e) => setResponses((p) => ({ ...p, expressedMilkUsed: e.target.checked }))}
          />
          {t('breastfeeding.expressedMilk')}
        </label>

        <label className="flex items-center gap-2 text-sm text-text">
          <input
            type="checkbox"
            checked={responses.alternativeFeedingMethodsUsed}
            onChange={(e) => setResponses((p) => ({ ...p, alternativeFeedingMethodsUsed: e.target.checked }))}
          />
          {t('breastfeeding.alternativeFeeding')}
        </label>

        <button
          type="button"
          disabled={submitting}
          onClick={handleSubmit}
          className="w-full min-h-12 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50"
        >
          {submitting ? t('breastfeeding.submitting') : t('breastfeeding.submit')}
        </button>
      </div>
    </AppShell>
  );
};
