import React from 'react';
import { useFilters } from '../../features/admin/FilterContext';
import {
  useAnalyticsOverview,
  useEnrollmentTrend,
  useAssessmentCompletion,
  useEngagementTrend,
  useSiteComparison,
  useOutcomeScores,
} from '../../features/admin/analyticsHooks';
import { EnrollmentKPIStrip } from './EnrollmentKPIStrip';
import { OverdueCheckpointList } from './OverdueCheckpointList';
import { EnrollmentTrendChart } from './EnrollmentTrendChart';
import { AssessmentCompletionChart } from './AssessmentCompletionChart';
import { EngagementTrendChart } from './EngagementTrendChart';
import { SiteComparisonChart } from './SiteComparisonChart';
import { OutcomeScoreCharts } from './OutcomeScoreCharts';

export const CohortOverview: React.FC = () => {
  const { filters } = useFilters();

  const overviewQuery = useAnalyticsOverview(filters);
  const enrollmentTrendQuery = useEnrollmentTrend(filters);
  const assessmentCompletionQuery = useAssessmentCompletion(filters);
  const engagementTrendQuery = useEngagementTrend(filters);
  const siteComparisonQuery = useSiteComparison(filters);
  const outcomeScoresQuery = useOutcomeScores(filters);

  return (
    <div className="mb-8">
      {/* 7 KPI Strip Cards */}
      <EnrollmentKPIStrip data={overviewQuery.data} isLoading={overviewQuery.isLoading} />

      {/* Actionable Overdue Checkpoint Collapsible Banner */}
      <OverdueCheckpointList
        overdueParticipants={overviewQuery.data?.overdueParticipants}
        isLoading={overviewQuery.isLoading}
      />

      {/* 2x2 Primary Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <EnrollmentTrendChart data={enrollmentTrendQuery.data} isLoading={enrollmentTrendQuery.isLoading} />
        <AssessmentCompletionChart data={assessmentCompletionQuery.data} isLoading={assessmentCompletionQuery.isLoading} />
        <EngagementTrendChart data={engagementTrendQuery.data} isLoading={engagementTrendQuery.isLoading} />
        <SiteComparisonChart data={siteComparisonQuery.data} isLoading={siteComparisonQuery.isLoading} />
      </div>

      {/* 3x Longitudinal Outcome Score Charts */}
      <OutcomeScoreCharts data={outcomeScoresQuery.data} isLoading={outcomeScoresQuery.isLoading} />
    </div>
  );
};
