import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { AppShell } from '../../components/layout/AppShell';
import { LoadingScreen } from '../../components/feedback/LoadingScreen';
import { AudioPlayer } from '../../components/AudioPlayer';
import { fetchArticleBySlug } from '../../features/learning/api';
import type { ArticleDetail as ArticleDetailType } from '../../features/learning/types';
import { normalizeApiError } from '../../lib/apiError';
import { ROUTES } from '../../routes/paths';

export const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [article, setArticle] = useState<ArticleDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ status?: number; message: string } | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchArticleBySlug(slug)
      .then(setArticle)
      .catch((err) => {
        const normalized = normalizeApiError(err);
        setError({ status: normalized.status, message: normalized.message });
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <AppShell title={t('learningHub.title')}>
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          {error.status === 404 ? (
            <>
              <p className="text-lg font-bold text-text">নিবন্ধটি পাওয়া যায়নি</p>
              <p className="mt-1 text-sm text-text-muted">
                এই নিবন্ধটি এখন পাওয়া যাচ্ছে না।
              </p>
            </>
          ) : (
            <p className="text-sm text-error">{error.message}</p>
          )}
          <button
            type="button"
            onClick={() => navigate(ROUTES.LEARN)}
            className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            ← শিক্ষা কেন্দ্রে ফিরুন
          </button>
        </div>
      </AppShell>
    );
  }

  if (!article) return null;

  return (
    <AppShell title={article.title} subtitle={t('learningHub.title')}>
      {/* On desktop: two-column — content left, cover image right (sticky) */}
      <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-12 lg:items-start">

        {/* ── Left column ── */}
        <div>
          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate(ROUTES.LEARN)}
            className="mb-5 text-sm font-semibold text-primary inline-flex items-center gap-1"
          >
            ← {t('learningHub.back', 'Back')}
          </button>

          {/* Category + read-time chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="care-chip capitalize">
              {t(`learningHub.categories.${article.category}`, article.category)}
            </span>
            <span className="care-chip">
              {article.durationMin} {t('learningHub.minRead', 'min read')}
            </span>
          </div>

          {/* Summary lead — displayed as a pull-quote intro above the body */}
          {article.summary && (
            <p className="text-base font-semibold text-text-muted leading-relaxed mb-5 border-l-4 border-secondary pl-4">
              {article.summary}
            </p>
          )}

          {/* Cover image — mobile only */}
          {article.coverImageUrl && (
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="w-full rounded-xl object-cover mb-6 lg:hidden"
              style={{ maxHeight: '260px' }}
            />
          )}

          {/* Divider before body */}
          <hr className="border-border mb-6" />

          {/* Article body — Bengali-optimised typography */}
          <div className="article-prose max-w-none">
            <ReactMarkdown>{article.body}</ReactMarkdown>
          </div>

          {/* Additional images inline with body */}
          {article.imageUrls && article.imageUrls.length > 0 && (
            <div className="flex flex-col gap-5 mt-6">
              {article.imageUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="w-full rounded-xl object-contain"
                  style={{ maxHeight: '480px' }}
                />
              ))}
            </div>
          )}

          {/* Audio player */}
          {article.audioUrl && (
            <div className="mt-8 p-4 rounded-xl bg-surface border border-border">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-text-muted">
                {t('learningHub.audio', 'Audio')}
              </p>
              <AudioPlayer src={article.audioUrl} />
            </div>
          )}

          {/* Video player */}
          {article.videoUrl && (
            <div className="mt-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-text-muted">
                {t('learningHub.video', 'Video')}
              </p>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                controls
                src={article.videoUrl}
                className="w-full rounded-xl"
              />
            </div>
          )}
        </div>

        {/* ── Right column: cover image, desktop only, sticky ── */}
        {article.coverImageUrl && (
          <div className="hidden lg:block lg:sticky lg:top-8">
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="w-full rounded-2xl object-cover shadow-sm"
              style={{ maxHeight: '480px' }}
            />
          </div>
        )}
      </div>
    </AppShell>
  );
};
