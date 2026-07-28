import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Pencil } from 'lucide-react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { adminFetchArticles, deleteArticle } from '../../features/learningAdmin/api';
import type { AdminArticle } from '../../features/learningAdmin/types';
import { normalizeApiError } from '../../lib/apiError';
import { ROUTES } from '../../routes/paths';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-amber-100 text-amber-800',
  published: 'bg-teal-100 text-teal-800',
  archived: 'bg-slate-100 text-slate-600',
};

const PAGE_LIMIT = 20;

export const AdminArticleList: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetchArticles({
        page,
        limit: PAGE_LIMIT,
        status: statusFilter || undefined,
      });
      setArticles(res.articles);
      setTotal(res.total);
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this article? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteArticle(id);
      await load();
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.ceil(total / PAGE_LIMIT);

  return (
    <div className="care-canvas min-h-screen">
      <AdminHeader />
      <div className="mx-auto max-w-6xl p-5 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-sans text-2xl font-extrabold text-text lg:text-3xl">Articles</h1>
            <p className="mt-1 text-sm text-text-muted">{total} total</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="rounded-full border border-border bg-surface px-3 py-2 text-sm font-semibold text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>

            <button
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_LEARNING_NEW)}
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              New
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-error/20 bg-error/5 p-3.5 text-xs font-medium text-error">
            {error}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-text-muted">
            Loading…
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-muted">
            No articles found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs font-extrabold uppercase text-text-muted">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-border last:border-0 cursor-pointer hover:bg-primary/5"
                    onClick={() => navigate(ROUTES.ADMIN_LEARNING_EDIT.replace(':id', a.id))}
                  >
                    <td className="px-4 py-3 font-semibold text-text max-w-xs truncate">
                      {a.title}
                    </td>
                    <td className="px-4 py-3 text-text-muted capitalize">{a.category}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[a.status] ?? 'bg-slate-100 text-slate-600'}`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-muted text-xs">
                      {a.publishedAt
                        ? new Date(a.publishedAt).toLocaleDateString()
                        : new Date(a.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          title="Preview"
                          onClick={() =>
                            navigate(ROUTES.ADMIN_LEARNING_PREVIEW.replace(':id', a.id))
                          }
                          className="rounded-full border border-border p-1.5 text-text-muted hover:bg-primary/5"
                        >
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          title="Edit"
                          onClick={() =>
                            navigate(ROUTES.ADMIN_LEARNING_EDIT.replace(':id', a.id))
                          }
                          className="rounded-full border border-border p-1.5 text-text-muted hover:bg-primary/5"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          disabled={deletingId === a.id}
                          onClick={() => void handleDelete(a.id)}
                          className="rounded-full border border-error/30 p-1.5 text-error/70 hover:bg-error/5 disabled:opacity-50"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-bold text-text disabled:opacity-40 hover:bg-primary/5"
            >
              ← Previous
            </button>
            <span className="text-sm text-text-muted">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-bold text-text disabled:opacity-40 hover:bg-primary/5"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
