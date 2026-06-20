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

/**
 * English text and answer keys are sourced verbatim from PRD Section 5.9
 * (Tool III). Bengali/Hindi translations are pending researcher sign-off
 * (PRD Open Question #3) and will be added without changing question
 * order, ids, or correctOptionId once approved.
 */
export const knowledgeQuestions: KnowledgeQuestion[] = [
  {
    id: 'q1',
    order: 1,
    topic: 'How to know baby gets enough milk',
    text: { en: 'How can you tell if your baby is getting enough breast milk?' },
    options: [
      { id: 'a', text: { en: 'Baby pees more than 6 times a day' } },
      { id: 'b', text: { en: 'Baby sleeps all day' } },
      { id: 'c', text: { en: 'Baby cries after every feed' } },
      { id: 'd', text: { en: 'Baby gains weight every day' } },
    ],
    correctOptionId: 'a',
    approvedCorrectAnswerReference: 'Baby pees >6 times/day',
    contentStatus: 'approved',
  },
  {
    id: 'q2',
    order: 2,
    topic: 'How to keep preterm baby warm',
    text: { en: 'What is the best way to keep a preterm baby warm?' },
    options: [
      { id: 'a', text: { en: 'Use a hot water bottle' } },
      { id: 'b', text: { en: 'Kangaroo (skin-to-skin) care' } },
      { id: 'c', text: { en: 'Keep the baby near a fire' } },
      { id: 'd', text: { en: 'Wrap the baby in many heavy blankets' } },
    ],
    correctOptionId: 'b',
    approvedCorrectAnswerReference: 'Kangaroo Care (skin-to-skin)',
    contentStatus: 'approved',
  },
  {
    id: 'q3',
    order: 3,
    topic: 'Baby suddenly refuses to feed',
    text: { en: 'What does it mean if your baby suddenly refuses to feed?' },
    options: [
      { id: 'a', text: { en: 'Nothing to worry about' } },
      { id: 'b', text: { en: 'The baby is simply not hungry' } },
      { id: 'c', text: { en: 'It could be a medical emergency' } },
      { id: 'd', text: { en: 'The baby wants formula instead' } },
    ],
    correctOptionId: 'c',
    approvedCorrectAnswerReference: 'Could be an emergency',
    contentStatus: 'approved',
  },
  {
    id: 'q4',
    order: 4,
    topic: 'Duration of exclusive breastfeeding',
    text: { en: 'For how long should a baby be exclusively breastfed?' },
    options: [
      { id: 'a', text: { en: '1 month' } },
      { id: 'b', text: { en: '3 months' } },
      { id: 'c', text: { en: '6 months' } },
      { id: 'd', text: { en: '12 months' } },
    ],
    correctOptionId: 'c',
    approvedCorrectAnswerReference: '6 months',
    contentStatus: 'approved',
  },
  {
    id: 'q5',
    order: 5,
    topic: 'Which is NOT a danger sign',
    text: { en: 'Which of the following is NOT a danger sign in a newborn?' },
    options: [
      { id: 'a', text: { en: 'Fast breathing' } },
      { id: 'b', text: { en: 'Baby pees 8-10 times a day' } },
      { id: 'c', text: { en: 'Bluish lips' } },
      { id: 'd', text: { en: 'Refusing to feed' } },
    ],
    correctOptionId: 'b',
    approvedCorrectAnswerReference: 'Baby pees 8-10 times/day',
    contentStatus: 'approved',
  },
  {
    id: 'q6',
    order: 6,
    topic: 'When to start breastfeeding after birth',
    text: { en: 'When should breastfeeding start after birth?' },
    options: [
      { id: 'a', text: { en: 'Within 1 hour' } },
      { id: 'b', text: { en: 'After 6 hours' } },
      { id: 'c', text: { en: 'After 24 hours' } },
      { id: 'd', text: { en: 'Only when the baby cries' } },
    ],
    correctOptionId: 'a',
    approvedCorrectAnswerReference: 'Within 1 hour',
    contentStatus: 'approved',
  },
  {
    id: 'q7',
    order: 7,
    topic: 'Definition of preterm birth',
    text: { en: 'A baby is considered preterm if born:' },
    options: [
      { id: 'a', text: { en: 'After 40 weeks' } },
      { id: 'b', text: { en: 'Before 37 completed weeks' } },
      { id: 'c', text: { en: 'Weighing less than 4kg' } },
      { id: 'd', text: { en: 'On the due date' } },
    ],
    correctOptionId: 'b',
    approvedCorrectAnswerReference: 'Born before 8 months (37 weeks)',
    contentStatus: 'approved',
  },
  {
    id: 'q8',
    order: 8,
    topic: 'Who advises vaccination schedule',
    text: { en: 'Who should you ask about your baby’s vaccination schedule?' },
    options: [
      { id: 'a', text: { en: 'A neighbour' } },
      { id: 'b', text: { en: 'Doctor or health worker' } },
      { id: 'c', text: { en: 'A pharmacist only' } },
      { id: 'd', text: { en: 'No one, it is not needed' } },
    ],
    correctOptionId: 'b',
    approvedCorrectAnswerReference: 'Doctor or health worker',
    contentStatus: 'approved',
  },
  {
    id: 'q9',
    order: 9,
    topic: 'Umbilical cord care',
    text: { en: 'How should the umbilical cord stump be cared for?' },
    options: [
      { id: 'a', text: { en: 'Apply oil or powder' } },
      { id: 'b', text: { en: 'Keep it clean and dry' } },
      { id: 'c', text: { en: 'Cover it tightly with a bandage' } },
      { id: 'd', text: { en: 'Wash it with soap several times a day' } },
    ],
    correctOptionId: 'b',
    approvedCorrectAnswerReference: 'Keep clean and dry',
    contentStatus: 'approved',
  },
  {
    id: 'q10',
    order: 10,
    topic: 'Daily KMC duration',
    text: { en: 'How many hours of Kangaroo Mother Care should be done daily, at minimum?' },
    options: [
      { id: 'a', text: { en: '5-10 minutes' } },
      { id: 'b', text: { en: '1-2 hours' } },
      { id: 'c', text: { en: 'Only once a week' } },
      { id: 'd', text: { en: 'It is not necessary at home' } },
    ],
    correctOptionId: 'b',
    approvedCorrectAnswerReference: '1-2 hours minimum',
    contentStatus: 'approved',
  },
  {
    id: 'q11',
    order: 11,
    topic: 'Keeping baby warm at home',
    text: { en: 'What is the most effective way to keep a baby warm at home?' },
    options: [
      { id: 'a', text: { en: 'Skin-to-skin contact with mother' } },
      { id: 'b', text: { en: 'Keep the fan running' } },
      { id: 'c', text: { en: 'Bathe the baby frequently' } },
      { id: 'd', text: { en: 'Leave the baby near a window' } },
    ],
    correctOptionId: 'a',
    approvedCorrectAnswerReference: 'Skin-to-skin contact',
    contentStatus: 'approved',
  },
  {
    id: 'q12',
    order: 12,
    topic: 'Major risk for preterm babies',
    text: { en: 'What is a major health risk for preterm babies?' },
    options: [
      { id: 'a', text: { en: 'Hypothermia (low body temperature)' } },
      { id: 'b', text: { en: 'Excess weight gain' } },
      { id: 'c', text: { en: 'Too much hair growth' } },
      { id: 'd', text: { en: 'Tallness' } },
    ],
    correctOptionId: 'a',
    approvedCorrectAnswerReference: 'Hypothermia (low body temp)',
    contentStatus: 'approved',
  },
  {
    id: 'q13',
    order: 13,
    topic: 'Why preterm babies stay longer',
    text: { en: 'Why do preterm babies often need a longer hospital stay?' },
    options: [
      { id: 'a', text: { en: 'They have not yet learned to feed and breathe well' } },
      { id: 'b', text: { en: 'Hospitals require it for billing' } },
      { id: 'c', text: { en: 'They are heavier than full-term babies' } },
      { id: 'd', text: { en: 'It is only a precaution with no medical reason' } },
    ],
    correctOptionId: 'a',
    approvedCorrectAnswerReference: 'Not learned to feed/breathe',
    contentStatus: 'approved',
  },
  {
    id: 'q14',
    order: 14,
    topic: 'Baby vomits often - what to do',
    text: { en: 'What should you do if your baby vomits often?' },
    options: [
      { id: 'a', text: { en: 'Ignore it, it is normal' } },
      { id: 'b', text: { en: 'Stop all feeds' } },
      { id: 'c', text: { en: 'Consult a doctor' } },
      { id: 'd', text: { en: 'Give the baby plain water instead' } },
    ],
    correctOptionId: 'c',
    approvedCorrectAnswerReference: 'Consult a doctor',
    contentStatus: 'approved',
  },
  {
    id: 'q15',
    order: 15,
    topic: 'Baby feels very hot - what to do',
    text: { en: 'What should you do if your baby feels very hot to the touch?' },
    options: [
      { id: 'a', text: { en: 'Wrap the baby in more blankets' } },
      { id: 'b', text: { en: 'Consult a doctor' } },
      { id: 'c', text: { en: 'Wait a day to see if it passes' } },
      { id: 'd', text: { en: 'Give the baby a cold water bath' } },
    ],
    correctOptionId: 'b',
    approvedCorrectAnswerReference: 'Consult a doctor',
    contentStatus: 'approved',
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
