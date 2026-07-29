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
      <div className="space-y-5">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(ROUTES.LEARN)}
          className="text-sm font-semibold text-primary"
        >
          ← {t('learningHub.back', 'Back')}
        </button>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 text-xs text-text-muted">
          <span>
            {article.durationMin} {t('learningHub.minRead', 'min read')}
          </span>
          <span className="capitalize">
            {t(`learningHub.categories.${article.category}`, article.category)}
          </span>
        </div>

        {/* Cover image — max 280px tall, natural width, no cropping */}
        {article.coverImageUrl && (
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="w-full rounded-xl object-contain"
            style={{ maxHeight: '280px' }}
          />
        )}

        {/* Markdown body */}
        <div className="prose prose-sm max-w-none text-text">
          <ReactMarkdown>{article.body}</ReactMarkdown>
        </div>

        {/* Additional images — full width, natural ratio, max height capped */}
        {article.imageUrls && article.imageUrls.length > 0 && (
          <div className="flex flex-col gap-4">
            {article.imageUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                className="w-full rounded-xl object-contain"
                style={{ maxHeight: '400px' }}
              />
            ))}
          </div>
        )}

        {/* Audio player */}
        {article.audioUrl && (
          <div>
            <p className="mb-2 text-xs font-semibold text-text-muted uppercase">
              {t('learningHub.audio', 'Audio')}
            </p>
            <AudioPlayer src={article.audioUrl} />
          </div>
        )}

        {/* Video player */}
        {article.videoUrl && (
          <div>
            <p className="mb-2 text-xs font-semibold text-text-muted uppercase">
              {t('learningHub.video', 'Video')}
            </p>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              controls
              src={article.videoUrl}
              className="w-full rounded-xl"
              style={{ maxHeight: '70vh' }}
            />
          </div>
        )}
      </div>
    </AppShell>
  );
};
