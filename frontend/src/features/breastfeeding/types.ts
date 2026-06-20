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

export interface BreastfeedingSubmissionResult {
  timePoint: string;
  totalScore: number;
  grade: 'excellent' | 'good' | 'fair' | 'poor';
  submittedAt: string;
  locked: boolean;
}
