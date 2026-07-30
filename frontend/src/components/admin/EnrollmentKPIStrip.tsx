import React from 'react';
import { OverviewData } from '../../features/admin/analyticsHooks';
import { Users, UserCheck, Activity, AlertTriangle, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const EnrollmentKPIStrip: React.FC<{ data?: OverviewData; isLoading: boolean }> = ({
  data,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-200/60 p-4" />
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Enrolled',
      value: data?.totalEnrolled ?? 0,
      subText: `${data?.awaitingAssignment ?? 0} unassigned`,
      icon: Users,
      color: 'text-primary bg-primary/10',
    },
    {
      title: 'Study Group',
      value: `${data?.studyCount ?? 0}/136`,
      subText: 'Target: 136',
      icon: UserCheck,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Control Group',
      value: `${data?.controlCount ?? 0}/136`,
      subText: 'Target: 136',
      icon: CheckCircle2,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Onboarded',
      value: data?.onboardedCount ?? 0,
      subText: `${data?.onboardedPct ?? 0}% completed`,
      icon: Activity,
      color: 'text-teal-600 bg-teal-50',
    },
    {
      title: 'Active (7 Days)',
      value: data?.activeLastSevenDays ?? 0,
      subText: 'Study group logs',
      icon: Clock,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      title: 'Overdue Checkpoints',
      value: data?.overdueCheckpointCount ?? 0,
      subText: `${data?.overdueParticipants?.length ?? 0} participants`,
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'Open Danger Signs',
      value: data?.openDangerSignCount ?? 0,
      subText: 'Requires review',
      icon: ShieldAlert,
      color: 'text-red-600 bg-red-50',
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div key={index} className="flex flex-col justify-between rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase text-text-muted">{kpi.title}</span>
              <div className={`rounded-xl p-2 ${kpi.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-sans text-2xl font-extrabold text-text-main">{kpi.value}</div>
              <div className="mt-0.5 text-[11px] font-medium text-text-muted">{kpi.subText}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
