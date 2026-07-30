import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { FilterPanel } from '../../features/admin/FilterPanel';
import { FilterContextProvider, useFilters } from '../../features/admin/FilterContext';
import { CohortOverview } from '../../components/admin/CohortOverview';
import { fetchParticipants, downloadCohortExport, downloadParticipantExport } from '../../features/admin/api';
import { Search, Download, AlertTriangle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
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

export const ParticipantListContent: React.FC = () => {
  const navigate = useNavigate();
  const { filters } = useFilters();

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

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedParticipants.length / pageSize));
  const paginatedParticipants = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedParticipants.slice(start, start + pageSize);
  }, [sortedParticipants, currentPage]);

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

        {/* Filter Controls Panel */}
        <FilterPanel />

        {/* Cohort Overview KPI Strip & Charts */}
        <CohortOverview />

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
            {selectedIds.size > 0 && (
              <button
                type="button"
                disabled={exporting}
                onClick={handleExportSelected}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-bold text-text-main shadow-sm transition-colors hover:bg-neutral-100 disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5 text-primary" />
                Export selected ({selectedIds.size})
              </button>
            )}

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
        ) : sortedParticipants.length === 0 ? (
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
                  return (
                    <tr
                      key={p.id}
                      onClick={() => navigate(`/admin/participants/${p.id}${filterQueryParams}`)}
                      className={`cursor-pointer transition-colors hover:bg-neutral-50/80 ${
                        isSelected ? 'bg-primary/5' : ''
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
                      <td className="px-3 py-3 font-technical font-bold">
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
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            p.onboardingCompletedAt
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.onboardingCompletedAt ? 'Onboarded' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {p.nextCheckpoint ? (
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              p.isOverdue
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : p.isDueSoon
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-neutral-100 text-neutral-700'
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
                            <AlertTriangle className="mx-auto h-4 w-4 text-red-500" />
                          </span>
                        )}
                      </td>
                    </tr>
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
              {Math.min(currentPage * pageSize, sortedParticipants.length)} of {sortedParticipants.length} participants
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
    high: 'bg-emerald-100 text-emerald-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-orange-100 text-orange-800',
    inactive: 'bg-gray-100 text-gray-600',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${styles[tier]}`}>
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
