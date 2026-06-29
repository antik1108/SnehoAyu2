import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, X, Send, RotateCw, TriangleAlert } from 'lucide-react';
import { generateCareInsight, type CareInsight } from '../../features/insights/api';
import { normalizeApiError } from '../../lib/apiError';

const Panel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useTranslation();
  const [insight, setInsight] = useState<CareInsight | null>(null);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const run = async (q?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateCareInsight(q);
      setInsight(result);
      setHasLoadedOnce(true);
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;
    setQuestion('');
    void run(q);
  };

  const content = (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85dvh] w-full max-w-md flex-col rounded-t-2xl bg-surface sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border p-4">
          <span className="surface-brand flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
            <Sparkles className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text">{t('dashboard.aiInsight.title', 'Your AI Care Summary')}</p>
            <p className="text-xs text-text-muted">{t('dashboard.aiInsight.subtitle', 'A quick read on how your baby is doing')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-secondary/15 hover:text-text"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!hasLoadedOnce && !loading && !error && (
            <button
              type="button"
              onClick={() => void run()}
              className="interactive-card flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 text-sm font-extrabold text-primary"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {t('dashboard.aiInsight.generate', 'Get my AI summary')}
            </button>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-text-muted">
              <RotateCw className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t('dashboard.aiInsight.loading', 'Analysing…')}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-error/30 bg-error/5 p-3">
              <p role="alert" className="text-xs font-medium text-error">{error}</p>
              <button
                type="button"
                onClick={() => void run()}
                className="mt-2 text-xs font-semibold text-primary underline"
              >
                {t('checklist.actions.tryAgain', 'Try again')}
              </button>
            </div>
          )}

          {!loading && insight && (
            <div
              className={`mt-1 rounded-xl p-3 text-sm leading-relaxed ${
                insight.hasFlag ? 'border border-amber-300 bg-amber-50 text-amber-900' : 'bg-primary/5 text-text'
              }`}
            >
              {insight.hasFlag && (
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700">
                  <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />
                  {t('dashboard.aiInsight.attentionNeeded', 'Needs your attention')}
                </p>
              )}
              {insight.message}
            </div>
          )}
        </div>

        <form onSubmit={handleAsk} className="flex items-center gap-2 border-t border-border p-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t('dashboard.aiInsight.askPlaceholder', "Ask about your baby's care…")}
            disabled={loading}
            className="min-h-11 flex-1 rounded-xl border border-border bg-background px-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            aria-label={t('dashboard.aiInsight.ask', 'Ask')}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"
          >
            <Send className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        </form>

        <p className="px-4 pb-3 text-center text-[11px] leading-snug text-text-muted">
          {t('dashboard.aiInsight.disclaimer', 'General guidance only — not a medical diagnosis. For any urgent concern, use the Danger Signs guide and contact your hospital.')}
        </p>
      </div>
    </div>
  );

  // Render via portal directly under <body> — if this panel is mounted
  // anywhere inside an ancestor with a CSS `backdrop-filter`/`transform`
  // (e.g. the app header's blur effect), `position: fixed` would resolve
  // against that ancestor instead of the viewport, squashing the whole
  // modal into that ancestor's small box. Portaling avoids that entirely.
  return createPortal(content, document.body);
};

export const AiAssistantButton: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={t('dashboard.aiInsight.title', 'Your AI Care Summary')}
      className="surface-brand shadow-brand flex h-14 w-14 items-center justify-center rounded-full transition-transform active:scale-95"
      style={{
        position: 'fixed',
        right: '1.25rem',
        left: 'auto',
        bottom: 'calc(6rem + env(safe-area-inset-bottom))',
        zIndex: 100,
      }}
    >
      <Sparkles className="h-6 w-6" aria-hidden="true" />
    </button>
  );

  return (
    <>
      {createPortal(trigger, document.body)}
      {open && <Panel onClose={() => setOpen(false)} />}
    </>
  );
};
