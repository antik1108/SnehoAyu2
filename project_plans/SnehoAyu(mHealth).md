# 📱 App Naming Document

# **📱 App Naming Document**

### **Proposed Name: SnehoAyu (স্নেহআয়ু)**

---

## **1\. Introduction**

Choosing the right name for an app is more than just branding—it shapes how parents, families, and healthcare providers perceive its purpose. Since your app is designed for **NICU-discharged preterm infants and their parents**, the name must communicate **care, trust, safety, and cultural relevance**.

After evaluating various options, the strongest and most meaningful name is:

👉 **SnehoAyu (স্নেহআয়ু)**

---

## **2\. Word Breakdown & Linguistic Meaning**

### **স্নেহ (Sneho)**

* Meaning: *Affection, tender care, love, nurturing*

* Usage in Bengali: Often used to describe the **bond between parents and children**, symbolizing warmth and compassion.

### **আয়ু (Ayu)**

* Meaning: *Life, lifespan, health, wellbeing*

* Usage in Bengali & Sanskrit: Commonly associated with **longevity, vitality, and healthy living**.

---

## 

## **3\. Combined Meaning: SnehoAyu (স্নেহআয়ু)**

When brought together, the name **SnehoAyu** represents:

* **“A Life of Affectionate Care”**

* **“A Nurtured Life”**

* **“Caring for a Precious Life”**

This perfectly mirrors the app’s mission—to provide parents with the knowledge, support, and digital tools to ensure their fragile newborns not only survive but thrive.

---

## **4\. Why “SnehoAyu” is the Perfect Fit**

### **💖 Emotional Connection**

* Parents of preterm infants are often anxious and stressed.

* The word *Sneho* makes the app feel like a **compassionate partner**, not just a digital tool.

* It creates **trust** by highlighting emotional bonding.

### **🌏 Cultural Relevance**

* Both words are widely understood in Bengali households, across urban and rural areas.

* The name instantly resonates with parents, grandparents, and extended families in West Bengal.

### **📝 Linguistic & Grammatical Accuracy**

* In Bengali, adjectives (describing words) precede the noun.

* **Sneho (affection)** before **Ayu (life)** makes the phrase grammatically correct and natural.

* This ensures that the name sounds fluent, professional, and respectful of the language.

### **🌱 Symbolic Values**

* **Safety**: The app reassures parents that their baby’s health is being tracked and supported.

* **Warmth**: It highlights the nurturing role of parents, supported by technology.

* **Hope**: It communicates a positive future for fragile infants.

---

## **5\. Why Other Names Do Not Work**

For example: **ShehoAyu (সেহআয়ু)**

* ❌ *Sheho* is not a standard Bengali word in this context.

* ❌ It sounds like a mispronunciation of *Sneho*.

* ❌ It would create confusion and reduce trust.

* ❌ It lacks cultural and linguistic accuracy.

Thus, compared to alternatives, **SnehoAyu** is **clear, trustworthy, and emotionally strong**.

---

## **6\. Sample Taglines for Branding**

To strengthen the identity, the name can be paired with a tagline:

* **SnehoAyu: Caring for Every Precious Life**

* **SnehoAyu: Love, Care, and Safety for Your Baby**

* **SnehoAyu: Empowering Parents, Nurturing Futures**

---

## 

## **7\. Conclusion**

**SnehoAyu (স্নেহআয়ু)** is more than a name—it is a **promise of care and hope**.

* It communicates the emotional, cultural, and professional values of your app.

* It connects deeply with Bengali parents and families.

* It reflects the mission of your project: **to support parents and safeguard the lives of NICU-discharged preterm infants through love, knowledge, and technology**.

✅ **Final Recommendation:** Adopt **SnehoAyu (স্নেহআয়ু)** as the official name of your app.

# PRD

**SnehoAyu**

*স্নেহ আয়ু*

Preterm Infant Care Companion — mHealth PWA

**PRODUCT REQUIREMENTS DOCUMENT**

Version 2.0  |  June 2025  |  Final Draft

Prepared for: Purnima Chakrabortty

*Confidential — For Client, Developer & Partner Review*

**Study:** *"A Study to Evaluate the Effectiveness of a Mobile-Based M-Health Intervention (SnehoAyu App) on Clinical Outcome of Preterm Infants, Knowledge on Newborn Care, Mental Well-Being, and Self-Efficacy among Mothers at Selected Hospitals of West Bengal"*

# **Document Control**

| Field | Detail |
| :---- | :---- |
| Product Name | SnehoAyu (স্নেহ আয়ু) |
| Document Type | Product Requirements Document (PRD) |
| Version | 2.0 — Complete Edition |
| Date | June 2025 |
| Researcher | Purnima Chakrabortty |
| Study Type | Randomised Controlled Trial (RCT) |
| Platform | Progressive Web App (PWA) — Android-first |
| Languages | Bengali (primary), Hindi, English |
| Study Sites | Bankura MCH, Burdwan MCH, Purba Bardhaman (Pilot: Deban Mahato MCH, Purulia) |
| Sample Size | 272 mothers (136 study group \+ 136 control group) |
| Study Duration | 6 months post-discharge per participant |
| Document Status | Final Draft — Approved for Development |

# **1\. Executive Summary**

*SnehoAyu is both a research instrument and a care companion. It is a Progressive Web App (PWA) built to support mothers of NICU-discharged preterm infants — and simultaneously to generate measurable, peer-reviewable evidence that such digital support improves infant outcomes, maternal knowledge, mental well-being, and self-efficacy.*

India contributes over 20% of global preterm births. In West Bengal alone, the preterm birth prevalence is 16% — nearly 1 in 6 deliveries. Once a preterm infant is discharged from the NICU, families receive verbal guidance and a printed sheet. There is no structured system for daily monitoring, reminder support, danger-sign guidance, or emotional care at home. The result: high readmission rates, growth faltering, missed vaccinations, and maternal anxiety.

SnehoAyu closes this gap with a single digital companion. It is distributed through hospitals at discharge, free to parents, and requires only an Android smartphone. It works offline. It speaks Bengali.

This document is the complete specification for what must be built — covering all screens, features, data collection instruments, research workflows, technical constraints, and the phased delivery plan.

# **2\. The Research Study**

Understanding the research context is essential for every developer who works on this app. SnehoAyu is not a standalone commercial product — it is the intervention arm of a formal Randomised Controlled Trial (RCT). The app must therefore serve two roles simultaneously: a daily care tool for mothers, and a data collection platform for the researcher.

## **2.1 Study Design**

| Parameter | Detail |
| :---- | :---- |
| Design | True Experimental — Randomised Pretest–Posttest Control Group Design |
| Approach | Quantitative |
| Groups | Study Group (app) \+ Control Group (standard care only) |
| Randomisation | Stratified by birth weight: \<1500g, 1500–2500g, \>2500g. Lottery method. |
| Blinding | Data analysis blinded (done by statistician) |
| Control Group Rule | Control group data collection completed BEFORE study group begins |
| Intervention Period | 6 months post-NICU discharge per participant |
| Follow-up Points | Baseline (pre-discharge), 1 month, 3 months, 6 months post-discharge |

## **2.2 Study Sites**

| Role | Hospital |
| :---- | :---- |
| Primary Study Sites | Bankura Medical College & Hospital (Bankura) |
|  | Burdwan Medical College & Hospital (Burdwan) |
|  | Purba Bardhaman (NICU site) |
| Pilot Site | Deban Mahato Medical College & Hospital (Purulia) |

## **2.3 Measurement Schedule**

| Data Collection Point | When | What is Collected |
| :---- | :---- | :---- |
| Baseline (O1) | Before NICU discharge (app installed same day) | Demographic data, infant profile, baseline growth, baseline knowledge (MCQ), baseline WHO-5, baseline PSOC |
| Post-test 1 (O2) | 1 month after discharge | Growth, development (TDSC), immunization, breastfeeding, knowledge, WHO-5, PSOC |
| Post-test 2 (O3) | 3 months after discharge | Same as O2 |
| Post-test 3 (O4) | 6 months after discharge | Same as O2 \+ readmission record \+ full outcome summary |

## **2.4 Inclusion and Exclusion Criteria**

### **Inclusion**

* Mothers of preterm infants (born before 37 completed weeks)

* Willing to participate and available during study period

* Can read and write Bengali

* Owns or has access to an Android smartphone

* Infant admitted to NICU for at least 14 days and stable at discharge

* Infant on at least katori feeding at time of discharge

* Primigravida mother; Normal Delivery

### **Exclusion**

* Infants with major congenital anomalies or terminal illness

* Mothers who are or have a close family member who is a health professional

* Mothers with any acute illness at time of enrolment

# **3\. Users & Roles**

## **3.1 Role Overview**

| Role | Who | App Access |
| :---- | :---- | :---- |
| Mother / Caregiver | Primary participant. Mothers of NICU-discharged preterm infants. | Full parent-facing app — all care, tracking, learning, and support features |
| Researcher / Nurse | Purnima Chakrabortty and designated data collectors at each hospital. | Admin panel — enrol participants, view submitted data, manage app content, trigger follow-up reminders |
| Hospital Staff | NICU nurses who install and demonstrate the app at discharge. | Onboarding flow only — link mother to study group, generate participant code |

## **3.2 Primary User Persona — The Mother**

| Attribute | Detail |
| :---- | :---- |
| Name (representative) | Priya Devi |
| Age | 22–32 years, first-time mother |
| Location | Semi-urban or rural West Bengal |
| Language | Bengali — primary. Limited English/Hindi. |
| Device | Mid-range Android smartphone. 4G. Limited storage. |
| Digital literacy | Uses WhatsApp and YouTube. Not comfortable with complex apps. |
| Situation | Baby born 30–34 weeks. Spent 3 weeks in NICU. Discharged home. |
| Biggest fear | "My baby will fall sick again and I won't know what to do." |
| Primary need | Simple daily guidance she can follow and refer back to, in Bengali. |

# **4\. What We Are Building**

*SnehoAyu is a single Progressive Web App with two distinct interfaces: (1) a Mother App — the daily care companion parents use at home, and (2) a Researcher Panel — the backend interface Purnima Chakrabortty uses to manage the study, enrol participants, and access collected data. Both must be built in Phase 1\.*

## **4.1 Platform**

* Progressive Web App (PWA) — installable from the browser, no Play Store required

* Android Chrome primary target; must also work on Samsung Internet

* Offline-first — core features must work without internet (checklist, danger signs, saved content)

* Service Worker for caching and background sync when connection restored

* Responsive design — mobile-only layout (360px–480px viewport target)

## **4.2 Languages**

* Bengali (বাংলা) — primary language, mandatory for all UI strings and content

* Hindi — secondary, for broader reach post-study

* English — tertiary, for researcher panel and technical use

* Language preference saved per user account

* Default language: Bengali at first launch

## **4.3 In Scope — Phase 1 (This Document)**

* Complete parent-facing PWA with all care and tracking features

* All 5 research measurement tools embedded as in-app forms

* Researcher / admin panel for study management and data access

* Daily SMS text messages and weekly audio message delivery

* Telehealth video call capability (researcher to mother)

* Real authentication with OTP

* Full Bengali UI

* Offline mode

## **4.4 Out of Scope**

* Native Android or iOS app (PWA is the target)

* Integration with government HMIS / immunization databases

* Multi-baby support (twins, siblings — not required for this study)

* Payment or subscription billing

* Clinical decision support or prescription tools

* Physical device integration (smart scales, oximeters — data entered manually)

# **5\. Mother App — Feature Specifications**

This section describes every screen and feature the mother sees. For each feature: what it does, why it matters for the research, what exists in the current codebase, and what still needs to be built.

## **5.1 Onboarding & Authentication**

  **UI: Partially Complete  |  Backend: Not Started  |  Priority: P0 — Blocker**


### **What It Does**

Allows a mother to create her account and link to the study at the time of NICU discharge. The nurse installs the app and creates the account with the mother before she leaves the hospital.

### **Onboarding Flow (Step by Step)**

1. Nurse opens SnehoAyu PWA on mother's phone and taps 'Enrol New Participant'

2. Nurse enters the hospital code (pre-assigned to each study site)

3. Nurse enters mother's phone number — OTP sent via SMS

4. Mother verifies OTP and sets a simple 4-digit PIN (no password typing)

5. Mother's profile form: name, age, education, religion, income class, residence, family type

6. Infant profile form: name, birth date, gestational age, birth weight, sex, NICU duration, KMC, initial feeding method

7. Mother assigned a participant code (anonymised) — linked to study group or control group

8. App language set to Bengali by default. Option to change.

9. 2-hour training session conducted by nurse over 3 days before discharge

10. Within 7 days of discharge: phone follow-up call by researcher to confirm app is being used

### **Login / Re-entry**

* Returning login: phone number \+ 4-digit PIN

* PIN reset: OTP to registered phone number

* Session stays active for 30 days — mother does not have to log in daily

### **What Needs to Be Built**

* OTP-based phone authentication (SMS gateway — suggest MSG91 or Twilio India)

* 4-digit PIN setup and login

* Mother profile form (all demographic fields from Tool I of the proposal)

* Infant profile form (all infant fields from Tool I)

* Hospital code linking — connects mother to study site and researcher

* Participant code assignment (study vs control group randomisation handled by researcher panel)

* Session persistence (30-day active session)

## **5.2 Home Dashboard**

  **UI: Complete  |  Backend: Not Started  |  Priority: P0**


### **What It Does**

The first screen after login. A single glance at today's care status, what tasks are done, what needs attention, and what reminder is upcoming. Designed to be understood in under 5 seconds by a sleep-deprived mother.

### **Components**

* Baby status card — baby name, current age in days/weeks, adjusted age, weight from last reading

* Today's care ring — circular progress showing % of daily checklist completed

* Quick action buttons — Log Feeding, Log Temperature, Log KMC (one-tap data entry)

* Feeding summary — feeds completed today vs target

* Health stats strip — last recorded temperature, weight, SpO2

* Next vaccination reminder card — vaccine name, due date, days remaining

* Daily message card — shows today's SMS-format care tip (displayed in-app too)

### **What Needs to Be Built**

* All home cards wired to live backend data

* Quick action buttons that write readings to backend

* Dynamic vaccination countdown from immunization module

## **5.3 Daily Care Checklist**

  **UI: Complete  |  Backend: Not Started  |  Priority: P0**


### **What It Does**

A structured daily checklist of care tasks. The mother ticks each item as done. The checklist resets every day. Completion data feeds into the research outcomes and the home dashboard progress ring.

### **Default Daily Tasks**

* Breastfeeding — number of feeds and volume (8–12 times per 24 hours)

* Kangaroo Mother Care (KMC) — minimum 1–2 hours logged

* Temperature check — morning and evening (normal 36.5–37.5°C)

* Weight check — on applicable days (weekly or as advised)

* Skin and cord care

* Medication — if prescribed (customisable field)

* Danger signs self-check — prompt to review once per day

### **What Needs to Be Built**

* Backend persistence — one checklist record per day per participant

* Daily reset at midnight IST via server-side cron

* 7-day and 30-day history view — mother can see past days

* Completion rate calculation exposed to researcher panel

## **5.4 Growth Tracking**

  **UI: Partially Complete (no chart)  |  Backend: Not Started  |  Priority: P1**


### **What It Does**

Records and displays the baby's weight, length, and head circumference over time. Compared against WHO growth chart standards adjusted for the baby's corrected (gestational) age. This is a core research outcome — growth data is collected at baseline, 1 month, 3 months, and 6 months.

### **Components**

* Current measurements card — weight (g), length (cm), head circumference (cm)

* WHO z-score display — weight-for-age, length-for-age, HC-for-age

* Growth chart — line chart plotting all readings against WHO percentile bands (3rd, 15th, 50th, 85th, 97th)

* Readings history table — all past entries with date and who entered it

* Manual entry form — mother or nurse enters new reading

* Alert flag — if weight drops or z-score falls below \-2 SD (flagged for researcher)

### **Research Note**

*Growth data must use CORRECTED age (chronological age minus weeks of prematurity) for WHO chart comparison. This calculation must be automatic in the backend.*

### **What Needs to Be Built**

* Backend API to store and retrieve growth readings with timestamps

* WHO growth chart data (boys and girls, weight/length/HC, 0–6 months corrected age)

* Z-score calculation engine

* Chart rendering component (suggest Recharts or Chart.js)

* Manual entry form with validation

* Alert system for z-score \< \-2 SD

## **5.5 Developmental Milestone Tracker (TDSC)**

  **UI: Not Built  |  Backend: Not Started  |  Priority: P1**


### **What It Does**

Tracks developmental milestones using the Trivandrum Developmental Screening Chart (TDSC). This is a pass/fail screening tool used at 1, 3, and 6 month follow-ups. Failure on even one item to the left of the scale indicates suspected developmental delay.

### **TDSC Items to Be Implemented (18 items, 0–25 months)**

| Item | Developmental Task | Lower Limit | Upper Limit |
| :---- | :---- | :---- | :---- |
| 1 | Social smile | 1 day | 2 months |
| 2 | Eyes follow pen/pencil | 1m 3d | 3m |
| 3 | Holds head steady | 1m 3d | 3m 24d |
| 4 | Rolls from back to stomach | 2m 21d | 4m 24d |
| 5 | Turns head to sound of bell | 3m | 5m 24d |
| 6 | Transfer objects hand to hand | 4m 3d | 7m |
| 7 | Raises self to sitting | 5m 24d | 11m |
| 8 | Standing up by furniture | 6m 9d | 11m |
| 9 | Fine prehension (pellet) | 6m 24d | 11m |
| 10 | Pat-a-cake | 6m 24d | 12m 21d |
| 11 | Walks with help | 7m 24d | 13m |
| 12 | Throws ball | 9m 15d | 16m 24d |
| 13 | Walks alone | 9m 27d | 17m 12d |
| 14 | Says two words | 11m 6d | 19m |
| 15 | Walk backwards | 11m 6d | 19m 15d |
| 16 | Walk upstairs with help | 12m 6d | 24m 15d |
| 17 | Points to 3 parts of doll | 15m 9d | 24m 15d |
| 18 | Remove garments | 21m | 25m |

### **Screening Logic**

* App calculates corrected age and shows only the items relevant to that age range

* Each item: Pass ✓ / Fail ✗

* If any item fails that should have been passed by corrected age → flag as 'Suspected Delay'

* Result saved per assessment date and exposed in researcher panel

### **What Needs to Be Built**

* TDSC screen with item-by-item pass/fail interface

* Corrected age engine to filter relevant items

* Delay detection logic

* Assessment history view

## **5.6 Immunization Schedule & Tracker**

  **UI: Complete  |  Backend: Not Started  |  Priority: P1**


### **What It Does**

Displays the baby's complete vaccination schedule generated from birth date. Preterm infants follow the vaccination schedule based on chronological (birth) age, not corrected age. Tracks which vaccines are done and sends reminders for upcoming ones.

### **Components**

* Full vaccine schedule — all vaccines from birth to 6 months with due dates

* Completed vaccines — marked with date given, batch number (optional), given by

* Pending vaccines — sorted by due date with days remaining

* Progress bar — percentage of 6-month schedule completed

* Reminder system — in-app alert 7 days and 1 day before due date

* Vaccine detail card — what the vaccine protects against, common side effects

* Immunization status for researcher — up to date / delayed / not started

### **What Needs to Be Built**

* Schedule generation engine from birth date (IAP 2023 schedule)

* Mark-as-done form with date and optional batch number

* Reminder notification via PWA push notification

* Status export for researcher panel

## **5.7 Breastfeeding Log & Assessment**

  **UI: Not Built  |  Backend: Not Started  |  Priority: P1**


### **What It Does**

Logs daily breastfeeding data and assesses feeding patterns against the structured interview schedule from the research tool (Tool II, Section B4). This is a core research outcome measured at each follow-up.

### **Daily Log**

* Feed type: Exclusive breastfeeding / Predominantly breastfeeding / Mixed / Formula only

* Number of feeds in 24 hours

* Duration of a typical feed session

* Night feeds count

* Feeding cues practiced (yes/always / sometimes / no — fixed schedule)

### **Feeding Assessment Form (Research Tool — at 1, 3, 6 months)**

At each research follow-up, the full 8-item breastfeeding interview schedule is presented in-app:

* Question 1: Currently breastfeeding? (Exclusive / Predominantly / Mixed / Not breastfeeding)

* Question 2: Reason if not exclusive

* Question 3: Frequency per 24 hours

* Question 4: Duration of sessions

* Question 5: Night feeding frequency

* Question 6: Feeding on cues

* Question 7: Feeding problems (multi-select)

* Question 8: Expressed breast milk used?

* Question 9: Alternative feeding methods used?

Scoring: 24–28 Excellent | 18–23 Good | 12–17 Fair | ≤11 Poor

### **What Needs to Be Built**

* Daily breastfeeding quick log (from Home or Checklist)

* Full assessment form (locked to follow-up dates)

* Automated scoring and grading

* History and trend display

## **5.8 Danger Signs Guide**

  **UI: Complete  |  Backend: Not Started  |  Priority: P1**


### **What It Does**

A quick-reference guide for the mother to identify warning signs that need immediate medical attention. Expandable cards with symptoms, what to observe, and what to do. One tap calls the hospital helpline.

### **Danger Signs Covered**

* Breathing difficulty or fast breathing (\>60 breaths/min)

* Blue lips or fingertips (cyanosis)

* Temperature below 36.5°C or above 38°C

* Refusing to feed or unable to feed

* Lethargic, floppy, or unresponsive

* Convulsions or seizures

* Jaundice spreading below the navel

* Sunken fontanelle

* Significant weight loss or no weight gain

* Redness or discharge from umbilical cord stump

### **What Needs to Be Built**

* Emergency call button wired to hospital helpline (configured per hospital in admin panel)

* Bengali translation of all danger sign descriptions

* Deep-link from Learning Hub

## **5.9 Knowledge Assessment — 15-Question MCQ (Research Tool III)**

  **UI: Not Built  |  Backend: Not Started  |  Priority: P0 — Research Instrument**


### **What It Does**

The 15-question multiple-choice knowledge test from Tool III of the research proposal. Administered at baseline and all three follow-up points. This is a PRIMARY research outcome.

*This is not a quiz for fun — it is a validated research instrument. The questions and answer options must be implemented EXACTLY as specified in the proposal. No rewording.*

### **The 15 Questions**

| Q | Topic | Correct Answer |
| :---- | :---- | :---- |
| 1 | How to know baby gets enough milk | Baby pees \>6 times/day |
| 2 | How to keep preterm baby warm | Kangaroo Care (skin-to-skin) |
| 3 | Baby suddenly refuses to feed | Could be an emergency |
| 4 | Duration of exclusive breastfeeding | 6 months |
| 5 | Which is NOT a danger sign | Baby pees 8–10 times/day |
| 6 | When to start breastfeeding after birth | Within 1 hour |
| 7 | Definition of preterm birth | Born before 8 months (37 weeks) |
| 8 | Who advises vaccination schedule | Doctor or health worker |
| 9 | Umbilical cord care | Keep clean and dry |
| 10 | Daily KMC duration | 1–2 hours minimum |
| 11 | Keeping baby warm at home | Skin-to-skin contact |
| 12 | Major risk for preterm babies | Hypothermia (low body temp) |
| 13 | Why preterm babies stay longer | Not learned to feed/breathe |
| 14 | Baby vomits often — what to do | Consult a doctor |
| 15 | Baby feels very hot — what to do | Consult a doctor |

### **Scoring**

* 1 mark per correct answer. Total: 15 marks.

* Poor Knowledge: 0–5 (0–33%)

* Moderate Knowledge: 6–10 (34–66%)

* Good Knowledge: 11–15 (73–100%)

### **Administration Rules**

* Presented as interview-style form (nurse asks, mother answers — or mother self-completes if literate)

* Administered at: Baseline, 1 month, 3 months, 6 months

* All 4 scores stored per participant and exported in researcher panel

* Form locked after submission at each time point — cannot be re-taken

## **5.10 Mental Well-Being Assessment — WHO-5 Index (Research Tool IV)**

  **UI: Not Built  |  Backend: Not Started  |  Priority: P0 — Research Instrument**


### **What It Does**

The validated WHO-5 Well-Being Index. Measures the mother's mental well-being over the past two weeks. This is a PRIMARY research outcome administered at all four time points.

### **The 5 Questions**

| \# | Statement | Scale |
| :---- | :---- | :---- |
| 1 | I have felt cheerful and in good spirits | 0 (At no time) → 5 (All of the time) |
| 2 | I have felt calm and relaxed | 0 → 5 |
| 3 | I have felt active and vigorous | 0 → 5 |
| 4 | I woke up feeling fresh and rested | 0 → 5 |
| 5 | My daily life has been filled with interesting things | 0 → 5 |

### **Scoring**

* Raw score: sum of all 5 answers (range 0–25)

* Percentage score: raw score × 4 (range 0–100)

* Score \< 50% (raw \< 13): Poor mental well-being — flag for researcher attention

* Score ≥ 50%: Good mental well-being

### **Implementation Rules**

* 6-point radio scale per question with Bengali labels

* Score auto-calculated and displayed to mother with simple interpretation

* Administered at: Baseline, 1 month, 3 months, 6 months

* Full score history stored and exported to researcher panel

* If score \< 50%: gentle in-app message encouraging her to contact the researcher

## **5.11 Self-Efficacy Assessment — PSOC Scale (Research Tool V)**

  **UI: Not Built  |  Backend: Not Started  |  Priority: P0 — Research Instrument**


### **What It Does**

The Parenting Sense of Competence Scale (PSOC), developed by Gibaud-Wallston & Wandersman (1978). Measures the mother's self-efficacy and satisfaction in caring for her preterm infant. PRIMARY research outcome, administered at all four time points.

### **The 17 Items**

| Item | Statement (Summary) | Scoring |
| :---- | :---- | :---- |
| 1 | Problems of child care are easy once you understand your child | Direct |
| 2 | Frustrated now while child is at this age | Reverse |
| 3 | Go to bed same as wake up — not accomplished much | Reverse |
| 4 | Feel like I'm being manipulated when I should be in control | Reverse |
| 5 | My mother was better prepared than I am | Reverse |
| 6 | I would be a fine model for a new mother | Direct |
| 7 | Being a parent is manageable, problems easily solved | Direct |
| 8 | Difficult not knowing if you're doing a good or bad job | Reverse |
| 9 | Sometimes I feel I'm not getting anything done | Reverse |
| 10 | I meet my personal expectations for caring for my child | Direct |
| 11 | If anyone can find the answer for my child, I am the one | Direct |
| 12 | My talents and interests are in other areas, not parenting | Reverse |
| 13 | I feel thoroughly familiar with this role | Direct |
| 14 | If parenting were more interesting, I'd be more motivated | Reverse |
| 15 | I have all the skills necessary to be a good mother | Direct |
| 16 | Being a parent makes me tense and anxious | Reverse |
| 17 | Being a good mother is a reward in itself | Direct |

### **Scoring**

* 6-point Likert scale: 1 \= Strongly Disagree → 6 \= Strongly Agree

* Reverse-scored items: 2, 3, 4, 5, 8, 9, 12, 14, 16 (score becomes: 6→1, 5→2, 4→3, 3→4, 2→5, 1→6)

* Two subscales: Efficacy (items 1,6,7,10,11,13,15,17) | Satisfaction (items 2,3,4,5,8,9,12,14,16)

* Grading: High ≥ Median \+ 1SD | Average \= Median ± 1SD | Low ≤ Median − 1SD

### **Implementation Rules**

* Presented as 17-item 6-point scale in Bengali

* Reverse scoring handled automatically in backend — mother selects naturally

* Both subscale scores and total score stored

* Administered at: Baseline, 1 month, 3 months, 6 months

* Full score history stored and exported

## **5.12 Learning Hub**

  **UI: Partially Complete  |  Backend: Not Started  |  Priority: P1**


### **What It Does**

A library of care guidance content for mothers. Short articles and videos on feeding, KMC, growth, danger signs, and emotional support. Available in Bengali (primary), Hindi, and English.

### **Content Categories**

* Feeding & Breastfeeding — latching, expressed milk, feeding cues, when to worry

* Kangaroo Mother Care (KMC) — how to, duration, benefits

* Growth & Development — what to expect, how to measure, adjusted age

* Danger Signs — what to watch for and when to call (links to Danger Signs screen)

* Emotional Support — coping with anxiety, bonding, asking for help

* Immunization — what each vaccine is for, schedule, side effects

### **Content Requirements**

* All content medically reviewed and approved by Purnima Chakrabortty before launch

* Maximum 3 minutes to read or watch per card

* Available in Bengali — all text and audio narration

* Culturally appropriate imagery

* Weekly spotlight card — rotates to highlight a timely topic

### **What Needs to Be Built**

* Content database / CMS (even a simple JSON-based CMS is acceptable for Phase 1\)

* Language toggle — Bengali / Hindi / English per user preference

* Content detail view when card is tapped

* Read/viewed tracking per participant (research engagement metric)

## **5.13 Daily SMS & Weekly Audio Messages**

  **UI: Not Built  |  Backend: Not Started  |  Priority: P1 — Mandated by Study**


*This feature is explicitly required by the research proposal: 'Send a text message daily and an audio message weekly.' It is not optional.*

### **Daily SMS / Text Message**

* One care tip or reminder sent to mother's phone every day via SMS

* Message content: rotation of care tips, check reminders, motivational messages

* All messages in Bengali

* Also displayed as a card on the Home Dashboard (in-app version)

* Message log — mother can scroll back to see past messages in-app

* SMS gateway: MSG91 or similar India-based provider

### **Weekly Audio Message**

* One audio message sent weekly — approximately 2–3 minutes

* Content: weekly care topic, recorded by Purnima Chakrabortty or a trusted nurse voice

* Delivered as an in-app notification with audio player

* Stored in-app so playable offline

* Topics follow the study timeline (Week 1: KMC basics, Week 2: Feeding cues, etc.)

### **What Needs to Be Built**

* SMS gateway integration for daily text messages

* Message content library (minimum 180 unique daily messages for 6-month period)

* Weekly audio message file hosting and delivery

* In-app notification for weekly audio

* Message history screen in app

## **5.14 Telehealth — Video Call with Researcher**

  **UI: Not Built  |  Backend: Not Started  |  Priority: P1 — Mandated by Study**


*Explicitly required by the proposal: 'Weekly video call to each participant if needed' and 'Video calls with parents if needed — provide ongoing guidance.'*

### **What It Does**

Allows Purnima Chakrabortty (or a designated researcher) to initiate a video call with a study participant directly from the researcher panel. The mother receives a push notification and taps to join.

### **Functionality**

* Researcher initiates call from admin panel — selects participant, taps 'Video Call'

* Mother receives PWA push notification: 'Purnima Chakrabortty is calling. Tap to join.'

* Mother taps notification — opens in-app video call screen

* Call ends when either party disconnects

* Call log stored: date, time, duration, participant code

### **Technical Implementation Options**

* Option A: Daily.co or Whereby — embeddable video SDK, free tier available

* Option B: Jitsi Meet — open source, self-hostable, no per-minute cost

* Option C: Simple WhatsApp call link (lowest tech — researcher taps pre-formed WhatsApp link per participant's number)

*Recommendation: Start with Option C (WhatsApp call link from admin panel) for the pilot. Upgrade to Option A or B if scaling.*

## **5.15 Support & Emergency Access**

  **UI: Partially Complete  |  Backend: Not Started  |  Priority: P1**


### **Components**

* Emergency call button — one tap dials the hospital NICU helpline (number per hospital, set in admin panel)

* Contact researcher button — triggers a request to the researcher for a callback

* Community peer posts — read-only view of moderated posts from other mothers (Phase 1: static/curated posts only)

### **What Needs to Be Built**

* Emergency call number configuration in admin panel (per hospital)

* Callback request notification to researcher panel

## **5.16 Profile & Settings**

  **UI: Complete  |  Backend: Not Started  |  Priority: P2**


### **Components**

* Mother profile summary — name, phone, hospital, study participant code

* Baby details — name, birth date, gestational age, adjusted age, discharge date

* Activity stats — days active, tasks completed, content viewed, weeks of care

* Badge gallery — earned for consistency milestones (7 days active, first vaccination logged, etc.)

* Settings — language preference, notification preferences, PIN change, logout

* App version and study information

# **6\. Researcher / Admin Panel**

*The researcher panel is NOT optional for Phase 1\. Without it, Purnima Chakrabortty cannot enrol participants, manage the study, access collected data, or conduct follow-ups. It must be built alongside the mother app.*

## **6.1 Access & Authentication**

* Separate login from mother app — email \+ password (researcher only)

* Role-based access: Researcher (full access) | Hospital Nurse (enrolment only)

* Accessible on desktop browser — researcher uses this from a hospital computer

## **6.2 Participant Management**

* Enrol new participant — create account, assign to study or control group, generate participant code

* Participant list — all enrolled mothers with code, site, group, status

* Participant detail view — full profile, all collected data, last activity

* Stratification — filter by birth weight stratum (\<1500g / 1500–2500g / \>2500g)

* Flag participants who have missed a follow-up or not opened app in 7 days

## **6.3 Data Collection Access**

Researcher can view all submitted data per participant per time point:

* Demographic and infant profile (Tool I)

* Growth measurements and z-scores (Tool II B1)

* TDSC developmental assessment results (Tool II B2)

* Immunization and readmission records (Tool II B3)

* Breastfeeding assessment scores (Tool II B4)

* Knowledge MCQ scores at baseline, 1m, 3m, 6m (Tool III)

* WHO-5 mental well-being scores at all 4 time points (Tool IV)

* PSOC self-efficacy scores at all 4 time points (Tool V)

## **6.4 Data Export**

* Export all participant data as Excel (.xlsx) — one row per participant per time point

* Export format compatible with SPSS and Excel for statistical analysis

* Includes all raw scores, calculated scores, z-scores, and demographic variables

* Blinding-ready: option to export with participant codes only (no names)

## **6.5 Communication Tools**

* Video call initiation — select participant, tap to call (WhatsApp link or embedded video)

* SMS message scheduler — set message content and delivery schedule

* Weekly audio message upload — upload audio file, schedule delivery date

* Bulk notification — send announcement to all active participants

## **6.6 Hospital Management**

* Add hospital — name, code, site supervisor, emergency helpline number

* Assign nurse accounts to hospital

* View per-hospital participant counts and compliance rates

# **7\. Feature Status Summary**

| Feature | Module | UI Built | Backend | Priority |
| :---- | :---- | :---- | :---- | :---- |
| Authentication (OTP \+ PIN) | Mother App | Partial | No | P0 — Blocker |
| Mother & Infant Profile Forms | Mother App | Partial | No | P0 — Blocker |
| Home Dashboard | Mother App | Complete | No | P0 |
| Daily Care Checklist | Mother App | Complete | No | P0 |
| Knowledge MCQ — Tool III | Research Tool | No | No | P0 — Research |
| WHO-5 Well-Being — Tool IV | Research Tool | No | No | P0 — Research |
| PSOC Self-Efficacy — Tool V | Research Tool | No | No | P0 — Research |
| Growth Tracking \+ WHO Chart | Mother App | Partial | No | P1 |
| TDSC Developmental Assessment | Research Tool | No | No | P1 |
| Immunization Schedule \+ Reminders | Mother App | Complete | No | P1 |
| Breastfeeding Log \+ Assessment | Mother App | No | No | P1 |
| Danger Signs Guide | Mother App | Complete | No | P1 |
| Learning Hub (Content) | Mother App | Partial | No | P1 |
| Daily SMS Messages | Mother App | No | No | P1 |
| Weekly Audio Messages | Mother App | No | No | P1 |
| Telehealth Video Call | Mother App | No | No | P1 |
| Researcher / Admin Panel — All features | Admin Panel | No | No | P1 |
| Bengali Language (full UI) | Mother App | No | No | P1 |
| Offline Mode (Service Worker) | Mother App | No | No | P1 |
| Profile & Settings | Mother App | Complete | No | P2 |
| Badge System | Mother App | Partial | No | P2 |

# **8\. Key User Flows**

## **8.1 Participant Enrolment Flow (Nurse \+ Mother at Hospital)**

11. Nurse logs into researcher panel on hospital computer or phone

12. Taps 'Enrol New Participant' — enters hospital code

13. Opens SnehoAyu PWA on mother's Android phone

14. Enters mother's phone number — OTP sent

15. Mother enters OTP and creates 4-digit PIN

16. Nurse/mother completes demographic proforma (Tool I) — mother profile \+ infant profile

17. System assigns participant code and group (study / control) based on randomisation list

18. Baseline data collected — growth measurements, knowledge MCQ, WHO-5, PSOC — all entered by nurse

19. App language confirmed as Bengali

20. 2-hour training session conducted. Nurse demonstrates all main features.

21. Mother goes home. App installed on her phone.

22. Researcher calls mother within 7 days to confirm app use

## **8.2 Daily Care Flow (Mother at Home)**

23. Morning: opens app — Home shows today's progress ring and any new message

24. Reads daily SMS care tip shown as card on Home

25. Taps 'Log Feeding' — enters feed type and count

26. Taps 'Log Temperature' — enters reading; app shows if normal or flagged

27. Throughout day: ticks checklist items as completed

28. Evening: views feeding summary and progress ring update

29. Weekly: opens audio message notification, listens to weekly care talk

## **8.3 Follow-Up Data Collection Flow (1, 3, 6 Months)**

30. Nurse or researcher meets mother at hospital follow-up visit

31. Opens researcher panel and selects participant

32. Takes physical measurements — weight, length, head circumference — enters in app

33. Administers TDSC developmental screening — enters pass/fail per item

34. Reviews immunization record and marks completed vaccines

35. Enters breastfeeding assessment data (Tool II B4)

36. Mother self-completes (or nurse assists) MCQ, WHO-5, and PSOC forms in app

37. All data auto-saved and timestamped

38. Researcher can download updated dataset from admin panel at any time

## **8.4 Emergency Flow (Mother at Home)**

39. Mother notices baby has fast breathing

40. Opens Danger Signs screen (accessible from bottom nav without login)

41. Taps 'Breathing Difficulty' — reads Bengali guidance

42. Taps large red 'Call Hospital' button — phone dialer opens with pre-filled NICU helpline number

# **9\. Technical Requirements**

## **9.1 Frontend**

* Framework: React with TypeScript (existing codebase)

* Styling: Tailwind CSS \+ shadcn/ui component library (existing)

* Routing: React Router with protected routes (existing)

* PWA: manifest.json, service worker (Workbox recommended), installability

* Offline caching: checklist state, danger signs content, last week's messages

* Background sync: data entered offline synced when connection restored

* i18n: react-i18next for Bengali / Hindi / English string management

* Charts: Recharts or Chart.js for WHO growth chart visualisation

## **9.2 Backend**

* REST API — Node.js (Express) or Python (FastAPI) recommended

* Database: PostgreSQL — structured relational data required for research dataset integrity

* Authentication: JWT with refresh tokens; OTP via SMS gateway

* File storage: AWS S3 or equivalent for audio message files

* SMS gateway: MSG91 (India) for OTP and daily messages

* Video calls: WhatsApp deep link (Phase 1\) or Daily.co SDK

* Multi-tenancy: all data scoped per hospital and per participant

## **9.3 Hosting**

* Cloud hosting: AWS, GCP, or Azure — India region preferred for data residency

* Separate environments: Development | Staging | Production

* HTTPS enforced — required for PWA service worker

* Automated backups: daily database backup retained for 30 days

## **9.4 Performance**

* First Contentful Paint: under 3 seconds on 4G

* Lighthouse PWA score: \> 90

* Total initial bundle: \< 500KB gzipped

* All images served as WebP with responsive sizing

## **9.5 Browser Support**

* Android Chrome 90+ — primary target

* Samsung Internet 14+ — secondary

* Safari iOS 15+ — tertiary

* No Internet Explorer support required

# **10\. Non-Functional Requirements**

## **10.1 Security**

* All API endpoints require authentication — no unauthenticated data access

* Research data encrypted at rest (AES-256) and in transit (TLS 1.3)

* Participant codes used in data export — no names in exported research dataset

* OWASP Top 10 review required before production launch

* No third-party analytics that collect health data (no Google Analytics on research screens)

## **10.2 Data Privacy — DPDPA 2023**

* Explicit informed consent collected digitally at account creation

* Participants can request deletion of personal data at any time

* Research data retained for minimum 5 years post-study (institutional requirement)

* Data shared with hospital partners is anonymised (participant codes only)

## **10.3 Availability**

* Target uptime: 99.5% for all mother-facing API endpoints

* Maintenance windows: 2 AM – 4 AM IST only (minimum disruption)

* Graceful degradation: if API is down, app must still work offline

## **10.4 Accessibility**

* WCAG 2.1 AA compliance for all core screens

* Minimum touch target: 48×48px (critical for anxious parents with shaking hands)

* Font size: minimum 16px for body text

* Colour contrast: minimum 4.5:1 for all text

* Audio messages must have a transcript available (accessibility \+ literacy)

# **11\. Build Phases & Delivery Plan**

*Total estimated build: 18 weeks from project kickoff to pilot launch. The pilot at Deban Mahato MCH, Purulia must be completed before main study enrolment begins at the three primary sites.*

| Phase | Duration | Deliverables |
| :---- | :---- | :---- |
| Phase 1AFoundation | Weeks 1–4 | Real OTP authentication \+ PIN login. Mother and infant profile forms (Tool I). Backend API scaffold with all data models. Researcher panel: login, enrolment, participant list. |
| Phase 1BCore Care \+ Research Tools | Weeks 5–9 | Home dashboard wired to live data. Daily checklist with persistence. Knowledge MCQ (Tool III) in-app. WHO-5 Well-Being (Tool IV) in-app. PSOC Self-Efficacy (Tool V) in-app. All 3 research forms with scoring, history, and export. |
| Phase 1CHealth Tracking | Weeks 10–13 | Growth tracking with WHO chart and z-scores. TDSC developmental assessment. Immunization schedule \+ mark-as-done. Breastfeeding log \+ assessment form. Danger signs with live emergency call. |
| Phase 1DCommunication \+ Content | Weeks 14–16 | Daily SMS integration (MSG91). Weekly audio message delivery. Telehealth video call (WhatsApp link). Learning hub with Bengali content. Support screen with emergency call and callback request. |
| Phase 1EPWA \+ Localisation \+ Polish | Weeks 17–18 | Full Bengali UI (all strings). Service worker \+ offline mode. PWA manifest \+ installability. Performance audit. Security review. Researcher panel: data export to Excel/SPSS. Pilot launch at Purulia. |

## **11.1 Post-Pilot**

* Pilot runs for 4–6 weeks at Deban Mahato MCH with \~20 participants

* Researcher and developer review: bugs, UX issues, missing data fields

* Bengali content review and corrections

* Main study enrolment begins at Bankura, Burdwan, Purba Bardhaman

# **12\. Open Questions for Client Decision**

| \# | Question | Why It Matters | Owner | Status |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Should the PSOC and WHO-5 forms be self-completed by the mother or entered by the nurse at the follow-up visit? | Affects UI design — self-complete needs simpler Bengali UX; nurse-entry can be more clinical. | Purnima Chakrabortty | Open |
| 2 | Is randomisation to study/control group done manually by the researcher before enrolment, or should the app handle it automatically? | Determines complexity of enrolment flow in admin panel. | Purnima Chakrabortty | Open |
| 3 | What is the approved Bengali translation for all 15 MCQ questions and the PSOC items? Who validates it? | Cannot build Bengali forms without validated translations. | Purnima Chakrabortty \+ Language Expert | Open |
| 4 | Who will create the weekly audio message content and record the audio files? | Must be scheduled into study preparation timeline. | Purnima Chakrabortty | Open |
| 5 | Who manages the daily SMS content library (180+ messages for 6 months)? | Large content task — needs assignment before dev starts. | Purnima Chakrabortty | Open |
| 6 | Should the telehealth be WhatsApp-based (simple, no dev) or an in-app video call? | Affects development time and cost significantly. | Purnima Chakrabortty | Open |
| 7 | Is DPDPA 2023 (India data privacy law) compliance formally required by the hospital IRBs? | Legal requirement may affect data storage architecture. | Institutional IRB | Open |
| 8 | What statistical software will be used for analysis — SPSS or R? What exact column format is needed for export? | Data export format must match analysis software expectations. | Statistician | Open |
| 9 | Should the control group mothers have any access to the app? (The proposal says standard care only — confirming no app access.) | Defines whether one codebase or two apps are needed. | Purnima Chakrabortty | Open |

# **13\. Existing Codebase Reference**

The following components are already built in the current frontend. Developers can treat these as the base to extend.

| Area | Files / Components | Notes |
| :---- | :---- | :---- |
| Routing & Auth | src/App.tsx, src/lib/auth.tsx, src/lib/use-auth.ts | Auth is localStorage stub — replace with real OTP \+ JWT backend |
| Pages | Login, Index, Checklist, Growth, Learn, Support, DangerSigns, Immunization, Profile | All pages exist; all data is mocked |
| Dashboard Components | src/components/dashboard/\* | UI complete; wire to backend API |
| Layout | AppLayout, DesktopSidebar, MobileHeader, MobileSidebar, BottomNavigation | Complete — keep as is |
| UI Library | src/components/ui/\* (shadcn/ui primitives) | Complete — reuse across all new screens |
| Toasts & Hooks | src/hooks/use-toast.ts, use-mobile.ts | Complete |
| Not yet built | TDSC screen, Breastfeeding screen, MCQ form, WHO-5 form, PSOC form, Researcher panel, Audio player, SMS history | Build from scratch using existing UI library |

Note for developers: The UI shell (navigation, layout, component library, routing) is production-ready. The primary work remaining is: (1) building the missing feature screens, (2) connecting all screens to a real backend API, and (3) implementing Bengali internationalisation.

# **14\. Document Sign-Off**

| Role | Name |
| :---- | :---- |
| Research  | Purnima Chakrabortty |
| Lead Developer | Antik Mondal |
| Project Manager | Antik Mondal |

*SnehoAyu PRD v2.0  |  Confidential  |  June 2025  |  For Client, Developer & Partner Review*

# Onboarding Flow & Database Schema

**SnehoAyu**

*স্নেহ আয়ু*

**Step 1 — Onboarding Flow & Database Schema**

Foundation document before development begins

Version 1.0  |  June 2025

Prepared for: Development Team

*This document covers: (A) Complete Login & Signup Flow with Language Selection  |  (B) Full Database Schema for all 4 system entities*

# **Part A — Onboarding & Login Flow**

This section describes every screen a mother or nurse sees from the moment they open the app for the first time, all the way to landing on the Home Dashboard. Developers should treat this as the exact specification for building these screens.

## **A.1 First Launch — Language Selection Screen**

  **Screen: /language-select  |  Who sees it: Everyone on first open  |  Required: Yes**


This is the very first screen when the app is opened for the first time on any phone. Before anything else, the user picks their language. This setting is saved to the device and used for all app text going forward.

### **What the Screen Shows**

* SnehoAyu logo and Bengali name স্নেহ আয়ু centred at top

* Tagline in all 3 languages: 'Your baby's care companion' / 'আপনার শিশুর যত্নের সঙ্গী' / 'आपके शिशु की देखभाल का साथी'

* 3 large tappable language buttons — one per language

| Button | Language Label | Sub-label | Stores As |
| :---- | :---- | :---- | :---- |
| Button 1 | বাংলা | Bengali | lang \= 'bn' |
| Button 2 | हिंदी | Hindi | lang \= 'hi' |
| Button 3 | English | English | lang \= 'en' |

### **Behaviour**

* User taps a language — it is saved to localStorage as preferred\_language

* On ALL future app opens, language selection is skipped — app opens in saved language

* Language can be changed later from Profile → Settings

* After selecting language — user is taken to the Welcome / Splash screen

*Developer note: Use react-i18next. All UI strings must have keys in bn.json, hi.json, en.json. Bengali (bn) is the default if no language is saved.*

## **A.2 Welcome Screen**

  **Screen: /welcome  |  Who sees it: First-time users after language select**


### **What the Screen Shows**

* SnehoAyu logo

* Headline (in selected language): 'Supporting you and your baby after NICU discharge'

* 3 small feature highlights with icons: Daily Care Guide | Growth Tracking | Danger Signs

* Two buttons: 'Create Account' (primary, filled) and 'I Already Have an Account' (secondary, outlined)

### **Behaviour**

* 'Create Account' → goes to A.3 Phone Number Entry (signup)

* 'I Already Have an Account' → goes to A.6 Returning Login

* This screen is NEVER shown again after the first login — returning users go directly to login

## **A.3 Signup — Step 1: Phone Number Entry**

  **Screen: /signup/phone  |  Who sees it: New mothers only**


### **What the Screen Shows**

* Heading: 'Enter your mobile number'

* Subtext: 'We will send you a verification code by SMS'

* Phone number input field — numeric keyboard, auto-prefixes \+91 (India)

* 'Send OTP' button — disabled until 10 digits entered

* Small text: 'Your number will only be used for login and study communication'

### **Validation**

| Rule | Behaviour |
| :---- | :---- |
| Must be exactly 10 digits | Show inline error: 'Please enter a valid 10-digit mobile number' |
| Number already registered | Show: 'This number already has an account. Did you mean to log in?'  \+ link to login |
| SMS send fails | Show: 'Could not send SMS. Please check your number or try again.' |

### **On 'Send OTP' tap**

* API call: POST /auth/send-otp  { phone: '9XXXXXXXXX' }

* Backend sends 6-digit OTP via SMS (MSG91 gateway)

* OTP is valid for 10 minutes

* User is navigated to A.4 OTP Verification screen

* Phone number is passed forward as state — not re-entered

## **A.4 Signup — Step 2: OTP Verification**

  **Screen: /signup/verify-otp  |  Who sees it: After phone number entry**


### **What the Screen Shows**

* Heading: 'Enter the 6-digit code'

* Subtext: 'Sent to \+91 XXXXXX1234' (last 4 digits shown)

* 6 individual digit input boxes (OTP style) — auto-advances focus

* Countdown timer: 'Resend in 02:34'

* 'Resend OTP' link — active after 3 minutes

* 'Verify' button

### **Behaviour**

| Scenario | Behaviour |
| :---- | :---- |
| Correct OTP entered | Navigate to A.5 PIN creation |
| Wrong OTP | Show: 'Incorrect code. X attempts remaining.' (3 attempts max) |
| 3 wrong attempts | Lock for 30 minutes. Show countdown. |
| OTP expired (\>10 min) | Show: 'Code has expired. Please request a new one.' |
| Resend OTP tapped | Re-send OTP. Reset countdown. Show: 'New code sent.' |

## **A.5 Signup — Step 3: Create 4-Digit PIN**

  **Screen: /signup/create-pin  |  Who sees it: After OTP verified**


A 4-digit PIN is used instead of a password because mothers may have low literacy or small screens. It is fast to enter and easy to remember.

### **What the Screen Shows**

* Heading: 'Create a 4-digit PIN'

* Subtext: 'You will use this to open the app'

* 4 PIN input dots (not digits shown — masked)

* Numeric keypad on screen

* After entering 4 digits: screen changes to 'Confirm your PIN'

* User enters PIN again to confirm

* 'Set PIN' button appears after confirmation entry

### **Validation**

* If confirm PIN does not match: 'PINs do not match. Please try again.' — clears both fields

* Do not allow: 0000, 1234, 1111 (too simple — show warning but allow user to proceed)

* PIN is hashed (bcrypt) before storing — never stored in plain text

## **A.6 Returning User — Login Screen**

  **Screen: /login  |  Who sees it: Mothers who already have an account**


### **What the Screen Shows**

* SnehoAyu logo (small, top)

* Heading: 'Welcome back'

* Phone number input (same as A.3)

* 'Continue' button

* On phone verified: shows 4-dot PIN entry with on-screen numeric keypad

* 'Forgot PIN?' link below keypad

### **Login Flow**

1. User enters phone number → taps Continue

2. Backend checks if phone exists → if yes, show PIN screen

3. User enters 4-digit PIN

4. Backend verifies PIN hash → issues JWT access token (24 hours) \+ refresh token (30 days)

5. User navigated to Home Dashboard

6. Session stays active 30 days — user does not log in again unless they log out manually

### **Forgot PIN Flow**

7. User taps 'Forgot PIN?'

8. OTP sent to registered phone number

9. User verifies OTP → goes to A.5 PIN creation flow to set new PIN

10. Old PIN invalidated immediately

*Security note: After 5 wrong PIN attempts, account is locked for 30 minutes. Show a countdown. Send SMS alert to the phone number: 'Someone tried to log into your SnehoAyu account.'*

## **A.7 Signup — Step 4: Mother Profile Form**

  **Screen: /signup/mother-profile  |  Who fills it: Nurse \+ Mother together at hospital**


This screen collects all demographic data for Tool I of the research proposal. It is filled once during hospital onboarding. The nurse sits with the mother and enters this together. All fields are required unless marked optional.

### **Form Fields — Mother Information**

| Field | Type | Options / Validation | Required |
| :---- | :---- | :---- | :---- |
| Parent's Name | Text input | Free text. Note: stored separately from participant code for privacy | Optional |
| Age | Dropdown | Below 18 / 18–25 / 26–30 / 31–35 / 36–40 / Above 40 | Yes |
| Mother's Education | Dropdown | No formal education (can sign) / Primary (up to 5th) / Secondary (6th–10th) / Higher Secondary / Graduate / Postgraduate+ | Yes |
| Father's Education | Dropdown | Same options as mother | Yes |
| Mother's Occupation | Dropdown | Homemaker / Govt Service / Private Service / Business / Daily Labour / Other (text) | Yes |
| Father's Occupation | Dropdown | Unemployed / Govt Service / Private Service / Business / Daily Labour / Other (text) | Yes |
| Monthly Family Income | Dropdown | Class I: ₹9414+ / Class II: ₹4707–9413 / Class III: ₹2824–4706 / Class IV: ₹1412–2823 / Class V: Below ₹1412 | Yes |
| Type of Family | Radio | Nuclear / Joint / Extended | Yes |
| Number of Family Members | Dropdown | 3 / 5 / Other (number) | Yes |
| Religion | Dropdown | Hindu / Muslim / Christian / Other (text) | Yes |
| Area of Residence | Radio | Urban / Rural / Semi-urban | Yes |
| Contact Number | Tel input | 10-digit mobile (may be different from login number) | Optional |
| Education received about preterm care | Radio | Yes / No | Yes |
| If yes — source of information | Multi-select | Health workers / Family members / Peer group / Workshop / Magazine | Conditional |

## **A.8 Signup — Step 5: Infant Profile Form**

  **Screen: /signup/baby-profile  |  Who fills it: Nurse at hospital using NICU records**


This screen collects the baby's clinical data. Most of it comes directly from the NICU discharge record — the nurse reads it from the file and enters it. This data is used throughout the app for age calculations, WHO chart comparisons, and vaccination scheduling.

### **Form Fields — Infant Information**

| Field | Type | Options / Validation | Used For |
| :---- | :---- | :---- | :---- |
| Infant's Name / Code | Text | Free text. Code auto-generated separately | Display only |
| Date of Birth | Date picker | Cannot be future date | Age & corrected age calculation |
| Sex | Radio | Male / Female | WHO chart (different charts per sex) |
| Gestational Age at Birth | Number | 24–36 weeks. Decimals allowed (e.g. 32.5) | Corrected age \= chrono age − (40 − GA) weeks |
| Birth Weight | Number | Grams. 400–4000g range | Baseline growth data |
| Current Weight at Discharge | Number | Grams | First growth reading |
| Place of Delivery | Radio | Hospital / Home | Profile data |
| NICU / SNCU Stay Duration | Number | Days (1–120) | Baseline severity indicator |
| Skin-to-skin contact at birth (KMC) | Radio | Yes / No | Baseline KMC data |
| KMC provided in NICU | Radio | Provided / Not Provided | Baseline data |
| Feeding Type at Discharge | Dropdown | Exclusively breastfed / Exclusively formula / Mixed feeding | Baseline feeding data |
| Cried after birth | Radio | Yes / No | Baseline clinical data |
| Need of Resuscitation | Radio | Yes / No | Baseline clinical data |

*CRITICAL: Gestational Age drives two key calculations: (1) Corrected Age \= Chronological Age − (40 − Gestational Age at Birth) weeks — used for WHO growth chart and TDSC. (2) Vaccination schedule — uses CHRONOLOGICAL age (birth date), NOT corrected age. Both must be implemented in backend on account creation.*

## **A.9 Signup — Step 6: Hospital Code Entry**

  **Screen: /signup/hospital-code  |  Who enters it: Nurse**


### **What the Screen Shows**

* Heading: 'Enter Hospital Code'

* Subtext: 'This code was provided by your study coordinator'

* 4–6 character code input field (uppercase)

* 'Confirm' button

### **Behaviour**

| Scenario | Behaviour |
| :---- | :---- |
| Valid code entered | Mother's account is linked to that hospital. Hospital name shown: 'Linked to Bankura Medical College'. Proceed. |
| Invalid code | Show: 'Invalid hospital code. Please check with your nurse.' |
| Code correct but study enrolment closed | Show: 'Enrolment for this study site is currently closed. Contact Purnima Chakrabortty.' |

## **A.10 Signup — Step 7: Participant Code & Group Assignment**

  **Screen: No UI shown to mother — handled by researcher panel**


After the hospital code is verified, the system auto-generates a participant code. The group assignment (study group or control group) is determined by the researcher in the admin panel — NOT by the app automatically. This preserves research integrity.

### **Participant Code Format**

| Component | Example | Meaning |
| :---- | :---- | :---- |
| Hospital prefix | BNK | Bankura Medical College |
| Group prefix | S or C | S \= Study group, C \= Control group |
| Sequential number | 042 | 42nd participant enrolled at this site |
| Full code | BNK-S-042 | Bankura, Study group, participant 42 |

*The researcher assigns the group (S or C) in the admin panel before the nurse starts the signup flow. The app* Purnima Chakrabortty*.*

## **A.11 Signup — Step 8: Confirm Language Preference**

  **Screen: /signup/confirm-language  |  Shown only during signup**


### **What the Screen Shows**

* Heading: 'Choose your preferred language for the app'

* Subtext: 'All daily tips, care guides, and alerts will appear in this language'

* 3 language options (same as A.1) — currently selected one is pre-highlighted

* 'Confirm' button

* Note: 'You can change this later in Settings'

### **Behaviour**

* Language saved to user's profile in the database (preferred\_language column)

* All subsequent app content loads in this language

* Language preference syncs across devices if mother re-installs

## **A.12 Signup Complete — Welcome Screen**

  **Screen: /signup/complete**


### **What the Screen Shows**

* Large checkmark icon (green)

* Heading: 'You're all set\!' / 'সব কিছু ঠিকঠাক\!' / 'सब कुछ तैयार है\!'

* Subtext: 'Your account has been created. The app will support you and \[baby name\] for the next 6 months.'

* Summary card showing: Mother name | Baby name | Hospital | Participant Code | Study Group

* 'Go to Home' button (large, primary)

## **A.13 Complete Signup Flow Summary**

| Step | Screen | Who Acts | Can Go Back? |
| :---- | :---- | :---- | :---- |
| 0 | Language Selection | Mother / Nurse | Yes — language not saved until next step |
| 1 | Welcome Screen | Mother / Nurse | Yes |
| 2 | Phone Number Entry | Nurse enters mother's number | Yes |
| 3 | OTP Verification | Nurse / Mother | Yes — re-enter number |
| 4 | Create 4-digit PIN | Mother (her choice) | No — OTP already used |
| 5 | Mother Profile Form | Nurse \+ Mother | Yes |
| 6 | Infant Profile Form | Nurse (from NICU file) | Yes |
| 7 | Hospital Code Entry | Nurse | Yes |
| 8 | Participant Code Assigned | System auto (no UI) | N/A |
| 9 | Confirm Language | Mother | Yes |
| 10 | Signup Complete | System | No — account created |

# **Part B — Database Schema**

This section defines every table needed in the PostgreSQL database. Four main entities: Hospitals, Users (mothers, researchers, nurses), Babies, and all clinical/research data tables. Follow this schema exactly — changing column names later will break the data export to SPSS.

*Database: PostgreSQL  |  All timestamps stored as UTC  |  All IDs: UUID v4  |  Soft deletes (deleted\_at column) on all main tables — never hard delete research data*

## **B.1 Table: hospitals**

Stores each NICU/hospital that is a study site. Purnima Chakrabortty creates these in the admin panel before enrolment begins.

| TABLE: hospitals |  |  |  |
| :---- | :---- | :---- | :---- |
| **Column Name** | **Data Type** | **Constraints** | **Description / Notes** |
| **id** | UUID | PRIMARY KEY, DEFAULT gen\_random\_uuid() | Unique identifier for this hospital |
| **name** | VARCHAR(255) | NOT NULL | Full hospital name e.g. 'Bankura Medical College and Hospital' |
| **code** | VARCHAR(10) | NOT NULL, UNIQUE | Short code used during enrolment e.g. 'BNK', 'BWN', 'PRB', 'DBN' |
| **district** | VARCHAR(100) | NOT NULL | District name e.g. 'Bankura', 'Burdwan' |
| **state** | VARCHAR(100) | NOT NULL, DEFAULT 'West Bengal' | State |
| **type** | VARCHAR(50) | NOT NULL | Values: 'primary\_site' or 'pilot\_site' |
| **emergency\_phone** | VARCHAR(20) | NULLABLE | NICU helpline number shown on Danger Signs screen |
| **is\_active** | BOOLEAN | NOT NULL, DEFAULT true | Set false to close enrolment at this site |
| **created\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| **updated\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Auto-updated on any change |

## **B.2 Table: users**

All system users: mothers, researchers, and nurses. Role column separates them. One table keeps auth simple.

| TABLE: users |  |  |  |
| :---- | :---- | :---- | :---- |
| **Column Name** | **Data Type** | **Constraints** | **Description / Notes** |
| **id** | UUID | PRIMARY KEY, DEFAULT gen\_random\_uuid() | Unique user ID |
| **phone** | VARCHAR(15) | NOT NULL, UNIQUE | Mobile number with country code e.g. '+919876543210' |
| **pin\_hash** | VARCHAR(255) | NULLABLE | bcrypt hash of 4-digit PIN. NULL for researchers (they use password) |
| **password\_hash** | VARCHAR(255) | NULLABLE | bcrypt hash. Only for role \= researcher or nurse |
| **role** | VARCHAR(20) | NOT NULL | Values: 'mother', 'researcher', 'nurse' |
| **preferred\_language** | VARCHAR(5) | NOT NULL, DEFAULT 'bn' | Values: 'bn' (Bengali), 'hi' (Hindi), 'en' (English) |
| **hospital\_id** | UUID | FK → hospitals.id, NULLABLE | NULL for researcher. Set for nurse and mother. |
| **is\_active** | BOOLEAN | NOT NULL, DEFAULT true | False \= account suspended or study ended |
| **last\_login\_at** | TIMESTAMPTZ | NULLABLE | Updated on every successful login |
| **failed\_pin\_attempts** | INTEGER | NOT NULL, DEFAULT 0 | Reset to 0 on successful login. Lock at 5\. |
| **locked\_until** | TIMESTAMPTZ | NULLABLE | Account locked until this time after too many failures |
| **created\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| **updated\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Auto-updated |
| **deleted\_at** | TIMESTAMPTZ | NULLABLE | Soft delete — set when account closed. Never hard delete. |

## **B.3 Table: otp\_verifications**

Stores OTP codes sent during signup and PIN reset. Expired OTPs are never deleted — kept for audit trail.

| TABLE: otp\_verifications |  |  |  |
| :---- | :---- | :---- | :---- |
| **Column Name** | **Data Type** | **Constraints** | **Description / Notes** |
| **id** | UUID | PRIMARY KEY | Unique OTP record ID |
| **phone** | VARCHAR(15) | NOT NULL | Phone number OTP was sent to |
| **otp\_hash** | VARCHAR(255) | NOT NULL | SHA-256 hash of the 6-digit OTP — never store plain OTP |
| **purpose** | VARCHAR(30) | NOT NULL | Values: 'signup', 'pin\_reset', 'login\_fallback' |
| **is\_used** | BOOLEAN | NOT NULL, DEFAULT false | Set true after successful verification |
| **attempts** | INTEGER | NOT NULL, DEFAULT 0 | Number of wrong attempts on this OTP |
| **expires\_at** | TIMESTAMPTZ | NOT NULL | OTP valid for 10 minutes from creation |
| **created\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | When OTP was generated |
| **used\_at** | TIMESTAMPTZ | NULLABLE | When OTP was successfully used |

## **B.4 Table: refresh\_tokens**

| TABLE: refresh\_tokens |  |  |  |
| :---- | :---- | :---- | :---- |
| **Column Name** | **Data Type** | **Constraints** | **Description / Notes** |
| **id** | UUID | PRIMARY KEY | Token ID |
| **user\_id** | UUID | NOT NULL, FK → users.id | Which user this token belongs to |
| **token\_hash** | VARCHAR(255) | NOT NULL | SHA-256 hash of the token value |
| **device\_info** | TEXT | NULLABLE | Browser / device info for security display |
| **expires\_at** | TIMESTAMPTZ | NOT NULL | 30 days from creation |
| **revoked\_at** | TIMESTAMPTZ | NULLABLE | Set when user logs out |
| **created\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Token creation time |

## **B.5 Table: mother\_profiles**

All demographic data for Tool I of the research proposal — mother section. One row per mother.

| TABLE: mother\_profiles |  |  |  |
| :---- | :---- | :---- | :---- |
| **Column Name** | **Data Type** | **Constraints** | **Description / Notes** |
| **id** | UUID | PRIMARY KEY | Profile ID |
| **user\_id** | UUID | NOT NULL, UNIQUE, FK → users.id | Links to users table. UNIQUE \= one profile per user |
| **participant\_code** | VARCHAR(20) | NOT NULL, UNIQUE | e.g. 'BNK-S-042'. Used in all research data exports |
| **study\_group** | VARCHAR(10) | NOT NULL | Values: 'study' or 'control' |
| **hospital\_id** | UUID | NOT NULL, FK → hospitals.id | Which hospital this mother was enrolled at |
| **full\_name** | VARCHAR(255) | NULLABLE | Optional. Not included in anonymised exports. |
| **age\_range** | VARCHAR(30) | NOT NULL | e.g. '18-25', '26-30' — from dropdown |
| **education\_mother** | VARCHAR(50) | NOT NULL | Education level from Tool I options |
| **education\_father** | VARCHAR(50) | NOT NULL | Education level from Tool I options |
| **occupation\_mother** | VARCHAR(50) | NOT NULL | Occupation from Tool I options |
| **occupation\_father** | VARCHAR(50) | NOT NULL | Occupation from Tool I options |
| **income\_class** | VARCHAR(20) | NOT NULL | BG Prasad scale: 'I','II','III','IV','V' |
| **family\_type** | VARCHAR(20) | NOT NULL | Values: 'nuclear', 'joint', 'extended' |
| **family\_members\_count** | VARCHAR(10) | NOT NULL | Values: '3', '5', 'other' \+ number |
| **religion** | VARCHAR(30) | NOT NULL | Hindu / Muslim / Christian / Other |
| **residence\_type** | VARCHAR(20) | NOT NULL | Values: 'urban', 'rural', 'semi\_urban' |
| **contact\_number** | VARCHAR(15) | NULLABLE | Optional alternate contact |
| **prev\_preterm\_education** | BOOLEAN | NOT NULL, DEFAULT false | Whether mother received prior preterm care education |
| **education\_source** | TEXT\[\] | NULLABLE | Array: \['health\_worker','family','peer','workshop','magazine'\] |
| **enrolled\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Date of enrolment / account creation |
| **created\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |  |
| **updated\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |  |

## **B.6 Table: baby\_profiles**

All infant demographic and clinical data from Tool I — infant section. One row per baby. All age calculations in the app derive from this table.

| TABLE: baby\_profiles |  |  |  |
| :---- | :---- | :---- | :---- |
| **Column Name** | **Data Type** | **Constraints** | **Description / Notes** |
| **id** | UUID | PRIMARY KEY | Baby profile ID |
| **mother\_profile\_id** | UUID | NOT NULL, UNIQUE, FK → mother\_profiles.id | Links baby to mother. UNIQUE \= one baby per mother (study constraint) |
| **baby\_name** | VARCHAR(100) | NULLABLE | Optional display name |
| **sex** | VARCHAR(10) | NOT NULL | Values: 'male', 'female' |
| **date\_of\_birth** | DATE | NOT NULL | Used for chronological age and vaccination schedule |
| **gestational\_age\_weeks** | DECIMAL(4,1) | NOT NULL | e.g. 32.5 — used for corrected age calculation |
| **birth\_weight\_grams** | INTEGER | NOT NULL | Birth weight in grams — baseline growth data point |
| **weight\_at\_discharge\_grams** | INTEGER | NOT NULL | Weight when leaving NICU — first growth tracking point |
| **place\_of\_delivery** | VARCHAR(20) | NOT NULL | Values: 'hospital', 'home' |
| **nicu\_stay\_days** | INTEGER | NOT NULL | Number of days in NICU |
| **skin\_to\_skin\_at\_birth** | BOOLEAN | NOT NULL | KMC immediately at birth — Yes/No |
| **kmc\_in\_nicu** | BOOLEAN | NOT NULL | Was KMC provided during NICU stay — Yes/No |
| **feeding\_at\_discharge** | VARCHAR(30) | NOT NULL | Values: 'exclusive\_bf', 'exclusive\_formula', 'mixed' |
| **cried\_at\_birth** | BOOLEAN | NOT NULL | Cried after birth — Yes/No |
| **needed\_resuscitation** | BOOLEAN | NOT NULL | Required resuscitation — Yes/No |
| **birth\_weight\_stratum** | VARCHAR(20) | NOT NULL | Auto-calculated on save: 'under\_1500', '1500\_to\_2500', 'over\_2500'. Used for randomisation stratification. |
| **discharge\_date** | DATE | NOT NULL | NICU discharge date — study start date for this participant |
| **created\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |  |
| **updated\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |  |

*Computed values (not stored — calculated on query):• Chronological age \= TODAY − date\_of\_birth• Corrected age \= Chronological age − (40 − gestational\_age\_weeks) weeks• Corrected age is used for: WHO growth chart, TDSC screening• Chronological age is used for: Vaccination schedule*

## **B.7 Table: nurse\_profiles**

Nurses are hospital staff who handle enrolment. They have limited access — enrolment flow only.

| TABLE: nurse\_profiles |  |  |  |
| :---- | :---- | :---- | :---- |
| **Column Name** | **Data Type** | **Constraints** | **Description / Notes** |
| **id** | UUID | PRIMARY KEY |  |
| **user\_id** | UUID | NOT NULL, UNIQUE, FK → users.id | Links to users table |
| **hospital\_id** | UUID | NOT NULL, FK → hospitals.id | Nurse belongs to this hospital |
| **full\_name** | VARCHAR(255) | NOT NULL | Nurse's name |
| **employee\_id** | VARCHAR(50) | NULLABLE | Hospital employee ID (optional) |
| **is\_active** | BOOLEAN | NOT NULL, DEFAULT true | Set false when nurse leaves |
| **created\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |  |

## **B.8 Table: researcher\_profiles**

Purnima Chakrabortty and any research assistants she designates. Full access to admin panel.

| TABLE: researcher\_profiles |  |  |  |
| :---- | :---- | :---- | :---- |
| **Column Name** | **Data Type** | **Constraints** | **Description / Notes** |
| **id** | UUID | PRIMARY KEY |  |
| **user\_id** | UUID | NOT NULL, UNIQUE, FK → users.id | Links to users table |
| **full\_name** | VARCHAR(255) | NOT NULL | Researcher's full name |
| **designation** | VARCHAR(100) | NULLABLE | e.g. 'Principal Investigator', 'Research Assistant' |
| **email** | VARCHAR(255) | NOT NULL, UNIQUE | Login email for researcher (they use email+password not phone+PIN) |
| **access\_level** | VARCHAR(20) | NOT NULL, DEFAULT 'full' | Values: 'full' (Purnima Chakrabortty, 'read\_only' (external reviewer) |
| **created\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |  |

## **B.9 Table: follow\_up\_schedules**

Auto-generated when a mother is enrolled. Creates 4 follow-up records (baseline \+ 3 months). Used to track whether data has been collected at each time point.

| TABLE: follow\_up\_schedules |  |  |  |
| :---- | :---- | :---- | :---- |
| **Column Name** | **Data Type** | **Constraints** | **Description / Notes** |
| **id** | UUID | PRIMARY KEY |  |
| **mother\_profile\_id** | UUID | NOT NULL, FK → mother\_profiles.id | Which participant |
| **time\_point** | VARCHAR(20) | NOT NULL | Values: 'baseline', '1\_month', '3\_months', '6\_months' |
| **scheduled\_date** | DATE | NOT NULL | Auto-calculated from discharge\_date \+ interval |
| **actual\_date** | DATE | NULLABLE | Date data was actually collected (may differ from scheduled) |
| **status** | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | Values: 'pending', 'completed', 'missed', 'rescheduled' |
| **data\_complete** | BOOLEAN | NOT NULL, DEFAULT false | True only when all 5 tools submitted for this time point |
| **collected\_by\_user\_id** | UUID | NULLABLE, FK → users.id | Researcher or nurse who collected data |
| **notes** | TEXT | NULLABLE | Any notes from researcher about this visit |
| **created\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |  |
| **updated\_at** | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |  |

## **B.10 Entity Relationship Summary**

How all tables connect to each other:

| Table | Connects To | Relationship | Purpose |
| :---- | :---- | :---- | :---- |
| hospitals | users, mother\_profiles, nurse\_profiles | One hospital → many users | Sites management |
| users | mother\_profiles, nurse\_profiles, researcher\_profiles | One user → one profile | Auth for all roles |
| mother\_profiles | baby\_profiles, follow\_up\_schedules | One mother → one baby, one → many follow-ups | Core research entity |
| baby\_profiles | mother\_profiles | One baby → one mother | Infant clinical data |
| nurse\_profiles | users, hospitals | One nurse → one hospital | Enrolment staff |
| researcher\_profiles | users | One researcher → one user | Admin panel access |
| follow\_up\_schedules | mother\_profiles | One mother → 4 schedules | Research timeline tracking |
| otp\_verifications | users (via phone) | Many OTPs per phone | Auth security |
| refresh\_tokens | users | Many tokens per user | Session management |

# **Part C — What to Build First (Developer Checklist)**

*Start here. Everything else in the app depends on these tables and screens being correct. Get this foundation right and the rest of the project builds cleanly on top of it.*

## **Backend — Build in This Order**

11. **Create PostgreSQL database with all 9 tables from Part B**

12. Set up UUID generation, timestamps, and soft delete triggers

13. POST /auth/send-otp — accepts phone number, sends OTP via MSG91, stores hashed OTP in otp\_verifications

14. POST /auth/verify-otp — verifies OTP hash, marks as used, returns a short-lived signup token

15. POST /auth/create-pin — accepts signup token \+ PIN, creates user in users table with bcrypt PIN hash

16. POST /auth/login — accepts phone \+ PIN, returns JWT access token \+ refresh token

17. POST /auth/refresh — accepts refresh token, returns new access token

18. POST /auth/logout — revokes refresh token

19. POST /auth/forgot-pin — sends OTP for PIN reset

20. POST /onboarding/mother-profile — saves all mother demographic fields to mother\_profiles

21. POST /onboarding/baby-profile — saves all infant fields to baby\_profiles, auto-calculates birth\_weight\_stratum

22. POST /onboarding/hospital-code — validates hospital code, links user to hospital

23. GET /onboarding/participant-code — returns next available participant code for this hospital \+ group

24. POST /onboarding/complete — marks onboarding done, generates 4 follow\_up\_schedule records

## **Frontend — Build in This Order**

25. **Language selection screen (A.1) with i18n setup — Bengali, Hindi, English**

26. Welcome screen (A.2)

27. Phone number entry screen (A.3) with validation

28. OTP verification screen (A.4) with 6-box input and countdown timer

29. 4-digit PIN creation screen (A.5) with confirmation

30. Mother profile form (A.7) — all demographic dropdowns and radios in Bengali

31. Baby profile form (A.8) — all infant fields with NICU data entry

32. Hospital code entry screen (A.9)

33. Signup complete screen (A.12)

34. Returning login screen (A.6) — phone \+ PIN

35. Forgot PIN flow (OTP → new PIN)

## **Testing Checklist Before Moving to Next Phase**

* All 9 database tables created with correct data types and foreign keys

* OTP is sent via SMS and received on a real Indian phone number

* OTP expiry (10 min) and attempt limiting (3 tries) working correctly

* PIN is hashed — never stored in plain text — verified in database directly

* JWT access token expires in 24 hours — refresh token in 30 days

* A mother can complete full signup in Bengali from language select to dashboard

* Participant code is generated in correct format (e.g. BNK-S-042)

* birth\_weight\_stratum is auto-calculated correctly on baby profile save

* follow\_up\_schedule creates 4 records with correct dates on signup complete

* A returning mother can log back in with phone \+ PIN

* Forgot PIN flow works end to end

* All form validation errors appear in Bengali

*SnehoAyu Step 1 Document  |  v1.0  |  June 2025  |  Confidential*  
