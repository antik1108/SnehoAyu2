/**
 * Breastfeeding Assessment — Tool II Section B4 (PRD Section 5.7).
 * Scoring weights below are an operationalisation of the PRD's structured
 * interview schedule, calibrated so the maximum attainable score is 28,
 * matching the published grading bands (24-28 Excellent ... ≤11 Poor).
 */
export const BREASTFEEDING_MAX_SCORE = 28;

export type BreastfeedingGrade = 'excellent' | 'good' | 'fair' | 'poor';

export interface BreastfeedingResponses {
  currentlyBreastfeeding: 'exclusive' | 'predominant' | 'mixed' | 'not_breastfeeding';
  reasonIfNotExclusive?: string;
  frequencyPer24h: number;
  sessionDurationMinutes: number;
  nightFeedsCount: number;
  feedingOnCues: 'always' | 'sometimes' | 'fixed_schedule';
  feedingProblems: string[];
  expressedMilkUsed: boolean;
  alternativeFeedingMethodsUsed: boolean;
}

function scoreFrequency(value: 'exclusive' | 'predominant' | 'mixed' | 'not_breastfeeding'): number {
  return { exclusive: 4, predominant: 3, mixed: 2, not_breastfeeding: 0 }[value];
}

function scoreFeedsPerDay(count: number): number {
  if (count >= 8) return 4;
  if (count >= 6) return 3;
  if (count >= 4) return 2;
  return 1;
}

function scoreDuration(minutes: number): number {
  if (minutes >= 15) return 4;
  if (minutes >= 10) return 3;
  if (minutes >= 5) return 2;
  return 1;
}

function scoreNightFeeds(count: number): number {
  if (count >= 3) return 4;
  if (count >= 1) return 2;
  return 0;
}

function scoreCues(value: 'always' | 'sometimes' | 'fixed_schedule'): number {
  return { always: 4, sometimes: 2, fixed_schedule: 0 }[value];
}

function scoreProblems(problems: string[]): number {
  if (problems.length === 0) return 4;
  if (problems.length <= 2) return 2;
  return 0;
}

export function scoreBreastfeedingAssessment(responses: BreastfeedingResponses): {
  totalScore: number;
  grade: BreastfeedingGrade;
} {
  const totalScore =
    scoreFrequency(responses.currentlyBreastfeeding) +
    scoreFeedsPerDay(responses.frequencyPer24h) +
    scoreDuration(responses.sessionDurationMinutes) +
    scoreNightFeeds(responses.nightFeedsCount) +
    scoreCues(responses.feedingOnCues) +
    scoreProblems(responses.feedingProblems) +
    (responses.expressedMilkUsed ? 2 : 0) +
    (responses.alternativeFeedingMethodsUsed ? 0 : 2);

  let grade: BreastfeedingGrade;
  if (totalScore >= 24) grade = 'excellent';
  else if (totalScore >= 18) grade = 'good';
  else if (totalScore >= 12) grade = 'fair';
  else grade = 'poor';

  return { totalScore, grade };
}
