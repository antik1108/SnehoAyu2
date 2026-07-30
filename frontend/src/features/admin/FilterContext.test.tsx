/**
 * Unit tests for FilterContext.tsx
 * Tests: setFilter, clearFilters, sessionStorage persistence, and restoration on mount.
 * Design §6.1 — Requirements: Req 5 criteria 8, 9, 10
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { FilterContextProvider, useFilters, type FilterState } from './FilterContext';

// ─── Helpers ────────────────────────────────────────────────────────────────

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <FilterContextProvider>{children}</FilterContextProvider>
);

const SESSION_KEY = 'admin-participant-filters';

function getSessionFilters(): Partial<FilterState> | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

// ─── Setup / teardown ────────────────────────────────────────────────────────

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  sessionStorage.clear();
  vi.restoreAllMocks();
});

// ─── Initial state ───────────────────────────────────────────────────────────

describe('FilterContextProvider — initial state', () => {
  it('initialises all filters to null when sessionStorage is empty', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    expect(result.current.filters).toEqual({
      hospitalId: null,
      studyGroup: null,
      birthWeightStratum: null,
      onboardingStatus: null,
      checkpointWindow: null,
      enrolledAfter: null,
      enrolledBefore: null,
      engagementTier: null,
    });
  });

  it('exposes all 8 filter fields defined in FilterState', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });
    const keys = Object.keys(result.current.filters);

    expect(keys).toContain('hospitalId');
    expect(keys).toContain('studyGroup');
    expect(keys).toContain('birthWeightStratum');
    expect(keys).toContain('onboardingStatus');
    expect(keys).toContain('checkpointWindow');
    expect(keys).toContain('enrolledAfter');
    expect(keys).toContain('enrolledBefore');
    expect(keys).toContain('engagementTier');
    expect(keys).toHaveLength(8);
  });
});

// ─── setFilter ───────────────────────────────────────────────────────────────

describe('setFilter', () => {
  it('updates a single field without affecting the others', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => {
      result.current.setFilter('studyGroup', 'study');
    });

    expect(result.current.filters.studyGroup).toBe('study');
    // All other fields remain null
    expect(result.current.filters.hospitalId).toBeNull();
    expect(result.current.filters.birthWeightStratum).toBeNull();
    expect(result.current.filters.onboardingStatus).toBeNull();
    expect(result.current.filters.checkpointWindow).toBeNull();
    expect(result.current.filters.enrolledAfter).toBeNull();
    expect(result.current.filters.enrolledBefore).toBeNull();
    expect(result.current.filters.engagementTier).toBeNull();
  });

  it('can set and overwrite a string field', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => result.current.setFilter('hospitalId', 'hosp-abc'));
    expect(result.current.filters.hospitalId).toBe('hosp-abc');

    act(() => result.current.setFilter('hospitalId', 'hosp-xyz'));
    expect(result.current.filters.hospitalId).toBe('hosp-xyz');
  });

  it('can set a field back to null', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => result.current.setFilter('engagementTier', 'high'));
    expect(result.current.filters.engagementTier).toBe('high');

    act(() => result.current.setFilter('engagementTier', null));
    expect(result.current.filters.engagementTier).toBeNull();
  });

  it('can independently set multiple fields', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => {
      result.current.setFilter('studyGroup', 'control');
      result.current.setFilter('onboardingStatus', 'onboarded');
      result.current.setFilter('checkpointWindow', 'overdue');
    });

    expect(result.current.filters.studyGroup).toBe('control');
    expect(result.current.filters.onboardingStatus).toBe('onboarded');
    expect(result.current.filters.checkpointWindow).toBe('overdue');
  });
});

// ─── clearFilters ────────────────────────────────────────────────────────────

describe('clearFilters', () => {
  it('atomically resets all fields back to null', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    // Set several fields
    act(() => {
      result.current.setFilter('studyGroup', 'study');
      result.current.setFilter('hospitalId', 'hosp-1');
      result.current.setFilter('engagementTier', 'medium');
      result.current.setFilter('enrolledAfter', '2025-01-01');
    });

    // Now clear everything
    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters).toEqual({
      hospitalId: null,
      studyGroup: null,
      birthWeightStratum: null,
      onboardingStatus: null,
      checkpointWindow: null,
      enrolledAfter: null,
      enrolledBefore: null,
      engagementTier: null,
    });
  });

  it('is idempotent — calling clearFilters twice leaves state as all-null', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => result.current.setFilter('hospitalId', 'hosp-1'));
    act(() => result.current.clearFilters());
    act(() => result.current.clearFilters());

    expect(Object.values(result.current.filters).every(v => v === null)).toBe(true);
  });
});

// ─── sessionStorage persistence ──────────────────────────────────────────────

describe('sessionStorage persistence', () => {
  it('writes filters to sessionStorage after setFilter', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => result.current.setFilter('studyGroup', 'study'));

    const stored = getSessionFilters();
    expect(stored?.studyGroup).toBe('study');
  });

  it('writes all-null state to sessionStorage after clearFilters', () => {
    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => result.current.setFilter('engagementTier', 'low'));
    act(() => result.current.clearFilters());

    const stored = getSessionFilters();
    expect(stored?.engagementTier).toBeNull();
  });

  it('writes initial default state to sessionStorage on mount', () => {
    renderHook(() => useFilters(), { wrapper });

    const stored = getSessionFilters();
    expect(stored).not.toBeNull();
    // All values should be null
    expect(Object.values(stored!).every(v => v === null)).toBe(true);
  });
});

// ─── sessionStorage restoration ──────────────────────────────────────────────

describe('sessionStorage restoration on mount', () => {
  it('restores previously persisted filters when a new provider mounts', () => {
    // Pre-populate sessionStorage with a non-default state
    const persisted: FilterState = {
      hospitalId: 'hosp-abc',
      studyGroup: 'study',
      birthWeightStratum: 'under_1500',
      onboardingStatus: 'onboarded',
      checkpointWindow: 'overdue',
      enrolledAfter: '2025-01-01',
      enrolledBefore: '2025-12-31',
      engagementTier: 'high',
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(persisted));

    const { result } = renderHook(() => useFilters(), { wrapper });

    expect(result.current.filters).toEqual(persisted);
  });

  it('falls back to all-null defaults when sessionStorage contains invalid JSON', () => {
    sessionStorage.setItem(SESSION_KEY, 'not-valid-json{{{');

    const { result } = renderHook(() => useFilters(), { wrapper });

    expect(Object.values(result.current.filters).every(v => v === null)).toBe(true);
  });

  it('falls back to all-null defaults when sessionStorage is empty', () => {
    // sessionStorage is cleared in beforeEach, so this is the empty case
    const { result } = renderHook(() => useFilters(), { wrapper });

    expect(Object.values(result.current.filters).every(v => v === null)).toBe(true);
  });

  it('merges persisted partial state with defaults for any missing fields', () => {
    // Simulate a stored state that is missing some fields (e.g., from an older version)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ studyGroup: 'control' }));

    const { result } = renderHook(() => useFilters(), { wrapper });

    expect(result.current.filters.studyGroup).toBe('control');
    expect(result.current.filters.hospitalId).toBeNull();
    expect(result.current.filters.engagementTier).toBeNull();
  });
});

// ─── useFilters guard ────────────────────────────────────────────────────────

describe('useFilters outside provider', () => {
  it('throws an error when used outside of FilterContextProvider', () => {
    // Suppress the expected React error boundary console output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useFilters());
    }).toThrow('useFilters must be used within a FilterContextProvider');

    consoleSpy.mockRestore();
  });
});
