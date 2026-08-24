import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HeartPulse, Thermometer, Timer, AlertTriangle } from 'lucide-react';
import { ROUTES } from '../../routes/paths';

interface QuickActionRowProps {
  onAction: (focus: 'feeding' | 'temperature' | 'kmc') => void;
}

export const QuickActionRow: React.FC<QuickActionRowProps> = ({ onAction }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 md:col-span-12 lg:col-span-12">
      <h2 className="text-sm font-extrabold text-text">{t('dashboard.quickActions.title')}</h2>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Log Feeding */}
        <button
          type="button"
          onClick={() => onAction('feeding')}
          className="interactive-card flex min-h-16 items-center gap-3 rounded-xl border border-[#e7cd5d] bg-[#efd35c] px-4 py-3 text-left text-sm font-extrabold text-[#181715] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/32">
            <Timer className="h-5 w-5" aria-hidden="true" />
          </span>
          {t('dashboard.quickActions.feeding')}
        </button>

        {/* Log Temperature */}
        <button
          type="button"
          onClick={() => onAction('temperature')}
          className="interactive-card flex min-h-16 items-center gap-3 rounded-xl border border-[#9bb6df] bg-[#aac3e9] px-4 py-3 text-left text-sm font-extrabold text-[#181715] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/32">
            <Thermometer className="h-5 w-5" aria-hidden="true" />
          </span>
          {t('dashboard.quickActions.temperature')}
        </button>

        {/* Log KMC */}
        <button
          type="button"
          onClick={() => onAction('kmc')}
          className="interactive-card flex min-h-16 items-center gap-3 rounded-xl border border-[#8d9e59] bg-[#94a45f] px-4 py-3 text-left text-sm font-extrabold text-[#181715] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/32">
            <HeartPulse className="h-5 w-5" aria-hidden="true" />
          </span>
          {t('dashboard.quickActions.kmc')}
        </button>

        {/* Check My Baby — Phase 4 P0 danger sign entry point (KB §4, plan §3 Phase 4) */}
        <button
          type="button"
          onClick={() => navigate(ROUTES.DANGER_SIGNS)}
          className="interactive-card flex min-h-16 items-center gap-3 rounded-xl border border-red-400 bg-red-500 px-4 py-3 text-left text-sm font-extrabold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>
          {t('dashboard.quickActions.checkBaby')}
        </button>
      </div>
    </section>
  );
};
