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

/**
 * WHO-5 Well-Being Index — official 5-item instrument (PRD Tool IV).
 * Bengali and Hindi text use the published WHO regional-office translations.
 */
export const who5Questions: Who5Question[] = [
  {
    id: 'q1',
    order: 1,
    text: {
      en: 'I have felt cheerful and in good spirits',
      bn: 'আমি প্রফুল্ল এবং ভালো মেজাজে ছিলাম',
      hi: 'मैं प्रसन्न और अच्छे मूड में रहा/रही हूँ',
    },
    contentStatus: 'approved',
  },
  {
    id: 'q2',
    order: 2,
    text: {
      en: 'I have felt calm and relaxed',
      bn: 'আমি শান্ত এবং স্বস্তি বোধ করেছি',
      hi: 'मैं शांत और तनावमुक्त महसूस कर रहा/रही हूँ',
    },
    contentStatus: 'approved',
  },
  {
    id: 'q3',
    order: 3,
    text: {
      en: 'I have felt active and vigorous',
      bn: 'আমি সক্রিয় এবং উদ্যমী বোধ করেছি',
      hi: 'मैं सक्रिय और ऊर्जावान महसूस कर रहा/रही हूँ',
    },
    contentStatus: 'approved',
  },
  {
    id: 'q4',
    order: 4,
    text: {
      en: 'I woke up feeling fresh and rested',
      bn: 'আমি সতেজ এবং বিশ্রাম নিয়ে ঘুম থেকে উঠেছি',
      hi: 'मैं ताज़ा और आराम महसूस करते हुए जागा/जागी हूँ',
    },
    contentStatus: 'approved',
  },
  {
    id: 'q5',
    order: 5,
    text: {
      en: 'My daily life has been filled with interesting things',
      bn: 'আমার দৈনন্দিন জীবন আকর্ষণীয় বিষয়ে পূর্ণ ছিল',
      hi: 'मेरा दैनिक जीवन दिलचस्प चीज़ों से भरा रहा है',
    },
    contentStatus: 'approved',
  },
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
