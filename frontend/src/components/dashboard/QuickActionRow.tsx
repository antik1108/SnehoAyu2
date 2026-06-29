import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeartPulse, Thermometer, Timer } from 'lucide-react';

interface QuickActionRowProps {
  onAction: (focus: 'feeding' | 'temperature' | 'kmc') => void;
}

export const QuickActionRow: React.FC<QuickActionRowProps> = ({ onAction }) => {
  const { t } = useTranslation();

  const actions = [
    { key: 'feeding', label: t('dashboard.quickActions.feeding'), Icon: Timer },
    { key: 'temperature', label: t('dashboard.quickActions.temperature'), Icon: Thermometer },
    { key: 'kmc', label: t('dashboard.quickActions.kmc'), Icon: HeartPulse },
  ] as const;

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 lg:col-span-12">
      <h2 className="text-sm font-extrabold text-text">{t('dashboard.quickActions.title')}</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {actions.map(({ key, label, Icon }, index) => (
          <button
            key={key}
            type="button"
            onClick={() => onAction(key)}
            className={`interactive-card flex min-h-16 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-extrabold text-[#181715] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              index === 0 ? 'border-[#e7cd5d] bg-[#efd35c]' : index === 1 ? 'border-[#9bb6df] bg-[#aac3e9]' : 'border-[#8d9e59] bg-[#94a45f]'
            }`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/32">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            {label}
          </button>
        ))}
      </div>
    </section>
  );
};
