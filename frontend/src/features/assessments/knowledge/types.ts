export const KNOWLEDGE_TIME_POINTS = [
  'baseline',
  '1_month',
  '3_months',
  '6_months',
] as const;

export type KnowledgeTimePoint = typeof KNOWLEDGE_TIME_POINTS[number];
export type KnowledgeOptionId = 'a' | 'b' | 'c' | 'd';
export type KnowledgeQuestionId =
  | 'q1'
  | 'q2'
  | 'q3'
  | 'q4'
  | 'q5'
  | 'q6'
  | 'q7'
  | 'q8'
  | 'q9'
  | 'q10'
  | 'q11'
  | 'q12'
  | 'q13'
  | 'q14'
  | 'q15';

export interface KnowledgeQuestion {
  id: KnowledgeQuestionId;
  order: number;
  topic: string;
  text: string | null;
  contentStatus: 'approved' | 'approval_required';
  options: Array<{
    id: KnowledgeOptionId;
    text: string | null;
  }>;
}

export interface KnowledgeQuestionsResponse {
  timePoint: KnowledgeTimePoint;
  contentReady: boolean;
  questions: KnowledgeQuestion[];
}

export interface KnowledgeStatus {
  timePoint: KnowledgeTimePoint;
  available: boolean;
  submitted: boolean;
  locked: boolean;
  score: number | null;
  maxScore: number;
  percentage: number | null;
  grade: 'poor' | 'moderate' | 'good' | null;
  submittedAt: string | null;
  contentReady: boolean;
}

export interface KnowledgeSubmissionResult {
  timePoint: KnowledgeTimePoint;
  responses?: Record<KnowledgeQuestionId, KnowledgeOptionId>;
  score: number;
  maxScore: number;
  percentage: number;
  grade: 'poor' | 'moderate' | 'good';
  submittedAt: string;
  locked: true;
}

export interface KnowledgeSubmitInput {
  timePoint: KnowledgeTimePoint;
  responses: Record<KnowledgeQuestionId, KnowledgeOptionId>;
}
