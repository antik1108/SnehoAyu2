# SnehoAyu — User & Testing Manual

This is a practical, step-by-step guide for using and testing every feature of
SnehoAyu, organized by role: **Mother**, **Nurse**, and **Researcher /
Admin**. Each section tells you what the feature does, where to find it in
the app, and how to verify it works.

Default local URLs:
- Mother/Nurse app: `http://localhost:5173`
- Backend API: `http://localhost:4000/api`

Before testing, make sure the database is migrated and seeded (see
[README.md](README.md#local-development)) — seeding creates two test
hospitals: **`BNK`** (Bankura Medical College) and **`BWN`** (Burdwan Medical
College).

---

## Part A — Mother App

### A.1 Language Selection
**Where:** First screen on first launch (`/language-select`)
**How to test:** Open the app in a fresh/incognito browser. You should see
three large buttons — বাংলা, हिंदी, English. Tap one; it's remembered
(localStorage) and you're taken to the Welcome screen. Reopening the app
should skip this screen.

### A.2 Welcome & Account Creation
**Where:** `/welcome` → `/signup/phone`
1. Tap **Create Account**.
2. Enter a 10-digit Indian mobile number (must start with 6-9), a password
   (8+ characters, with an uppercase letter, a lowercase letter, and a
   number — shown as a hint under the field), and confirm it.
3. Tap **Create Account**.
4. You'll land on **Create PIN** — enter and confirm a 4-digit PIN.

> Note: This build uses phone + password + PIN, not OTP SMS (see
> [FEATURES.md](FEATURES.md) for why). Real OTP wiring is documented but not
> connected to a live SMS gateway.

**To test login**, log out and use `/login` with the same phone + password,
then `/login/pin` with the PIN.

### A.3 Onboarding: Mother & Baby Profiles
**Where:** `/signup/mother-profile` → `/signup/baby-profile`
1. Fill all required dropdowns (age range, education, occupation, income
   class, family type, religion, residence type, etc).
2. On the baby profile, enter a **Date of Birth** in the past, a
   **Gestational Age** between 24–36 weeks, and a **Birth Weight** in grams.
   The stratum (`under_1500` / `1500_to_2500` / `over_2500`) is calculated
   automatically — check the participant code later confirms this.

### A.4 Hospital Linking & Participant Code
**Where:** `/signup/hospital-code`
1. Enter `BNK` or `BWN` (case-insensitive, auto-uppercased).
2. **If this is the first participant for that hospital and no researcher
   has assigned a study group yet**, you'll see *"The researcher must assign
   the study group..."* — this is expected. Log in as a researcher (Part C)
   and assign a study group to this participant from the Participant List,
   then return and tap **Retry**.
3. On success you'll see the hospital confirmed, then a generated
   participant code like `BNK-S-001` (Hospital-Group-Sequence), then land on
   the **Signup Complete** screen.

### A.5 Home Dashboard
**Where:** `/dashboard`
Verify: baby's name/age/corrected age, today's care ring, quick action
buttons, health stats, next follow-up reminder, daily message card (should
show real rotating text, not "not available"), and — if a researcher has
scheduled one — a telehealth notification card.

### A.6 Daily Care Checklist
**Where:** `/checklist`
1. Tick items: breastfeeding, KMC, temperature (morning/evening), weight,
   skin/cord care, danger-signs review.
2. Confirm the progress ring on the Dashboard updates after returning.
3. **Offline test:** open DevTools → Network → set to "Offline", tick an
   item. It should not show a hard error; reconnect (Network → "Online")
   and the change should sync automatically (queued via IndexedDB — check
   Application → IndexedDB → `snehoayu-offline` in DevTools to see/clear the
   queue).

### A.7 Growth Tracking
**Where:** `/growth` → **Add Reading** (`/growth/add`)
1. Add a reading: weight (400–5000g), length (cm), head circumference (cm).
2. Return to `/growth` — the **chart** should render with WHO percentile
   bands (3rd/15th/50th/85th/97th) and your data point plotted by corrected
   age. Toggle between Weight / Length / Head Circumference.
3. To test the **low-Z alert**: log a weight far below typical (e.g. 1500g
   for a baby several weeks old) — a red alert banner should appear under
   the chart.

### A.8 Research Instruments
All four lock after first submission per time point (`baseline` is used by
default in this build).

| Instrument | Path | What to verify |
| --- | --- | --- |
| Knowledge MCQ (15 Q) | `/assessments/knowledge` | One question at a time, no back-navigation after submit, score + grade shown |
| WHO-5 Well-Being | `/assessments/who5` | 6-point scale, raw + percentage score, "poor well-being" flag if raw < 13 |
| PSOC Self-Efficacy | `/assessments/psoc` | 17 items, reverse-scored items handled automatically, efficacy/satisfaction subscales |
| TDSC Milestones | `/assessments/tdsc` | Only age-appropriate items shown (based on corrected age), pass/fail per item, "suspected delay" flag if a failed item is past its upper age limit |
| Breastfeeding Assessment | `/assessments/breastfeeding` | Score out of 28, grade (excellent/good/fair/poor) |

**Re-submitting** the same instrument at the same time point should return a
`409 ASSESSMENT_ALREADY_SUBMITTED` error — confirms the locking logic.

### A.9 Immunization Tracker
**Where:** `/immunization`
1. On first visit, a full vaccine schedule is auto-generated from the
   baby's **chronological** date of birth (not corrected age).
2. Tap a vaccine to see its description and side effects.
3. Tap **Mark as Done** on a pending vaccine — it should move to the
   "Completed" tab and the progress bar should update.

### A.10 Danger Signs
**Where:** `/danger-signs`
1. Tap any of the 10 cards to expand "What to observe" / "What to do".
2. Tap the red **Emergency: Call Hospital** button once — it should ask you
   to tap again to confirm (prevents accidental dialing). Tapping again
   triggers a `tel:` link to your linked hospital's emergency number (set
   per-hospital by a researcher — see Part C.4).

### A.11 Learning Hub
**Where:** `/learn`
1. Browse the featured card and category filters (Feeding, KMC, Growth,
   Danger Signs, Emotional Support, Immunization).
2. Open an article — it's marked "✓ Viewed" on return to the list (this is
   tracked server-side; a researcher can later see engagement).
3. Articles with audio show an `AudioPlayer` with play/pause and a speed
   toggle (1x / 1.5x / 0.75x).

### A.12 Messages
**Where:** Dashboard daily message card, full history at `/messages`
The dashboard shows a rotating weekly care tip computed from the baby's
discharge date. `/messages` lists past deliveries (populated once the
nightly scheduler runs — see [FEATURES.md](FEATURES.md#messaging) to trigger
it manually for testing).

### A.13 Telehealth
A notification card appears on the Dashboard only after a researcher
schedules a session for that participant (Part C.5).

---

## Part B — Nurse Role

Nurses share the mother app's login (phone + password + PIN) but with
`role: nurse`. In this build, nurse accounts must be created directly in the
database (no self-serve nurse signup screen yet — see
[FEATURES.md](FEATURES.md) "Known Gaps"). A nurse's primary job in the PRD
is sitting with the mother during the onboarding flow described in Part A —
there is no separate nurse-only UI in this build.

---

## Part C — Researcher / Admin Panel

Researcher accounts also use phone + password login, but with
`role: researcher`. To create one for testing:

```bash
cd backend
npx prisma studio
```
In Prisma Studio, open the `User` table, create a row with `role` =
`researcher`, a `phone`, and a `passwordHash` (use the same bcrypt hashing
the app uses — easiest path is to register normally via `/signup/phone` as
a "mother" first, then edit that user's `role` to `researcher` in Prisma
Studio, and separately create a `ResearcherProfile` row linked to that
`userId`).

Once logged in, visiting any mother-app URL redirects researchers to
`/dashboard`; the actual admin panel lives at:

### C.1 Participant List
**Where:** `/admin/participants`
Table of all enrolled mothers: code, hospital, study group, birth-weight
stratum, onboarding status. Click a row's code to open the detail view.

### C.2 Assign Study Group
For any participant with no `participantCode` yet, **Study** / **Control**
buttons appear in the row. Click one — this unblocks that mother's
onboarding (Part A.4). Once a participant code exists, the group is locked
(re-assignment returns `409 STUDY_GROUP_LOCKED`).

### C.3 Participant Detail
**Where:** `/admin/participants/:id`
Shows baby profile, follow-up schedule, growth readings, and every research
instrument's results (Knowledge MCQ, WHO-5, PSOC, TDSC, breastfeeding,
immunization) for that participant in one page.

### C.4 Hospital Management
**Where:** `/admin/hospitals` (linked from the Participants page header)
1. Add a hospital: name, code, district, type, emergency phone.
2. Toggle **Enrolling / Closed** to open/close enrollment at that site —
   closing it makes new hospital-code links return
   `409 HOSPITAL_ENROLLMENT_CLOSED`.
3. Setting an **emergency phone** here is what powers the Danger Signs call
   button (A.10) for mothers linked to that hospital.

### C.5 Telehealth Scheduling
From the Participant List, click **📹 Video Call** next to any onboarded
participant — this logs a `VideoCallSession` and makes the telehealth
notification card appear on that mother's dashboard (A.13). This build uses
WhatsApp as the call channel (Option C from the PRD) — the researcher calls
the mother's number directly on WhatsApp; SnehoAyu just tracks that the
session happened.

### C.6 Data Export
From `/admin/hospitals`, use **Export (Anonymized)** or **Export (Full)** —
downloads an `.xlsx` with one row per participant: demographics, baseline
scores across all five research tools, latest growth reading, and
enrollment status. Anonymized export omits the `fullName` column.

---

## Quick End-to-End Test Script

A fast way to verify the whole pipeline works after a fresh setup:

1. Register a mother (A.2), complete profiles (A.3).
2. In another browser/incognito window, create a researcher account and
   assign that mother's study group (C.2).
3. Back in the mother's session, retry hospital linking (A.4) — should
   succeed and show a participant code.
4. Visit the dashboard (A.5) — should load without errors.
5. Submit one daily checklist entry (A.6) and one growth reading (A.7).
6. Submit the Knowledge MCQ (A.8) — confirm it locks on resubmission.
7. As the researcher, open that participant's detail page (C.3) — confirm
   the checklist, growth reading, and MCQ score all appear.
8. Run an export (C.6) — confirm the `.xlsx` downloads and contains that
   participant's row.

If all 8 steps succeed, the core data path (mother → backend → database →
researcher) is verified end to end.
