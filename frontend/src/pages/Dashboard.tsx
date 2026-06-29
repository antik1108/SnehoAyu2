import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CalendarDays, HeartPulse, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
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
import { TelehealthCard } from '../components/dashboard/TelehealthCard';
import { getDashboardHome } from '../features/dashboard/api';
import type { DashboardHomeData } from '../features/dashboard/types';
import { ROUTES, getHomeRouteForRole } from '../routes/paths';
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
  const { user } = useAuth();

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
    // Skip the fetch entirely for non-mother roles — this endpoint always
    // 403s for them. The redirect guard below handles navigating away, but
    // hooks run unconditionally before that return, so without this check
    // the request would still fire once on every mount.
    if (user && user.role !== 'mother') return;

    const timeoutId = window.setTimeout(() => {
      void loadDashboardInitial();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [user]);

  const handleQuickAction = (focus: 'feeding' | 'temperature' | 'kmc') => {
    navigate(`${ROUTES.CHECKLIST}?focus=${focus}`);
  };

  // This dashboard calls mother-only endpoints. A researcher/nurse account
  // landing here (stale bookmark, back button) would otherwise see a
  // confusing "could not load" error — send them to their real home instead.
  if (user && user.role !== 'mother') {
    return <Navigate to={getHomeRouteForRole(user.role)} replace />;
  }

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
      <section className="mb-5 grid overflow-hidden rounded-[28px] border border-border bg-[#111] text-white lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-6 lg:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#efd35c] px-3 py-1.5 text-xs font-extrabold text-[#111]">
              {data.participant.participantCode ?? 'Active participant'}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-extrabold text-white/75">
              {data.hospital.code}
            </span>
          </div>
          <h2 className="mt-5 max-w-2xl text-4xl font-extrabold leading-tight lg:text-6xl">
            {data.baby.displayName}'s care today
          </h2>
          <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/68">
            Quick view of daily care progress, last vitals, feeding, learning and follow-up reminders.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/8 p-4">
              <CalendarDays className="h-5 w-5 text-[#efd35c]" aria-hidden="true" />
              <p className="mt-3 text-xs font-bold text-white/52">Today</p>
              <p className="text-sm font-extrabold">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            </div>
            <div className="rounded-2xl bg-white/8 p-4">
              <HeartPulse className="h-5 w-5 text-[#efa8d0]" aria-hidden="true" />
              <p className="mt-3 text-xs font-bold text-white/52">Care tasks</p>
              <p className="text-sm font-extrabold">{data.careToday.completedCount}/{data.careToday.totalCount} done</p>
            </div>
            <div className="rounded-2xl bg-white/8 p-4">
              <Sparkles className="h-5 w-5 text-[#aac3e9]" aria-hidden="true" />
              <p className="mt-3 text-xs font-bold text-white/52">Corrected age</p>
              <p className="text-sm font-extrabold">{data.baby.correctedAgeDisplay}</p>
            </div>
          </div>
        </div>
        <div className="relative min-h-64 overflow-hidden lg:min-h-full">
          <img
            src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="care-photo-overlay absolute inset-0" />
        </div>
      </section>
      <div className="grid gap-4 lg:grid-cols-12 lg:items-start">
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
        <TelehealthCard />
        {data.careToday.available ? null : <ChecklistStateCard />}
      </div>
    </AppShell>
  );
};
