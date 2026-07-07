/**
 * Daily care message library — Phase 2 content integration.
 *
 * All 56 messages sourced directly from SnehoAyu_Content_Knowledge_Base.md §2.
 * Messages are organised by corrected-age window, as mandated for a preterm
 * cohort (KB §2 implementation rule: use corrected_age_days, not chronological).
 *
 * TODO: confirm with researcher — KB §21 item 1 — this library contains 56
 * unique messages. The PRD requires ≥180 for the full 6-month period. The
 * selection logic below rotates within the matched window to fill gaps.
 * Additional messages must be drafted by Dr. Ponnarasi's team and clinically
 * signed off before being added here. Do NOT auto-generate new messages.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type MessageCategory =
  | 'WARMTH'
  | 'INFECTION_PREVENTION'
  | 'BATHING'
  | 'CORD_CARE'
  | 'IMMUNIZATION'
  | 'SLEEP'
  | 'LOVING_CARE'
  | 'BREASTFEEDING'
  | 'KMC'
  | 'VITAMIN_A'
  | 'SAFETY'
  | 'DANGER_SIGNS'
  | 'MOTHER_SELF_CARE'
  | 'GROWTH_WEIGHT'
  | 'FOLLOW_UP';

export interface CareMessage {
  /** Unique identifier matching the KB (D01–D56). */
  id: string;
  /** Corrected-age window start, inclusive (days post-discharge). */
  correctedAgeDayMin: number;
  /** Corrected-age window end, inclusive (days post-discharge). */
  correctedAgeDayMax: number;
  category: MessageCategory;
  textEn: string;
  /** Bengali translation — primary delivery language for this cohort. */
  textBn: string;
}

// ─── Window A — Days 0–7 (First Week Post-Discharge): Survival Basics ────────
// Source: KB §2 — Window A

const WINDOW_A: CareMessage[] = [
  { id: 'D01', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'WARMTH',
    textEn: 'Keep your baby warm today. Cover the head with a cap, feet with mittens, and dress in weather-appropriate cotton clothes.',
    textBn: 'আজ আপনার শিশুকে উষ্ণ রাখুন। মাথায় টুপি, পায়ে মোজা পরিয়ে দিন এবং আবহাওয়া উপযোগী সুতি কাপড় পরান।' },
  { id: 'D02', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'INFECTION_PREVENTION',
    textEn: 'Always wash your hands with soap and water before touching your baby — this is the #1 way to prevent infection.',
    textBn: 'শিশুকে স্পর্শ করার আগে সর্বদা সাবান ও পানি দিয়ে হাত ধুন — এটি সংক্রমণ প্রতিরোধের সবচেয়ে কার্যকর উপায়।' },
  { id: 'D03', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'BREASTFEEDING',
    textEn: 'Breastfeed your baby every 2–3 hours or on demand — that\'s 8 to 12 times in 24 hours. Look for hunger signs: rooting, lip-smacking, fussing.',
    textBn: 'প্রতি ২–৩ ঘণ্টা পর পর বা চাহিদামতো বুকের দুধ খাওয়ান — ২৪ ঘণ্টায় ৮ থেকে ১২ বার। ক্ষুধার লক্ষণ দেখুন: মুখ ঘোরানো, ঠোঁট চাটা, অস্থিরতা।' },
  { id: 'D04', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'BREASTFEEDING',
    textEn: 'After every feed, gently burp your baby to release swallowed air.',
    textBn: 'প্রতিটি খাওয়ানোর পরে শিশুকে আলতো করে ঢেকুর তুলিয়ে দিন যাতে গেলা বাতাস বেরিয়ে যায়।' },
  { id: 'D05', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'BREASTFEEDING',
    textEn: 'No water, tea, or any other fluid for your baby until 6 months — breast milk alone is enough, even in hot weather.',
    textBn: '৬ মাস বয়স পর্যন্ত শিশুকে পানি, চা বা অন্য কোনো তরল দেবেন না — গরম আবহাওয়াতেও শুধু বুকের দুধই যথেষ্ট।' },
  { id: 'D06', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'LOVING_CARE',
    textEn: 'Talk to and comfort your baby often. Your voice and touch help your baby feel safe.',
    textBn: 'প্রায়ই শিশুর সাথে কথা বলুন এবং তাকে সান্ত্বনা দিন। আপনার কণ্ঠস্বর ও স্পর্শ শিশুকে নিরাপদ অনুভব করায়।' },
  { id: 'D07', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'INFECTION_PREVENTION',
    textEn: 'Clean your baby\'s face, hands, and diaper area regularly using a wet cotton cloth.',
    textBn: 'ভেজা সুতি কাপড় দিয়ে নিয়মিত শিশুর মুখ, হাত ও ডায়াপারের জায়গা পরিষ্কার করুন।' },
  { id: 'D08', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'DANGER_SIGNS',
    textEn: 'Check diapers often — a well-fed newborn passes urine at least 6 times in 24 hours.',
    textBn: 'প্রায়ই ডায়াপার পরীক্ষা করুন — একজন ভালোভাবে খাওয়া নবজাতক ২৪ ঘণ্টায় কমপক্ষে ৬ বার প্রস্রাব করে।' },
  { id: 'D09', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'SLEEP',
    textEn: 'Always place your baby on their back to sleep, in a safe, calm space.',
    textBn: 'সর্বদা শিশুকে চিৎ করে শোয়ান, নিরাপদ ও শান্ত জায়গায়।' },
  { id: 'D10', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'MOTHER_SELF_CARE',
    textEn: 'Keep a calm environment around your baby — avoid loud noise and overstimulation.',
    textBn: 'শিশুর চারপাশে শান্ত পরিবেশ বজায় রাখুন — উচ্চ শব্দ ও অতিরিক্ত উদ্দীপনা এড়িয়ে চলুন।' },
  { id: 'D11', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'MOTHER_SELF_CARE',
    textEn: 'You are doing a great job. Rest whenever your baby sleeps — your body is still recovering too.',
    textBn: 'আপনি দারুণ করছেন। শিশু যখন ঘুমায় তখন আপনিও বিশ্রাম নিন — আপনার শরীরও এখনো সুস্থ হচ্ছে।' },
  { id: 'D12', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'CORD_CARE',
    textEn: 'Keep your baby\'s umbilical cord clean and dry. Do not apply any oil, powder, ash, or herbs to it.',
    textBn: 'শিশুর নাভি পরিষ্কার ও শুকনো রাখুন। এতে কোনো তেল, পাউডার, ছাই বা ভেষজ লাগাবেন না।' },
  { id: 'D13', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'CORD_CARE',
    textEn: 'Check the cord daily. It should look clean with no redness, swelling, pus, or bad smell.',
    textBn: 'প্রতিদিন নাভি পরীক্ষা করুন। এটি পরিষ্কার থাকা উচিত, কোনো লালভাব, ফোলা, পুঁজ বা দুর্গন্ধ থাকা উচিত নয়।' },
  { id: 'D14', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'VITAMIN_A',
    textEn: 'Have you taken your vitamin A capsule (200,000 IU) yet? It should be taken as soon as possible after birth, and no later than 8 weeks after delivery.',
    textBn: 'আপনি কি এখনো ভিটামিন এ ক্যাপসুল (২,০০,০০০ আইইউ) নিয়েছেন? প্রসবের পরপরই এটি নেওয়া উচিত, এবং প্রসবের ৮ সপ্তাহের মধ্যে অবশ্যই নিতে হবে।' },
  { id: 'D15', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'WARMTH',
    textEn: 'Hold your baby skin-to-skin against your chest and cover both of you with a warm cloth — this is one of the best ways to keep a small baby warm.',
    textBn: 'শিশুকে আপনার বুকে শরীর-থেকে-শরীর ধরুন এবং দুজনকেই একটি উষ্ণ কাপড়ে ঢেকে দিন — এটি ছোট শিশুকে উষ্ণ রাখার সেরা উপায়গুলির একটি।' },
  { id: 'D16', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'DANGER_SIGNS',
    textEn: 'Review today: does your baby feed well and feel warm to touch? If your baby feels cold, feeds poorly, or breathes fast/slow, seek care immediately.',
    textBn: 'আজ পর্যালোচনা করুন: আপনার শিশু কি ভালো খাচ্ছে এবং স্পর্শে উষ্ণ লাগছে? শিশু যদি ঠান্ডা লাগে, খাওয়ানো কমে যায়, বা দ্রুত/ধীরে শ্বাস নেয়, তাহলে তাৎক্ষণিক চিকিৎসা নিন।' },
  { id: 'D17', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'BATHING',
    textEn: 'Until your baby\'s cord falls off, give only sponge baths — do not immerse your baby in water.',
    textBn: 'নাভি পড়ে না যাওয়া পর্যন্ত শুধু স্পঞ্জ বাথ দিন — শিশুকে পানিতে ডুবাবেন না।' },
  { id: 'D18', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'INFECTION_PREVENTION',
    textEn: 'Keep sick visitors away from your baby, and avoid smoke from cigarettes or cooking fires near your baby.',
    textBn: 'অসুস্থ দর্শনার্থীদের শিশু থেকে দূরে রাখুন এবং শিশুর কাছে সিগারেট বা রান্নার আগুনের ধোঁয়া এড়িয়ে চলুন।' },
  { id: 'D19', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'BREASTFEEDING',
    textEn: 'Let your baby fully empty one breast before offering the other — this ensures they get both thirst-quenching foremilk and filling hindmilk.',
    textBn: 'অন্য স্তন দেওয়ার আগে শিশুকে একটি স্তন সম্পূর্ণ খালি করতে দিন — এতে সে তৃষ্ণা মেটানো ফোরমিল্ক এবং পেট ভরানো হিন্ডমিল্ক দুটোই পাবে।' },
  { id: 'D20', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'GROWTH_WEIGHT',
    textEn: 'Some weight loss in the first week is normal (5–10%). Your baby should start regaining weight from around day 7–10.',
    textBn: 'প্রথম সপ্তাহে কিছুটা ওজন কমা স্বাভাবিক (৫–১০%)। ৭–১০ দিনের দিকে থেকে আপনার শিশুর ওজন বাড়া শুরু হওয়া উচিত।' },
  { id: 'D21', correctedAgeDayMin: 0, correctedAgeDayMax: 7, category: 'SLEEP',
    textEn: 'Newborns sleep 16–18 hours a day and wake every 2–3 hours to feed — this is completely normal.',
    textBn: 'নবজাতকরা দিনে ১৬–১৮ ঘণ্টা ঘুমায় এবং প্রতি ২–৩ ঘণ্টায় খাওয়ানোর জন্য জেগে ওঠে — এটি সম্পূর্ণ স্বাভাবিক।' },
];

// ─── Window B — Days 8–28 (First Month): Building Routines ───────────────────
// Source: KB §2 — Window B

const WINDOW_B: CareMessage[] = [
  { id: 'D22', correctedAgeDayMin: 8, correctedAgeDayMax: 28, category: 'KMC',
    textEn: 'Skin-to-skin Kangaroo Care helps your baby stay warm, feed better, and grow faster — try to do it every day.',
    textBn: 'ত্বক-থেকে-ত্বক ক্যাঙ্গারু কেয়ার আপনার শিশুকে উষ্ণ থাকতে, ভালো খেতে এবং দ্রুত বাড়তে সাহায্য করে — প্রতিদিন এটি করার চেষ্টা করুন।' },
  { id: 'D23', correctedAgeDayMin: 8, correctedAgeDayMax: 28, category: 'KMC',
    textEn: 'Kangaroo Mother Care position: baby upright between your breasts, head turned to one side, legs in a frog position, supported by a sling or binder.',
    textBn: 'ক্যাঙ্গারু মাদার কেয়ার পজিশন: শিশু সোজাভাবে আপনার বুকের মাঝে, মাথা এক দিকে ঘোরানো, পা ব্যাঙের মতো অবস্থানে, স্লিং বা বাইন্ডার দিয়ে সহায়তা করা।' },
  { id: 'D24', correctedAgeDayMin: 8, correctedAgeDayMax: 28, category: 'CORD_CARE',
    textEn: 'The cord usually falls off within 5–10 days. Keep giving sponge baths until it\'s fully healed.',
    textBn: 'নাভি সাধারণত ৫–১০ দিনের মধ্যে পড়ে যায়। সম্পূর্ণ সেরে না যাওয়া পর্যন্ত স্পঞ্জ বাথ দিতে থাকুন।' },
  { id: 'D25', correctedAgeDayMin: 8, correctedAgeDayMax: 28, category: 'IMMUNIZATION',
    textEn: 'Mark your baby\'s vaccination dates on the health card. On-time vaccines protect against serious diseases.',
    textBn: 'স্বাস্থ্য কার্ডে শিশুর টিকার তারিখ চিহ্নিত করুন। সময়মতো টিকা গুরুতর রোগ থেকে রক্ষা করে।' },
  { id: 'D26', correctedAgeDayMin: 8, correctedAgeDayMax: 28, category: 'BREASTFEEDING',
    textEn: 'Good attachment signs: baby\'s mouth wide open, chin touching breast, more areola visible above the mouth than below, slow deep sucks with pauses.',
    textBn: 'ভালো সংযুক্তির লক্ষণ: শিশুর মুখ প্রশস্তভাবে খোলা, থুতনি স্তনে স্পর্শ করছে, মুখের নিচের চেয়ে উপরে বেশি অ্যারিওলা দেখা যাচ্ছে, বিরতি সহ ধীর গভীর চোষা।' },
  { id: 'D27', correctedAgeDayMin: 8, correctedAgeDayMax: 28, category: 'BREASTFEEDING',
    textEn: 'Never introduce a feeding bottle — it can cause poor attachment and reduce your milk supply.',
    textBn: 'কখনো ফিডিং বোতল ব্যবহার করবেন না — এটি সংযুক্তি খারাপ করতে পারে এবং দুধের সরবরাহ কমাতে পারে।' },
  { id: 'D28', correctedAgeDayMin: 8, correctedAgeDayMax: 28, category: 'DANGER_SIGNS',
    textEn: 'Watch daily for danger signs: feeding poorly, feels cold, fast/slow or gasping breathing, fever, red swollen eyelids with pus, cord redness/pus/smell, fits, or yellow skin. Any one of these — seek care now.',
    textBn: 'প্রতিদিন বিপদ চিহ্ন দেখুন: খাওয়া কমে যাওয়া, ঠান্ডা লাগা, দ্রুত/ধীর বা হাঁপানো শ্বাস, জ্বর, পুঁজসহ লাল ফোলা চোখের পাতা, নাভিতে লালভাব/পুঁজ/গন্ধ, খিঁচুনি বা হলুদ ত্বক। যেকোনো একটি দেখলে — এখনই চিকিৎসা নিন।' },
  { id: 'D29', correctedAgeDayMin: 8, correctedAgeDayMax: 28, category: 'GROWTH_WEIGHT',
    textEn: 'By day 14, your baby should have regained their birth weight. After that, expect about 25–30 grams of weight gain per day.',
    textBn: '১৪তম দিনের মধ্যে আপনার শিশুর জন্মের ওজন ফিরে পাওয়া উচিত। এরপর প্রতিদিন প্রায় ২৫–৩০ গ্রাম ওজন বাড়ার আশা করুন।' },
  { id: 'D30', correctedAgeDayMin: 8, correctedAgeDayMax: 28, category: 'LOVING_CARE',
    textEn: 'Every baby is different — some are calm, some are fussy. Learning your baby\'s unique cues builds trust between you both.',
    textBn: 'প্রতিটি শিশু আলাদা — কেউ শান্ত, কেউ অস্থির। আপনার শিশুর অনন্য সংকেত শিখলে আপনাদের মধ্যে আস্থা তৈরি হয়।' },
  { id: 'D31', correctedAgeDayMin: 8, correctedAgeDayMax: 28, category: 'MOTHER_SELF_CARE',
    textEn: 'To make enough breast milk, drink 3–4 litres of fluid a day — drink something every time you breastfeed.',
    textBn: 'পর্যাপ্ত বুকের দুধ তৈরির জন্য দিনে ৩–৪ লিটার তরল পান করুন — প্রতিবার বুকের দুধ খাওয়ানোর সময় কিছু পান করুন।' },
  { id: 'D32', correctedAgeDayMin: 8, correctedAgeDayMax: 28, category: 'MOTHER_SELF_CARE',
    textEn: 'Eating one extra full serving of your regular staple food each day helps keep your milk supply strong.',
    textBn: 'প্রতিদিন আপনার নিয়মিত প্রধান খাবারের একটি অতিরিক্ত পরিপূর্ণ পরিবেশন খেলে দুধের সরবরাহ শক্তিশালী থাকে।' },
  { id: 'D33', correctedAgeDayMin: 8, correctedAgeDayMax: 28, category: 'SAFETY',
    textEn: 'Never leave your baby alone on a bed, sofa, or table — even for a moment.',
    textBn: 'কখনো শিশুকে বিছানা, সোফা বা টেবিলে একা রাখবেন না — এমনকি এক মুহূর্তের জন্যও না।' },
  { id: 'D34', correctedAgeDayMin: 8, correctedAgeDayMax: 28, category: 'SAFETY',
    textEn: 'Never hold your baby by the feet with the head hanging down.',
    textBn: 'কখনো শিশুকে পা ধরে মাথা নিচু করে ধরবেন না।' },
  { id: 'D35', correctedAgeDayMin: 8, correctedAgeDayMax: 28, category: 'BREASTFEEDING',
    textEn: 'Continue exclusive breastfeeding — no water, formula, or other foods — for the full first 6 months.',
    textBn: 'সম্পূর্ণ প্রথম ৬ মাস শুধু বুকের দুধ খাওয়ানো চালিয়ে যান — পানি, ফর্মুলা বা অন্য কিছু নয়।' },
  { id: 'D36', correctedAgeDayMin: 8, correctedAgeDayMax: 28, category: 'FOLLOW_UP',
    textEn: 'If everything is normal, your next check-up follows the standard schedule: 2–3 days, 7 days, 28 days, and 6 weeks. Don\'t miss these visits.',
    textBn: 'সব ঠিক থাকলে পরবর্তী চেকআপের সময়সূচি: ২–৩ দিন, ৭ দিন, ২৮ দিন এবং ৬ সপ্তাহ। এই ভিজিটগুলো মিস করবেন না।' },
  { id: 'D37', correctedAgeDayMin: 8, correctedAgeDayMax: 28, category: 'INFECTION_PREVENTION',
    textEn: 'Keep fingernails short and clean for anyone who handles your baby, to reduce the spread of germs.',
    textBn: 'যে কেউ শিশুকে ধরে তার নখ ছোট ও পরিষ্কার রাখুন, জীবাণু ছড়ানো কমাতে।' },
  { id: 'D38', correctedAgeDayMin: 8, correctedAgeDayMax: 28, category: 'BATHING',
    textEn: 'Once the cord has healed, you can give a full bath every 2–3 days — clean the diaper area after every stool or urine in between.',
    textBn: 'নাভি সেরে গেলে প্রতি ২–৩ দিনে একবার পূর্ণ গোসল দিতে পারেন — এর মাঝে প্রতিটি মল বা প্রস্রাবের পরে ডায়াপারের জায়গা পরিষ্কার করুন।' },
];

// ─── Window C — Days 29–90 (Month 2–3): Sustaining Care & Confidence ─────────
// Source: KB §2 — Window C

const WINDOW_C: CareMessage[] = [
  { id: 'D39', correctedAgeDayMin: 29, correctedAgeDayMax: 90, category: 'BREASTFEEDING',
    textEn: 'If you feel your milk supply is low: rest, drink fluids, feed on demand every 2–3 hours, and avoid giving bottles or supplements — supply usually improves within days.',
    textBn: 'দুধের সরবরাহ কম মনে হলে: বিশ্রাম নিন, তরল পান করুন, প্রতি ২–৩ ঘণ্টায় চাহিদামতো খাওয়ান, এবং বোতল বা সাপ্লিমেন্ট দেওয়া এড়িয়ে চলুন — সরবরাহ সাধারণত কয়েকদিনের মধ্যে উন্নত হয়।' },
  { id: 'D40', correctedAgeDayMin: 29, correctedAgeDayMax: 90, category: 'BREASTFEEDING',
    textEn: 'Sore nipples? Make sure of a good latch, apply a little breast milk after feeds, and let nipples air-dry. Start feeds on the less sore side.',
    textBn: 'স্তনবৃন্তে ব্যথা? ভালো সংযুক্তি নিশ্চিত করুন, খাওয়ানোর পরে সামান্য বুকের দুধ লাগান এবং স্তনবৃন্ত বাতাসে শুকাতে দিন। কম ব্যথার দিক থেকে খাওয়ানো শুরু করুন।' },
  { id: 'D41', correctedAgeDayMin: 29, correctedAgeDayMax: 90, category: 'GROWTH_WEIGHT',
    textEn: 'Your baby should double their birth weight by around 4–5 months — keep tracking growth at each visit.',
    textBn: 'আপনার শিশুর প্রায় ৪–৫ মাসের মধ্যে জন্মের ওজন দ্বিগুণ হওয়া উচিত — প্রতিটি ভিজিটে বৃদ্ধি ট্র্যাক করতে থাকুন।' },
  { id: 'D42', correctedAgeDayMin: 29, correctedAgeDayMax: 90, category: 'SLEEP',
    textEn: 'As your baby grows, night sleep will get longer and daytime wake periods more regular — this happens gradually.',
    textBn: 'শিশু বড় হওয়ার সাথে সাথে রাতের ঘুম দীর্ঘ হবে এবং দিনের জেগে থাকার সময়কাল আরও নিয়মিত হবে — এটি ধীরে ধীরে হয়।' },
  { id: 'D43', correctedAgeDayMin: 29, correctedAgeDayMax: 90, category: 'IMMUNIZATION',
    textEn: 'At 6 weeks: Pentavalent (1st dose), OPV-1, and Hepatitis B (2nd dose) are due. Please don\'t delay.',
    textBn: '৬ সপ্তাহে: পেন্টাভ্যালেন্ট (১ম ডোজ), ওপিভি-১ এবং হেপাটাইটিস বি (২য় ডোজ) দেওয়ার সময়। দয়া করে দেরি করবেন না।' },
  { id: 'D44', correctedAgeDayMin: 29, correctedAgeDayMax: 90, category: 'KMC',
    textEn: 'Kangaroo care can be continued for as many hours a day as comfortable — even sleeping in KMC position is fine if you\'re comfortable.',
    textBn: 'স্বাচ্ছন্দ্যমতো যত বেশি ঘণ্টা ক্যাঙ্গারু কেয়ার চালিয়ে যেতে পারেন — আপনি স্বাচ্ছন্দ্যবোধ করলে কেএমসি পজিশনে ঘুমানোও ঠিক আছে।' },
  { id: 'D45', correctedAgeDayMin: 29, correctedAgeDayMax: 90, category: 'DANGER_SIGNS',
    textEn: 'A baby who is very hard to wake, or who is sleeping much more than usual and missing feeds, may be unwell — seek medical help right away.',
    textBn: 'যে শিশুকে জাগানো খুব কঠিন, বা যে স্বাভাবিকের চেয়ে অনেক বেশি ঘুমাচ্ছে এবং খাওয়া মিস করছে, সে অসুস্থ হতে পারে — এখনই চিকিৎসা সহায়তা নিন।' },
  { id: 'D46', correctedAgeDayMin: 29, correctedAgeDayMax: 90, category: 'MOTHER_SELF_CARE',
    textEn: 'Breastfeeding mothers should avoid smoking, alcohol, and any unprescribed medicines — these can pass to your baby through milk.',
    textBn: 'বুকের দুধ খাওয়ানো মায়েদের ধূমপান, মদ এবং কোনো অনির্ধারিত ওষুধ এড়ানো উচিত — এগুলো দুধের মাধ্যমে শিশুর কাছে যেতে পারে।' },
  { id: 'D47', correctedAgeDayMin: 29, correctedAgeDayMax: 90, category: 'BREASTFEEDING',
    textEn: 'Breast engorgement? Try a warm compress before feeding, express a little milk first, feed every 2–3 hours, and use a cold compress afterward.',
    textBn: 'স্তন ফুলে গেছে? খাওয়ানোর আগে গরম সেক দিন, আগে একটু দুধ বের করুন, প্রতি ২–৩ ঘণ্টায় খাওয়ান এবং পরে ঠান্ডা সেক ব্যবহার করুন।' },
  { id: 'D48', correctedAgeDayMin: 29, correctedAgeDayMax: 90, category: 'IMMUNIZATION',
    textEn: 'At 10 weeks: Pentavalent (2nd dose), OPV-2, and Rotavirus (2nd dose) are due.',
    textBn: '১০ সপ্তাহে: পেন্টাভ্যালেন্ট (২য় ডোজ), ওপিভি-২ এবং রোটাভাইরাস (২য় ডোজ) দেওয়ার সময়।' },
  { id: 'D49', correctedAgeDayMin: 29, correctedAgeDayMax: 90, category: 'VITAMIN_A',
    textEn: 'Vitamin A in your diet — mangoes, papaya, carrots, egg yolk, liver, and fish — helps both you and your baby stay strong and fight infection.',
    textBn: 'আপনার খাবারে ভিটামিন এ — আম, পেঁপে, গাজর, ডিমের কুসুম, কলিজা এবং মাছ — আপনাকে ও শিশু উভয়কেই সুস্থ ও সংক্রমণমুক্ত থাকতে সাহায্য করে।' },
];

// ─── Window D — Days 91–180 (Month 4–6): Extended Follow-Through ─────────────
// Source: KB §2 — Window D

const WINDOW_D: CareMessage[] = [
  { id: 'D50', correctedAgeDayMin: 91, correctedAgeDayMax: 180, category: 'IMMUNIZATION',
    textEn: 'At 14 weeks: Pentavalent (3rd dose), OPV-3, and Hepatitis B (3rd dose) are due.',
    textBn: '১৪ সপ্তাহে: পেন্টাভ্যালেন্ট (৩য় ডোজ), ওপিভি-৩ এবং হেপাটাইটিস বি (৩য় ডোজ) দেওয়ার সময়।' },
  { id: 'D51', correctedAgeDayMin: 91, correctedAgeDayMax: 180, category: 'BREASTFEEDING',
    textEn: 'Keep breastfeeding exclusively — no other foods yet — right up until your baby turns 6 months.',
    textBn: 'শিশুর ৬ মাস বয়স পর্যন্ত শুধু বুকের দুধ খাওয়ানো চালিয়ে যান — এখনো অন্য কোনো খাবার নয়।' },
  { id: 'D52', correctedAgeDayMin: 91, correctedAgeDayMax: 180, category: 'GROWTH_WEIGHT',
    textEn: 'Continue weighing your baby regularly and bring the growth record to every follow-up visit.',
    textBn: 'নিয়মিত শিশুর ওজন নিতে থাকুন এবং প্রতিটি ফলো-আপ ভিজিটে বৃদ্ধির রেকর্ড নিয়ে যান।' },
  { id: 'D53', correctedAgeDayMin: 91, correctedAgeDayMax: 180, category: 'FOLLOW_UP',
    textEn: 'Your 6-month follow-up is an important milestone visit — it includes a full development and feeding assessment. Please don\'t miss it.',
    textBn: 'আপনার ৬ মাসের ফলো-আপ একটি গুরুত্বপূর্ণ মাইলস্টোন ভিজিট — এতে সম্পূর্ণ বিকাশ ও খাওয়ানোর মূল্যায়ন অন্তর্ভুক্ত রয়েছে। অনুগ্রহ করে মিস করবেন না।' },
  { id: 'D54', correctedAgeDayMin: 91, correctedAgeDayMax: 180, category: 'IMMUNIZATION',
    textEn: 'At 9 months, Measles/MR/MMR vaccine will be due — mark it on your calendar now.',
    textBn: '৯ মাসে হাম/এমআর/এমএমআর টিকার সময় হবে — এখনই আপনার ক্যালেন্ডারে চিহ্নিত করুন।' },
  { id: 'D55', correctedAgeDayMin: 91, correctedAgeDayMax: 180, category: 'LOVING_CARE',
    textEn: 'Responding warmly every time your baby cries builds their lifelong sense of trust and security — you cannot "spoil" a baby with love.',
    textBn: 'শিশু কাঁদলে প্রতিবার উষ্ণভাবে সাড়া দিলে তার আজীবনের বিশ্বাস ও নিরাপত্তার অনুভূতি তৈরি হয় — ভালোবাসায় শিশু নষ্ট হয় না।' },
  { id: 'D56', correctedAgeDayMin: 91, correctedAgeDayMax: 180, category: 'BREASTFEEDING',
    textEn: 'Around 6 months, you\'ll begin adding soft, mashed complementary foods while continuing to breastfeed up to 2 years or beyond.',
    textBn: 'প্রায় ৬ মাসে আপনি নরম, চটকানো পরিপূরক খাবার যোগ করা শুরু করবেন এবং ২ বছর বা তার বেশি সময় পর্যন্ত বুকের দুধ খাওয়ানো চালিয়ে যাবেন।' },
];

// ─── Lookup helpers ──────────────────────────────────────────────────────────

/** Flat array of all 56 messages, ordered by window then index. */
export const ALL_CARE_MESSAGES: CareMessage[] = [
  ...WINDOW_A,
  ...WINDOW_B,
  ...WINDOW_C,
  ...WINDOW_D,
];

/**
 * Returns all messages eligible for the given corrected age (in days since
 * discharge). Falls back to Window A if the corrected age exceeds all windows
 * (i.e. beyond 180 days), and to Window D if corrected age is negative.
 */
function getWindowMessages(correctedAgeDays: number): CareMessage[] {
  const matches = ALL_CARE_MESSAGES.filter(
    (m) => correctedAgeDays >= m.correctedAgeDayMin && correctedAgeDays <= m.correctedAgeDayMax,
  );
  // Fallback: if no window matched (e.g. age > 180) return the last window
  if (matches.length === 0) {
    return correctedAgeDays < 0 ? WINDOW_A : WINDOW_D;
  }
  return matches;
}

/**
 * Selects today's message for the given corrected age.
 *
 * Rotation strategy: within the matched window, rotate by `dayOffset` so that
 * each day a different message is shown (cycling back to the start once the
 * window's messages are exhausted). `dayOffset` is the number of days since
 * the first day of the current window — callers pass `correctedAgeDays` and
 * the window min is subtracted automatically.
 *
 * TODO: confirm with researcher — KB §21 item 1 — with 56 messages across 4
 * windows, rotation within windows means some messages repeat after ~7–21 days.
 * This library must be expanded to ≥180 messages by the research team before
 * the 6-month study period. Do NOT add messages without researcher sign-off.
 */
export function resolveDailyMessage(
  correctedAgeDays: number,
  language: 'bn' | 'hi' | 'en',
): { messageId: string; text: string } | null {
  const window = getWindowMessages(correctedAgeDays);
  if (window.length === 0) return null;

  const windowMin = window[0].correctedAgeDayMin;
  const dayOffset = Math.max(0, correctedAgeDays - windowMin);
  const index = dayOffset % window.length;
  const message = window[index];

  const text =
    language === 'en' ? message.textEn :
    language === 'hi' ? (message.textBn) : // TODO: add textHi when translations are provided
    message.textBn;

  return { messageId: message.id, text };
}

/**
 * @deprecated Use resolveDailyMessage() with corrected age directly.
 * Kept for backwards-compatibility during Phase 2 rollout.
 */
export function getTodayMessage(weekNumber: number, language: 'bn' | 'hi' | 'en'): string | null {
  // Convert week number back to an approximate corrected-age day for legacy callers.
  // Week 1 = days 0–6, week 2 = days 7–13, etc.
  const approxCorrectedAgeDays = (Math.max(1, weekNumber) - 1) * 7;
  const result = resolveDailyMessage(approxCorrectedAgeDays, language);
  return result?.text ?? null;
}

// ─── Legacy weekly audio (unchanged, Phase 3 will address weekly audio theme) ─

export interface WeeklyAudioTopic {
  weekNumber: number;
  theme: string;
  primaryModules: string;
}

/**
 * 13-week rotating weekly audio topic plan — KB §3.
 * Audio script content per week is sourced from Learning Hub KB Sections 10–19.
 * Actual audio file upload/hosting (Cloudflare R2) is out of scope for Phase 2.
 */
export const WEEKLY_AUDIO_TOPICS: WeeklyAudioTopic[] = [
  { weekNumber: 1,  theme: 'Keeping your baby warm & preventing infection',     primaryModules: 'KB §10, §11' },
  { weekNumber: 2,  theme: 'Getting breastfeeding right — position & attachment', primaryModules: 'KB §15' },
  { weekNumber: 3,  theme: 'Cord care and bathing safely',                        primaryModules: 'KB §12, §13' },
  { weekNumber: 4,  theme: 'Kangaroo Mother Care — why skin-to-skin matters',    primaryModules: 'KB §16' },
  { weekNumber: 5,  theme: 'Recognizing danger signs — when to seek help now',  primaryModules: 'KB §4' },
  { weekNumber: 6,  theme: 'Immunization — staying on schedule',                 primaryModules: 'KB §8' },
  { weekNumber: 7,  theme: 'Sleep patterns and safe sleep',                       primaryModules: 'KB §9' },
  { weekNumber: 8,  theme: 'Vitamin A for mother and baby',                       primaryModules: 'KB §17' },
  { weekNumber: 9,  theme: "Understanding your baby's cries — loving, responsive care", primaryModules: 'KB §14' },
  { weekNumber: 10, theme: 'Common breastfeeding problems & how to solve them',  primaryModules: 'KB §15.11' },
  { weekNumber: 11, theme: "Growth & weight — what's normal",                    primaryModules: 'KB §7' },
  { weekNumber: 12, theme: 'Safety in the home',                                 primaryModules: 'KB §18' },
  { weekNumber: 13, theme: "Mother's own recovery and rest",                     primaryModules: 'KB §19' },
];
