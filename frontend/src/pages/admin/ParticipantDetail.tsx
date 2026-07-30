import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchParticipantDetail, downloadParticipantExport } from '../../features/admin/api';
import type { ParticipantDetail as ParticipantDetailType } from '../../features/admin/types';
import { normalizeApiError } from '../../lib/apiError';
import { InlineFormError } from '../../components/feedback/InlineFormError';
import { ROUTES } from '../../routes/paths';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { StaffDataEntryPanel } from '../../components/admin/StaffDataEntryPanel';
import { AssessmentScoreHistoryTable } from '../../components/admin/AssessmentScoreHistoryTable';
import { GrowthChartAdmin } from '../../components/admin/GrowthChartAdmin';
import { DailyLogCalendar30Day } from '../../components/admin/DailyLogCalendar30Day';
import { DangerSignAlertManager } from '../../components/admin/DangerSignAlertManager';
import { Download, ArrowLeft } from 'lucide-react';

export const ParticipantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState<ParticipantDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(() => {
    if (!id) return;
    fetchParticipantDetail(id)
      .then(setData)
      .catch((err) => setError(normalizeApiError(err).message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleExport = async () => {
    if (!id || !data) return;
    setExporting(true);
    try {
      await downloadParticipantExport(id, data.participantCode ?? undefined);
    } catch (err: any) {
      setError(err?.message || 'Failed to export participant workbook');
    } finally {
      setExporting(false);
    }
  };

  const handleBack = () => {
    // Preserve URL search params from back navigation if available
    const searchParams = location.search;
    navigate(`${ROUTES.ADMIN_PARTICIPANTS}${searchParams}`);
  };

  return (
    <div className="care-canvas min-h-screen">
      <AdminHeader />
      <div className="mx-auto max-w-6xl p-5 lg:p-8">
        {/* Navigation & Export Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2 text-xs font-bold text-text-main shadow-xs hover:bg-neutral-50"
          >
            <ArrowLeft className="h-4 w-4 text-text-muted" />
            Back to participant directory
          </button>

          {data && (
            <button
              type="button"
              disabled={exporting}
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-dark disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {exporting ? 'Generating...' : 'Export participant Excel'}
            </button>
          )}
        </div>

        {error && <InlineFormError message={error} />}

        {loading ? (
          <div className="flex items-center justify-center py-24 text-sm text-text-muted">
            Loading participant profile...
          </div>
        ) : data && id ? (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="rounded-[24px] border border-border bg-white p-6 shadow-sm lg:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="font-technical text-3xl font-extrabold text-text-main">
                      {data.participantCode ?? id.slice(0, 8)}
                    </h1>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase ${
                        data.studyGroup === 'study'
                          ? 'bg-emerald-100 text-emerald-800'
                          : data.studyGroup === 'control'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {data.studyGroup ?? 'Unassigned'} Group
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-text-muted">
                    {data.fullName} · Hospital: <strong>{data.hospital?.name ?? '—'}</strong> ({data.hospital?.code})
                  </p>
                </div>

                {data.studyGroup === 'study' && data.engagementTier && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-right">
                    <div className="text-[10px] font-extrabold uppercase text-emerald-800">Engagement Score</div>
                    <div className="text-xl font-extrabold text-emerald-900">{data.engagementScore ?? 0}%</div>
                    <div className="text-[10px] font-bold text-emerald-700 capitalize">{data.engagementTier} Tier</div>
                  </div>
                )}
              </div>

              {/* Stratum & Metadata Summary */}
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-4 lg:grid-cols-6 text-xs">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-text-muted">Birth Weight Stratum</span>
                  <div className="mt-0.5 font-bold text-text-main">
                    {data.babyProfile?.birthWeightStratum
                      ? data.babyProfile.birthWeightStratum.replace('_to_', '-').replace('under_', '<').replace('over_', '>')
                      : '—'}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-text-muted">Contact Number</span>
                  <div className="mt-0.5 font-bold text-text-main">{data.contactNumber || '—'}</div>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-text-muted">Enrolled Date</span>
                  <div className="mt-0.5 font-bold text-text-main">{data.enrolledAt.slice(0, 10)}</div>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-text-muted">Days Enrolled</span>
                  <div className="mt-0.5 font-bold text-text-main">{data.daysSinceEnrollment} days</div>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-text-muted">Last Active</span>
                  <div className="mt-0.5 font-bold text-text-main">{data.lastActiveDate || '—'}</div>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-text-muted">Onboarding</span>
                  <div className="mt-0.5 font-bold text-text-main">
                    {data.onboardingCompletedAt ? 'Completed' : 'Pending'}
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Data Entry Panel */}
            <StaffDataEntryPanel motherProfileId={id} onRefresh={load} />

            {/* Assessment Score History Matrix */}
            <AssessmentScoreHistoryTable data={data} />

            {/* Growth Chart */}
            <GrowthChartAdmin participantId={id} babyProfile={data.babyProfile} />

            {/* 30-Day Care Task Calendar */}
            <DailyLogCalendar30Day dailyLogs={data.dailyLogs30Day} />

            {/* Danger Sign Alert History & Resolution */}
            <DangerSignAlertManager alerts={data.dangerSignAlerts} onRefresh={load} />

            {/* Immunization Summary */}
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-sans text-sm font-extrabold text-text-main">Immunization History</h3>
              {data.vaccineRecords?.length === 0 ? (
                <p className="text-xs font-medium text-text-muted">No vaccine records logged yet.</p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {data.vaccineRecords?.map((v, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl border border-border bg-neutral-50/50 p-3 text-xs">
                      <span className="font-bold text-text-main">{v.vaccineName}</span>
                      <span className="text-text-muted">
                        {v.completedDate ? `Given: ${v.completedDate.slice(0, 10)}` : `Due: ${v.dueDate.slice(0, 10)}`} ({v.status})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
