import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppShell } from '../../components/layout/AppShell';
import { ROUTES } from '../../routes/paths';
import { useAuth } from '../../hooks/useAuth';
import { normalizeApiError, type AppApiError } from '../../lib/apiError';
import {
  getKnowledgeQuestions,
  getKnowledgeStatus,
  getKnowledgeSubmission,
  submitKnowledgeAssessment,
} from '../../features/assessments/knowledge/api';
import {
  KNOWLEDGE_TIME_POINTS,
  type KnowledgeOptionId,
  type KnowledgeQuestionId,
  type KnowledgeQuestionsResponse,
  type KnowledgeStatus,
  type KnowledgeSubmissionResult,
  type KnowledgeTimePoint,
} from '../../features/assessments/knowledge/types';
import { isKnowledgeTimePoint } from '../../features/assessments/knowledge/validation';

type Responses = Partial<Record<KnowledgeQuestionId, KnowledgeOptionId>>;

const timePointLabels: Record<KnowledgeTimePoint, string> = {
  baseline: 'Baseline',
  '1_month': '1 month',
  '3_months': '3 months',
  '6_months': '6 months',
};

function responseIsComplete(
  responses: Responses,
  questions: KnowledgeQuestionsResponse['questions']
): responses is Record<KnowledgeQuestionId, KnowledgeOptionId> {
  return questions.length === 15 && questions.every((question) => responses[question.id]);
}

const ResultCard: React.FC<{ result: KnowledgeSubmissionResult | KnowledgeStatus }> = ({ result }) => {
  return (
    <section className="rounded-xl border border-success/40 bg-success/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-success">Submitted and locked</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-surface p-3">
          <p className="text-xl font-bold text-text">{result.score ?? '-'}</p>
          <p className="text-xs text-text-muted">Score</p>
        </div>
        <div className="rounded-lg bg-surface p-3">
          <p className="text-xl font-bold text-text">{result.percentage ?? '-'}%</p>
          <p className="text-xs text-text-muted">Percent</p>
        </div>
        <div className="rounded-lg bg-surface p-3">
          <p className="text-xl font-bold capitalize text-text">{result.grade ?? '-'}</p>
          <p className="text-xs text-text-muted">Grade</p>
        </div>
      </div>
      {result.submittedAt ? (
        <p className="mt-3 text-xs text-text-muted">
          Submitted {new Date(result.submittedAt).toLocaleString()}
        </p>
      ) : null}
    </section>
  );
};

export const KnowledgeMCQ: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const rawTimePoint = query.get('timePoint');
  const timePoint = isKnowledgeTimePoint(rawTimePoint) ? rawTimePoint : null;

  const [questionsData, setQuestionsData] = useState<KnowledgeQuestionsResponse | null>(null);
  const [status, setStatus] = useState<KnowledgeStatus | null>(null);
  const [result, setResult] = useState<KnowledgeSubmissionResult | null>(null);
  const [responses, setResponses] = useState<Responses>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<AppApiError | null>(null);

  const language = user?.preferredLanguage ?? i18n.language ?? 'bn';

  useEffect(() => {
    if (!timePoint) {
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const nextStatus = await getKnowledgeStatus(timePoint);
        if (cancelled) return;
        setStatus(nextStatus);

        if (nextStatus.submitted) {
          const existing = await getKnowledgeSubmission(timePoint);
          if (!cancelled) setResult(existing);
          return;
        }

        const nextQuestions = await getKnowledgeQuestions(timePoint, language);
        if (!cancelled) setQuestionsData(nextQuestions);
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
  }, [language, timePoint]);

  const questions = questionsData?.questions ?? [];
  const activeQuestion = questions[currentIndex] ?? null;
  const progressText = useMemo(() => {
    if (!activeQuestion) return '';
    return `${currentIndex + 1} / ${questions.length}`;
  }, [activeQuestion, currentIndex, questions.length]);

  if (!timePoint) {
    return (
      <AppShell title={t('knowledge.title', 'Knowledge Assessment')}>
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
    if (!questionsData || !responseIsComplete(responses, questions)) return;
    setSubmitting(true);
    setError(null);
    try {
      const nextResult = await submitKnowledgeAssessment({
        timePoint,
        responses,
      });
      setResult(nextResult);
      setStatus({
        timePoint,
        available: true,
        submitted: true,
        locked: true,
        score: nextResult.score,
        maxScore: nextResult.maxScore,
        percentage: nextResult.percentage,
        grade: nextResult.grade,
        submittedAt: nextResult.submittedAt,
        contentReady: questionsData.contentReady,
      });
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell
      title={t('knowledge.title', 'Knowledge Assessment')}
      subtitle={`${timePointLabels[timePoint]} - Tool III`}
    >
      {loading ? (
        <div className="rounded-xl border border-border bg-surface p-4 text-sm text-text-muted">
          Loading assessment...
        </div>
      ) : null}

      {error ? (
        <section className="mb-4 rounded-xl border border-error/30 bg-error/5 p-4">
          <p className="text-sm font-semibold text-error">{error.code}</p>
          <p className="mt-1 text-sm leading-6 text-text-muted">{error.message}</p>
        </section>
      ) : null}

      {result || status?.submitted ? (
        <div className="space-y-4">
          <ResultCard result={result ?? status!} />
          <button
            type="button"
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="w-full min-h-12 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-text"
          >
            Back to dashboard
          </button>
        </div>
      ) : null}

      {!loading && questionsData && !questionsData.contentReady ? (
        <section className="rounded-xl border border-warning/40 bg-warning/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Content approval required
          </p>
          <h2 className="mt-2 text-base font-semibold text-text">
            Tool III is not ready for real submission.
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-muted">
            Approved MCQ question wording, answer choices, option order, and validated Bengali/Hindi translations are required before production use.
          </p>
          <div className="mt-4 rounded-lg bg-surface p-3">
            <p className="text-sm font-medium text-text">Configured topics: {questionsData.questions.length}/15</p>
            <p className="mt-1 text-xs text-text-muted">Submissions are blocked by the backend with KNOWLEDGE_CONTENT_NOT_CONFIGURED.</p>
          </div>
        </section>
      ) : null}

      {!loading && questionsData?.contentReady && activeQuestion && !result && !status?.submitted ? (
        <section className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Question {progressText}</p>
              <p className="text-xs text-text-muted">{Math.round(((currentIndex + 1) / questions.length) * 100)}%</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
            <h2 className="mt-5 text-lg font-semibold leading-7 text-text">
              {activeQuestion.text ?? activeQuestion.topic}
            </h2>
          </div>

          <div className="space-y-3" role="radiogroup" aria-label={activeQuestion.text ?? activeQuestion.topic}>
            {activeQuestion.options.map((option) => {
              const selected = responses[activeQuestion.id] === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setResponses((prev) => ({ ...prev, [activeQuestion.id]: option.id }))}
                  className={`w-full min-h-14 rounded-xl border px-4 py-3 text-left text-sm font-semibold leading-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    selected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-surface text-text'
                  }`}
                >
                  {option.text}
                </button>
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
                disabled={!responses[activeQuestion.id]}
                onClick={() => setCurrentIndex((index) => Math.min(questions.length - 1, index + 1))}
                className="min-h-12 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting || !responseIsComplete(responses, questions)}
                onClick={submit}
                className="min-h-12 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                {submitting ? 'Submitting...' : 'Submit and lock'}
              </button>
            )}
          </div>
        </section>
      ) : null}
    </AppShell>
  );
};
