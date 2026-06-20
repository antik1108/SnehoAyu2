# SnehoAyu — Feature & Functionality Reference

A feature-by-feature technical map of the codebase, for developers picking
up this project. For diagrams and high-level architecture, see
[README.md](README.md). For how to use/test each feature as an end user,
see [USER_GUIDE.md](USER_GUIDE.md).

Each entry lists: what it does, the backend files, the frontend files, the
API endpoint(s), and the Prisma model(s) involved.

---

## Authentication & Session

**What:** Phone + password registration/login, 4-digit PIN as a fast
re-entry method, JWT access tokens (24h) + hashed refresh tokens (30d).

- Backend: `src/services/authService.ts`, `src/controllers/authController.ts`,
  `src/routes/authRoutes.ts`, `src/middlewares/authMiddleware.ts`
  (`requireAuth`, `requireRole`), `src/validators/authValidator.ts`
- Frontend: `src/context/AuthContext.tsx`, `src/hooks/useAuth.ts`,
  `src/lib/api.ts` (axios interceptor attaches Bearer token, handles 401
  refresh), `src/lib/authStorage.ts`
- Endpoints: `POST /api/auth/register`, `/login`, `/create-pin`,
  `/login-pin`, `/change-pin`, `DELETE /remove-pin`, `/refresh`, `/logout`
- Models: `User`, `RefreshToken`, `OtpVerification` (schema present, OTP
  flow not wired to a live SMS gateway — see Known Gaps)

**Password policy** is enforced both client-side (`SignupPhone.tsx`) and
server-side (`validatePasswordPolicy` in `authValidator.ts`): 8-72 chars,
must include uppercase, lowercase, and a digit.

---

## Onboarding

**What:** Multi-step flow collecting mother profile (Tool I demographics),
baby profile (clinical data, auto-calculates `birthWeightStratum`), hospital
linking, and participant code generation (`HOSPITAL-GROUP-SEQUENCE`, e.g.
`BNK-S-001`).

- Backend: `src/controllers/onboardingController.ts`,
  `src/validators/onboardingValidator.ts`
- Frontend: `src/pages/MotherProfileForm.tsx`, `BabyProfileForm.tsx`,
  `HospitalCodeEntry.tsx`, `SignupComplete.tsx`,
  `src/features/onboarding/{api,types}.ts`
- Endpoints: `POST /api/onboarding/mother-profile`, `/baby-profile`,
  `/hospital-code`, `GET /participant-code`, `POST /complete`
- Models: `MotherProfile`, `BabyProfile`, `FollowUpSchedule` (4 auto-created
  on completion: baseline, 1m, 3m, 6m)

**Study-group gate:** `GET /onboarding/participant-code` throws
`409 STUDY_GROUP_REQUIRED` until a researcher assigns `study`/`control` via
the admin panel (`POST /admin/participants/:id/study-group`). This is
intentional — preserves randomization integrity per the PRD.

---

## Dashboard

**What:** Single home screen summarizing baby status, today's care
progress, health stats, next reminder, and daily message.

- Backend: `src/services/dashboardService.ts`,
  `src/controllers/dashboardController.ts`
- Frontend: `src/pages/Dashboard.tsx` + `src/components/dashboard/*`
- Endpoint: `GET /api/dashboard/home`
- Pulls from: `MotherProfile`, `BabyProfile`, `DailyLog` (today), latest
  `GrowthReading`, pending `FollowUpSchedule`, computed daily message
  (see Messaging)

---

## Daily Care Checklist

**What:** One row per mother per day tracking breastfeeding, KMC,
temperature, weight, skin/cord care, danger-signs review.

- Backend: `src/services/checklistService.ts`,
  `src/controllers/checklistController.ts`
- Frontend: `src/pages/Checklist.tsx`, `src/features/checklist/{api,types}.ts`
- Endpoints: `GET /api/checklist/today`, `POST /log`, `GET /history`
- Model: `DailyLog` (unique per `motherProfileId` + `careDate`)
- **Offline support:** `src/lib/offlineQueue.ts` is an IndexedDB-backed
  queue. `updateTodayChecklist()` in `features/checklist/api.ts` falls back
  to queueing on `ERR_NETWORK`/offline, and a `window.addEventListener('online', ...)`
  hook flushes the queue automatically on reconnect.

---

## Growth Tracking & Charts

**What:** Manual weight/length/head-circumference entry, automatic
chronological + corrected age calculation, WHO percentile chart rendering,
z-score-based low-growth alerting.

- Backend: `src/services/growthService.ts`, `src/utils/age.ts`
  (`calculateCorrectedAge`), `src/content/whoGrowthStandards.ts` (reference
  mean/SD tables, interpolated z-score calculation — see inline doc comment
  for the precision caveat: this is an interpolated approximation, not the
  full WHO LMS clinical tables)
- Frontend: `src/pages/Growth.tsx`, `src/pages/growth/AddReading.tsx`,
  `src/components/growth/{GrowthChart,GrowthHistoryList,CurrentMeasurementsCard}.tsx`
- Endpoints: `POST /api/growth/log`, `GET /history`, `/latest`, `/chart?metric=`
- Model: `GrowthReading`

**Corrected age formula:** `chronological_age − (40 − gestational_age_weeks)`,
implemented once in `utils/age.ts` and reused everywhere (growth, TDSC,
dashboard) — don't duplicate this calculation elsewhere.

---

## Research Instruments (Tools III–V + TDSC + Breastfeeding)

All five instruments share the same pattern: fetch questions →
submit responses → backend scores them → locked on resubmission for that
`timePoint`.

| Tool | Backend service | Frontend page | Content source |
| --- | --- | --- | --- |
| Knowledge MCQ (15 Q) | `knowledgeAssessmentService.ts` | `pages/assessments/KnowledgeMCQ.tsx` | `content/knowledgeQuestions.ts` |
| WHO-5 Well-Being | `who5AssessmentService.ts` | `pages/assessments/Who5Assessment.tsx` | `content/who5Questions.ts` |
| PSOC Self-Efficacy | `psocAssessmentService.ts` | `pages/assessments/PsocAssessment.tsx` | `content/psocQuestions.ts` |
| TDSC Milestones | `tdscService.ts` | `pages/assessments/TdscTracker.tsx` | `content/tdscItems.ts` |
| Breastfeeding | `breastfeedingService.ts` | `pages/assessments/BreastfeedingAssessment.tsx` | `content/breastfeedingAssessment.ts` (scoring weights) |

Models: `KnowledgeAssessment`, `Who5Assessment`, `PsocAssessment`,
`TdscAssessment`, `BreastfeedingAssessment` — each unique on
`(motherProfileId, timePoint)`.

**Scoring logic lives entirely server-side** — clients never submit a score,
only raw responses; the backend computes and persists the score so the
research dataset can't be tampered with from the client.

**TDSC specifics:** `content/tdscItems.ts` has 18 items with
`lowerLimitDays`/`upperLimitDays`. `getApplicableTdscItems()` filters to
items relevant at the baby's current corrected age. `suspectedDelay` is
flagged if any item marked `fail` has an `upperLimitDays` already passed.

---

## Immunization

**What:** IAP-2023-based vaccine schedule (birth → 6 months), generated
from chronological DOB (not corrected age), mark-as-done with optional
batch number/administered-by.

- Backend: `src/services/immunizationService.ts`,
  `src/content/immunizationSchedule.ts` (vaccine definitions)
- Frontend: `src/pages/ImmunizationTracker.tsx`,
  `src/features/immunization/{api,types}.ts`
- Endpoints: `GET /api/immunization/schedule` (lazily generates the
  schedule on first call), `POST /mark-complete`
- Model: `VaccineRecord`, unique on `(motherProfileId, vaccineId)`

---

## Danger Signs

**What:** 10 expandable cards (PRD Section 5.8) + a confirm-before-dialing
emergency call button wired to the mother's linked hospital's
`emergencyPhone`.

- Frontend only: `src/pages/DangerSigns.tsx` (content is static, defined
  in-file — translating the clinical sign descriptions themselves into
  Bengali/Hindi is flagged as a Known Gap, pending researcher sign-off)
- Reads `hospital.emergencyPhone` from `GET /api/dashboard/home`
- The emergency phone itself is set by a researcher via
  `PATCH /api/admin/hospitals/:id`

---

## Learning Hub

**What:** JSON-backed content library (6 categories), audio player for
weekly tips, per-mother view tracking.

- Backend: `src/services/contentService.ts` — `ContentItem` rows are
  upserted lazily by `slug` the first time any mother views that content;
  `ContentView` records the per-mother read receipt.
- Frontend: `src/content/learningHubContent.ts` (the actual article data —
  edit this file to add/change articles), `src/pages/LearningHub.tsx`,
  `src/components/AudioPlayer.tsx`
- Endpoints: `POST /api/content/view`, `GET /views`
- Models: `ContentItem`, `ContentView`

---

## Messaging

**What:** Daily rotating SMS-style care tip (shown in-app on the dashboard)
+ weekly audio tip, mocked SMS delivery via a nightly scheduler, delivery
history.

- Backend content: `src/content/careMessages.ts` (12 seed messages across
  weeks 1-8 — extend this array to reach the PRD's 180-message target; the
  lookup contract by `weekNumber`/`type` doesn't need to change)
- Scheduler: `src/jobs/messageScheduler.ts` — `startMessageScheduler()` is
  called once in `index.ts` at server boot. It computes the delay to the
  next IST midnight, then runs `runDailyMessageDelivery()` every 24h.
  **To trigger it manually for testing**, import and call
  `runDailyMessageDelivery()` directly from a one-off script, or temporarily
  lower the delay in `nextMidnightIstDelayMs()`.
- Study-week calculation: `computeStudyWeek()` in `messageService.ts` —
  `floor(days_since_discharge / 7) + 1`, used both by the scheduler and by
  the dashboard's live "today's message" resolution (so the dashboard
  doesn't need to wait for the scheduler to show *a* message).
- Endpoints: `GET /api/messages/history`
- Models: `CareMessage`, `MessageDelivery`

**No real SMS gateway is connected** — `console.log('[MockSMS] ...')` in
the scheduler is the integration point for MSG91/Twilio.

---

## Telehealth

**What:** Researcher-initiated WhatsApp video call logging (PRD Option C —
no in-app video infrastructure).

- Backend: `src/services/telehealthService.ts`
- Frontend: dashboard card `src/components/dashboard/TelehealthCard.tsx`,
  admin trigger button in `pages/admin/ParticipantList.tsx`
- Endpoints: `GET /api/telehealth/active` (mother), `POST /session`
  (researcher-only, via `requireRole('researcher')`)
- Model: `VideoCallSession`

---

## Audit Log

**What:** Append-only event log for research-grade traceability.

- Backend: `src/services/auditService.ts` — `recordAudit()` never throws
  (a failed audit write must never block the primary operation it
  describes); call it `void`-style, fire-and-forget, after the main
  mutation succeeds.
- Currently wired into: PIN login, onboarding completion, study-group
  assignment, TDSC submission, immunization mark-complete, hospital
  create/update, export generation.
- **Not yet wired into:** checklist edits, growth-reading edits, individual
  assessment submissions beyond TDSC. The pattern is established — adding a
  new call site is a 5-line change (see any existing controller for the
  pattern: `void recordAudit({ actorId, actorRole, action, entityType, entityId, metadata })`).
- Model: `AuditLog`

---

## Admin / Researcher Panel

**What:** Researcher-only desktop UI (English, per PRD §6.1 — Bengali is
intentionally not applied here).

- Backend: `src/services/adminService.ts`, `src/controllers/adminController.ts`,
  `src/routes/adminRoutes.ts` — every route behind
  `requireAuth, requireRole('researcher')`
- Frontend: `src/pages/admin/{ParticipantList,ParticipantDetail,HospitalManagement}.tsx`,
  guarded by `src/routes/RequireRole.tsx`
- Endpoints:
  - `GET /api/admin/participants` (list, filterable by `hospitalId`/`birthWeightStratum`)
  - `GET /api/admin/participants/:id` (full detail — every instrument's data)
  - `POST /api/admin/participants/:id/study-group`
  - `GET /api/admin/hospitals`, `POST /api/admin/hospitals`, `PATCH /api/admin/hospitals/:id`
  - `GET /api/admin/export?anonymize=true|false` — streams an `.xlsx` via `exceljs`
    (`src/services/exportService.ts`)

---

## AI Care Assistant (Groq)

**What:** A floating button (bottom-right, above the bottom nav, on every
mother-facing page) opens a panel that either auto-generates a short,
warm summary of the baby's recent data, or answers a free-text question
the mother types — strictly scoped to this baby's care.

- Backend: `src/services/groqService.ts` (thin wrapper around Groq's
  OpenAI-compatible chat completions API — never leaks raw provider errors
  to the client), `src/services/insightsService.ts` (aggregates growth
  z-score, 7-day checklist compliance, latest WHO-5/TDSC flags, and
  immunization progress into a structured JSON summary, builds the prompt,
  calls Groq)
- Endpoint: `POST /api/insights/generate` — body `{ question?: string }`,
  mother-only, rate-limited to 10 requests/10 minutes per user
  (`src/routes/insightsRoutes.ts`) since it calls a paid external API
- Env vars: `GROQ_API_KEY` (required for this feature only — not in
  `config/env.ts`'s required-vars list, so the rest of the app still boots
  without it), `GROQ_MODEL` (defaults to `llama-3.3-70b-versatile`)
- **Prompt design** (`buildSystemPrompt` in `insightsService.ts`): safety-flag
  rule is evaluated before tone/brevity rules (any red flag → first sentence
  must tell the mother to contact her hospital); a `STRICT TOPIC SCOPE` rule
  refuses anything not about this baby's care (verified live — asking it to
  write code returns a polite redirect, not a partial answer); the JSON data
  block and the mother's typed question are both explicitly labeled as
  *data, not instructions*, so embedded text can't override the system
  prompt
- Every generation is audit-logged (`insights.generated`, with `hasFlag` /
  `hadQuestion` booleans — no raw AI text stored in the audit trail)
- Frontend: `src/components/dashboard/AiAssistantButton.tsx` — both the
  trigger button and the panel render via `createPortal(..., document.body)`.
  This matters: the button lives inside page headers that use
  `backdrop-blur`, and any ancestor with `backdrop-filter`/`transform`
  becomes a new CSS containing block for `position: fixed` descendants —
  without the portal, the modal would collapse into the header's small box
  instead of covering the viewport. The trigger's position is also set via
  inline styles rather than Tailwind classes, for the same reason.

---

## PWA / Offline

**What:** Installable app, cached static assets/translations, offline
checklist queue (see Daily Care Checklist above).

- Config: `frontend/vite.config.ts` (`VitePWA` plugin) — manifest colors
  (`#f8fafc` background, `#0f766e` theme), Workbox runtime caching rules for
  `/locales/*.json` (CacheFirst) and `/api/checklist/*` (NetworkFirst)
- Offline queue: `frontend/src/lib/offlineQueue.ts` (raw IndexedDB, no
  external dependency)

---

## i18n

- Files: `frontend/src/locales/{bn,hi,en}.json`, loaded via `react-i18next`
  (`src/i18n/index.ts`)
- `bn` (Bengali) is the default/fallback language per the PRD.
- **Translated:** all core onboarding/dashboard/checklist/growth/assessment
  screens, plus TDSC, Immunization, Breastfeeding, Learning Hub, Danger
  Signs (chrome only — the 10 sign descriptions themselves are still
  English-only, pending clinical translation review), Message History.
- **Not translated:** the admin/researcher panel (intentional — see above).

---

## Layout & Scrolling

The app shell (`html`, `body`, `#root` in `frontend/src/index.css`) is set
up so the **document itself** owns vertical scrolling — `html { height: 100% }`,
`body { min-height: 100%; overflow-y: auto; overscroll-behavior-y: contain }`.
This is deliberate: page components use `min-h-[100dvh]` (not a fixed
`h-[100dvh]`) so they can grow taller than one viewport, and nothing in the
ancestor chain sets `overflow: hidden`, so native mouse-wheel/trackpad/touch
scrolling always works without needing any custom scroll container or JS
scroll handling. If a future page needs an inner scrollable region (e.g. a
fixed-height list), give that specific element `overflow-y: auto` rather
than constraining a page-level wrapper — constraining a wrapper is what
causes the classic "scroll only works if I drag" symptom (the wheel/trackpad
gesture has no element to scroll, while touch flick can sometimes still
trigger overflow scroll on certain browsers, making the bug look
touch-specific when it isn't).

Note: if you're testing in Chrome DevTools' device-toolbar (touch emulation
on), the mouse wheel intentionally stops scrolling and only click-drag pans
the page — that's DevTools emulating a touchscreen, not an app bug. Test on
a real device or with device-toolbar off to confirm.

---

## Known Gaps (not implemented)

These are real, not hidden — see prior session summaries for full context:

- Live OTP SMS / real MSG91-Twilio integration (mocked)
- S3/object storage for uploaded audio files (weekly audio is referenced by
  static URL only)
- Push notifications (PWA caches assets but doesn't request push permission
  or send pushes)
- DPDPA consent capture flow
- Nurse self-service login/enrollment UI (nurse accounts must be created
  manually via Prisma Studio — see USER_GUIDE.md Part B)
- Badge/gamification gallery, community peer-posts screen
- Full WHO LMS clinical-grade growth percentile tables (current
  implementation interpolates between mean/SD checkpoints — fine for an
  early-warning flag, not for clinical publication-grade z-scores)
- Lighthouse/accessibility audit pass

---

## Where to Start Reading Code

If you're new to this codebase, read in this order:
1. `backend/prisma/schema.prisma` — the data model is the source of truth
2. `backend/src/app.ts` — route registration, one line per feature
3. `frontend/src/routes/AppRoutes.tsx` — page routing, mirrors the backend's
   feature list
4. Pick one feature from the table above and read its backend service →
   controller → route, then its frontend page → feature API client — every
   feature in this app follows that same four-layer shape.
