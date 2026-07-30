import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFilters, FilterState } from './FilterContext';
import { fetchHospitals } from './api';
import { RotateCcw, AlertCircle } from 'lucide-react';

export const FilterPanel: React.FC = () => {
  const { filters, setFilter, clearFilters } = useFilters();

  // Local date inputs to manage transient invalid range typing gracefully
  const [localAfter, setLocalAfter] = useState<string>(filters.enrolledAfter ?? '');
  const [localBefore, setLocalBefore] = useState<string>(filters.enrolledBefore ?? '');
  const [dateError, setDateError] = useState<string | null>(null);

  // Synchronize local date input states when global filter is cleared or updated externally
  useEffect(() => {
    setLocalAfter(filters.enrolledAfter ?? '');
    setLocalBefore(filters.enrolledBefore ?? '');
    setDateError(null);
  }, [filters.enrolledAfter, filters.enrolledBefore]);

  const { data: hospitals = [] } = useQuery({
    queryKey: ['admin', 'hospitals'],
    queryFn: fetchHospitals,
    staleTime: 300_000,
  });

  const handleAfterChange = (val: string) => {
    setLocalAfter(val);
    if (val && localBefore && val > localBefore) {
      setDateError('Start date cannot be after end date');
    } else {
      setDateError(null);
      setFilter('enrolledAfter', val || null);
    }
  };

  const handleBeforeChange = (val: string) => {
    setLocalBefore(val);
    if (localAfter && val && localAfter > val) {
      setDateError('Start date cannot be after end date');
    } else {
      setDateError(null);
      setFilter('enrolledBefore', val || null);
    }
  };

  const isControlGroup = filters.studyGroup === 'control';

  return (
    <div className="mb-6 rounded-2xl border border-border bg-care-canvas p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-text-muted">
          Cohort Filter Controls
        </h2>
        <button
          type="button"
          onClick={() => {
            clearFilters();
            setDateError(null);
          }}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-text-main transition-colors hover:bg-neutral-100"
        >
          <RotateCcw className="h-3.5 w-3.5 text-text-muted" />
          Clear all filters
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-3">
        {/* Site Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase text-text-muted">Site</label>
          <select
            value={filters.hospitalId ?? ''}
            onChange={(e) => setFilter('hospitalId', e.target.value || null)}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All sites</option>
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.code})
              </option>
            ))}
          </select>
        </div>

        {/* Group Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase text-text-muted">Group</label>
          <select
            value={filters.studyGroup ?? ''}
            onChange={(e) => {
              const val = e.target.value as 'study' | 'control' | '';
              setFilter('studyGroup', val || null);
              if (val === 'control') {
                setFilter('engagementTier', null);
              }
            }}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Both groups</option>
            <option value="study">Study</option>
            <option value="control">Control</option>
          </select>
        </div>

        {/* Stratum Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase text-text-muted">Stratum</label>
          <select
            value={filters.birthWeightStratum ?? ''}
            onChange={(e) => setFilter('birthWeightStratum', e.target.value || null)}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All strata</option>
            <option value="under_1500">&lt; 1,500g (VLBW)</option>
            <option value="1500_to_2500">1,500–2,500g (LBW)</option>
            <option value="over_2500">&gt; 2,500g (NBW)</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase text-text-muted">Status</label>
          <select
            value={filters.onboardingStatus ?? ''}
            onChange={(e) => {
              const val = e.target.value as 'onboarded' | 'pending' | '';
              setFilter('onboardingStatus', val || null);
            }}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Both statuses</option>
            <option value="onboarded">Onboarded</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Checkpoint Window Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase text-text-muted">Checkpoint Window</label>
          <select
            value={filters.checkpointWindow ?? ''}
            onChange={(e) => {
              const val = e.target.value as FilterState['checkpointWindow'] | '';
              setFilter('checkpointWindow', val || null);
            }}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All windows</option>
            <option value="overdue">Overdue</option>
            <option value="due_this_week">Due this week</option>
            <option value="due_this_month">Due this month</option>
            <option value="due_next_month">Due next month</option>
          </select>
        </div>

        {/* Enrollment Date Range */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase text-text-muted">Enrolled Date Range</label>
          <div className="flex flex-wrap items-center gap-1.5 sm:flex-nowrap">
            <input
              type="date"
              value={localAfter}
              onChange={(e) => handleAfterChange(e.target.value)}
              className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <span className="text-xs font-medium text-text-muted">to</span>
            <input
              type="date"
              value={localBefore}
              onChange={(e) => handleBeforeChange(e.target.value)}
              className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Engagement Tier Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold uppercase text-text-muted">Engagement Tier</label>
          <select
            disabled={isControlGroup}
            value={filters.engagementTier ?? ''}
            onChange={(e) => {
              const val = e.target.value as FilterState['engagementTier'] | '';
              setFilter('engagementTier', val || null);
            }}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-main disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All tiers</option>
            <option value="high">High (≥75%)</option>
            <option value="medium">Medium (40–74%)</option>
            <option value="low">Low (10–39%)</option>
            <option value="inactive">Inactive (&lt;10%)</option>
          </select>
        </div>
      </div>

      {/* Date error banner */}
      {dateError && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{dateError}</span>
        </div>
      )}

      {/* Control group notice */}
      {isControlGroup && (
        <div className="mt-2 text-[11px] font-medium text-amber-700">
          * Engagement data is not available for Control group participants
        </div>
      )}
    </div>
  );
};
