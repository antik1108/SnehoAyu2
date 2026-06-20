import type { KnowledgeTimePoint } from '../knowledge/types';

export type PsocQuestionId =
  | 'q1' | 'q2' | 'q3' | 'q4' | 'q5'
  | 'q6' | 'q7' | 'q8' | 'q9' | 'q10'
  | 'q11' | 'q12' | 'q13' | 'q14' | 'q15'
  | 'q16' | 'q17';
export type PsocResponseValue = 1 | 2 | 3 | 4 | 5 | 6;

export interface PsocQuestion {
  id: PsocQuestionId;
  order: number;
  text: string | null;
  contentStatus: 'approval_required' | 'draft_from_prd_summary';
}

export interface PsocQuestionsResponse {
  timePoint: KnowledgeTimePoint;
  contentReady: boolean;
  questions: PsocQuestion[];
  scale: Array<{ value: PsocResponseValue; label: string }>;
}

export interface PsocStatus {
  timePoint: KnowledgeTimePoint;
  available: boolean;
  submitted: boolean;
  locked: boolean;
  efficacyScore: number | null;
  satisfactionScore: number | null;
  totalScore: number | null;
  maxScore: number;
  classification: string | null;
  classificationMethod: string | null;
  submittedAt: string | null;
  contentReady: boolean;
}

export interface PsocResult {
  timePoint: KnowledgeTimePoint;
  responses?: Record<PsocQuestionId, PsocResponseValue>;
  efficacyScore: number;
  satisfactionScore: number;
  totalScore: number;
  maxScore: number;
  classification: string | null;
  classificationMethod: string | null;
  submittedAt: string;
  locked: true;
}

export interface PsocSubmitInput {
  timePoint: KnowledgeTimePoint;
  responses: Record<PsocQuestionId, PsocResponseValue>;
}
