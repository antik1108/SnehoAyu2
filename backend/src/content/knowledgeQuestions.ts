export const KNOWLEDGE_MAX_SCORE = 15;

export const KNOWLEDGE_TIME_POINTS = [
  'baseline',
  '1_month',
  '3_months',
  '6_months',
] as const;

export const KNOWLEDGE_LANGUAGES = ['bn', 'hi', 'en'] as const;

export type KnowledgeTimePoint = typeof KNOWLEDGE_TIME_POINTS[number];
export type KnowledgeLanguage = typeof KNOWLEDGE_LANGUAGES[number];

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

export type KnowledgeOptionId = 'a' | 'b' | 'c' | 'd';
export type KnowledgeGrade = 'poor' | 'moderate' | 'good';
export type KnowledgeContentStatus = 'approved' | 'approval_required';

export interface KnowledgeQuestion {
  id: KnowledgeQuestionId;
  order: number;
  topic: string;
  text: Partial<Record<KnowledgeLanguage, string>>;
  options: Array<{
    id: KnowledgeOptionId;
    text: Partial<Record<KnowledgeLanguage, string>>;
  }>;
  correctOptionId: KnowledgeOptionId | null;
  approvedCorrectAnswerReference: string;
  contentStatus: KnowledgeContentStatus;
}

export const knowledgeQuestions: KnowledgeQuestion[] = [
  {
    id: 'q1',
    order: 1,
    topic: 'How to know baby gets enough milk',
    text: { en: 'How to know baby gets enough milk' },
    options: [],
    correctOptionId: null,
    approvedCorrectAnswerReference: 'Baby pees >6 times/day',
    contentStatus: 'approval_required',
  },
  {
    id: 'q2',
    order: 2,
    topic: 'How to keep preterm baby warm',
    text: { en: 'How to keep preterm baby warm' },
    options: [],
    correctOptionId: null,
    approvedCorrectAnswerReference: 'Kangaroo Care (skin-to-skin)',
    contentStatus: 'approval_required',
  },
  {
    id: 'q3',
    order: 3,
    topic: 'Baby suddenly refuses to feed',
    text: { en: 'Baby suddenly refuses to feed' },
    options: [],
    correctOptionId: null,
    approvedCorrectAnswerReference: 'Could be an emergency',
    contentStatus: 'approval_required',
  },
  {
    id: 'q4',
    order: 4,
    topic: 'Duration of exclusive breastfeeding',
    text: { en: 'Duration of exclusive breastfeeding' },
    options: [],
    correctOptionId: null,
    approvedCorrectAnswerReference: '6 months',
    contentStatus: 'approval_required',
  },
  {
    id: 'q5',
    order: 5,
    topic: 'Which is NOT a danger sign',
    text: { en: 'Which is NOT a danger sign' },
    options: [],
    correctOptionId: null,
    approvedCorrectAnswerReference: 'Baby pees 8-10 times/day',
    contentStatus: 'approval_required',
  },
  {
    id: 'q6',
    order: 6,
    topic: 'When to start breastfeeding after birth',
    text: { en: 'When to start breastfeeding after birth' },
    options: [],
    correctOptionId: null,
    approvedCorrectAnswerReference: 'Within 1 hour',
    contentStatus: 'approval_required',
  },
  {
    id: 'q7',
    order: 7,
    topic: 'Definition of preterm birth',
    text: { en: 'Definition of preterm birth' },
    options: [],
    correctOptionId: null,
    approvedCorrectAnswerReference: 'Born before 37 weeks',
    contentStatus: 'approval_required',
  },
  {
    id: 'q8',
    order: 8,
    topic: 'Who advises vaccination schedule',
    text: { en: 'Who advises vaccination schedule' },
    options: [],
    correctOptionId: null,
    approvedCorrectAnswerReference: 'Doctor or health worker',
    contentStatus: 'approval_required',
  },
  {
    id: 'q9',
    order: 9,
    topic: 'Umbilical cord care',
    text: { en: 'Umbilical cord care' },
    options: [],
    correctOptionId: null,
    approvedCorrectAnswerReference: 'Keep clean and dry',
    contentStatus: 'approval_required',
  },
  {
    id: 'q10',
    order: 10,
    topic: 'Daily KMC duration',
    text: { en: 'Daily KMC duration' },
    options: [],
    correctOptionId: null,
    approvedCorrectAnswerReference: '1-2 hours minimum',
    contentStatus: 'approval_required',
  },
  {
    id: 'q11',
    order: 11,
    topic: 'Keeping baby warm at home',
    text: { en: 'Keeping baby warm at home' },
    options: [],
    correctOptionId: null,
    approvedCorrectAnswerReference: 'Skin-to-skin contact',
    contentStatus: 'approval_required',
  },
  {
    id: 'q12',
    order: 12,
    topic: 'Major risk for preterm babies',
    text: { en: 'Major risk for preterm babies' },
    options: [],
    correctOptionId: null,
    approvedCorrectAnswerReference: 'Hypothermia (low body temp)',
    contentStatus: 'approval_required',
  },
  {
    id: 'q13',
    order: 13,
    topic: 'Why preterm babies stay longer',
    text: { en: 'Why preterm babies stay longer' },
    options: [],
    correctOptionId: null,
    approvedCorrectAnswerReference: 'Not learned to feed/breathe',
    contentStatus: 'approval_required',
  },
  {
    id: 'q14',
    order: 14,
    topic: 'Baby vomits often - what to do',
    text: { en: 'Baby vomits often - what to do' },
    options: [],
    correctOptionId: null,
    approvedCorrectAnswerReference: 'Consult a doctor',
    contentStatus: 'approval_required',
  },
  {
    id: 'q15',
    order: 15,
    topic: 'Baby feels very hot - what to do',
    text: { en: 'Baby feels very hot - what to do' },
    options: [],
    correctOptionId: null,
    approvedCorrectAnswerReference: 'Consult a doctor',
    contentStatus: 'approval_required',
  },
];

export function isKnowledgeContentReady(): boolean {
  return knowledgeQuestions.every((question) => (
    question.contentStatus === 'approved'
    && question.correctOptionId !== null
    && question.options.length >= 2
  ));
}

export function isKnowledgeTimePoint(value: unknown): value is KnowledgeTimePoint {
  return typeof value === 'string' && KNOWLEDGE_TIME_POINTS.includes(value as KnowledgeTimePoint);
}

export function isKnowledgeLanguage(value: unknown): value is KnowledgeLanguage {
  return typeof value === 'string' && KNOWLEDGE_LANGUAGES.includes(value as KnowledgeLanguage);
}
