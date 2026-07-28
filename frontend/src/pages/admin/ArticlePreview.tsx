import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Pencil } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AudioPlayer } from '../../components/AudioPlayer';
import { adminFetchArticle } from '../../features/learningAdmin/api';
import type { AdminArticle } from '../../features/learningAdmin/types';
import { normalizeApiError } from '../../lib/apiError';
import { ROUTES } from '../../routes/paths';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-amber-100 text-amber-800',
  published: 'bg-teal-100 text-teal-800',
  archived: 'bg-slate-100 text-slate-600',
};

export const ArticlePreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [article, setArticle] = useState<AdminArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    adminFetchArticle(id)
      .then(setArticle)
      .catch((err) => setError(normalizeApiError(err).message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="care-canvas min-h-screen">
        <AdminHeader />
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="care-canvas min-h-screen">
        <AdminHeader />
        <div className="mx-auto max-w-3xl p-5">
          <p className="text-sm text-error">{error ?? 'Article not found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="care-canvas min-h-screen">
      <AdminHeader />

      {/* Preview banner */}
      <div className="sticky top-[73px] z-10 border-b border-amber-200 bg-amber-50 px-4 py-2.5">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
            <span>👁 Preview mode</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[article.status]}`}
            >
              {article.status}
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN_LEARNING_EDIT.replace(':id', article.id))}
            className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            Edit
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl p-5 lg:p-8 space-y-5">
        {/* Meta */}
        <div className="flex flex-wrap gap-3 text-xs text-text-muted">
          <span className="capitalize">{article.category.replace('_', ' ')}</span>
          {article.tags.length > 0 && (
            <span>{article.tags.join(', ')}</span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-sans text-2xl font-extrabold text-text lg:text-3xl">
          {article.title}
        </h1>

        {/* Cover image */}
        {article.coverImageUrl && (
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="w-full rounded-xl object-cover"
            style={{ maxHeight: '260px' }}
          />
        )}

        {/* Body */}
        <div className="prose prose-sm max-w-none text-text">
          <ReactMarkdown>{article.body}</ReactMarkdown>
        </div>

        {/* Additional images */}
        {article.imageUrls && article.imageUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {article.imageUrls.map((url, i) => (
              <img key={i} src={url} alt="" className="w-full rounded-xl object-cover aspect-square" />
            ))}
          </div>
        )}

        {/* Audio */}
        {article.audioUrl && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-text-muted">Audio</p>
            <AudioPlayer src={article.audioUrl} />
          </div>
        )}

        {/* Video */}
        {article.videoUrl && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-text-muted">Video</p>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video controls src={article.videoUrl} className="w-full rounded-xl" />
          </div>
        )}
      </div>
    </div>
  );
};
