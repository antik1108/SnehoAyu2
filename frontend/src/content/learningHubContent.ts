export type LearningCategory =
  | 'feeding'
  | 'kmc'
  | 'growth'
  | 'danger_signs'
  | 'emotional_support'
  | 'immunization';

export interface LearningContentItem {
  slug: string;
  category: LearningCategory;
  title: string;
  summary: string;
  body: string;
  durationMin: number;
  audioUrl?: string;
  featured?: boolean;
}

export const learningHubContent: LearningContentItem[] = [
  {
    slug: 'latching-basics',
    category: 'feeding',
    title: 'Getting a Good Latch',
    summary: 'Simple steps for a comfortable, effective breastfeeding latch.',
    body: 'Hold your baby tummy-to-tummy, bring baby to breast (not breast to baby), and wait for a wide-open mouth before latching. A good latch should not hurt after the first few seconds.',
    durationMin: 3,
    featured: true,
  },
  {
    slug: 'feeding-cues',
    category: 'feeding',
    title: 'Recognizing Feeding Cues',
    summary: 'Early signs your baby is hungry, before crying starts.',
    body: 'Look for rooting, hand-to-mouth movements, and lip smacking. Feeding on these early cues is calmer for both of you than waiting for crying.',
    durationMin: 2,
  },
  {
    slug: 'expressed-milk',
    category: 'feeding',
    title: 'Storing Expressed Breast Milk',
    summary: 'How long expressed milk stays safe at room temperature, fridge, and freezer.',
    body: 'Room temperature (up to 25°C): 4 hours. Refrigerator: 4 days. Freezer: 6 months. Always label with the date and use the oldest milk first.',
    durationMin: 2,
  },
  {
    slug: 'kmc-how-to',
    category: 'kmc',
    title: 'How to Do Kangaroo Mother Care',
    summary: 'Step-by-step skin-to-skin contact technique.',
    body: 'Undress your baby down to the diaper, place baby upright against your bare chest, and cover both of you with a blanket. Aim for at least 1-2 hours per session, as often as possible.',
    durationMin: 3,
    audioUrl: '/audio/kmc-how-to.mp3',
    featured: true,
  },
  {
    slug: 'kmc-benefits',
    category: 'kmc',
    title: 'Why Kangaroo Care Matters',
    summary: 'The science behind skin-to-skin contact for preterm babies.',
    body: 'KMC stabilizes heart rate and breathing, helps maintain body temperature, supports weight gain, and strengthens bonding between mother and baby.',
    durationMin: 2,
  },
  {
    slug: 'corrected-age-explained',
    category: 'growth',
    title: 'Understanding Corrected Age',
    summary: 'Why your preterm baby is measured differently than full-term babies.',
    body: 'Corrected age accounts for how early your baby was born. It is calculated as chronological age minus the number of weeks born early. Use corrected age when checking growth and development milestones.',
    durationMin: 3,
  },
  {
    slug: 'tracking-growth',
    category: 'growth',
    title: 'What to Expect: Growth Tracking',
    summary: 'How often to measure and what the numbers mean.',
    body: 'Weigh your baby weekly if advised, and bring measurements to every follow-up visit. Steady, gradual growth matters more than any single reading.',
    durationMin: 2,
  },
  {
    slug: 'danger-signs-overview',
    category: 'danger_signs',
    title: 'Danger Signs at a Glance',
    summary: 'A quick summary of the warning signs covered in the Danger Signs guide.',
    body: 'Fast breathing, bluish lips, fever or low temperature, refusing to feed, and unusual sleepiness are all reasons to seek care immediately. See the full Danger Signs guide for details.',
    durationMin: 2,
  },
  {
    slug: 'coping-with-anxiety',
    category: 'emotional_support',
    title: 'Coping with Anxiety as a New Mother',
    summary: 'It is normal to feel worried — here is how to manage it.',
    body: 'Many mothers of preterm babies feel anxious. Talk to someone you trust, take short breaks when possible, and reach out to your researcher or nurse if your worry feels overwhelming.',
    durationMin: 3,
    audioUrl: '/audio/coping-with-anxiety.mp3',
    featured: true,
  },
  {
    slug: 'asking-for-help',
    category: 'emotional_support',
    title: 'It Is Okay to Ask for Help',
    summary: 'Building a support system around you and your baby.',
    body: 'Caring for a preterm baby is demanding. Lean on family, friends, and your care team. Asking for help is a sign of strength, not weakness.',
    durationMin: 2,
  },
  {
    slug: 'vaccine-basics',
    category: 'immunization',
    title: 'Why Vaccines Matter for Preterm Babies',
    summary: 'Preterm babies follow the same schedule as full-term babies, by birth date.',
    body: 'Vaccinations are scheduled from your baby\'s actual birth date, not corrected age. Staying on schedule protects your baby from serious diseases during a vulnerable time.',
    durationMin: 2,
  },
];
