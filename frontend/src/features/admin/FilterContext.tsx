import React, { createContext, useContext, useState, useEffect } from 'react';

// ─── FilterState ─────────────────────────────────────────────────────────────
// Design §6.1 — all 8 filter fields; every field is nullable (null = "no filter")

export interface FilterState {
  hospitalId: string | null;
  studyGroup: 'study' | 'control' | null;
  birthWeightStratum: string | null;
  onboardingStatus: 'onboarded' | 'pending' | null;
  checkpointWindow: 'overdue' | 'due_this_week' | 'due_this_month' | 'due_next_month' | null;
  enrolledAfter: string | null;   // ISO date string, e.g. "2025-01-01"
  enrolledBefore: string | null;  // ISO date string, e.g. "2025-12-31"
  engagementTier: 'high' | 'medium' | 'low' | 'inactive' | null;
}

// ─── Default (cleared) state ──────────────────────────────────────────────────

const DEFAULT_FILTERS: FilterState = {
  hospitalId: null,
  studyGroup: null,
  birthWeightStratum: null,
  onboardingStatus: null,
  checkpointWindow: null,
  enrolledAfter: null,
  enrolledBefore: null,
  engagementTier: null,
};

// ─── sessionStorage key ───────────────────────────────────────────────────────

const SESSION_KEY = 'admin-participant-filters';

// ─── Context value shape ──────────────────────────────────────────────────────

interface FilterContextValue {
  /** Current filter state — the single source of truth */
  filters: FilterState;
  /** Update a single filter field; pass null to clear that field */
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  /** Atomically reset every field back to null */
  clearFilters: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const FilterContext = createContext<FilterContextValue | null>(null);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Read persisted filters from sessionStorage, falling back to defaults on any error. */
function readFromSessionStorage(): FilterState {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return DEFAULT_FILTERS;
    const parsed = JSON.parse(raw) as Partial<FilterState>;
    // Merge with defaults so any future fields added to FilterState degrade gracefully
    return { ...DEFAULT_FILTERS, ...parsed };
  } catch {
    return DEFAULT_FILTERS;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function FilterContextProvider({ children }: { children: React.ReactNode }) {
  // Initialise from sessionStorage on mount (Req 5 criterion 9)
  const [filters, setFilters] = useState<FilterState>(readFromSessionStorage);

  // Persist every state change to sessionStorage (Req 5 criterion 10)
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(filters));
    } catch {
      // sessionStorage may be unavailable in some environments (e.g. private browsing quota)
      // Silently ignore — the filter still works in memory
    }
  }, [filters]);

  // Update a single filter field (Req 5 criterion 8)
  const setFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Atomically reset all filters to null (Req 5 criterion 8)
  const clearFilters = () => {
    setFilters({ ...DEFAULT_FILTERS });
  };

  return (
    <FilterContext.Provider value={{ filters, setFilter, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

// ─── Convenience hook ─────────────────────────────────────────────────────────

/**
 * Returns the current filter state and mutation helpers from the nearest
 * `FilterContextProvider`. Throws if used outside of one.
 */
export function useFilters(): FilterContextValue {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error('useFilters must be used within a FilterContextProvider');
  }
  return ctx;
}
