import type { KnowledgeTimePoint } from '../knowledge/types';

export type Who5QuestionId = 'q1' | 'q2' | 'q3' | 'q4' | 'q5';
export type Who5ResponseValue = 0 | 1 | 2 | 3 | 4 | 5;

export interface Who5Question {
  id: Who5QuestionId;
  order: number;
  text: string | null;
  contentStatus: 'approved' | 'approval_required';
}

export interface Who5QuestionsResponse {
  timePoint: KnowledgeTimePoint;
  contentReady: boolean;
  questions: Who5Question[];
  scale: Array<{ value: Who5ResponseValue; label: string }>;
}

export interface Who5Status {
  timePoint: KnowledgeTimePoint;
  available: boolean;
  submitted: boolean;
  locked: boolean;
  rawScore: number | null;
  maxScore: number;
  percentageScore: number | null;
  poorWellbeingFlag: boolean | null;
  interpretation: 'needs_researcher_attention' | 'no_flag' | null;
  submittedAt: string | null;
  contentReady: boolean;
}

export interface Who5Result {
  timePoint: KnowledgeTimePoint;
  responses?: Record<Who5QuestionId, Who5ResponseValue>;
  rawScore: number;
  maxScore: number;
  percentageScore: number;
  poorWellbeingFlag: boolean;
  interpretation: 'needs_researcher_attention' | 'no_flag';
  submittedAt: string;
  locked: true;
}

export interface Who5SubmitInput {
  timePoint: KnowledgeTimePoint;
  responses: Record<Who5QuestionId, Who5ResponseValue>;
}
