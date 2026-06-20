import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { AudioPlayer } from '../components/AudioPlayer';
import { learningHubContent, type LearningCategory, type LearningContentItem } from '../content/learningHubContent';
import { recordContentView, getViewedSlugs } from '../features/content/api';

const CATEGORY_KEYS: (LearningCategory | 'all')[] = ['all', 'feeding', 'kmc', 'growth', 'danger_signs', 'emotional_support', 'immunization'];

export const LearningHub: React.FC = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState<LearningCategory | 'all'>('all');
  const [selected, setSelected] = useState<LearningContentItem | null>(null);
  const [viewedSlugs, setViewedSlugs] = useState<string[]>([]);

  useEffect(() => {
    getViewedSlugs().then(setViewedSlugs).catch(() => undefined);
  }, []);

  const handleOpen = (item: LearningContentItem) => {
    setSelected(item);
    recordContentView(item.slug, item.category)
      .then(() => setViewedSlugs((prev) => (prev.includes(item.slug) ? prev : [...prev, item.slug])))
      .catch(() => undefined);
  };

  const featured = learningHubContent.find((c) => c.featured);
  const filtered = learningHubContent.filter((c) => category === 'all' || c.category === category);

  if (selected) {
    return (
      <AppShell title={selected.title} subtitle={t('learningHub.title')}>
        <button type="button" onClick={() => setSelected(null)} className="mb-4 text-sm font-semibold text-primary">
          {t('learningHub.back')}
        </button>
        <div className="space-y-4">
          <p className="text-sm text-text-muted">{selected.durationMin} {t('learningHub.minRead')}</p>
          <p className="text-sm leading-6 text-text">{selected.body}</p>
          {selected.audioUrl && <AudioPlayer src={selected.audioUrl} />}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={t('learningHub.title')} subtitle={t('learningHub.subtitle')}>
      <div className="space-y-4">
        {featured && (
          <button
            type="button"
            onClick={() => handleOpen(featured)}
            className="surface-brand shadow-brand w-full text-left rounded-xl p-5"
          >
            <p className="text-xs font-semibold uppercase opacity-80">{t('learningHub.featured')}</p>
            <h3 className="mt-1 text-lg font-bold">{featured.title}</h3>
            <p className="mt-1 text-sm opacity-90">{featured.summary}</p>
          </button>
        )}

        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORY_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                category === key ? 'bg-primary text-primary-foreground' : 'bg-slate-100 text-text-muted'
              }`}
            >
              {t(`learningHub.categories.${key}`)}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => handleOpen(item)}
              className="w-full text-left rounded-xl border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-text">{item.title}</p>
                {viewedSlugs.includes(item.slug) && (
                  <span className="flex items-center gap-1 text-xs font-medium text-teal-700">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    {t('learningHub.viewed')}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-text-muted">{item.summary}</p>
              <p className="mt-2 text-xs text-text-muted">{item.durationMin} {t('learningHub.minRead')} {item.audioUrl ? `· ${t('learningHub.audio')}` : ''}</p>
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
};
