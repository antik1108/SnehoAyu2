import React from 'react';
import { useTranslation } from 'react-i18next';

export const GrowthEmptyState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <h2 className="text-base font-semibold text-text">{t('growth.empty.title')}</h2>
      <p className="mt-2 text-sm leading-6 text-text-muted">{t('growth.empty.body')}</p>
    </section>
  );
};
