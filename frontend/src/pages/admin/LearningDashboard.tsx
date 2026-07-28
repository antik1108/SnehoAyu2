import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, Globe, Plus } from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { adminFetchArticles } from '../../features/learningAdmin/api';
import type { AdminArticle } from '../../features/learningAdmin/types';
import { normalizeApiError } from '../../lib/apiError';
import { ROUTES } from '../../routes/paths';

export const LearningDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminFetchArticles({ limit: 100 })
      .then((res) => setArticles(res.articles))
      .catch((err) => setError(normalizeApiError(err).message))
      .finally(() => setLoading(false));
  }, []);

  const total = articles.length;
  const draft = articles.filter((a) => a.status === 'draft').length;
  const published = articles.filter((a) => a.status === 'published').length;

  const stats = [
    { label: 'Total Articles', value: total, icon: BookOpen, color: 'bg-slate-100 text-slate-700' },
    { label: 'Draft', value: draft, icon: FileText, color: 'bg-amber-50 text-amber-700' },
    { label: 'Published', value: published, icon: Globe, color: 'bg-teal-50 text-teal-700' },
  ];

  return (
    <div className="care-canvas min-h-screen">
      <AdminHeader />
      <div className="mx-auto max-w-6xl p-5 lg:p-8">
        {/* Header */}
        <div className="mb-6 rounded-[28px] bg-[#111] p-6 text-white lg:p-8">
          <p className="text-xs font-extrabold uppercase text-white/55">Content management</p>
          <h1 className="mt-2 font-sans text-4xl font-extrabold lg:text-5xl">Learning</h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-white/70">
            Manage Bengali learning articles for the SnehoAyu app.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-error/20 bg-error/5 p-3.5 text-xs font-medium text-error">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {loading
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-border bg-surface p-6 h-28"
                />
              ))
            : stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-surface p-6">
                  <div className={`inline-flex rounded-full p-2 ${s.color}`}>
                    <s.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="mt-3 text-3xl font-extrabold text-text">{s.value}</p>
                  <p className="mt-1 text-sm font-medium text-text-muted">{s.label}</p>
                </div>
              ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN_LEARNING_ARTICLES)}
            className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-bold text-text hover:bg-primary/5 transition-colors"
          >
            View All Articles
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN_LEARNING_NEW)}
            className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Article
          </button>
        </div>
      </div>
    </div>
  );
};
