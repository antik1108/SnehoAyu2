import { isKnowledgeLanguage, type KnowledgeLanguage, type KnowledgeTimePoint } from './knowledgeQuestions.js';

export const WHO5_MAX_SCORE = 25;
export type Who5QuestionId = 'q1' | 'q2' | 'q3' | 'q4' | 'q5';
export type Who5ResponseValue = 0 | 1 | 2 | 3 | 4 | 5;
export type Who5Interpretation = 'needs_researcher_attention' | 'no_flag';

export interface Who5Question {
  id: Who5QuestionId;
  order: number;
  text: Partial<Record<KnowledgeLanguage, string>>;
  contentStatus: 'approved' | 'approval_required';
}

export const who5Questions: Who5Question[] = [
  { id: 'q1', order: 1, text: { en: 'I have felt cheerful and in good spirits' }, contentStatus: 'approval_required' },
  { id: 'q2', order: 2, text: { en: 'I have felt calm and relaxed' }, contentStatus: 'approval_required' },
  { id: 'q3', order: 3, text: { en: 'I have felt active and vigorous' }, contentStatus: 'approval_required' },
  { id: 'q4', order: 4, text: { en: 'I woke up feeling fresh and rested' }, contentStatus: 'approval_required' },
  { id: 'q5', order: 5, text: { en: 'My daily life has been filled with interesting things' }, contentStatus: 'approval_required' },
];

export const who5Scale: Array<{
  value: Who5ResponseValue;
  label: Record<KnowledgeLanguage, string>;
}> = [
  { value: 0, label: { en: 'At no time', bn: 'কখনও নয়', hi: 'कभी नहीं' } },
  { value: 1, label: { en: 'Some of the time', bn: 'কিছু সময়', hi: 'कुछ समय' } },
  { value: 2, label: { en: 'Less than half of the time', bn: 'অর্ধেক সময়ের কম', hi: 'आधे समय से कम' } },
  { value: 3, label: { en: 'More than half of the time', bn: 'অর্ধেকের বেশি সময়', hi: 'आधे समय से अधिक' } },
  { value: 4, label: { en: 'Most of the time', bn: 'বেশিরভাগ সময়', hi: 'अधिकांश समय' } },
  { value: 5, label: { en: 'All of the time', bn: 'সব সময়', hi: 'हर समय' } },
];

export function isWho5ContentReady(): boolean {
  return who5Questions.every((question) => (
    question.contentStatus === 'approved'
    && question.text.en
    && question.text.bn
    && question.text.hi
  ));
}

export function resolveAssessmentLanguage(value: unknown, fallback: string): KnowledgeLanguage {
  if (isKnowledgeLanguage(value)) return value;
  if (isKnowledgeLanguage(fallback)) return fallback;
  return 'bn';
}

export type AssessmentTimePoint = KnowledgeTimePoint;
