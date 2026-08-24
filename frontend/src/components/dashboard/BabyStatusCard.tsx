import React from 'react';
import { useTranslation } from 'react-i18next';
import { Baby, Hospital, IdCard } from 'lucide-react';
import type { DashboardBabySummary, DashboardHospitalSummary, DashboardParticipantSummary } from '../../features/dashboard/types';

interface BabyStatusCardProps {
  baby: DashboardBabySummary;
  participant?: DashboardParticipantSummary | null;
  hospital?: DashboardHospitalSummary | null;
}

export const BabyStatusCard: React.FC<BabyStatusCardProps> = ({ baby, participant, hospital }) => {
  const { t } = useTranslation();

  return (
    <section className="interactive-card relative overflow-hidden rounded-2xl border border-[#e7cd5d] bg-[#efd35c] p-5 text-[#181715] md:col-span-7 lg:col-span-7">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-[32px] bg-white/18 rotate-12" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase text-[#181715]/62">{t('dashboard.babyStatus.title')}</p>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight">{baby.displayName}</h2>
        </div>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#111] text-white">
          <Baby className="h-6 w-6" aria-hidden="true" />
        </span>
      </div>
      <div className="relative mt-5 grid gap-3 text-xs sm:text-sm sm:grid-cols-2">
        <p className="rounded-xl bg-white/28 p-3 font-bold">{t('dashboard.babyStatus.age')}: {baby.ageDisplay}</p>
        <p className="rounded-xl bg-white/28 p-3 font-bold">{t('dashboard.babyStatus.correctedAge')}: {baby.correctedAgeDisplay}</p>
        <p className="rounded-xl bg-white/28 p-3 font-bold sm:col-span-2">
          {t('dashboard.babyStatus.latestWeight')}: {baby.latestWeightGrams !== null ? `${baby.latestWeightGrams} g` : t('dashboard.common.notLoggedYet')}
        </p>
        {baby.latestWeightSource === 'discharge' && (
          <p className="text-xs font-semibold text-[#181715]/68 sm:col-span-2">{t('dashboard.babyStatus.dischargeWeightSource')}</p>
        )}
        {participant && (
          <p className="flex items-center gap-1.5 text-xs font-bold text-[#181715]/72">
            <IdCard className="h-3.5 w-3.5" aria-hidden="true" />
            {t('dashboard.babyStatus.participantCode')}: {participant.participantCode}
          </p>
        )}
        {hospital && (
          <p className="flex items-center gap-1.5 text-xs font-bold text-[#181715]/72">
            <Hospital className="h-3.5 w-3.5" aria-hidden="true" />
            {hospital.name} · {hospital.code}
          </p>
        )}
      </div>
    </section>
  );
};
