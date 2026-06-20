import React from 'react';
import { useTranslation } from 'react-i18next';

interface QuickActionRowProps {
  onAction: (focus: 'feeding' | 'temperature' | 'kmc') => void;
}

export const QuickActionRow: React.FC<QuickActionRowProps> = ({ onAction }) => {
  const { t } = useTranslation();

  const actions = [
    { key: 'feeding', label: t('dashboard.quickActions.feeding') },
    { key: 'temperature', label: t('dashboard.quickActions.temperature') },
    { key: 'kmc', label: t('dashboard.quickActions.kmc') },
  ] as const;

  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold text-text">{t('dashboard.quickActions.title')}</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {actions.map((action) => (
          <button
            key={action.key}
            type="button"
            onClick={() => onAction(action.key)}
            className="min-h-12 rounded-xl border border-border bg-background px-3 py-3 text-sm font-medium text-text transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
};
