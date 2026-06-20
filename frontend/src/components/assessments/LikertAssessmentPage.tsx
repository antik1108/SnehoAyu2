import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppShell } from '../layout/AppShell';
import { ROUTES } from '../../routes/paths';
import { useAuth } from '../../hooks/useAuth';
import { normalizeApiError, type AppApiError } from '../../lib/apiError';
import { KNOWLEDGE_TIME_POINTS, type KnowledgeTimePoint } from '../../features/assessments/knowledge/types';
import { isKnowledgeTimePoint } from '../../features/assessments/knowledge/validation';

export interface LikertQuestion<TQuestionId extends string> {
  id: TQuestionId;
  order: number;
  text: string | null;
  contentStatus: string;
}

export interface LikertScaleOption<TValue extends number> {
  value: TValue;
  label: string;
}

interface LikertQuestionsPayload<TQuestionId extends string, TValue extends number> {
  contentReady: boolean;
  questions: Array<LikertQuestion<TQuestionId>>;
  scale: Array<LikertScaleOption<TValue>>;
}

interface LikertAssessmentPageProps<TQuestionId extends string, TValue extends number, TResult> {
  title: string;
  subtitle: string;
  toolLabel: string;
  intro: string;
  result: TResult | null;
  setResult: React.Dispatch<React.SetStateAction<TResult | null>>;
  getStatus: (timePoint: KnowledgeTimePoint) => Promise<{ submitted: boolean; locked: boolean; contentReady: boolean }>;
  getQuestions: (timePoint: KnowledgeTimePoint, language: string) => Promise<LikertQuestionsPayload<TQuestionId, TValue>>;
  getResult: (timePoint: KnowledgeTimePoint) => Promise<TResult>;
  submitAssessment: (input: { timePoint: KnowledgeTimePoint; responses: Record<TQuestionId, TValue> }) => Promise<TResult>;
  renderResult: (result: TResult) => React.ReactNode;
  contentNotReadyMessage: string;
}

const timePointLabels: Record<KnowledgeTimePoint, string> = {
  baseline: 'Baseline',
  '1_month': '1 month',
  '3_months': '3 months',
  '6_months': '6 months',
};

export function LikertAssessmentPage<TQuestionId extends string, TValue extends number, TResult>({
  title,
  subtitle,
  toolLabel,
  intro,
  result,
  setResult,
  getStatus,
  getQuestions,
  getResult,
  submitAssessment,
  renderResult,
  contentNotReadyMessage,
}: LikertAssessmentPageProps<TQuestionId, TValue, TResult>) {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const rawTimePoint = query.get('timePoint');
  const timePoint = isKnowledgeTimePoint(rawTimePoint) ? rawTimePoint : null;

  const [questionsPayload, setQuestionsPayload] = useState<LikertQuestionsPayload<TQuestionId, TValue> | null>(null);
  const [responses, setResponses] = useState<Partial<Record<TQuestionId, TValue>>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewing, setReviewing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<AppApiError | null>(null);

  const language = user?.preferredLanguage ?? i18n.language ?? 'bn';

  useEffect(() => {
    if (!timePoint) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        const status = await getStatus(timePoint);
        if (cancelled) return;
        if (status.submitted) {
          const existing = await getResult(timePoint);
          if (!cancelled) setResult(existing);
          return;
        }
        const nextQuestions = await getQuestions(timePoint, language);
        if (!cancelled) setQuestionsPayload(nextQuestions);
      } catch (err) {
        if (!cancelled) setError(normalizeApiError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [getQuestions, getResult, getStatus, language, setResult, timePoint]);

  const questions = questionsPayload?.questions ?? [];
  const activeQuestion = questions[currentIndex] ?? null;
  const answeredCount = questions.filter((question) => responses[question.id] !== undefined).length;
  const missingCount = questions.length - answeredCount;
  const complete = questions.length > 0 && missingCount === 0;
  const progressText = useMemo(() => {
    if (!activeQuestion) return '';
    return `Question ${currentIndex + 1} of ${questions.length}`;
  }, [activeQuestion, currentIndex, questions.length]);

  if (!timePoint) {
    return (
      <AppShell title={title}>
        <section className="rounded-xl border border-error/30 bg-error/5 p-4">
          <h2 className="text-base font-semibold text-text">Invalid assessment link</h2>
          <p className="mt-2 text-sm leading-6 text-text-muted">
            Choose a valid time point: {KNOWLEDGE_TIME_POINTS.join(', ')}.
          </p>
          <Link className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground" to={ROUTES.DASHBOARD}>
            Back to dashboard
          </Link>
        </section>
      </AppShell>
    );
  }

  const submit = async () => {
    if (!complete) return;
    setSubmitting(true);
    setError(null);
    try {
      const nextResult = await submitAssessment({
        timePoint,
        responses: responses as Record<TQuestionId, TValue>,
      });
      setResult(nextResult);
      setReviewing(false);
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell title={title} subtitle={`${timePointLabels[timePoint]} - ${toolLabel}. ${subtitle}`}>
      {loading ? (
        <div role="status" className="rounded-xl border border-border bg-surface p-4 text-sm text-text-muted">
          Loading assessment...
        </div>
      ) : null}

      {error ? (
        <section role="alert" className="mb-4 rounded-xl border border-error/30 bg-error/5 p-4">
          <p className="text-sm font-semibold text-error">{error.code}</p>
          <p className="mt-1 text-sm leading-6 text-text-muted">{error.message}</p>
        </section>
      ) : null}

      {result ? (
        <div className="space-y-4">
          {renderResult(result)}
          <button
            type="button"
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="w-full min-h-12 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-text"
          >
            Back to Dashboard
          </button>
        </div>
      ) : null}

      {!loading && questionsPayload && !questionsPayload.contentReady ? (
        <section className="rounded-xl border border-warning/40 bg-warning/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Content approval required</p>
          <h2 className="mt-2 text-base font-semibold text-text">The approved assessment content is not configured yet.</h2>
          <p className="mt-2 text-sm leading-6 text-text-muted">{contentNotReadyMessage}</p>
          <div className="mt-4 rounded-lg bg-surface p-3">
            <p className="text-sm font-medium text-text">Configured items: {questions.length}</p>
            <p className="mt-1 text-xs text-text-muted">Submissions are blocked by the backend with ASSESSMENT_CONTENT_NOT_CONFIGURED.</p>
          </div>
        </section>
      ) : null}

      {!loading && questionsPayload?.contentReady && activeQuestion && !result && !reviewing ? (
        <section className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-sm leading-6 text-text-muted">{intro}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">{progressText}</p>
              <p className="text-xs text-text-muted">{answeredCount}/{questions.length} answered</p>
            </div>
            <h2 className="mt-5 text-lg font-semibold leading-7 text-text">{activeQuestion.text}</h2>
          </div>

          <div role="radiogroup" aria-label={activeQuestion.text ?? progressText} className="space-y-3">
            {questionsPayload.scale.map((option) => {
              const id = `${activeQuestion.id}-${option.value}`;
              const selected = responses[activeQuestion.id] === option.value;
              return (
                <label
                  key={option.value}
                  htmlFor={id}
                  className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold leading-6 transition-colors ${
                    selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-surface text-text'
                  }`}
                >
                  <input
                    id={id}
                    type="radio"
                    name={activeQuestion.id}
                    checked={selected}
                    onChange={() => setResponses((prev) => ({ ...prev, [activeQuestion.id]: option.value }))}
                    className="h-5 w-5 accent-primary"
                  />
                  <span>{option.value}. {option.label}</span>
                </label>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
              className="min-h-12 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-text disabled:opacity-40"
            >
              Previous
            </button>
            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                disabled={responses[activeQuestion.id] === undefined}
                onClick={() => setCurrentIndex((index) => Math.min(questions.length - 1, index + 1))}
                className="min-h-12 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                disabled={!complete}
                onClick={() => setReviewing(true)}
                className="min-h-12 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                Review responses
              </button>
            )}
          </div>
        </section>
      ) : null}

      {!loading && questionsPayload?.contentReady && reviewing && !result ? (
        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="text-lg font-semibold text-text">Review responses</h2>
          <p className="mt-2 text-sm leading-6 text-text-muted">
            Please check your responses. After submission, this assessment cannot be changed.
          </p>
          <div className="mt-4 rounded-lg bg-background p-3 text-sm text-text">
            Answered: {answeredCount}/{questions.length}
            {missingCount > 0 ? <span className="block text-error">Missing: {missingCount}</span> : null}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setReviewing(false)}
              className="min-h-12 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-text"
            >
              Back
            </button>
            <button
              type="button"
              disabled={submitting || !complete}
              onClick={submit}
              className="min-h-12 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              {submitting ? 'Submitting...' : 'Submit assessment'}
            </button>
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}
