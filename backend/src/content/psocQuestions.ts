import type { KnowledgeLanguage } from './knowledgeQuestions.js';

export const PSOC_MAX_SCORE = 102;
export type PsocQuestionId =
  | 'q1' | 'q2' | 'q3' | 'q4' | 'q5'
  | 'q6' | 'q7' | 'q8' | 'q9' | 'q10'
  | 'q11' | 'q12' | 'q13' | 'q14' | 'q15'
  | 'q16' | 'q17';
export type PsocResponseValue = 1 | 2 | 3 | 4 | 5 | 6;
export type PsocScoringDirection = 'direct' | 'reverse';

export interface PsocQuestion {
  id: PsocQuestionId;
  order: number;
  text: Partial<Record<KnowledgeLanguage, string>>;
  scoringDirection: PsocScoringDirection;
  subscale: 'efficacy' | 'satisfaction';
  contentStatus: 'approval_required' | 'draft_from_prd_summary';
}

export const psocQuestions: PsocQuestion[] = [
  { id: 'q1', order: 1, text: { en: 'Problems of child care are easy once you understand your child' }, scoringDirection: 'direct', subscale: 'efficacy', contentStatus: 'draft_from_prd_summary' },
  { id: 'q2', order: 2, text: { en: 'Frustrated now while child is at this age' }, scoringDirection: 'reverse', subscale: 'satisfaction', contentStatus: 'draft_from_prd_summary' },
  { id: 'q3', order: 3, text: { en: 'Go to bed same as wake up - not accomplished much' }, scoringDirection: 'reverse', subscale: 'satisfaction', contentStatus: 'draft_from_prd_summary' },
  { id: 'q4', order: 4, text: { en: "Feel like I'm being manipulated when I should be in control" }, scoringDirection: 'reverse', subscale: 'satisfaction', contentStatus: 'draft_from_prd_summary' },
  { id: 'q5', order: 5, text: { en: 'My mother was better prepared than I am' }, scoringDirection: 'reverse', subscale: 'satisfaction', contentStatus: 'draft_from_prd_summary' },
  { id: 'q6', order: 6, text: { en: 'I would be a fine model for a new mother' }, scoringDirection: 'direct', subscale: 'efficacy', contentStatus: 'draft_from_prd_summary' },
  { id: 'q7', order: 7, text: { en: 'Being a parent is manageable, problems easily solved' }, scoringDirection: 'direct', subscale: 'efficacy', contentStatus: 'draft_from_prd_summary' },
  { id: 'q8', order: 8, text: { en: "Difficult not knowing if you're doing a good or bad job" }, scoringDirection: 'reverse', subscale: 'satisfaction', contentStatus: 'draft_from_prd_summary' },
  { id: 'q9', order: 9, text: { en: "Sometimes I feel I'm not getting anything done" }, scoringDirection: 'reverse', subscale: 'satisfaction', contentStatus: 'draft_from_prd_summary' },
  { id: 'q10', order: 10, text: { en: 'I meet my personal expectations for caring for my child' }, scoringDirection: 'direct', subscale: 'efficacy', contentStatus: 'draft_from_prd_summary' },
  { id: 'q11', order: 11, text: { en: 'If anyone can find the answer for my child, I am the one' }, scoringDirection: 'direct', subscale: 'efficacy', contentStatus: 'draft_from_prd_summary' },
  { id: 'q12', order: 12, text: { en: 'My talents and interests are in other areas, not parenting' }, scoringDirection: 'reverse', subscale: 'satisfaction', contentStatus: 'draft_from_prd_summary' },
  { id: 'q13', order: 13, text: { en: 'I feel thoroughly familiar with this role' }, scoringDirection: 'direct', subscale: 'efficacy', contentStatus: 'draft_from_prd_summary' },
  { id: 'q14', order: 14, text: { en: "If parenting were more interesting, I'd be more motivated" }, scoringDirection: 'reverse', subscale: 'satisfaction', contentStatus: 'draft_from_prd_summary' },
  { id: 'q15', order: 15, text: { en: 'I have all the skills necessary to be a good mother' }, scoringDirection: 'direct', subscale: 'efficacy', contentStatus: 'draft_from_prd_summary' },
  { id: 'q16', order: 16, text: { en: 'Being a parent makes me tense and anxious' }, scoringDirection: 'reverse', subscale: 'satisfaction', contentStatus: 'draft_from_prd_summary' },
  { id: 'q17', order: 17, text: { en: 'Being a good mother is a reward in itself' }, scoringDirection: 'direct', subscale: 'efficacy', contentStatus: 'draft_from_prd_summary' },
];

export const psocScale: Array<{
  value: PsocResponseValue;
  label: Record<KnowledgeLanguage, string>;
}> = [
  { value: 1, label: { en: 'Strongly Disagree', bn: 'একেবারেই একমত নই', hi: 'बिल्कुल सहमत नहीं' } },
  { value: 2, label: { en: 'Disagree', bn: 'একমত নই', hi: 'सहमत नहीं' } },
  { value: 3, label: { en: 'Slightly Disagree', bn: 'কিছুটা একমত নই', hi: 'कुछ हद तक सहमत नहीं' } },
  { value: 4, label: { en: 'Slightly Agree', bn: 'কিছুটা একমত', hi: 'कुछ हद तक सहमत' } },
  { value: 5, label: { en: 'Agree', bn: 'একমত', hi: 'सहमत' } },
  { value: 6, label: { en: 'Strongly Agree', bn: 'সম্পূর্ণ একমত', hi: 'पूरी तरह सहमत' } },
];

export function isPsocContentReady(): boolean {
  return psocQuestions.every((question) => (
    question.contentStatus !== 'draft_from_prd_summary'
    && question.text.en
    && question.text.bn
    && question.text.hi
  ));
}
