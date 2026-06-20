import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppShell } from '../layout/AppShell';

interface FeaturePlaceholderPageProps {
  titleKey: string;
  bodyKey: string;
}

export const FeaturePlaceholderPage: React.FC<FeaturePlaceholderPageProps> = ({ titleKey, bodyKey }) => {
  const { t } = useTranslation();

  return (
    <AppShell>
      <section className="rounded-2xl border border-border bg-surface p-4">
        <h1 className="text-lg font-semibold text-text">{t(titleKey)}</h1>
        <p className="mt-2 text-sm leading-6 text-text-muted">{t(bodyKey)}</p>
      </section>
    </AppShell>
  );
};
