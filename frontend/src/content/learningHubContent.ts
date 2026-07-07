// Learning Hub article content — Phase 1 content integration
// All article body text is sourced directly from SnehoAyu_Content_Knowledge_Base.md
// Sections 10–19. Do NOT edit body text without researcher sign-off (Dr. P. Ponnarasi).
// TODO: confirm with researcher — KB §21 item 4 — illustrated diagrams for breastfeeding
//       positions and KMC position need new cultural illustrations; not included here.
// TODO: confirm with researcher — KB §21 item 6 — Vitamin A high-dose pregnancy caution
//       in §17 is excluded from mother-facing content as it applies only to future pregnancies.

export type LearningCategory =
  | 'feeding'
  | 'kmc'
  | 'growth'
  | 'danger_signs'
  | 'emotional_support'
  | 'immunization'
  | 'newborn_care'; // Added Phase 1: warmth, infection prevention, bathing, cord care, sleep, loving care, safety

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
  // ─── FEEDING ────────────────────────────────────────────────────────────────
  // Source: KB §15.6 — Attachment & Sucking Technique
  {
    slug: 'latching-basics',
    category: 'feeding',
    title: 'Getting a Good Latch',
    summary: 'Step-by-step guidance for a comfortable, effective breastfeeding latch.',
    body:
      'A good latch is the foundation of successful breastfeeding. Hold your breast in a "C" shape — thumb on top, fingers below. Touch the baby\'s lips gently with your nipple and wait until the mouth opens wide before bringing the baby onto the breast. Move the baby toward your breast, not your breast toward the baby.\n\nSigns of a good latch: the baby\'s mouth is wide open; more of the areola is visible above the mouth than below; the chin is touching the breast; and you hear slow, deep sucks followed by swallowing, then pauses. Your nipples should not be sore after the first few seconds.\n\nMake sure the breast tissue does not block the baby\'s nose. Support the back of the baby\'s neck and move the whole body — do not push only the head. If the latch is poor, gently break suction by inserting a clean finger into the corner of the baby\'s mouth, then try again. Poor attachment causes sore nipples, engorgement, and a baby who is not getting enough milk.',
    durationMin: 4,
    featured: true,
  },
  // Source: KB §15.7 — Feeding Pattern & Hunger Signs
  {
    slug: 'feeding-cues',
    category: 'feeding',
    title: 'Recognizing Feeding Cues',
    summary: 'Early signs your baby is hungry — before crying starts.',
    body:
      'Feed your baby when you see early hunger signs — do not wait for crying, which is a late cue and makes latching harder. Early hunger signs include: open eyes and alert expression, turning the head and rooting (moving the mouth side to side looking for the breast), hand-to-mouth movements, lip-smacking or licking, tongue thrust with mouth open, and a slight backward tilt of the head.\n\nNewborns need to feed 8 to 12 times in 24 hours — roughly every 2 to 3 hours. This is because a newborn\'s stomach is small and breast milk digests quickly. The more your baby sucks, the more milk your body produces. Do not place a time limit on feeds; let your baby feed until satisfied. Offer both breasts and let the baby fully empty one before offering the other — the thicker, fattier milk at the end of the feed (hindmilk) is what satisfies hunger.',
    durationMin: 3,
  },
  // Source: KB §15.3 — Types of Breast Milk + §15.10 — Signs Baby Is Getting Enough
  {
    slug: 'expressed-milk',
    category: 'feeding',
    title: 'Storing Expressed Breast Milk',
    summary: 'How long expressed milk stays safe — and signs your baby is getting enough.',
    body:
      'Expressed breast milk can be stored safely at room temperature (up to 25°C) for up to 4 hours. In a refrigerator it keeps for 4 days; in a freezer, up to 6 months. Always label each container with the date expressed and use the oldest milk first.\n\nBreast milk changes to meet your baby\'s needs. Colostrum — the first milk produced in the days after birth — is thick and yellow, rich in antibodies and protein. It is your baby\'s first immunization. Never discard it. Transitional milk follows over the next two weeks, gradually becoming mature milk. If your baby was born early, your body produces preterm milk with higher protein and immune factors matched to your baby\'s needs.\n\nSigns that your baby is getting enough milk: passes urine at least 6 times in 24 hours; you can hear swallowing during feeds; your breasts feel softer after a feed; your baby seems contented after feeding; and your baby gains weight steadily after the first week. If you are unsure, contact your health worker rather than introducing formula or water — breast milk alone is sufficient even in hot weather.',
    durationMin: 3,
  },
  // Source: KB §15.11 — Breastfeeding Problems & Solutions
  {
    slug: 'breastfeeding-problems',
    category: 'feeding',
    title: 'Common Breastfeeding Problems & Solutions',
    summary: 'Sore nipples, low milk supply, engorgement — causes and what to do.',
    body:
      'Sore or cracked nipples are almost always caused by a poor latch or position. Ensure a deep, wide latch, try a different feeding position, and apply a few drops of expressed breast milk to the nipple after each feed — let it air-dry. Start each feed on the less sore side. Do not stop breastfeeding. Re-check in 2 to 3 days; if there is no improvement, contact your health worker.\n\nLow milk supply is most often a misconception. If your baby is gaining weight and passing urine 6 or more times a day, your supply is adequate. To build supply: rest and drink fluids often, breastfeed on demand every 2 to 3 hours, ensure the baby empties one breast fully before switching, and avoid bottles or formula supplements. Never introduce a feeding bottle at any point — it interferes with proper attachment and reduces milk supply.\n\nBreast engorgement (swollen, hard, painful breasts) happens when feeds are missed or the baby is not latching deeply. Apply a warm compress before feeding, express a little milk to soften the areola first, then feed or express every 2 to 3 hours. After feeding, a cold compress relieves discomfort. Watch for signs of infection: increasing pain, redness, swelling, or fever. If these develop, see a doctor immediately — this may be mastitis.',
    durationMin: 5,
  },
  // Source: KB §15.1 — Benefits of Breastfeeding
  {
    slug: 'benefits-of-breastfeeding',
    category: 'feeding',
    title: 'Why Breast Milk Is the Best Choice',
    summary: 'Complete nutrition, infection protection, and benefits for both mother and baby.',
    body:
      'Breast milk is the only complete food your baby needs for the first 6 months of life — no water, tea, formula, or other foods are necessary. It contains exactly the right nutrients in the right proportions, changes its composition as your baby grows, and is always at the right temperature.\n\nFor your baby, breast milk acts as the first immunization. It strengthens the immune system, protects against diarrhea, pneumonia, and intestinal disease (especially important for low-birth-weight babies), reduces allergy risk, and supports healthy development of the brain, mouth, and jaw. It is particularly important for premature babies — preterm milk is specially adapted with higher protein and immune factors.\n\nFor you, breastfeeding helps your uterus return to its normal size, reduces bleeding after birth, lowers the risk of anaemia, and supports natural child spacing by delaying ovulation. It also builds a close bond with your baby and saves the cost of formula and medical care.\n\nExclusive breastfeeding means only breast milk — no other liquid or food — from birth to 6 months. After 6 months, continue breastfeeding while gradually introducing mashed, soft complementary foods. Breastfeeding to 2 years and beyond continues to provide immune protection and nutrition.',
    durationMin: 4,
  },
  // ─── KMC ────────────────────────────────────────────────────────────────────
  // Source: KB §16.6 — How to Provide KMC
  {
    slug: 'kmc-how-to',
    category: 'kmc',
    title: 'How to Do Kangaroo Mother Care',
    summary: 'Step-by-step skin-to-skin technique and what to wear.',
    body:
      'Kangaroo Mother Care (KMC) is a simple, proven method for caring for low-birth-weight and premature babies using prolonged skin-to-skin contact with the mother — or any willing, healthy adult family member.\n\nHow to get into position: dress your baby in a soft cap, socks, and a small open-fronted shirt or cloth. Place your baby upright between your breasts with the head turned to one side and slightly extended — so the airway is clear and the face is visible. The hips should be flexed and spread in a "frog" position. The baby\'s abdomen should rest at the level of your upper stomach. Support the baby from below with a sling, binder, or wrap.\n\nDuring KMC you can walk, stand, sit, or even sleep in this position if comfortable. Monitor your baby continuously: the airway must be clear, breathing regular, skin colour pink, and temperature maintained. You can breastfeed directly from this position.\n\nFor clothing, any front-open garment suits — no special garment is required. KMC can be provided by the father or another family member when the mother needs to rest.',
    durationMin: 4,
    audioUrl: '/audio/kmc-how-to.mp3',
    featured: false,
  },
  // Source: KB §16.3 + §16.2 — Benefits + Duration Categories
  {
    slug: 'kmc-benefits',
    category: 'kmc',
    title: 'Why Kangaroo Care Matters',
    summary: 'The evidence behind skin-to-skin contact for preterm and low-birth-weight babies.',
    body:
      'Kangaroo Mother Care stabilizes your baby\'s body temperature, heart rate, and breathing — three functions premature babies struggle with outside the womb. Research consistently shows that KMC supports better weight gain, earlier hospital discharge, and improved neurodevelopment compared to incubator care alone.\n\nKMC also promotes breastfeeding. The skin-to-skin position stimulates milk production and helps your baby latch and suck more effectively. It prevents infection, strengthens the bond between you and your baby, and helps your baby feel safe and calm.\n\nHow long should you do KMC each day? More is better. Short KMC is around 4 hours daily. Extended KMC is 5 to 8 hours. Long KMC is 9 to 12 hours. Continuous KMC is more than 12 hours daily and is the goal for the smallest babies. Even a few hours a day makes a significant difference — start with what is comfortable and increase gradually.\n\nKMC should continue until your baby reaches a healthy weight of 2500 grams and is feeding well. It can be provided by the mother, father, or any other healthy, willing family member.',
    durationMin: 3,
    audioUrl: '/audio/kmc-how-to.mp3',
  },
  // Source: KB §16.5 — Time of Initiation Based on Birth Weight
  {
    slug: 'kmc-when-to-start',
    category: 'kmc',
    title: 'When to Start KMC — Birth Weight Guide',
    summary: 'Initiation guidance based on your baby\'s birth weight.',
    body:
      'Kangaroo Mother Care should be started as early as possible, but the timing depends on how stable your baby is.\n\nFor babies born weighing 1800 to 2500 grams: your baby is generally stable and KMC can be started immediately after birth.\n\nFor babies weighing 1200 to 1800 grams: many have some health challenges at birth. KMC is started after stabilization, which usually takes a few days in the facility.\n\nFor babies weighing less than 1200 grams: these very small babies often need specialized care. KMC begins only after the baby is medically stable — this may take days to weeks. During transport, skin-to-skin care with a family member is the safest option if a transport incubator is not available.\n\nKMC follow-up is important. After discharge, the first check-up should be within 1 week, then fortnightly for the next two visits, and continuing until your baby reaches 2500 grams. Do not miss these visits — your health worker will monitor your baby\'s growth, feeding, and development at each one.',
    durationMin: 3,
  },
  // ─── GROWTH ─────────────────────────────────────────────────────────────────
  // Source: KB §7 — Growth & Weight-Gain Validation Logic (narrative layer)
  {
    slug: 'corrected-age-explained',
    category: 'growth',
    title: 'Understanding Corrected Age',
    summary: 'Why your preterm baby\'s growth is measured against corrected age.',
    body:
      'Corrected age (also called adjusted age) accounts for how early your baby was born. It is calculated by subtracting the number of weeks born early from the baby\'s actual (chronological) age. For example, a baby born 8 weeks early who is now 4 months old has a corrected age of about 2 months.\n\nFor premature babies, corrected age is the right baseline for comparing growth and development milestones. This app uses corrected age throughout — for daily care messages, growth chart comparisons, and care guidance — to ensure every recommendation is matched to where your baby actually is in their development.\n\nYour baby\'s growth chart uses corrected age on the horizontal axis. When checking milestones (weight gain, length, head circumference), always use the corrected age column, not the actual age in weeks since birth.',
    durationMin: 3,
  },
  // Source: KB §7 — Weight-gain windows
  {
    slug: 'tracking-growth',
    category: 'growth',
    title: 'What to Expect: Growth Tracking',
    summary: 'Normal weight-gain patterns week by week.',
    body:
      'Some weight loss in the first 7 days is completely normal — up to 5 to 10% of birth weight. From around days 7 to 10, your baby should begin gaining weight again. By day 14, your baby should have regained their birth weight. If this has not happened by day 14, bring it up with your health worker at the next visit.\n\nAfter day 14 and through to around 4 months of corrected age, expect an average gain of 25 to 30 grams per day. By 4 to 5 months, your baby should have roughly doubled their birth weight.\n\nWeigh your baby regularly (weekly if advised) and bring the record to every follow-up visit. Steady, gradual growth over time matters more than any single reading. The growth chart in this app tracks your baby\'s weight, length, and head circumference against standard reference bands — a reading between the bands is the goal, but a consistent upward trend is the most reassuring sign.',
    durationMin: 3,
  },
  // ─── DANGER SIGNS ───────────────────────────────────────────────────────────
  // Source: KB §4.1 — Master Danger Sign Table
  {
    slug: 'danger-signs-overview',
    category: 'danger_signs',
    title: 'Danger Signs at a Glance',
    summary: 'Warning signs that mean seek care immediately or consult a doctor soon.',
    body:
      'Knowing your baby\'s danger signs can save their life. Seek medical care immediately — go to the nearest hospital or contact your ASHA/ANM worker now — if your baby shows any of the following: stops feeding well and feels cold to touch; breathing rate is less than 30 or more than 60 breaths per minute; gasping, grunting, chest indrawing, or nostrils flaring; lips, tongue, or skin appearing blue; high fever or feels cold (axillary temperature above 37°C or below 36°C); redness, swelling, pus, or foul smell around the umbilical cord; any seizure or convulsion; body is limp or floppy; or the baby is inactive and very difficult to wake.\n\nConsult your doctor or health worker soon (same day) if you notice: red or swollen eyelids with pus discharge; yellow skin or eyes (jaundice); a baby who is excessively sleepy, very hard to wake, and missing feeds; or persistent watery/loose stools.\n\nUse the Danger Signs Checker in this app any time you are worried. You cannot "over-use" it — when in doubt, check. If you see a CRITICAL warning, do not wait — seek help immediately.',
    durationMin: 3,
  },
  // ─── EMOTIONAL SUPPORT ──────────────────────────────────────────────────────
  // Source: KB §19 — Mother's Own Wellbeing / Postpartum Self-Care
  {
    slug: 'coping-with-anxiety',
    category: 'emotional_support',
    title: 'Coping with Anxiety as a New Mother',
    summary: 'Self-care essentials when caring for a premature baby.',
    body:
      'It is completely normal to feel worried, overwhelmed, or exhausted when caring for a premature baby. Your feelings are valid — and taking care of yourself is part of taking care of your baby.\n\nRest whenever your baby sleeps. This is not a luxury — insufficient rest directly reduces your milk supply and your ability to respond to your baby. Aim for 7 to 9 hours of rest across the day and night combined, even if it is broken into shorter naps.\n\nEat at least one large extra serving of your regular staple food every day while breastfeeding. Drink 3 to 4 litres of fluid daily — drink something every time you breastfeed. Avoid smoking, alcohol, and any unprescribed medicines while breastfeeding, as these pass to your baby through milk.\n\nAccept help from family and caregivers without guilt. Keep essential baby supplies organized so routines feel manageable. Continue your own postpartum care, not only the baby\'s. If your worry feels persistent or overwhelming, please speak to your nurse, ASHA worker, or the research team — you do not have to manage this alone.',
    durationMin: 3,
    audioUrl: '/audio/coping-with-anxiety.mp3',
    featured: true,
  },
  // Source: KB §19 — Mother's Wellbeing / support-seeking
  {
    slug: 'asking-for-help',
    category: 'emotional_support',
    title: 'It Is Okay to Ask for Help',
    summary: 'Building a support system around you and your baby.',
    body:
      'Caring for a preterm baby is one of the most demanding things a person can do. Lean on your family, friends, and care team. Asking for help is a sign of strength, not weakness — no one is meant to do this alone.\n\nPeople who support a breastfeeding mother materially improve breastfeeding success. A relaxed, supported mother produces milk more easily; stress and anxiety genuinely hinder milk flow. Every time a family member reassures you, takes a household task off your hands, or simply sits with you — that helps your baby too.\n\nYour ASHA worker and the research nurse are part of your care team. Reach out if something worries you, if breastfeeding is difficult, or if you feel you are not coping. They are there to support you through the study period and beyond.',
    durationMin: 2,
  },
  // ─── IMMUNIZATION ───────────────────────────────────────────────────────────
  // Source: KB §8 — Immunization Schedule & Reminder Logic
  {
    slug: 'vaccine-basics',
    category: 'immunization',
    title: 'Why Vaccines Matter for Preterm Babies',
    summary: 'The schedule, what to expect, and how to stay on track.',
    body:
      // TODO: confirm with researcher — KB §21 item 2 — immunization timing:
      // India\'s UIP schedule is conventionally chronological-age-based even for preterm infants.
      // This article uses chronological age (birth date) as the basis, consistent with national
      // guidelines, but this must be confirmed by Dr. Ponnarasi before the reminder engine is built.
      'Immunizations protect your baby from serious diseases during the most vulnerable period of their life. Premature babies need and benefit from the same vaccines as full-term babies, on the same schedule from their actual birth date.\n\nAt birth: BCG (against tuberculosis), OPV-0 (polio), and Hepatitis B (1st dose). At 6 weeks: Pentavalent 1st dose, OPV-1, Hepatitis B 2nd dose, and Rotavirus 1st dose. At 10 weeks: Pentavalent 2nd dose, OPV-2, and Rotavirus 2nd dose. At 14 weeks: Pentavalent 3rd dose, OPV-3, and Hepatitis B 3rd dose. At 9 months: Measles/MR/MMR vaccine.\n\nAllow at least 4 weeks between each scheduled set. Mark every date on your health card and bring it to every visit. A mild fever for up to 24 hours after the Hepatitis B or Pentavalent vaccine is expected and is not a danger sign. Continue exclusive breastfeeding during the vaccination period — it strengthens your baby\'s immune response. If a dose is missed, go to your nearest health centre as soon as possible.',
    durationMin: 3,
  },
  // ─── NEWBORN CARE ───────────────────────────────────────────────────────────
  // Source: KB §10 — Warmth & Thermal Care Module
  {
    slug: 'warmth-thermal-care',
    category: 'newborn_care',
    title: 'Keeping Your Baby Warm',
    summary: 'Newborns cannot control their temperature — here is how to help.',
    body:
      'Warmth is life for a newborn. A baby — especially a premature baby — cannot regulate their own body temperature. If a newborn gets too cold, it is life-threatening.\n\nKeep the room warm and free of draughts, day and night. Dress your baby in 1 to 2 more layers than you are wearing. Always cover the head with a soft hat or cloth — babies lose a large amount of heat through the head. Use loose, soft clothing and blankets; tight clothes actually make the baby colder. Keep the baby\'s face uncovered so they can always breathe freely.\n\nThe most powerful way to keep a small baby warm is skin-to-skin Kangaroo Mother Care — holding your baby upright against your bare chest and covering both of you with a warm cloth. This is more effective than blankets alone and has the added benefits of supporting breastfeeding and bonding. See the KMC articles in this app for detailed guidance.',
    durationMin: 3,
  },
  // Source: KB §11 — Infection Prevention & Hygiene Module
  {
    slug: 'infection-prevention',
    category: 'newborn_care',
    title: 'Preventing Infections at Home',
    summary: 'Simple hygiene rules that protect your baby\'s immature immune system.',
    body:
      'A newborn\'s immune system is not yet mature. Preventing exposure to germs is one of the most important things you can do at home.\n\nAlways wash your hands with soap and water before and after touching your baby — this is the single most effective infection prevention measure. Keep your fingernails short and clean. Wash your baby\'s clothes, bedding, and wraps regularly.\n\nKeep sick people away from your baby; ask visitors who have a cough, cold, or fever to stay away until they are well. Avoid smoke from cigarettes and cooking fires near your baby. Use an insecticide-treated bed net in areas where mosquitoes are present.\n\nNever apply oils, powders, herbs, or any other substance to the umbilical cord — keep it clean and dry only. Breastfeed exclusively — your breast milk gives your baby strong, specific protection against infections that no formula can replicate. Ensure all immunizations are given on time to build your baby\'s own defences.',
    durationMin: 3,
  },
  // Source: KB §12 — Bathing Module
  {
    slug: 'bathing-your-baby',
    category: 'newborn_care',
    title: 'Bathing Your Baby Safely',
    summary: 'Sponge baths until the cord heals — then full baths, step by step.',
    body:
      'Until your baby\'s umbilical cord has fallen off and the area has healed, give only sponge baths — do not immerse your baby in water. Use a warm, wet cloth. Wash the upper body first, dry and cover it before washing the lower body.\n\nAfter the cord heals, you can give a full bath every 2 to 3 days. Clean the buttocks gently with a soft wet cloth after every urine or stool in between baths.\n\nTo keep your baby warm during the bath: close windows and doors, prepare everything you need before starting, and test the water temperature with your elbow (it should feel comfortably warm). Wash the face first and the head last — babies lose the most heat through the head. Work quickly but gently, then dry your baby completely including inside all skin folds and the hair. After the bath, hold your baby skin-to-skin against your chest, cover both of you warmly, and re-cover the baby\'s head.\n\nClean each eye with a separate clean corner of cloth, wiping from the inner corner (near the nose) outward. Use clean water only on the face — no soap. Do not clean inside the ears or nose, only the outside. Avoid baby powder — fine powder can enter your baby\'s lungs.',
    durationMin: 4,
  },
  // Source: KB §13 — Cord Care Module
  {
    slug: 'cord-care',
    category: 'newborn_care',
    title: 'Umbilical Cord Care',
    summary: 'Keep it clean, keep it dry — and know the danger signs.',
    body:
      'Proper cord care prevents serious infections. The only rule is: keep the cord clean and dry. Do not apply anything to it — no ointment, oil, powder, ash, or herbal dressing.\n\nDo not allow urine or stool to touch the cord. If it gets dirty, wash gently with soap and clean water, then dry thoroughly with a clean cloth or allow to air-dry. Give only sponge baths until the cord has completely fallen off and the area has healed.\n\nThe cord normally falls off within 5 to 10 days after birth. Check it every day. A healthy cord will dry, shrink, and detach on its own.\n\nSeek medical help immediately if you notice any of these: pus discharge; foul or bad smell; redness or swelling of the skin around the cord base; or the cord taking an unusually long time to fall off. These are signs of umbilical infection, which can progress to serious sepsis quickly. Do not wait — contact your ASHA/ANM worker or go to the nearest hospital.',
    durationMin: 3,
  },
  // Source: KB §14 — Loving Care / Responsive Caregiving Module
  {
    slug: 'loving-care',
    category: 'newborn_care',
    title: 'Loving, Responsive Care',
    summary: 'Why responding to your baby\'s cues builds trust and healthy development.',
    body:
      'A newborn cannot survive without love and care. At birth, a baby depends completely on others — not only for food and warmth, but for touch, voice, and gentle attention. Love, warmth, and gentle touch are as important as food and medicine.\n\nEvery baby is different. Some are calm and sleepy; others are active and fussy. Some have a soft cry, others a loud one. Some settle easily; others need more patience. A mother learns to recognize her baby\'s unique personality through observation — and this knowledge builds over days and weeks.\n\nWhen a baby cries and someone responds with love and care, the baby learns two things: that the world is safe, and that their cues matter. This builds the baby\'s confidence and trust, which are the foundation of healthy development. Never ignore a newborn\'s cry — it is their only way of communicating a need.\n\nAlways handle your baby gently and speak in a calm, quiet voice. Observe closely for signs of hunger, tiredness, or discomfort. Talk to your baby during care routines — your voice is comforting and stimulating even before they understand words. You cannot "spoil" a newborn with attention and love.',
    durationMin: 3,
  },
  // Source: KB §9 — Sleep Guidance by Age
  {
    slug: 'sleep-safe-practices',
    category: 'newborn_care',
    title: 'Safe Sleep for Your Baby',
    summary: 'How much sleep is normal and how to keep your baby safe at night.',
    body:
      'Newborns sleep 16 to 18 hours a day — but in short stretches, waking every 2 to 3 hours to feed. This is completely normal and healthy. Some babies may sleep up to 4 hours between night feeds. As your baby grows, night sleep gradually lengthens and daytime wake periods become more regular.\n\nAlways place your baby on their back to sleep — this is the safest sleeping position and should continue throughout the first year. Keep the sleeping area calm and safe, with no loose bedding or pillows near the baby\'s face.\n\nUse an insecticide-treated bed net if you are in an area where mosquitoes are present.\n\nDanger sign: if your baby is very hard to wake, or is sleeping far more than usual and missing feeds, this may be a sign of illness. Use the Danger Signs Checker in this app and seek medical help promptly.\n\nFor mothers: nap when your baby sleeps during the day. Night waking is frequent in the early weeks — aim for 7 to 9 hours of rest across the full day and night combined. Getting enough rest helps maintain your milk supply.',
    durationMin: 3,
  },
  // Source: KB §17 — Vitamin A Supplementation Logic
  {
    slug: 'vitamin-a',
    category: 'newborn_care',
    title: 'Vitamin A for Mother and Baby',
    summary: 'Why it matters, when to take it, and which foods are rich in vitamin A.',
    body:
      // TODO: confirm with researcher — KB §21 item 6 — the high-dose pregnancy caution
      // from §17 is excluded here as it applies only to future pregnancies, not this cohort.
      'Newborns are born with very small vitamin A stores. For the first months of life, a breastfed baby depends entirely on the vitamin A in the mother\'s breast milk — and that level depends on the mother\'s own intake. Vitamin A helps both mother and baby grow well, fight infections, and recover faster when illness occurs.\n\nA single high-dose vitamin A capsule (200,000 IU) should be taken by the mother as soon as possible after giving birth, and no later than 8 weeks after delivery. If you have not yet taken this capsule and more than 8 weeks have passed since your baby was born, speak to your health worker rather than taking it late — they will advise you.\n\nVitamin A in food: eat plenty of orange and yellow fruits and vegetables (mangoes, papaya, carrots) and animal-source foods (egg yolk, liver, fish) to keep your vitamin A levels high throughout breastfeeding. Breast milk is the only safe source of vitamin A for your baby for the first 6 months — another reason exclusive breastfeeding matters.',
    durationMin: 3,
  },
  // Source: KB §18 — Safety & Security Guidance
  {
    slug: 'safety-at-home',
    category: 'newborn_care',
    title: 'Safety at Home',
    summary: 'Simple rules to prevent accidents and keep your baby safe.',
    body:
      'Never leave your baby alone on a bed, sofa, or table — even for a moment. Babies can roll or slide off in seconds. If you need to step away, place the baby in a safe, flat surface on the floor or in a crib.\n\nNever hold a newborn by the feet with the head hanging down. A newborn\'s neck muscles cannot support the head, and this position is dangerous.\n\nBreastfeeding mothers: avoid smoking, alcohol, and any unprescribed medicines or drugs. These substances pass to your baby through breast milk and can harm their development. Even secondhand smoke near your baby increases the risk of respiratory infections and other problems.\n\nKeep your baby away from open flames, hot liquids, and cooking areas. Test water temperature carefully before bathing.',
    durationMin: 2,
  },
];
