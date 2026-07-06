# SnehoAyu — Newborn Care Content & Logic Knowledge Base
### Source-of-Truth for Backend Content, Rules Engine, and AI Implementation Agents

**Compiled from researcher-provided source documents (Dr. P. Ponnarasi):**
1. `1__daily_care_message.docx` — Daily newborn care messages, danger signs, mother checklist, FAQ/decision-making chart
2. `2__28_days.docx` — Newborn examination protocol, danger-sign assessment table, weight-gain chart
3. `how_to_take_daily_care_of_newborn.docx` — Full newborn care guide (warmth, infection prevention, bathing, cord care, immunizations, sleep, loving care, breastfeeding, KMC, vitamin A, safety, danger signs)

**Cross-referenced against:** `SnehoAyu_mHealth_.md` (PRD v2.0) to align every content item with an existing app feature (Daily SMS, Weekly Audio Message, Learning Hub, Daily Care Checklist, Danger Sign Checker, Research Tools I–V).

**Purpose of this document:** This is not a summary — it is the **raw content bank + structured logic** needed to build:
- The daily SMS message library (PRD requires ≥180 unique messages over 6 months)
- The weekly audio message script topics
- The Learning Hub article content (Bengali translation happens later — this is the English source)
- The Danger Sign Checker rules engine
- The Daily Care Checklist logic
- The growth/weight validation logic
- The immunization reminder schedule
- The KMC guidance module (for low-birth-weight infants — highly relevant since this is a preterm-infant study)
- Follow-up visit assessment prompts (feeds Tool II interview data collection)

**Note on scope alignment:** Because every enrolled infant is preterm/NICU-discharged, **corrected age**, not chronological age, must drive which content is shown (per PRD principle already established). This document flags every place where corrected-age logic must be applied.

---

## Table of Contents

1. Content Taxonomy (Category Model)
2. Daily Message Content Library (structured, ready for DB seeding)
3. Weekly Theme Plan (maps to Weekly Audio Message feature)
4. Danger Sign Rules Engine (structured logic)
5. Newborn Examination Protocol (28-Day Decision-Making Chart)
6. Follow-Up Visit Interview Questions (feeds Tool II / researcher data collection)
7. Growth & Weight-Gain Validation Logic
8. Immunization Schedule & Reminder Logic
9. Sleep Guidance by Age
10. Warmth & Thermal Care Module
11. Infection Prevention & Hygiene Module
12. Bathing Module
13. Cord Care Module
14. Loving Care / Responsive Caregiving Module
15. Breastfeeding Module (Full — Benefits, Physiology, Milk Types, Positioning, Attachment, Problems & Solutions)
16. Kangaroo Mother Care (KMC) Module — Critical for Preterm Cohort
17. Vitamin A Supplementation Logic
18. Safety & Security Guidance
19. Mother's Own Wellbeing / Postpartum Self-Care Checklist
20. Content-to-Feature Mapping Table
21. Gaps, Assumptions & Open Questions for the Researcher
22. Suggested Content Data Model (for backend engineers)

---

## 1. Content Taxonomy (Category Model)

Every piece of content in this document belongs to exactly one primary category. Use this as the `category` enum for the content database table.

| Category ID | Category Name | Source Doc(s) | Primary Feature(s) |
|---|---|---|---|
| `WARMTH` | Keeping Baby Warm / Thermal Care | Doc 3 | Daily SMS, Learning Hub, Danger Sign Checker |
| `INFECTION_PREVENTION` | Infection Prevention & Hygiene | Doc 1, Doc 3 | Daily SMS, Learning Hub |
| `BATHING` | Bathing the Newborn | Doc 3 | Learning Hub |
| `CORD_CARE` | Umbilical Cord Care | Doc 1, Doc 3 | Daily SMS, Danger Sign Checker, Learning Hub |
| `IMMUNIZATION` | Immunization Schedule | Doc 1, Doc 3 | Reminders, Learning Hub |
| `SLEEP` | Sleep Care | Doc 1, Doc 3 | Daily SMS, Learning Hub |
| `LOVING_CARE` | Responsive/Loving Caregiving | Doc 3 | Daily SMS, Learning Hub |
| `BREASTFEEDING` | Breastfeeding (all sub-topics) | Doc 1, Doc 3 | Daily SMS, Danger Sign Checker, Learning Hub, Tool II B4 |
| `KMC` | Kangaroo Mother Care | Doc 3 | Learning Hub, Daily Care Checklist (critical for preterm) |
| `VITAMIN_A` | Vitamin A Supplementation | Doc 1, Doc 3 | Daily SMS, Learning Hub |
| `SAFETY` | Safety & Security | Doc 3 | Learning Hub |
| `DANGER_SIGNS` | Danger Sign Recognition | Doc 1, Doc 2, Doc 3 | Danger Sign Checker (P0 feature) |
| `MOTHER_SELF_CARE` | Mother's Own Health/Rest | Doc 1, Doc 3 | Daily SMS, Learning Hub |
| `GROWTH_WEIGHT` | Growth & Weight Monitoring | Doc 2 | Growth Tracker validation |
| `FOLLOW_UP` | Follow-up Visit Logistics | Doc 1, Doc 2 | Appointment Reminders |

Each daily message and Learning Hub article in this document is tagged with one of the above category IDs so they can be seeded directly into a `content_items` table.


## 2. Daily Message Content Library (Structured, Ready for DB Seeding)

**Format for each entry:** `ID | Corrected-Age Window | Category | Message Text (English, SMS-length) | Notes`

This is the **core message bank** extracted directly from the researcher's source documents. It is organized by **corrected age window** (not chronological age — critical for a preterm cohort where a baby discharged at 34 weeks gestation needs Week-1 content on Day 1 *after discharge*, not Day 1 of life).

> **Implementation rule:** `message_day = date_today - discharge_date` (or `corrected_age_days` if the app tracks gestational correction separately). The scheduler selects from the window matching `message_day`, then rotates/repeats within that window to fill gaps until the 6-month (≈180-day) library is expanded — see Section 21.

### Window A — Days 0–7 (First Week Post-Discharge): Survival Basics

| ID | Category | Message Text |
|---|---|---|
| D01 | WARMTH | Keep your baby warm today. Cover the head with a cap, feet with mittens, and dress in weather-appropriate cotton clothes. |
| D02 | INFECTION_PREVENTION | Always wash your hands with soap and water before touching your baby — this is the #1 way to prevent infection. |
| D03 | BREASTFEEDING | Breastfeed your baby every 2–3 hours or on demand — that's 8 to 12 times in 24 hours. Look for hunger signs: rooting, lip-smacking, fussing. |
| D04 | BREASTFEEDING | After every feed, gently burp your baby to release swallowed air. |
| D05 | BREASTFEEDING | No water, tea, or any other fluid for your baby until 6 months — breast milk alone is enough, even in hot weather. |
| D06 | LOVING_CARE | Talk to and comfort your baby often. Your voice and touch help your baby feel safe. |
| D07 | INFECTION_PREVENTION | Clean your baby's face, hands, and diaper area regularly using a wet cotton cloth. |
| D08 | DANGER_SIGNS | Check diapers often — a well-fed newborn passes urine at least 6 times in 24 hours. |
| D09 | SLEEP | Always place your baby on their back to sleep, in a safe, calm space. |
| D10 | MOTHER_SELF_CARE | Keep a calm environment around your baby — avoid loud noise and overstimulation. |
| D11 | MOTHER_SELF_CARE | You are doing a great job. Rest whenever your baby sleeps — your body is still recovering too. |
| D12 | CORD_CARE | Keep your baby's umbilical cord clean and dry. Do not apply any oil, powder, ash, or herbs to it. |
| D13 | CORD_CARE | Check the cord daily. It should look clean with no redness, swelling, pus, or bad smell. |
| D14 | VITAMIN_A | Have you taken your vitamin A capsule (200,000 IU) yet? It should be taken as soon as possible after birth, and no later than 8 weeks after delivery. |
| D15 | WARMTH | Hold your baby skin-to-skin against your chest and cover both of you with a warm cloth — this is one of the best ways to keep a small baby warm. |
| D16 | DANGER_SIGNS | Review today: does your baby feed well and feel warm to touch? If your baby feels cold, feeds poorly, or breathes fast/slow, seek care immediately. |
| D17 | BATHING | Until your baby's cord falls off, give only sponge baths — do not immerse your baby in water. |
| D18 | INFECTION_PREVENTION | Keep sick visitors away from your baby, and avoid smoke from cigarettes or cooking fires near your baby. |
| D19 | BREASTFEEDING | Let your baby fully empty one breast before offering the other — this ensures they get both thirst-quenching foremilk and filling hindmilk. |
| D20 | GROWTH_WEIGHT | Some weight loss in the first week is normal (5–10%). Your baby should start regaining weight from around day 7–10. |
| D21 | SLEEP | Newborns sleep 16–18 hours a day and wake every 2–3 hours to feed — this is completely normal. |

### Window B — Days 8–28 (First Month): Building Routines

| ID | Category | Message Text |
|---|---|---|
| D22 | KMC | Skin-to-skin Kangaroo Care helps your baby stay warm, feed better, and grow faster — try to do it every day. |
| D23 | KMC | Kangaroo Mother Care position: baby upright between your breasts, head turned to one side, legs in a frog position, supported by a sling or binder. |
| D24 | CORD_CARE | The cord usually falls off within 5–10 days. Keep giving sponge baths until it's fully healed. |
| D25 | IMMUNIZATION | Mark your baby's vaccination dates on the health card. On-time vaccines protect against serious diseases. |
| D26 | BREASTFEEDING | Good attachment signs: baby's mouth wide open, chin touching breast, more areola visible above the mouth than below, slow deep sucks with pauses. |
| D27 | BREASTFEEDING | Never introduce a feeding bottle — it can cause poor attachment and reduce your milk supply. |
| D28 | DANGER_SIGNS | Watch daily for danger signs: feeding poorly, feels cold, fast/slow or gasping breathing, fever, red swollen eyelids with pus, cord redness/pus/smell, fits, or yellow skin. Any one of these — seek care now. |
| D29 | GROWTH_WEIGHT | By day 14, your baby should have regained their birth weight. After that, expect about 25–30 grams of weight gain per day. |
| D30 | LOVING_CARE | Every baby is different — some are calm, some are fussy. Learning your baby's unique cues builds trust between you both. |
| D31 | MOTHER_SELF_CARE | To make enough breast milk, drink 3–4 litres of fluid a day — drink something every time you breastfeed. |
| D32 | MOTHER_SELF_CARE | Eating one extra full serving of your regular staple food each day helps keep your milk supply strong. |
| D33 | SAFETY | Never leave your baby alone on a bed, sofa, or table — even for a moment. |
| D34 | SAFETY | Never hold your baby by the feet with the head hanging down. |
| D35 | BREASTFEEDING | Continue exclusive breastfeeding — no water, formula, or other foods — for the full first 6 months. |
| D36 | FOLLOW_UP | If everything is normal, your next check-up follows the standard schedule: 2–3 days, 7 days, 28 days, and 6 weeks. Don't miss these visits. |
| D37 | INFECTION_PREVENTION | Keep fingernails short and clean for anyone who handles your baby, to reduce the spread of germs. |
| D38 | BATHING | Once the cord has healed, you can give a full bath every 2–3 days — clean the diaper area after every stool or urine in between. |

### Window C — Days 29–90 (Month 2–3): Sustaining Care & Confidence

| ID | Category | Message Text |
|---|---|---|
| D39 | BREASTFEEDING | If you feel your milk supply is low: rest, drink fluids, feed on demand every 2–3 hours, and avoid giving bottles or supplements — supply usually improves within days. |
| D40 | BREASTFEEDING | Sore nipples? Make sure of a good latch, apply a little breast milk after feeds, and let nipples air-dry. Start feeds on the less sore side. |
| D41 | GROWTH_WEIGHT | Your baby should double their birth weight by around 4–5 months — keep tracking growth at each visit. |
| D42 | SLEEP | As your baby grows, night sleep will get longer and daytime wake periods more regular — this happens gradually. |
| D43 | IMMUNIZATION | At 6 weeks: Pentavalent (1st dose), OPV-1, and Hepatitis B (2nd dose) are due. Please don't delay. |
| D44 | KMC | Kangaroo care can be continued for as many hours a day as comfortable — even sleeping in KMC position is fine if you're comfortable. |
| D45 | DANGER_SIGNS | A baby who is very hard to wake, or who is sleeping much more than usual and missing feeds, may be unwell — seek medical help right away. |
| D46 | MOTHER_SELF_CARE | Breastfeeding mothers should avoid smoking, alcohol, and any unprescribed medicines — these can pass to your baby through milk. |
| D47 | BREASTFEEDING | Breast engorgement? Try a warm compress before feeding, express a little milk first, feed every 2–3 hours, and use a cold compress afterward. |
| D48 | IMMUNIZATION | At 10 weeks: Pentavalent (2nd dose), OPV-2, and Rotavirus (2nd dose) are due. |
| D49 | VITAMIN_A | Vitamin A in your diet — mangoes, papaya, carrots, egg yolk, liver, and fish — helps both you and your baby stay strong and fight infection. |

### Window D — Days 91–180 (Month 4–6): Extended Follow-Through

| ID | Category | Message Text |
|---|---|---|
| D50 | IMMUNIZATION | At 14 weeks: Pentavalent (3rd dose), OPV-3, and Hepatitis B (3rd dose) are due. |
| D51 | BREASTFEEDING | Keep breastfeeding exclusively — no other foods yet — right up until your baby turns 6 months. |
| D52 | GROWTH_WEIGHT | Continue weighing your baby regularly and bring the growth record to every follow-up visit. |
| D53 | FOLLOW_UP | Your 6-month follow-up is an important milestone visit — it includes a full development and feeding assessment. Please don't miss it. |
| D54 | IMMUNIZATION | At 9 months, Measles/MR/MMR vaccine will be due — mark it on your calendar now. |
| D55 | LOVING_CARE | Responding warmly every time your baby cries builds their lifelong sense of trust and security — you cannot "spoil" a baby with love. |
| D56 | BREASTFEEDING | Around 6 months, you'll begin adding soft, mashed complementary foods while continuing to breastfeed up to 2 years or beyond. *(Prepare mothers ahead of the 6-month mark.)* |

> **Total extracted, ready-to-seed messages: 56 unique entries.** See Section 21 for the plan to reach the ≥180-message requirement.


## 3. Weekly Theme Plan (Maps to Weekly Audio Message Feature)

The PRD requires one ~2–3 minute weekly audio message. Below is a themed schedule derived from the source documents' natural grouping, aligned to the daily message windows above. This gives Antik's team (or a scriptwriter) a topic-per-week outline; each week's audio script should draw its content from the matching module in this document (Sections 10–19).

| Week | Theme | Primary Module(s) to Draw Script From |
|---|---|---|
| 1 | Keeping your baby warm & preventing infection | Section 10 (Warmth), Section 11 (Infection Prevention) |
| 2 | Getting breastfeeding right — position & attachment | Section 15 (Breastfeeding — Positioning & Attachment) |
| 3 | Cord care and bathing safely | Section 12 (Bathing), Section 13 (Cord Care) |
| 4 | Kangaroo Mother Care — why skin-to-skin matters | Section 16 (KMC) |
| 5 | Recognizing danger signs — when to seek help now | Section 4 (Danger Sign Rules Engine) |
| 6 | Immunization — staying on schedule | Section 8 (Immunization) |
| 7 | Sleep patterns and safe sleep | Section 9 (Sleep) |
| 8 | Vitamin A for mother and baby | Section 17 (Vitamin A) |
| 9 | Understanding your baby's cries — loving, responsive care | Section 14 (Loving Care) |
| 10 | Common breastfeeding problems & how to solve them | Section 15 (Problems & Solutions subsection) |
| 11 | Growth & weight — what's normal | Section 7 (Growth & Weight-Gain) |
| 12 | Safety in the home | Section 18 (Safety) |
| 13 | Mother's own recovery and rest | Section 19 (Mother's Wellbeing) |
| 14+ | Repeat cycle with seasonal/monthly variation (e.g., monsoon-specific warmth tips, festival-season hygiene reminders) | Rotate through all modules |

> Weeks 15–26 should repeat this 13-week cycle with re-recorded or refreshed scripts (same core content, different phrasing/examples) to avoid repetition fatigue while staying within the source material's actual coverage.


## 4. Danger Sign Rules Engine (Structured Logic)

This is the most safety-critical module in the app. It should back a **"Check My Baby" / Danger Sign Checker** feature (interactive symptom checklist) that mothers can open any time, plus power **automatic alerts** if danger-sign data is ever logged elsewhere (e.g., a connected thermometer/oximeter per the proposal's remote-monitoring roadmap).

### 4.1 Master Danger Sign Table

| Sign | Threshold / Definition | Possible Cause | Action Required | Severity |
|---|---|---|---|---|
| Poor/no feeding + feels cold | Stops feeding well, cold to touch | Hypothermia / illness | Seek medical care immediately | CRITICAL |
| Abnormal breathing rate | <30 or >60 breaths/minute | Breathing difficulty / infection | Seek medical care immediately | CRITICAL |
| Gasping / noisy breathing | Grunting, gasping, chest indrawing, nostril flaring | Respiratory distress | Seek medical care immediately | CRITICAL |
| Blue discoloration | Tongue, lips, or skin appear blue | Hypoxia | Seek medical care immediately | CRITICAL |
| Feeding difficulty | Unable to suck, poor suck, tires quickly, refuses feeds | Infection / weakness | Seek medical care immediately | CRITICAL |
| Feels cold | Body (abdomen/back) cooler than normal; axillary temp <36°C | Hypothermia | Seek medical care immediately | CRITICAL |
| Fever | Body feels hot; axillary temp >37°C | Infection | Seek medical care immediately | CRITICAL |
| Eye discharge | Red, swollen eyelids with pus discharge | Eye infection | Consult doctor | HIGH |
| Cord infection signs | Redness, swelling, pus, or foul smell around cord/umbilicus | Umbilical infection / sepsis risk | Consult health worker/doctor immediately | CRITICAL |
| Convulsions/fits | Any seizure activity | Severe infection / brain involvement | Seek medical care immediately | CRITICAL |
| Jaundice | Yellow skin or eyes | Jaundice / liver problem | Seek medical advice promptly | HIGH |
| Limp/floppy posture | Arms and legs not flexed, floppy body | Illness / neurological concern | Seek medical care immediately | CRITICAL |
| Lethargy | Inactive, difficult to wake, doesn't respond when awake | Illness / infection | Seek medical care immediately | CRITICAL |
| Excessive sleepiness | Very hard to wake, or sleeping far more than usual and missing feeds | Possible illness | Seek medical help immediately | HIGH |
| Watery stool | Persistent watery/loose stool (after the initial normal black/green sticky stool of day 1–2) | Diarrhea / infection | Seek medical advice | HIGH |
| Persistent large-volume vomiting | Vomiting large quantities repeatedly (small spit-up after feeds is normal) | Investigate for underlying issue | Consult doctor | MEDIUM |

### 4.2 Suggested Rules-Engine Pseudocode

```
function evaluateDangerSigns(reportedSymptoms: Symptom[]): CheckerResult {
  const CRITICAL_SIGNS = ['cold_to_touch_and_feeding_poorly','breathing_abnormal','gasping',
                           'blue_discoloration','feels_cold','fever','cord_infection_signs',
                           'convulsions','limp_floppy','lethargic'];
  const HIGH_SIGNS = ['eye_discharge','jaundice','excessive_sleepiness','watery_stool'];

  if (reportedSymptoms.some(s => CRITICAL_SIGNS.includes(s.code))) {
    return {
      severity: 'CRITICAL',
      message: 'Seek medical care immediately. Go to the nearest hospital or contact ASHA/ANM staff now.',
      showEmergencyCallButton: true,
      notifyResearchTeam: true // Flag for researcher panel follow-up per RCT safety monitoring
    };
  }
  if (reportedSymptoms.some(s => HIGH_SIGNS.includes(s.code))) {
    return {
      severity: 'HIGH',
      message: 'Please consult your doctor or health worker soon.',
      showEmergencyCallButton: true,
      notifyResearchTeam: false
    };
  }
  return { severity: 'NORMAL', message: 'No danger signs reported. Continue routine care and daily checklist.' };
}
```

> **Design note:** Any CRITICAL result should surface the same "Call ASHA/ANM or go to nearest hospital" messaging used consistently in the source material — mothers in this population may not distinguish between having to call a helpline vs. traveling to a facility, so keep the instruction concrete and singular per the source docs' own phrasing ("contact health personnel ASHA/ANM STAFF or go to nearby hospital").

### 4.3 Feeds Into

- **Daily Care Checklist** (PRD Section 5.3) — checklist items should map 1:1 to the "Daily Checklist for Assessing the Newborn" list in Section 4.4 of this document.
- **Danger Sign Checker** — standalone feature, P0 priority per PRD.
- **Researcher Panel Safety Monitoring** — any CRITICAL flag logged by a mother should be visible to the research team (RCT safety reporting obligation), even though hospitals are not system users — the *research team* still needs visibility into adverse events.


### 4.4 Daily Care Checklist (Mother Self-Assessment) — Feeds "Daily Care Checklist" Feature

**Checklist: The newborn is healthy and safe if the mother —**
- [ ] Has no worries about the baby's behaviour
- [ ] Responds appropriately when the baby cries
- [ ] Keeps the baby warm
- [ ] Handles the baby gently
- [ ] Knows the newborn danger signs and what to do
- [ ] Is comfortable with exclusive breastfeeding
- [ ] Has taken one vitamin A capsule (200,000 IU) after birth
- [ ] Believes the baby is healthy

**Daily checklist for assessing the newborn (baby-focused items):**
- [ ] Feeds well (8–12 times in 24 hours)
- [ ] Sleeps between feeds
- [ ] Wakes for feedings
- [ ] Urinates at least 6 times in 24 hours
- [ ] Has stools that are not watery
- [ ] Is gaining weight steadily (after the first 7–10 days)
- [ ] Has axillary temperature 36–37°C (96.8–98.6°F)
- [ ] Is breathing quietly, 30–60 breaths/minute
- [ ] Has skin without pustules or rashes; not yellow, blue, or pale
- [ ] Has clean eyes
- [ ] Has a dry, clean umbilicus
- [ ] Has received first immunizations

> **Implementation suggestion:** render as a daily tappable checklist (already scoped as P0 "Daily Care Checklist Complete" in the PRD feature table). Any item left unchecked for 2+ consecutive days could trigger a gentle in-app nudge; any item that flips to "no" for a danger-adjacent item (temperature, breathing, feeding) should route into the Danger Sign Checker (Section 4.1–4.2).


## 5. Newborn Examination Protocol (28-Day Decision-Making Chart)

This module comes primarily from `2__28_days.docx` and is intended to structure a **guided assessment flow** — useful either as a mother-facing self-check or as a structured field the researcher's team fills during in-person follow-up visits (feeds Tool II).

### 5.1 Examination Without Touching the Baby vs. By Gentle Touch

The source distinguishes two examination phases. Structure the assessment UI/form around this same sequencing:

**Phase 1 — Observe without touching:**
- Watch the baby breastfeed (position, attachment, mother-baby interaction)
- Observe skin colour, posture, activity level

**Phase 2 — Gentle touch examination:**
1. **Temperature** — feel abdomen/back; if uncertain, use axillary thermometer. Normal: 36–37°C (96.8–98.6°F). *Note: slight fever up to 24 hrs after Hepatitis B/Pentavalent immunization is normal and not a danger sign.*
2. **Skin** — check for rashes/pustules. Note: the BCG injection site normally develops a small pustule within a few weeks, later forming a scar — this is expected, not an infection sign.
3. **Eyes** — check for sticky/pus-like discharge (eye infection indicator).

### 5.2 Full Assessment Reference Table

| Assessment Area | Normal Findings | Danger Signs / Abnormal Findings | Action |
|---|---|---|---|
| Breathing | Regular, 30–60 breaths/min | <30 or >60 breaths/min, chest indrawing, grunting, gasping | Seek medical care immediately |
| Umbilical Cord | Clean and dry, no redness/discharge | Redness, swelling, pus, foul smell around cord | Consult health worker/doctor |
| Skin Colour | Pink face, chest, lips, tongue, mucous membranes | Pale, blue lips/skin, yellow skin/eyes (jaundice) | Seek medical advice promptly |
| Posture | Arms and legs flexed (bent) | Limp or floppy body | Seek medical care immediately |
| Activity | Active movements, cries normally, responds when awake | Inactive, lethargic, difficult to wake | Seek medical care immediately |
| Feeding/Sucking | Feeds well, strong suck | Poor sucking, refuses feeds, difficulty feeding | Seek medical care immediately |
| Temperature | Warm to touch (36.5–37.5°C) | Fever or feels cold to touch | Seek medical care immediately |

### 5.3 Watching the Baby Breastfeed — Normal Interaction Indicators

1. Mother maintains eye contact with the baby
2. She touches the baby using full hands, not just fingertips
3. Both mother and baby are turned toward each other while feeding

*(These same three indicators are useful as a lightweight, non-clinical proxy checklist within the Breastfeeding Assessment feature — Tool II B4 — alongside the more detailed attachment signs in Section 15.4.)*


## 6. Follow-Up Visit Interview Questions (Feeds Tool II / Researcher Data Collection)

`1__daily_care_message.docx` includes a structured Q&A "Frequently Asked Questions" list that functions as an **interview script for a health worker/researcher assessing a mother at a follow-up visit.** This maps naturally onto the Researcher Panel's data-collection forms (Tool II) and could also power a self-guided "How is my baby doing?" reflective checklist in the Mother App.

| # | Question (ask the mother) | Interpretation Guide / Normal vs. Concerning |
|---|---|---|
| 1 | Have you seen anything in the baby that worries you? | Occasional spit-up after feeds is normal. Persistent vomiting of large quantities needs investigation. |
| 2 | Is the baby sucking well? | Poor suck can be a sign of infection. |
| 3 | How often does the baby feed during the day and night? | Normal: 8–12 times/24 hrs. Low-birth-weight babies feed more often (smaller stomach). |
| 4 | Does your baby wake to breastfeed at least every 2–3 hours, or do you need to wake the baby? | Not waking for feeds is a sign of infection or another problem. |
| 5 | How many times does the baby urinate in 1 day? | A well-fed newborn urinates at least 6 times/24 hrs. |
| 6 | Does the baby seem very sleepy? Hard to wake? | Excess sleepiness may indicate infection or another problem. |
| 7 | How do the baby's stools look? | Day 1–2: black/greenish, sticky is normal. After that: soft, yellow, "seedy" is normal. Watery stool is abnormal. |
| 8 | Has the baby received any immunizations? If so, which? | Cross-check against Immunization Schedule (Section 8). |
| 9 | Does the baby have any eye discharge? | If yes, refer to a doctor. |
| 10 | How many meals do you (the mother) eat per day? What food, how much? | A breastfeeding mother needs at least one large extra serving of staple food daily. |
| 11 | How much fluid are you drinking per day? | Needs 3–4 litres/day; should drink something at every feed. |
| 12 | Have you taken a vitamin A capsule? | Single 200,000 IU dose, any time from delivery up to 8 weeks postpartum, ensures adequate vitamin A in breast milk. |
| 13 | Are you getting enough rest? | Insufficient rest can reduce milk supply. Mothers should aim for 7–9 hours of sleep. |

> **Implementation suggestion:** this maps cleanly to a repeatable "Follow-Up Interview" form in the Researcher Panel with each question as a field, a free-text or structured answer, and an auto-flag if the answer matches a "concerning" pattern (e.g., stool = watery, urination <6/day, sleepiness = excessive) — these auto-flags should route into the same Danger Sign visibility used in Section 4.


## 7. Growth & Weight-Gain Validation Logic

Source: `2__28_days.docx`. This should back the Growth Tracker's expected-range validation (flagging entries that fall outside expected bounds for follow-up review, not as a strict diagnostic tool).

| Age Window | Expected Weight Pattern |
|---|---|
| First 7 days | May lose 5–10% of birth weight (normal) |
| Days 7–10 | Begins to gain weight |
| Day 14 | Should have regained birth weight |
| After Day 14 (up to 4 months) | Gains an average of 25–30 grams/day |
| 4–5 months | Doubles birth weight |

### Suggested Validation Logic

```
function validateWeightEntry(birthWeightGrams, currentWeightGrams, ageInDays, correctedAgeInDays) {
  // Use correctedAgeInDays for all comparisons — this cohort is preterm.
  if (correctedAgeInDays <= 7) {
    const lossPercent = ((birthWeightGrams - currentWeightGrams) / birthWeightGrams) * 100;
    if (lossPercent > 10) return { flag: 'REVIEW', reason: 'Weight loss exceeds 10% of birth weight' };
  }
  if (correctedAgeInDays === 14 && currentWeightGrams < birthWeightGrams) {
    return { flag: 'REVIEW', reason: 'Has not regained birth weight by day 14' };
  }
  if (correctedAgeInDays > 14 && correctedAgeInDays <= 120) {
    const expectedGainPerDay = 25; // grams, lower bound
    // Compare against previous logged weight, not birth weight, for day-to-day gain checks
  }
  if (correctedAgeInDays >= 120 && correctedAgeInDays <= 150) {
    if (currentWeightGrams < birthWeightGrams * 2) {
      return { flag: 'INFO', reason: 'Expected to double birth weight by 4-5 months corrected age' };
    }
  }
  return { flag: 'NORMAL' };
}
```

> **Cross-reference:** the PRD already scopes WHO growth charts and z-score calculation (Tool II B1) as a research outcome. This weight-gain-pattern logic is a **simpler, mother-facing layer** on top of that — a quick "is this normal?" indicator distinct from the clinical z-score calculation used by the research team.


## 8. Immunization Schedule & Reminder Logic

Source: `how_to_take_daily_care_of_newborn.docx`. This is the definitive schedule to seed the reminder/notification system.

| Age of Baby | Vaccines Given |
|---|---|
| At Birth | BCG (against Tuberculosis), OPV-0 (Polio), Hepatitis B (1st dose) |
| 6 Weeks | Pentavalent (1st dose), OPV-1, Hepatitis B (2nd dose), Hib & Rotavirus (per national schedule) |
| 10 Weeks | Pentavalent (2nd dose), OPV-2, Rotavirus (2nd dose) |
| 14 Weeks | Pentavalent (3rd dose), OPV-3, Hepatitis B (3rd dose), Hib (3rd dose) |
| 9 Months | Measles / MR / MMR vaccine |

**Rule:** Ensure at least 4 weeks between each scheduled set of immunizations.

**Reminder logic:**
- Calculate each due date from the infant's **corrected age** birth reference point used consistently elsewhere in the app (confirm with researcher whether immunization timing should use chronological age — India's UIP schedule is chronological-age-based even for preterm infants — this is an **open question**, see Section 21).
- Send a reminder notification/SMS 3 days before each due date, and again on the due date if unconfirmed.
- If a dose is logged as missed (past due date, unconfirmed), flag for follow-up and surface "go to the nearest health center" messaging, per source material.
- Mother-facing copy should reinforce: continue exclusive breastfeeding during the vaccination period (source note that this strengthens immunity), and that mild fever up to 24 hours post-Hepatitis B/Pentavalent is expected, not a danger sign (already noted in Section 5.1 — cross-link these two so the Danger Sign Checker doesn't over-flag expected post-vaccine fever within the 24-hour window).


## 9. Sleep Guidance by Age

| Age Range | Recommended Sleep Duration |
|---|---|
| Up to 3 months | 14–17 hours/day |
| 4–11 months | 12–16 hours/day |
| 12–24 months | 11–14 hours/day |
| Beyond 2 years | 10–13 hours/day |

**Newborn-specific notes (first weeks):**
- Healthy newborns sleep ~16–18 hours/day, waking every 2–3 hours to feed.
- Some babies sleep up to 4 hours between night feeds — this is normal.
- Frequent night waking is expected and healthy (small, frequent feeds).
- As the baby grows, night sleep lengthens and daytime wake periods become more regular.

**Safe sleep practices:**
- Always place the baby on their back to sleep, ensuring the airway is clear.
- Baby should sleep on their back throughout the first year.
- Use a bednet in malaria-prone areas.

**Sleep-related danger sign:** a baby who is very hard to wake, or sleeps far more than usual and misses feeds, may be sick — this maps to Section 4's danger sign rules (`excessive_sleepiness`, HIGH severity).

**Mother's own sleep:** mothers should nap when the baby sleeps during the day, since night waking is frequent; aim for 7–9 hours of rest across the day/night combined (ties into Section 6, Q13 and Section 19).


## 10. Warmth & Thermal Care Module (Learning Hub Article Source)

**Headline principle:** *Warmth is life — newborns cannot control their body temperature. If a newborn gets too cold, he can die.*

**Tips for keeping baby warm:**
- Keep the room warm and draft-free (day and night).
- Dress the baby in 1–2 layers more than what the mother is wearing.
- Cover the head with a soft hat or cloth.
- Use loose, soft clothing and blankets — tight clothes make the baby cold.
- Keep the baby in bed with the mother for warmth and feeding.
- Hold the baby skin-to-skin and cover both with a warm cloth.
- Keep the baby's face uncovered so they can breathe freely.

**Cross-reference:** this is functionally the entry point to Kangaroo Mother Care (Section 16), and should link to it in the Learning Hub UI.

## 11. Infection Prevention & Hygiene Module

**Headline principle:** *A newborn's immune system is not yet mature — prevent germs and sickness.*

**Family hygiene rules:**
- Wash hands with soap and water before and after touching the baby.
- Keep fingernails short and clean.
- Never apply oils, herbs, or powders on the umbilical cord.
- Keep the cord clean and dry.
- Wash the baby's clothes, bedding, and wraps regularly.
- Keep sick people away from the baby.
- Avoid smoke from cigarettes or cooking fires.
- Use an insecticide-treated bed net to prevent mosquito bites.
- Breastfeed exclusively — mother's milk gives strong infection protection.
- Ensure all immunizations are done on time.

## 12. Bathing Module

### Sponge Bath (First Week / Until Cord Falls Off)
- Wait 6–24 hours after birth for the first bath.
- Give only sponge baths until the cord falls off and heals.
- Use a warm, wet cloth — do not immerse the baby in water.
- Wash the upper body first, dry and cover; then wash the lower body, dry and cover.

### Full Bath (After Cord Heals)
- Give a full bath every 2–3 days.
- Clean the buttocks after every urine or stool using a soft, wet cloth.

### Keeping Baby Warm During Bath
- Bathe in a warm, closed room with no drafts.
- Have everything ready before starting.
- Test water temperature with your elbow.
- Wash the face first, head last — babies lose heat through the head.
- Bathe quickly but gently; dry completely, including skin folds and hair.
- After the bath, hold the baby skin-to-skin with the mother, cover both warmly, and re-cover the baby's head.

### Bathing Recommendations
- Clean eyes gently with a clean cloth corner for each eye, wiping from the nose outward.
- Wash the bottom from front to back.
- Use clean water only on the face — no soap.
- Do not clean inside the ears or nose, only the outside.
- Avoid baby powder — it may enter the baby's lungs.
- Dry inside skin folds thoroughly.

### Check for Infection Signs While Bathing
- Skin: rashes or pustules
- Cord: redness, pus, swelling, or foul smell
- Eyes: redness, swelling, or pus-like discharge

**Key summary phrase from source:** *Warmth + Cleanliness + Breastfeeding = A Healthy Newborn.*

## 13. Cord Care Module

**Why it matters:** improper cord care can lead to serious infections such as tetanus and sepsis, both life-threatening. Studies from 10 countries show that simple clean, dry cord care is as safe and effective as antiseptics or antibiotics.

**Preventing cord infections:**
- The mother should receive tetanus toxoid injections during pregnancy.
- The cord must be cut with a sterile instrument or a new, clean blade.
- Keep the cord clean and dry at all times.
- Do not apply anything to the cord — no ointment, powder, or herbal dressing.

**Daily cord care tips:**
- Do not apply any medication or dressing.
- Keep the cord clean and dry.
- Prevent urine or stool from touching the cord.
- If it gets dirty, wash gently with soap and clean water, then dry with a clean cloth or air-dry.
- The cord usually falls off within 5–10 days after birth.
- Give the baby only sponge baths until the cord has fallen off and the umbilicus is fully healed.
- Check the cord daily for signs of infection.

**Watch for (seek medical help immediately):**
- Cord taking too long to fall off
- Pus discharge
- Foul smell
- Redness or swelling around the umbilicus

## 14. Loving Care / Responsive Caregiving Module

**Core message:** *A baby's first need is love, touch, and gentle attention. A newborn cannot survive without love and care — at birth, he depends completely on others.*

**Understanding baby's signals:**
- When hungry, wet, cold, uncomfortable, in pain, or sick, a baby can only cry or give small cues.
- Every baby is different: some calm and sleepy, others active and fussy; some have a soft cry, others loud and strong; some are easy to soothe, others need more patience.
- A mother learns to recognize her baby's unique personality through observation.

**Building trust and confidence:**
- When a baby cries and someone responds with love and care, the baby learns the world is safe.
- The baby also learns confidence (that they can communicate needs) and trust (that someone will always care for them).
- Never ignore a newborn's cry — it is their only way of "talking."

**Practical guidance:**
- Always handle the baby gently and speak softly.
- Observe the baby closely for signs of hunger, tiredness, or discomfort.
- Talk to the baby in a calm, quiet voice.
- Caregivers and health workers should model gentle, respectful handling, since mothers learn by watching.

**Key summary phrase from source:** *Love, warmth, and gentle touch are as important as food and medicine.*


## 15. Breastfeeding Module (Full)

This is the single largest content domain in the source material and should power the richest Learning Hub section, since breastfeeding assessment is also a primary research outcome (Tool II B4).

### 15.1 Benefits of Breastfeeding

**For babies:**
- Complete nutrition for the first 6 months — no substitute equals breast milk.
- Contains vitamin A, protecting against eye problems and infections.
- Clean and safe — no risk of contaminated water or bottles.
- Acts as the "first immunization," strengthening the immune system.
- Protects against allergies; helps babies recover faster from illness.
- Prevents serious intestinal disease that especially affects low-birth-weight babies.
- Supports brain and body development.
- Ideal for low-birth-weight or premature babies — easy to digest, protective against intestinal disease.
- Supports proper development of mouth, teeth, and jaw.
- Helps stabilize body temperature.
- Always the right temperature and ready to feed.

**For mothers:**
- Aids placental separation and helps the uterus return to normal size.
- Reduces risk of anemia; delays the next pregnancy by suppressing ovulation.
- Encourages bonding with the baby.
- Saves money on formula and healthcare costs.

**For family and society:**
- Saves money; promotes family planning; decreases need for hospitalization; contributes to child survival.

### 15.2 Breast Physiology & Milk Production (Background — Learning Hub "Deep Dive," Optional)

- The breast consists of glandular tissue, supporting tissue, and fat. Milk travels through tubules into lactiferous sinuses beneath the areola, then out through lactiferous ducts to the nipple.
- **Prolactin reflex ("milk secretion reflex"):** sucking stimulates nerve endings in the nipple → signals the anterior pituitary → releases prolactin → stimulates milk secretion. The earlier and more frequently the baby feeds, the stronger the reflex and the greater the milk supply. Since this reflex is especially active at night, night feeding (or expressing) helps improve supply.
- **Oxytocin reflex ("milk ejection reflex"):** triggered by nipple stimulation and also by the sight, sound, or thought of the baby. This reflex is sensitive to the mother's emotional state — a relaxed, confident mother has better milk flow; tension, pain, and low confidence hinder it. Supportive companions (health workers, relatives) who reassure the mother materially help breastfeeding success.

### 15.3 Types of Breast Milk

| Type | Timing | Characteristics |
|---|---|---|
| Colostrum | First week after delivery | Yellow, thick, high in antibodies and white blood cells, high protein, small quantity. **Never discard.** |
| Transitional Milk | Following ~2 weeks | Immunoglobulin/protein content decreases; fat and sugar content increases. |
| Mature Milk | After transitional milk | Thinner, more watery; contains all nutrients for optimal growth. |
| Preterm Milk | Produced by mothers who deliver prematurely | Higher protein, sodium, iron, and immunoglobulins — matched to preterm needs. *(Directly relevant to this study's cohort.)* |
| Foremilk | Start of each feed | Watery, rich in protein/sugar/vitamins/minerals/water — quenches thirst. |
| Hindmilk | End of each feed | Richer in fat, more energy, satisfies hunger. Babies should finish one breast fully before switching, to get both. |

**Do babies need extra water?** No — breast milk is 88% water, sufficient even in hot climates; colostrum alone fully satisfies a newborn's thirst.

### 15.4 Early & Exclusive Breastfeeding

- **Early breastfeeding** = within minutes of birth (most babies are ready to feed 15–55 minutes after birth).
- **Exclusive breastfeeding** = only breast milk for 6 months — no water, tea, formula, or foods.
- Starting within the first hour: baby is alert and ready to suck, helps milk production, reduces maternal bleeding, and colostrum provides antibodies/vitamin A that help prevent jaundice and low blood sugar; also encourages bonding and temperature stability.
- **Self-attachment:** place the baby face-down on the mother's abdomen after birth; let the baby move toward the breast and attach naturally, taking the full areola, not just the nipple.

**Risks of giving other liquids/foods early:**
- Reduces milk production and leads to less breastfeeding.
- Causes poor sucking, sore nipples, or malnutrition.
- Decreases nutrient absorption from breast milk.
- Increases risk of diarrhea and infections like pneumonia.

### 15.5 Breastfeeding Positions

| Position | Description |
|---|---|
| Cradle Hold | Baby lies across the mother's lap, supported by her arm. |
| Cross-Cradle Hold | Baby held with the opposite arm for better head control. |
| Under-Arm Hold | Useful after cesarean birth or for premature babies; baby's feet point backward. |

**General positioning rules:**
- Mother should be comfortable and supported (use pillows); can lie on her back, lie on her side (after cesarean), or sit up.
- Baby should be held close with both hands, face and body turned toward the breast, nose opposite the nipple, fully supported.
- Baby's chin should touch the breast, mouth wide open, lower lip turned out.
- Bring the baby to the breast — not the breast to the baby.

### 15.6 Attachment & Sucking Technique

- Mother holds her breast in a "C" hold (thumb on top, fingers below).
- Touch the baby's lips with the nipple; wait for the mouth to open wide.
- Move the baby onto the breast with the lower lip below the nipple.
- Support the back of the neck and move the whole body — don't move only the head.
- Make sure breast tissue doesn't block the baby's nose.
- Mother should not lean over the baby — bring baby to breast, not breast to baby.

**Signs of good attachment:**
- Mouth wide open
- More areola visible above the mouth than below
- Chin touching the breast
- Slow, deep sucks with pauses
- Mother's nipples not sore

**Signs of good (effective) sucking:**
- Several slow, deep sucks followed by swallowing, then pauses
- Mother's breasts and nipples are comfortable

**Signs of ineffective sucking:**
- Baby suckles briefly but tires out and can't continue long enough

**If attachment/sucking are poor:** gently break suction with a finger in the baby's mouth, then help the baby re-attach. Poor position/attachment/sucking reduces milk transfer, can hurt the nipple (soreness/cracks), and can cause breast engorgement.

**Causes of poor attachment:**
- Use of feeding bottles
- Inexperienced mother
- Lack of skilled support/guidance
- Inverted nipples

> **Critical rule from source: bottle feeds should never be introduced at any point**, as they interfere with proper attachment.

**Problems caused by poor attachment:** painful/damaged/sore nipples, breast engorgement, a hungry/irritable baby from inadequate intake, poor weight gain.

### 15.7 Feeding Pattern & Duration

- No time limit — baby feeds until full.
- Offer both breasts, alternating which one starts each feed.
- Empty one breast fully before offering the other (foremilk quenches thirst, hindmilk satisfies hunger).
- **Hunger signs to feed on demand:** open eyes, seeking the breast, head tilted back slightly, tongue thrust forward, mouth wide open, licking lips/drooling.
- Feed 8–12 times in 24 hours (roughly every 2–3 hours) — a newborn's stomach is small and breast milk digests quickly.
- The more the baby sucks, the more milk the mother produces (demand-supply relationship).

### 15.8 Mother's Nutrition While Breastfeeding

- Drink a glass of water with every feed.
- Eat one extra serving of staple food daily.
- Avoid alcohol — it affects milk let-down and the baby's development.

### 15.9 Duration of Breastfeeding

| Age | Guidance |
|---|---|
| Birth – 6 months | Exclusive breastfeeding on demand — only breast milk, no water or other foods. |
| 6 months – 2 years and beyond | Add complementary foods (mashed fruits, vegetables, cereals) while continuing to breastfeed. Keep breastfeeding to 2 years or longer for ongoing infection protection and healthy growth. |

### 15.10 Signs the Baby Is Getting Enough Milk

- Passes urine at least 6 times in 24 hours
- Audible swallowing during feeds
- Mother's breasts feel softer after a feed
- Baby gains weight over time (after the first week)
- Baby seems contented after feeding, with clear periods of hunger, quiet alertness, and sleepiness through the day

### 15.11 Breastfeeding Problems & Solutions

| Problem | Causes | Care Tips | Follow-up |
|---|---|---|---|
| **Sore or Cracked Nipples** | Poor latch/positioning | Ensure proper latch, try different positions; apply expressed breast milk and air-dry nipples (avoid soap); 10 min sun exposure 2–3x/day; start feeds on the less sore side; don't stop breastfeeding; if HIV-positive, avoid feeding from a bleeding nipple (express and discard until healed); express milk and cup-feed if resting the nipple | Re-check in 2–3 days |
| **Not Enough Milk (usually a misconception)** | Fatigue, stress, dehydration, infrequent feeding, poor latch, giving other foods | Rest and drink fluids often; back massage 15–30 min, 3–4x/day (relaxation stimulates hormone production); breastfeed on demand every 2–3 hrs, empty one breast fully; avoid bottles/supplements; keep baby close and feed frequently; reassure with weight-gain records and visible milk | Re-check in 3 days |
| **Breast Engorgement** | Missed feeds, poor attachment, separation, stress | Warm compress/shower before feeding, express a little milk first; feed/express every 2–3 hrs; cold compress or cabbage leaves after feeding; avoid tight bras; paracetamol if needed; back massage; watch for infection signs (pain, redness, swelling, fever) | Monitor for infection signs |
| **Plugged Milk Duct** | Poor emptying of one duct | Massage gently; ensure baby empties the breast well | — |
| **Mastitis (Breast Infection)** | Cracked nipples, engorgement, blocked duct, tight bras, poor health | Warm compress and gentle massage before feeding; breastfeed every 2 hrs, starting on the infected side; rest, drink ≥4L fluids/day, paracetamol for pain | **Danger sign:** fever, persistent lump, or no improvement after 2 days → see a doctor immediately (possible abscess); contact health personnel |


## 16. Kangaroo Mother Care (KMC) Module — Critical for the Preterm Cohort

Since every enrolled infant is preterm/NICU-discharged, KMC is arguably the single most study-relevant content module. It should have dedicated prominence in the Mother App (not buried in the general Learning Hub) — consider a persistent "KMC Tracker" alongside the Daily Care Checklist.

### 16.1 What Is KMC?

Kangaroo Mother Care is a simple method of care for low-birth-weight infants involving early and prolonged skin-to-skin contact with the mother (or a substitute caregiver), combined with exclusive and frequent breastfeeding.

*(The source material opens this module with the origin analogy: a kangaroo — found in Australia — delivers her premature joey, which stays in the mother's pouch for warmth and exclusive feeding until mature enough to survive outside. This analogy may be useful as an explainer illustration in the Learning Hub, without reproducing any copyrighted imagery.)*

### 16.2 KMC Duration Categories

| Category | Daily Duration |
|---|---|
| Short | 4 hours daily |
| Extended | 5–8 hours daily |
| Long | 9–12 hours daily |
| Continuous | More than 12 hours daily |

### 16.3 Benefits to the Newborn

- Stabilizes body temperature
- Decreases morbidities; supports better neurodevelopment
- Enables earlier hospital discharge
- Promotes breastfeeding; prevents infection
- Encourages mother–child bonding

### 16.4 KMC vs. Routine Skin-to-Skin at Birth

KMC should not be confused with routine skin-to-skin care immediately after delivery. WHO recommends skin-to-skin care immediately after delivery for **every** newborn regardless of birth weight — KMC is the more prolonged, structured practice specifically for low-birth-weight infants.

### 16.5 Time of Initiation — Based on Birth Weight

| Birth Weight | Initiation Guidance |
|---|---|
| Less than 1200 g | Most infants have serious morbidities; delivery should ideally be at a specialized centre. KMC initiated only after stabilization — may take days to weeks. Transfer to a specialized centre if possible; during transport, use skin-to-skin care with mother/family member if a transport incubator is unavailable. KMC may begin after stabilization (a few days). |
| 1200–1800 g | Many infants have serious morbidities. KMC initiated after stabilization, which may take a few days. |
| 1800–2500 g | Generally stable at birth. **KMC can be initiated immediately after birth.** |

**Who can provide KMC?** Mother, father, or any other willing adult family member who is healthy and maintains basic hygiene standards.

### 16.6 How to Provide KMC

Understanding the "why" behind KMC is a prerequisite for mothers and health workers to overcome socio-cultural barriers and anxiety around handling a low-birth-weight infant.

**Clothing:**
- **Mother:** any front-open, light dress per local culture — no special garment is mandatory.
- **Infant:** cap, socks, disposable diaper, and a front-open sleeveless shirt or "jhabala" made of soft natural fabric (e.g., cotton).

**KMC Position:**
1. Place the infant upright between the mother's breasts.
2. Turn the head to one side, slightly extended.
3. Flex and abduct the hips in a "frog" position; arms also flexed.
4. Infant's abdomen should rest at the level of the mother's epigastrium.
5. Support the infant from below with a sling or binder.

**During KMC:** the mother can walk, stand, sit, or engage in activities, and may even sleep in the KMC position if comfortable. **Monitor carefully** to ensure the infant's airway is clear, breathing is regular, colour is pink, and temperature is maintained.

### 16.7 KMC Follow-Up Schedule

- Follow-up is fundamental to KMC — it enables regular assessment of growth, sensory function, behaviour, and neurodevelopment.
- Community health workers (ASHA) continue care after discharge.
- First follow-up: at 1 week, then fortnightly for the next two visits.
- Additional follow-ups continue until the infant reaches 2500 g.

> **Cross-reference:** this KMC-specific follow-up cadence (1 week → fortnightly x2 → until 2500g) is distinct from — and may run in parallel with — the RCT's own study follow-up schedule (baseline, 1, 3, 6 months). Flagged in Section 21 as a point to clarify with the researcher: should the app track both schedules separately, or has the RCT schedule superseded this clinical KMC schedule for study purposes?


## 17. Vitamin A Supplementation Logic

**Why it matters:** newborns are born with very small vitamin A stores, so breastfed infants depend entirely on the vitamin A in breast milk during the first months — and breast milk's vitamin A level depends on the mother's own intake. Vitamin A helps both mother and baby grow well, prevent infections, and recover faster when infections occur.

**Food sources of vitamin A for the mother:**
- Fruits & vegetables: mangoes, papaya, carrots (red, yellow, orange varieties)
- Animal sources: egg yolk, liver, cheese, fish
- Fats & oils: fish liver oil, palm oil, butter

**Supplementation rules (structure as a one-time reminder + validation flag):**
- A single dose of 200,000 IU vitamin A capsule should be given as soon as possible after birth, but **not later than 8 weeks postpartum**.
- For non-breastfeeding mothers, give within 6 weeks after delivery.
- **Do not give high doses** (>10,000 IU/day) during the first trimester of pregnancy — this note is more relevant to a future-pregnancy education context than to this cohort, but is included in the source material as a caution and can appear in general reproductive-health content.
- Breast milk is the only safe and main source of vitamin A for the baby — reinforcing exclusive breastfeeding for the first six months.

**Suggested logic:** track `vitaminACapsuleTaken: boolean` + `dateTaken` on the mother profile. If `false` and `daysPostpartum > 56` (8 weeks), surface a gentle "you may have missed this window — talk to your health worker" notice rather than a blocking error (past-due, informational only).

## 18. Safety & Security Guidance

- Never leave a baby alone on a bed or table — risk of falling.
- Do not hold a newborn by the feet with the head down.
- Breastfeeding mothers should avoid: smoking, alcohol, unprescribed drugs or medicines.
- Practice safe sex: use condoms, abstain, or have sex only with a monogamous, HIV-negative partner.

*(This last point is present in the source material as general postpartum family-health guidance. Treat with the same plain, non-judgmental tone as the rest of the content when localizing/translating.)*

## 19. Mother's Own Wellbeing / Postpartum Self-Care Checklist

Drawn from the "Tips for parents" section and scattered guidance throughout the source docs — useful as a distinct "For You" tab/section rather than folding entirely into baby-care content, since the PRD already tracks mental wellbeing (WHO-5, Tool IV) as a primary outcome.

- Rest whenever your baby sleeps.
- Maintain personal hygiene to protect your baby.
- Keep essential baby supplies organised.
- Accept help from family or caregivers.
- Continue postpartum care for yourself, not just the baby.
- Eat at least one large extra serving of staple food daily while breastfeeding.
- Drink 3–4 litres of fluid daily.
- Take the vitamin A capsule within the postpartum window (Section 17).
- Aim for 7–9 hours of rest; if not getting enough rest, know this can reduce milk supply.
- Avoid smoking, alcohol, and unprescribed medicines while breastfeeding.

> **Design consideration:** several of these directly overlap with WHO-5 well-being domains (rest, support from others, coping) — consider surfacing this checklist contextually after a low WHO-5 score, as a gentle, non-clinical set of self-care nudges (not a replacement for the WHO-5 assessment itself, but a supportive companion to it).

## 20. Content-to-Feature Mapping Table

| PRD Feature | Content Modules That Feed It | Priority |
|---|---|---|
| Daily Care Checklist (5.3) | Section 4.4 | P0 |
| Danger Sign Checker | Section 4 (all) | P0 |
| Daily SMS Messages (5.13) | Section 2 (all windows) | P1 |
| Weekly Audio Messages (5.13) | Section 3 (weekly themes) | P1 |
| Learning Hub | Sections 10–19 (all modules, as individual articles) | P1/P2 |
| Growth Tracker validation | Section 7 | Supports Tool II B1 |
| Immunization Reminders | Section 8 | New/derived feature |
| Breastfeeding Assessment (Tool II B4) | Section 15.4, 15.6, 15.10, Section 5.3 | P0 — Research |
| KMC Tracker (new — recommended) | Section 16 | Recommend elevating to P0/P1 given cohort relevance |
| Follow-up visit data collection (Researcher Panel) | Section 6 | P0 — Research |
| Vitamin A tracking | Section 17 | P2 |
| Mother Wellbeing companion content | Section 19 | Supports Tool IV |


## 21. Gaps, Assumptions & Open Questions for the Researcher

These need Dr. Ponnarasi's input before backend logic is finalized:

1. **Message library size gap.** The source documents yield **56 unique, extractable daily messages**. The PRD requires a minimum of 180 unique messages for the 6-month intervention period. Options to close the gap:
   - Rotate the 56 messages on a repeating cycle (simplest, lowest effort, but repetitive by month 4).
   - Ask Dr. Ponnarasi's team to expand/approve additional messages derived from the same source content (e.g., splitting compound bullet points into separate daily sends, adding seasonal variants).
   - Antik's team drafts additional messages **strictly derived from** the existing modules (Sections 10–19) and sends them back to the researcher for clinical sign-off before going live — recommended approach, since content must remain researcher-approved for RCT integrity.

2. **Chronological age vs. corrected age for immunization timing.** India's Universal Immunization Programme schedule is conventionally chronological-age-based even for preterm infants, but this app otherwise privileges corrected age throughout. **Confirm with the researcher which age basis governs immunization due-dates** before building the reminder engine (Section 8).

3. **KMC follow-up schedule vs. RCT follow-up schedule.** Section 16.7 describes a KMC-specific follow-up cadence (1 week, then fortnightly x2, until 2500g) that is separate from the RCT's own baseline/1/3/6-month follow-up schedule. Clarify whether both should be tracked as distinct schedules in the data model, or whether the RCT schedule has superseded/absorbed KMC follow-up for study purposes.

4. **Untranslated diagrams.** Several images in the source docs (breastfeeding physiology diagrams, breastfeeding position illustrations, KMC position photos) are visual aids whose content has been captured in the surrounding text above. If Antik wants these as actual illustrations in the Learning Hub UI, they'll need to be **newly illustrated** (in Bengali-appropriate, culturally relevant style) rather than reusing the source images, since several appear to be sourced from WHO/UNICEF public material and should not be repurposed without checking licensing.

5. **Danger-sign auto-escalation to the research team.** Section 4.3 proposes that CRITICAL flags become visible to the researcher panel for RCT safety monitoring. Confirm this is within the study's approved data-collection/ethics scope before building it, since it introduces a new researcher-facing data stream not explicitly named in the original proposal excerpts reviewed so far.

6. **Vitamin A high-dose caution during pregnancy** (Section 17) is present in the source material but is only relevant to future pregnancies, not this postpartum cohort's newborns — confirm whether this belongs in the app at all, or was included in the source purely as general reference material to be excluded from the mother-facing content.

## 22. Suggested Content Data Model (For Backend Engineers)

```sql
-- Core content library table (daily messages, learning hub articles, audio scripts)
CREATE TABLE content_items (
    content_id          VARCHAR(10) PRIMARY KEY,      -- e.g., 'D01', 'LH_WARMTH_01'
    content_type        VARCHAR(20) NOT NULL,          -- 'DAILY_SMS' | 'LEARNING_HUB' | 'AUDIO_SCRIPT'
    category            VARCHAR(30) NOT NULL,          -- FK to category enum, Section 1
    corrected_age_min_days INT,                        -- window start (nullable for evergreen content)
    corrected_age_max_days INT,                        -- window end
    text_en             TEXT NOT NULL,                 -- English source text (this document)
    text_bn             TEXT,                          -- Bengali translation (populated later)
    text_hi             TEXT,                          -- Hindi translation (populated later)
    audio_url           VARCHAR(255),                  -- for weekly audio messages
    source_document     VARCHAR(100),                  -- traceability back to original doc
    researcher_approved BOOLEAN DEFAULT FALSE,          -- RCT content-integrity gate
    created_at          TIMESTAMP DEFAULT NOW()
);

-- Danger sign rules table
CREATE TABLE danger_sign_rules (
    rule_id             VARCHAR(10) PRIMARY KEY,
    sign_code           VARCHAR(50) NOT NULL,          -- e.g., 'breathing_abnormal'
    sign_label_en       VARCHAR(200) NOT NULL,
    threshold_description TEXT,
    possible_cause      VARCHAR(200),
    action_required      VARCHAR(200) NOT NULL,
    severity            VARCHAR(10) NOT NULL           -- 'CRITICAL' | 'HIGH' | 'MEDIUM'
);

-- Immunization schedule table
CREATE TABLE immunization_schedule (
    schedule_id         VARCHAR(10) PRIMARY KEY,
    age_milestone       VARCHAR(30) NOT NULL,          -- 'At Birth' | '6 Weeks' | '10 Weeks' | '14 Weeks' | '9 Months'
    age_in_days         INT NOT NULL,                  -- computed reference point
    vaccines            TEXT NOT NULL,                 -- comma-separated list, or normalize to a join table
    age_basis           VARCHAR(20) DEFAULT 'TBD'      -- 'CHRONOLOGICAL' | 'CORRECTED' — pending Section 21, item 2
);

-- Weight-gain expectation reference table
CREATE TABLE growth_expectation_windows (
    window_id           VARCHAR(10) PRIMARY KEY,
    corrected_age_min_days INT NOT NULL,
    corrected_age_max_days INT,
    expected_pattern     VARCHAR(200) NOT NULL,
    validation_type      VARCHAR(20)                    -- 'PERCENT_LOSS' | 'REGAIN_CHECK' | 'DAILY_GAIN' | 'MULTIPLIER'
);

-- KMC tracking table (recommended new feature, given cohort relevance)
CREATE TABLE kmc_daily_log (
    log_id              SERIAL PRIMARY KEY,
    infant_id           VARCHAR(50) NOT NULL,          -- FK to infant_profiles
    log_date            DATE NOT NULL,
    duration_minutes    INT NOT NULL,
    duration_category   VARCHAR(20),                    -- 'SHORT' | 'EXTENDED' | 'LONG' | 'CONTINUOUS' (derived)
    provider            VARCHAR(20),                     -- 'MOTHER' | 'FATHER' | 'OTHER_FAMILY'
    notes               TEXT
);
```

**Migration note:** `text_en` for `DAILY_SMS` content_type should be seeded directly from Section 2's tables (IDs D01–D56). `text_en` for `LEARNING_HUB` content_type should be seeded from Sections 10–19, one `content_id` per module/subsection (e.g., `LH_WARMTH`, `LH_BREASTFEEDING_POSITIONS`, `LH_KMC_INITIATION`).

---

*End of document. This file is intended to be read directly by AI coding agents and human backend engineers building SnehoAyu's content and rules-engine layers, alongside the existing PRD v2.0 and Step 1 Foundation Document.*
