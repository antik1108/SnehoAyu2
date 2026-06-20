import React from 'react';
import { useTranslation } from 'react-i18next';
import type { DashboardBabySummary, DashboardHospitalSummary, DashboardParticipantSummary } from '../../features/dashboard/types';

interface BabyStatusCardProps {
  baby: DashboardBabySummary;
  participant?: DashboardParticipantSummary | null;
  hospital?: DashboardHospitalSummary | null;
}

export const BabyStatusCard: React.FC<BabyStatusCardProps> = ({ baby, participant, hospital }) => {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold text-text">{t('dashboard.babyStatus.title')}</h2>
      <div className="mt-3 space-y-2">
        <p className="text-lg font-semibold leading-tight">{baby.displayName}</p>
        <p className="text-sm text-text-muted">{t('dashboard.babyStatus.age')}: {baby.ageDisplay}</p>
        <p className="text-sm text-text-muted">{t('dashboard.babyStatus.correctedAge')}: {baby.correctedAgeDisplay}</p>
        <p className="text-sm text-text-muted">
          {t('dashboard.babyStatus.latestWeight')}: {baby.latestWeightGrams !== null ? `${baby.latestWeightGrams} g` : t('dashboard.common.notLoggedYet')}
        </p>
        {baby.latestWeightSource === 'discharge' && (
          <p className="text-xs text-text-muted">{t('dashboard.babyStatus.dischargeWeightSource')}</p>
        )}
        {participant && (
          <p className="text-xs text-text-muted">
            {t('dashboard.babyStatus.participantCode')}: {participant.participantCode}
          </p>
        )}
        {hospital && (
          <p className="text-xs text-text-muted">
            {hospital.name} · {hospital.code}
          </p>
        )}
      </div>
    </section>
  );
};
