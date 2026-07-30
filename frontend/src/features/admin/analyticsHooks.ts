import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { FilterState } from './FilterContext';

export interface OverviewData {
  totalEnrolled: number;
  studyCount: number;
  controlCount: number;
  awaitingAssignment: number;
  onboardedCount: number;
  pendingCount: number;
  onboardedPct: number;
  activeLastSevenDays: number;
  openDangerSignCount: number;
  overdueCheckpointCount: number;
  overdueParticipants: Array<{
    id: string;
    participantCode: string;
    hospitalName: string;
    overdueCheckpoints: string[];
  }>;
}

export interface EnrollmentTrendData {
  weeks: Array<{
    weekStart: string;
    newEnrollments: number;
    cumulative: number;
  }>;
  target: number;
}

export interface AssessmentCompletionRate {
  checkpoint: string;
  instrument: string;
  due: number;
  completed: number;
  pct: number;
}

export interface AssessmentCompletionData {
  rates: AssessmentCompletionRate[];
}

export interface EngagementTrendData {
  weeks: Array<{
    weekStart: string;
    meanEngagementPct: number;
  }>;
}

export interface SiteComparisonData {
  sites: Array<{
    hospitalId: string;
    hospitalName: string;
    studyCount: number;
    controlCount: number;
    meanEngagementPct: number;
    assessmentCompletionPct: number;
  }>;
}

export interface OutcomeScoreDataPoint {
  checkpoint: string;
  study: {
    mean: number | null;
    n: number;
    sparse?: boolean;
  };
  control: null | {
    mean: number | null;
    n: number;
    sparse?: boolean;
  };
}

export interface OutcomeScoresData {
  who5: OutcomeScoreDataPoint[];
  psoc: OutcomeScoreDataPoint[];
  knowledge: OutcomeScoreDataPoint[];
}

function cleanFilterParams(filters: FilterState) {
  const params: Record<string, string> = {};
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== null && val !== undefined) {
      params[key] = String(val);
    }
  });
  return params;
}

export function useAnalyticsOverview(filters: FilterState) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'overview', filters],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: OverviewData }>('/admin/analytics/overview', {
        params: cleanFilterParams(filters),
      });
      return res.data.data;
    },
    staleTime: 60_000,
  });
}

export function useEnrollmentTrend(filters: FilterState) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'enrollment-trend', filters],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: EnrollmentTrendData }>(
        '/admin/analytics/enrollment-trend',
        { params: cleanFilterParams(filters) }
      );
      return res.data.data;
    },
    staleTime: 60_000,
  });
}

export function useAssessmentCompletion(filters: FilterState) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'assessment-completion', filters],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: AssessmentCompletionData }>(
        '/admin/analytics/assessment-completion',
        { params: cleanFilterParams(filters) }
      );
      return res.data.data;
    },
    staleTime: 60_000,
  });
}

export function useEngagementTrend(filters: FilterState) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'engagement-trend', filters],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: EngagementTrendData }>(
        '/admin/analytics/engagement-trend',
        { params: cleanFilterParams(filters) }
      );
      return res.data.data;
    },
    staleTime: 60_000,
  });
}

export function useSiteComparison(filters: FilterState) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'site-comparison', filters],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: SiteComparisonData }>(
        '/admin/analytics/site-comparison',
        { params: cleanFilterParams(filters) }
      );
      return res.data.data;
    },
    staleTime: 60_000,
  });
}

export function useOutcomeScores(filters: FilterState) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'outcome-scores', filters],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: OutcomeScoresData }>(
        '/admin/analytics/outcome-scores',
        { params: cleanFilterParams(filters) }
      );
      return res.data.data;
    },
    staleTime: 60_000,
  });
}
