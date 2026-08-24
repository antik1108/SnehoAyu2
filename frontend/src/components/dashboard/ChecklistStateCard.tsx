import React from 'react';
import { useTranslation } from 'react-i18next';

interface ChecklistStateCardProps {
  focus?: 'feeding' | 'temperature' | 'kmc';
}

export const ChecklistStateCard: React.FC<ChecklistStateCardProps> = ({ focus }) => {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-border bg-surface p-4 md:col-span-12 lg:col-span-12">
      <h1 className="text-base font-semibold text-text">{t('dashboard.checklist.title')}</h1>
      <p className="mt-2 text-sm leading-6 text-text-muted">{t('dashboard.checklist.empty')}</p>
      {focus ? <p className="mt-2 text-xs text-text-muted">{t(`dashboard.checklist.focus.${focus}`)}</p> : null}
    </section>
  );
};
