import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { LoadingScreen } from '../components/feedback/LoadingScreen';
import { fetchArticles } from '../features/learning/api';
import type { PublishedArticle } from '../features/learning/types';
import { normalizeApiError } from '../lib/apiError';
import { ROUTES } from '../routes/paths';

type CategoryKey = 'all' | 'feeding' | 'kmc' | 'growth' | 'danger_signs' | 'emotional_support' | 'immunization' | 'newborn_care';

const CATEGORY_KEYS: CategoryKey[] = [
  'all', 'feeding', 'kmc', 'growth', 'danger_signs',
  'emotional_support', 'immunization', 'newborn_care',
];

export const LearningHub: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [articles, setArticles] = useState<PublishedArticle[]>([]);
  const [viewedSlugs, setViewedSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<CategoryKey>('all');
  const [search, setSearch] = useState('');

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstLoad = useRef(true);

  const loadArticles = useCallback(
    async (cat: CategoryKey, searchVal: string, isInitial: boolean) => {
      if (!isInitial) setFilterLoading(true);
      setError(null);
      try {
        const filters: { category?: string; search?: string } = {};
        if (cat !== 'all') filters.category = cat;
        if (searchVal.trim()) filters.search = searchVal.trim();

        const data = await fetchArticles(filters);
        setArticles(data.articles);
        setViewedSlugs(data.viewedSlugs);
      } catch (err) {
        setError(normalizeApiError(err).message);
      } finally {
        setLoading(false);
        setFilterLoading(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    void loadArticles('all', '', true);
    isFirstLoad.current = false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search / category filter
  useEffect(() => {
    if (isFirstLoad.current) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      void loadArticles(category, search, false);
    }, 300);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [category, search, loadArticles]);

  const handleCategoryChange = (cat: CategoryKey) => {
    setCategory(cat);
  };

  const featured = articles.find((a) => a.coverImageUrl);

  if (loading) return <LoadingScreen />;

  return (
    <AppShell title={t('learningHub.title')} subtitle={t('learningHub.subtitle')}>
      <div className="space-y-4">
        {/* Error banner */}
        {error && (
          <div className="rounded-xl border border-error/20 bg-error/5 p-3.5 text-xs font-medium text-error">
            {error}
          </div>
        )}

        {/* Featured article — compact card on mobile, wider on desktop */}
        {featured && !search && category === 'all' && (
          <button
            type="button"
            onClick={() => navigate(ROUTES.LEARN_ARTICLE.replace(':slug', featured.slug))}
            className="surface-brand shadow-brand w-full text-left rounded-xl p-4 lg:p-5"
          >
            <div className="flex items-start gap-3 lg:gap-5">
              {featured.coverImageUrl && (
                <img
                  src={featured.coverImageUrl}
                  alt=""
                  className="h-16 w-16 flex-shrink-0 rounded-lg object-cover lg:h-28 lg:w-28 lg:rounded-xl"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase opacity-70 mb-1 lg:text-xs">
                  {t('learningHub.featured')}
                </p>
                <p className="text-sm font-bold leading-snug lg:text-xl lg:leading-tight">{featured.title}</p>
                <p className="mt-1 text-xs opacity-80 lg:text-sm lg:mt-2">
                  {t(`learningHub.categories.${featured.category}`, featured.category)}
                </p>
                <p className="mt-1 text-xs opacity-70 lg:mt-1.5 lg:text-sm">
                  {featured.durationMin} {t('learningHub.minRead')}
                  {featured.audioUrl ? ` · ${t('learningHub.audio')}` : ''}
                </p>
              </div>
            </div>
          </button>
        )}

        {/* Search input */}
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('learningHub.search', 'খুঁজুন...')}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        {/* Category filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORY_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleCategoryChange(key)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                category === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-slate-100 text-text-muted'
              }`}
            >
              {t(`learningHub.categories.${key}`, key)}
            </button>
          ))}
        </div>

        {/* Articles list */}
        {filterLoading ? (
          <div className="flex items-center justify-center py-8">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-text-muted">
            {t('learningHub.noArticles', 'কোনো নিবন্ধ পাওয়া যায়নি')}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {articles.map((article) => (
              <button
                key={article.slug}
                type="button"
                onClick={() => navigate(ROUTES.LEARN_ARTICLE.replace(':slug', article.slug))}
                className="w-full text-left rounded-xl border border-border bg-surface p-4 hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  {article.coverImageUrl && (
                    <img
                      src={article.coverImageUrl}
                      alt=""
                      className="h-20 w-20 flex-shrink-0 rounded-lg object-cover lg:h-24 lg:w-24"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-text lg:text-base">{article.title}</p>
                      {viewedSlugs.includes(article.slug) && (
                        <span className="flex flex-shrink-0 items-center gap-1 text-xs font-medium text-teal-700">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          {t('learningHub.viewed')}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-text-muted lg:text-sm">
                      {t(`learningHub.categories.${article.category}`, article.category)}
                    </p>
                    <p className="mt-1.5 text-xs text-text-muted">
                      {article.durationMin} {t('learningHub.minRead')}
                      {article.audioUrl ? ` · ${t('learningHub.audio')}` : ''}
                      {article.videoUrl ? ` · ${t('learningHub.video', 'ভিডিও')}` : ''}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
};
