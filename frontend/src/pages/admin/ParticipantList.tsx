import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { FilterPanel } from '../../features/admin/FilterPanel';
import { FilterContextProvider, useFilters } from '../../features/admin/FilterContext';
import { CohortOverview } from '../../components/admin/CohortOverview';
import { fetchParticipants, downloadCohortExport, downloadParticipantExport, fetchParticipantDetail } from '../../features/admin/api';
import type { ParticipantDetail as ParticipantDetailType } from '../../features/admin/types';
import {
  Search,
  Download,
  AlertTriangle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronRight,
  Phone,
  User as UserIcon,
  Baby,
  MapPin,
  ClipboardList,
  BarChart4,
  AlertCircle
} from 'lucide-react';
import { InlineFormError } from '../../components/feedback/InlineFormError';

type SortField =
  | 'participantCode'
  | 'hospital'
  | 'studyGroup'
  | 'birthWeightStratum'
  | 'enrolledAt'
  | 'daysSinceEnrollment'
  | 'lastActiveDate'
  | 'onboardingCompletedAt';

type SortOrder = 'asc' | 'desc';

// Dynamic sub-row component to fetch and display participant/baby details inline
const ParticipantRowExpanded: React.FC<{ id: string }> = ({ id }) => {
  const [data, setData] = useState<ParticipantDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchParticipantDetail(id)
      .then((res) => {
        if (active) setData(res);
      })
      .catch(() => {
        if (active) setError('Failed to load detailed profile.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center gap-2.5 py-5 px-8 text-xs font-semibold text-text-muted bg-neutral-50/50">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        Fetching participant details...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-4 px-8 text-xs text-rose-600 font-semibold bg-rose-50/30 border-t border-b border-rose-200">
        {error || 'Failed to load details.'}
      </div>
    );
  }

  return (
    <div className="bg-neutral-50/50 p-6 border-t border-b border-border/60">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-xs">
        {/* Mother Details */}
        <div className="rounded-2xl border border-border/80 bg-white p-4.5 shadow-xs">
          <h4 className="flex items-center gap-2 font-extrabold text-[#111] mb-3 uppercase tracking-wider text-[10px]">
            <UserIcon className="h-4 w-4 text-primary" /> Mother Info
          </h4>
          <div className="space-y-2.5">
            <div>
              <span className="text-[10px] text-text-muted font-extrabold uppercase block">Full Name</span>
              <span className="font-bold text-[#111] text-sm">{data.fullName || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted font-extrabold uppercase block">Contact Number</span>
              <span className="font-bold text-[#111] flex items-center gap-1.5 mt-0.5">
                <Phone className="h-3.5 w-3.5 text-text-muted" /> {data.contactNumber || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Baby Details */}
        <div className="rounded-2xl border border-border/80 bg-white p-4.5 shadow-xs">
          <h4 className="flex items-center gap-2 font-extrabold text-[#111] mb-3 uppercase tracking-wider text-[10px]">
            <Baby className="h-4 w-4 text-primary" /> Infant Info
          </h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            <div>
              <span className="text-[10px] text-text-muted font-extrabold uppercase block">Baby Name</span>
              <span className="font-bold text-[#111]">{data.babyProfile?.babyName || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted font-extrabold uppercase block">Sex</span>
              <span className="font-bold text-[#111] capitalize">{data.babyProfile?.sex || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted font-extrabold uppercase block">Date of Birth</span>
              <span className="font-bold text-[#111]">{data.babyProfile?.dateOfBirth || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted font-extrabold uppercase block">Gestational Age</span>
              <span className="font-bold text-[#111]">{data.babyProfile?.gestationalAgeWeeks ? `${data.babyProfile.gestationalAgeWeeks} weeks` : '—'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] text-text-muted font-extrabold uppercase block">Birth Weight</span>
              <span className="font-bold text-[#111]">{data.babyProfile?.birthWeightGrams ? `${data.babyProfile.birthWeightGrams} grams` : '—'}</span>
            </div>
          </div>
        </div>

        {/* Site & Alerts Info */}
        <div className="rounded-2xl border border-border/80 bg-white p-4.5 shadow-xs">
          <h4 className="flex items-center gap-2 font-extrabold text-[#111] mb-3 uppercase tracking-wider text-[10px]">
            <MapPin className="h-4 w-4 text-primary" /> Site & Flags
          </h4>
          <div className="space-y-2.5">
            <div>
              <span className="text-[10px] text-text-muted font-extrabold uppercase block">Assigned Site</span>
              <span className="font-bold text-[#111]">{data.hospital?.name || '—'} ({data.hospital?.code || '—'})</span>
            </div>
            <div>
              <span className="text-[10px] text-text-muted font-extrabold uppercase block">Active Danger Sign Flags</span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 mt-1 text-[10px] font-extrabold ${
                data.dangerSignAlerts?.filter(a => a.status === 'OPEN').length > 0
                  ? 'bg-rose-500/10 text-rose-700 border border-rose-500/20'
                  : 'bg-teal-500/10 text-teal-700 border border-teal-500/20'
              }`}>
                {data.dangerSignAlerts?.filter(a => a.status === 'OPEN').length || 0} Open Alerts
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          to={`/admin/participants/${id}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition-all"
        >
          View Full Clinical Profile →
        </Link>
      </div>
    </div>
  );
};

export const ParticipantListContent: React.FC = () => {
  const navigate = useNavigate();
  const { filters } = useFilters();

  const [activeTab, setActiveTab] = useState<'directory' | 'analytics' | 'alerts'>('directory');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('enrolledAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const pageSize = 50;

  // React Query to fetch participants driven by FilterContext
  const {
    data: participants = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['admin', 'participants', filters],
    queryFn: () => fetchParticipants(filters),
    staleTime: 60_000,
  });

  // Filter by search term
  const searchedParticipants = useMemo(() => {
    if (!searchTerm.trim()) return participants;
    const term = searchTerm.trim().toLowerCase();
    return participants.filter((p) =>
      p.participantCode ? p.participantCode.toLowerCase().includes(term) : false
    );
  }, [participants, searchTerm]);

  // Sort participants
  const sortedParticipants = useMemo(() => {
    const list = [...searchedParticipants];
    list.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'hospital') {
        valA = a.hospital?.name ?? '';
        valB = b.hospital?.name ?? '';
      }

      if (valA === null || valA === undefined) valA = '';
      if (valB === null || valB === undefined) valB = '';

      if (typeof valA === 'string') {
        const cmp = valA.localeCompare(valB as string);
        return sortOrder === 'asc' ? cmp : -cmp;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [searchedParticipants, sortField, sortOrder]);

  // Filter participants to display based on active tab
  const displayedParticipants = useMemo(() => {
    if (activeTab === 'alerts') {
      return sortedParticipants.filter(
        (p) => p.hasDangerSignFlag || p.isOverdue || p.engagementTier === 'low' || p.engagementTier === 'inactive'
      );
    }
    return sortedParticipants;
  }, [sortedParticipants, activeTab]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(displayedParticipants.length / pageSize));
  const paginatedParticipants = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return displayedParticipants.slice(start, start + pageSize);
  }, [displayedParticipants, currentPage]);

  const totalAlertsCount = useMemo(() => {
    return participants.filter(
      (p) => p.hasDangerSignFlag || p.isOverdue || p.engagementTier === 'low' || p.engagementTier === 'inactive'
    ).length;
  }, [participants]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAllVisible = (checked: boolean) => {
    const newSet = new Set(selectedIds);
    paginatedParticipants.forEach((p) => {
      if (checked) newSet.add(p.id);
      else newSet.delete(p.id);
    });
    setSelectedIds(newSet);
  };

  const handleToggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleExportSelected = async () => {
    if (selectedIds.size === 0) return;
    setExporting(true);
    setExportError(null);
    try {
      for (const id of Array.from(selectedIds)) {
        const p = participants.find((item) => item.id === id);
        await downloadParticipantExport(id, p?.participantCode ?? undefined);
      }
    } catch (err: any) {
      setExportError(err?.message || 'Failed to export selected participants');
    } finally {
      setExporting(false);
    }
  };

  const handleExportCohort = async () => {
    setExporting(true);
    setExportError(null);
    try {
      await downloadCohortExport(filters);
    } catch (err: any) {
      setExportError(err?.response?.data?.message || err?.message || 'Failed to export cohort');
    } finally {
      setExporting(false);
    }
  };

  const handleTabChange = (tab: 'directory' | 'analytics' | 'alerts') => {
    setActiveTab(tab);
    setCurrentPage(1);
    setExpandedId(null);
  };

  // Build search params string from current filters to attach to participant profile URL
  const filterQueryParams = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== null && val !== undefined) {
        params.set(key, String(val));
      }
    });
    const str = params.toString();
    return str ? `?${str}` : '';
  }, [filters]);

  const allVisibleSelected =
    paginatedParticipants.length > 0 &&
    paginatedParticipants.every((p) => selectedIds.has(p.id));

  return (
    <div className="care-canvas min-h-screen">
      <AdminHeader />
      <div className="mx-auto max-w-7xl p-5 lg:p-8">
        {/* Banner */}
        <div className="mb-6 rounded-[28px] bg-[#111] p-6 text-white lg:p-8">
          <p className="text-xs font-extrabold uppercase text-white/55">Research dashboard</p>
          <h1 className="mt-2 font-sans text-4xl font-extrabold lg:text-5xl">Participant Directory</h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-white/70">
            Real-time participant cohort tracking across all study sites. Filter, inspect, and export cohort data.
          </p>
        </div>

        {/* Sleek Navigation Tabs */}
        <div className="mb-6 flex gap-2 border-b border-border pb-px overflow-x-auto">
          <button
            type="button"
            onClick={() => handleTabChange('directory')}
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'directory'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            Directory List
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('analytics')}
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            <BarChart4 className="h-4 w-4" />
            Cohort Analytics
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('alerts')}
            className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'alerts'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            <AlertCircle className="h-4 w-4" />
            High-Risk & Alerts
            {totalAlertsCount > 0 && (
              <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-extrabold text-white">
                {totalAlertsCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content: Cohort Analytics */}
        {activeTab === 'analytics' && <CohortOverview />}

        {/* Tab Content: Directory & Alerts */}
        {activeTab !== 'analytics' && (
          <>
            {/* Filter Controls Panel */}
            <FilterPanel />

            {/* Error Banners */}
            {isError && (
              <InlineFormError message={(error as any)?.message || 'Failed to load participants.'} />
            )}
            {exportError && <InlineFormError message={exportError} />}

            {/* Action Header & Search */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search by participant code..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-border bg-surface pl-9 pr-4 py-2 text-xs font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={exporting}
                  onClick={handleExportCohort}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  {exporting ? 'Generating...' : 'Export cohort Excel'}
                </button>
              </div>
            </div>

            {/* Participant Table */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20 text-sm text-text-muted">
                Loading cohort data...
              </div>
            ) : displayedParticipants.length === 0 ? (
              <div className="rounded-2xl border border-border bg-surface p-12 text-center text-sm font-medium text-text-muted">
                No participants match the current search or filter criteria.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
                <table className="care-table w-full text-left text-xs">
                  <thead className="border-b border-border bg-neutral-50/70 text-[11px] font-extrabold uppercase text-text-muted">
                    <tr>
                      <th className="px-3 py-3 w-10">
                        <input
                          type="checkbox"
                          checked={allVisibleSelected}
                          onChange={(e) => handleSelectAllVisible(e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary/20"
                        />
                      </th>
                      <th className="w-8"></th>
                      <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort('participantCode')}>
                        <div className="flex items-center gap-1">
                          Code
                          <SortIcon field="participantCode" current={sortField} order={sortOrder} />
                        </div>
                      </th>
                      <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort('hospital')}>
                        <div className="flex items-center gap-1">
                          Site
                          <SortIcon field="hospital" current={sortField} order={sortOrder} />
                        </div>
                      </th>
                      <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort('studyGroup')}>
                        <div className="flex items-center gap-1">
                          Group
                          <SortIcon field="studyGroup" current={sortField} order={sortOrder} />
                        </div>
                      </th>
                      <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort('birthWeightStratum')}>
                        <div className="flex items-center gap-1">
                          Stratum
                          <SortIcon field="birthWeightStratum" current={sortField} order={sortOrder} />
                        </div>
                      </th>
                      <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort('enrolledAt')}>
                        <div className="flex items-center gap-1">
                          Enrolled Date
                          <SortIcon field="enrolledAt" current={sortField} order={sortOrder} />
                        </div>
                      </th>
                      <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort('daysSinceEnrollment')}>
                        <div className="flex items-center gap-1">
                          Days
                          <SortIcon field="daysSinceEnrollment" current={sortField} order={sortOrder} />
                        </div>
                      </th>
                      <th className="px-3 py-3 cursor-pointer" onClick={() => handleSort('lastActiveDate')}>
                        <div className="flex items-center gap-1">
                          Last Active
                          <SortIcon field="lastActiveDate" current={sortField} order={sortOrder} />
                        </div>
                      </th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Next Checkpoint</th>
                      <th className="px-3 py-3">Engagement</th>
                      <th className="px-3 py-3 text-center">Alerts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedParticipants.map((p) => {
                      const isSelected = selectedIds.has(p.id);
                      const isExpanded = expandedId === p.id;
                      return (
                        <React.Fragment key={p.id}>
                          <tr
                            onClick={() => setExpandedId(isExpanded ? null : p.id)}
                            className={`cursor-pointer transition-colors hover:bg-neutral-50/80 ${
                              isSelected ? 'bg-primary/5' : ''
                            } ${
                              p.hasDangerSignFlag
                                ? 'border-l-4 border-l-rose-500 bg-rose-500/5'
                                : p.isOverdue
                                ? 'border-l-4 border-l-amber-500 bg-amber-500/5'
                                : ''
                            }`}
                          >
                            <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelect(p.id)}
                                className="rounded border-border text-primary focus:ring-primary/20"
                              />
                            </td>
                            <td className="px-1 py-3 text-center" onClick={(e) => {
                              e.stopPropagation();
                              setExpandedId(isExpanded ? null : p.id);
                            }}>
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-text-muted hover:text-text-main" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-text-muted hover:text-text-main" />
                              )}
                            </td>
                            <td className="px-3 py-3 font-technical font-bold" onClick={(e) => e.stopPropagation()}>
                              <Link
                                to={`/admin/participants/${p.id}${filterQueryParams}`}
                                className="text-primary hover:underline"
                              >
                                {p.participantCode ?? p.id.slice(0, 8)}
                              </Link>
                            </td>
                            <td className="px-3 py-3 font-medium">{p.hospital?.name ?? '—'}</td>
                            <td className="px-3 py-3 capitalize font-medium">{p.studyGroup ?? 'Unassigned'}</td>
                            <td className="px-3 py-3 font-medium">
                              {p.birthWeightStratum
                                ? p.birthWeightStratum.replace('_to_', '-').replace('under_', '<').replace('over_', '>')
                                : '—'}
                            </td>
                            <td className="px-3 py-3 font-medium">{p.enrolledAt.slice(0, 10)}</td>
                            <td className="px-3 py-3 font-medium">{p.daysSinceEnrollment}d</td>
                            <td className="px-3 py-3 font-medium">{p.lastActiveDate ?? '—'}</td>
                            <td className="px-3 py-3">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                                  p.onboardingCompletedAt
                                    ? 'bg-teal-500/10 text-teal-700 border-teal-500/20'
                                    : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                                }`}
                              >
                                {p.onboardingCompletedAt ? 'Onboarded' : 'Pending'}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              {p.nextCheckpoint ? (
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                                    p.isOverdue
                                      ? 'bg-rose-500/10 text-rose-700 border-rose-500/20'
                                      : p.isDueSoon
                                      ? 'bg-blue-500/10 text-blue-700 border-blue-500/20'
                                      : 'bg-neutral-500/10 text-neutral-700 border-neutral-500/10'
                                  }`}
                                >
                                  {p.nextCheckpoint.timePoint} ({p.nextCheckpoint.scheduledDate})
                                </span>
                              ) : (
                                <span className="text-text-muted">—</span>
                              )}
                            </td>
                            <td className="px-3 py-3">
                              {p.studyGroup === 'study' && p.engagementTier ? (
                                <EngagementChip tier={p.engagementTier} score={p.engagementScore} />
                              ) : (
                                <span className="text-text-muted">—</span>
                              )}
                            </td>
                            <td className="px-3 py-3 text-center">
                              {p.hasDangerSignFlag && (
                                <span title="Active Danger Sign Flag">
                                  <AlertTriangle className="mx-auto h-4 w-4 text-rose-500" />
                                </span>
                              )}
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr>
                              <td colSpan={13} className="p-0">
                                <ParticipantRowExpanded id={p.id} />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Bar */}
            {totalPages > 1 && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-medium text-text-muted">
                  Showing {(currentPage - 1) * pageSize + 1}–
                  {Math.min(currentPage * pageSize, displayedParticipants.length)} of {displayedParticipants.length} participants
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="rounded-lg border border-border bg-surface px-3 py-1.5 font-bold text-text-main disabled:opacity-40"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                    .map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`rounded-lg px-3 py-1.5 font-bold ${
                          currentPage === page
                            ? 'bg-primary text-white'
                            : 'border border-border bg-surface text-text-main hover:bg-neutral-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-lg border border-border bg-surface px-3 py-1.5 font-bold text-text-main disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Floating Bulk Action Toolbar */}
        {selectedIds.size > 0 && (
          <div className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-4 rounded-full border border-neutral-800 bg-[#111] px-6 py-3.5 text-white shadow-xl animate-fade-in">
            <span className="text-xs font-bold">
              {selectedIds.size} participant{selectedIds.size > 1 ? 's' : ''} selected
            </span>
            <div className="h-4 w-px bg-white/20" />
            <button
              type="button"
              disabled={exporting}
              onClick={handleExportSelected}
              className="flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-extrabold text-[#111] shadow-sm hover:bg-neutral-100 active:scale-95 transition-all disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              {exporting ? 'Exporting...' : 'Export Selected'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="text-xs font-bold text-white/60 hover:text-white transition-colors"
            >
              Deselect All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const SortIcon: React.FC<{ field: SortField; current: SortField; order: SortOrder }> = ({
  field,
  current,
  order,
}) => {
  if (field !== current) return <ArrowUpDown className="h-3 w-3 text-text-muted/60" />;
  return order === 'asc' ? (
    <ArrowUp className="h-3 w-3 text-primary" />
  ) : (
    <ArrowDown className="h-3 w-3 text-primary" />
  );
};

const EngagementChip: React.FC<{ tier: 'high' | 'medium' | 'low' | 'inactive'; score: number | null }> = ({
  tier,
  score,
}) => {
  const styles = {
    high: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
    medium: 'bg-yellow-500/10 text-yellow-700 border border-yellow-500/20',
    low: 'bg-orange-500/10 text-orange-700 border border-orange-500/20',
    inactive: 'bg-rose-500/10 text-rose-700 border border-rose-500/20',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border ${styles[tier]}`}>
      {tier.toUpperCase()} {score !== null ? `(${score}%)` : ''}
    </span>
  );
};

export const ParticipantList: React.FC = () => {
  return (
    <FilterContextProvider>
      <ParticipantListContent />
    </FilterContextProvider>
  );
};
