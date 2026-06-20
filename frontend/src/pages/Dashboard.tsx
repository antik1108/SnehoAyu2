import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppShell } from '../components/layout/AppShell';
import { DashboardSkeleton } from '../components/dashboard/DashboardSkeleton';
import { DashboardErrorState } from '../components/dashboard/DashboardErrorState';
import { DashboardRecoveryState } from '../components/dashboard/DashboardRecoveryState';
import { BabyStatusCard } from '../components/dashboard/BabyStatusCard';
import { CareProgressRing } from '../components/dashboard/CareProgressRing';
import { QuickActionRow } from '../components/dashboard/QuickActionRow';
import { HealthStatsStrip } from '../components/dashboard/HealthStatsStrip';
import { FeedingSummaryCard } from '../components/dashboard/FeedingSummaryCard';
import { NextReminderCard } from '../components/dashboard/NextReminderCard';
import { DailyMessageCard } from '../components/dashboard/DailyMessageCard';
import { getDashboardHome } from '../features/dashboard/api';
import type { DashboardHomeData } from '../features/dashboard/types';
import { ROUTES } from '../routes/paths';
import type { AppApiError } from '../lib/apiError';
import { ChecklistStateCard } from '../components/dashboard/ChecklistStateCard';

function mapRecoveryRoute(code?: string): string {
  switch (code) {
    case 'MOTHER_PROFILE_REQUIRED':
      return ROUTES.MOTHER_PROFILE;
    case 'BABY_PROFILE_REQUIRED':
      return ROUTES.BABY_PROFILE;
    case 'HOSPITAL_LINK_REQUIRED':
    case 'PARTICIPANT_CODE_REQUIRED':
    case 'ONBOARDING_INCOMPLETE':
      return ROUTES.HOSPITAL_CODE;
    default:
      return ROUTES.SIGNUP_COMPLETE;
  }
}

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [data, setData] = useState<DashboardHomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppApiError | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getDashboardHome();
      setData(response.data);
    } catch (err) {
      setError(err as AppApiError);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardInitial = async () => {
    try {
      const response = await getDashboardHome();
      setData(response.data);
    } catch (err) {
      setError(err as AppApiError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadDashboardInitial();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const handleQuickAction = (focus: 'feeding' | 'temperature' | 'kmc') => {
    navigate(`${ROUTES.CHECKLIST}?focus=${focus}`);
  };

  if (loading) {
    return (
      <AppShell title={t('dashboard.title')} subtitle={t('dashboard.subtitle')}>
        <DashboardSkeleton />
      </AppShell>
    );
  }

  if (error) {
    const recoveryCodes = new Set([
      'MOTHER_PROFILE_REQUIRED',
      'BABY_PROFILE_REQUIRED',
      'HOSPITAL_LINK_REQUIRED',
      'PARTICIPANT_CODE_REQUIRED',
      'ONBOARDING_INCOMPLETE',
    ]);

    if (recoveryCodes.has(error.code)) {
      return (
        <AppShell title={t('dashboard.title')} subtitle={t('dashboard.subtitle')}>
          <DashboardRecoveryState
            message={t(`dashboard.recovery.${error.code}`, t('dashboard.recovery.generic'))}
            actionLabel={t('dashboard.recovery.action')}
            to={mapRecoveryRoute(error.code)}
          />
        </AppShell>
      );
    }

    return (
      <AppShell title={t('dashboard.title')} subtitle={t('dashboard.subtitle')}>
        <DashboardErrorState message={error.message} onRetry={loadDashboard} />
      </AppShell>
    );
  }

  if (!data || !data.baby || !data.participant || !data.hospital) {
    return (
      <AppShell title={t('dashboard.title')} subtitle={t('dashboard.subtitle')}>
        <DashboardRecoveryState
          message={t('dashboard.recovery.generic')}
          actionLabel={t('dashboard.recovery.action')}
          to={ROUTES.HOSPITAL_CODE}
        />
      </AppShell>
    );
  }

  return (
    <AppShell title={t('dashboard.title')} subtitle={t('dashboard.subtitle')}>
      <div className="space-y-4">
        <BabyStatusCard baby={data.baby} participant={data.participant} hospital={data.hospital} />
        <CareProgressRing
          percent={data.careToday.completionPercent}
          completedCount={data.careToday.completedCount}
          totalCount={data.careToday.totalCount}
          label={t('dashboard.careProgress.title')}
        />
        <QuickActionRow onAction={handleQuickAction} />
        <HealthStatsStrip healthStats={data.healthStats} />
        <FeedingSummaryCard feeding={data.feeding} />
        <NextReminderCard nextReminder={data.nextReminder} />
        <DailyMessageCard dailyMessage={data.dailyMessage} />
        {data.careToday.available ? null : <ChecklistStateCard />}
      </div>
    </AppShell>
  );
};
