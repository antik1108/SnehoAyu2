# Requirements Document

## Introduction

SnehoAyu is a mobile-first PWA that is the intervention arm of a formal Randomised Controlled Trial (RCT). Dr. P. Ponnarasi (the researcher) is the only user of the admin panel. The study enrolls 272 mothers (136 Study + 136 Control) across four sites in West Bengal: Bankura MCH, Burdwan MCH, Purba Bardhaman MCH, and pilot site Deban Mahato MCH, Purulia. Each participant is followed for 6 months post-NICU-discharge with formal assessments at Baseline, 1 month, 3 months, and 6 months using five research instruments: Demographic proforma, Infant clinical outcome, Knowledge MCQ (15 questions), WHO-5 mental well-being index, and PSOC self-efficacy (17 items).

This feature rebuilds the `/admin/participants` Participants tab into a three-layer Researcher Analytics Dashboard:
1. **Cohort Overview** — aggregate KPIs and charts across all (or filtered) participants
2. **Participant List** — the existing table upgraded with search, filter, sort, and status indicators
3. **Individual Participant Profile** — full drill-down into one mother's longitudinal data

### Codebase Investigation Summary

Before writing requirements, all specified files were investigated. Key findings:

**What already exists and can be reused or extended:**
- `adminService.ts`: `listParticipants()` (basic `hospitalId`/`birthWeightStratum` filters only), `getParticipantDetail()` (full assessment includes), `assignStudyGroup()`, hospital CRUD
- `exportService.ts`: single-sheet Excel export, baseline scores only, no filter awareness — needs extension
- `adminController.ts` / `adminRoutes.ts`: existing REST endpoints for participants and hospitals
- `checklistService.ts`: full daily checklist logic including `dangerSignsReviewed: Boolean` in `DailyLog`
- `growthService.ts`: WHO z-score calculations, weight gain validation, `mapGrowthReading()` utility
- `ParticipantList.tsx`: basic table with Code, Hospital, Group, Stratum, Status columns — needs upgrade
- `ParticipantDetailView.tsx`: plain-list display of all assessment data — needs visual upgrade
- `GrowthChart.tsx`: existing SVG-based growth chart (custom, **mother-facing only** — fetches from mother's own endpoint; cannot be directly reused for admin; must create an admin-specific variant)
- `AdminHeader.tsx`: pill nav with Participants, Hospitals, Learning tabs — do not modify

**What needs to be built new:**
- `analyticsService.ts` (or equivalent) — cohort aggregation queries with full filter awareness
- All chart rendering for the cohort overview (no chart library is currently installed)
- Filter panel with persistent state
- Enhanced participant list columns and interactions
- Redesigned individual profile page with timeline and score history charts
- Admin-scoped growth chart variant (wraps growthService data, not mother-facing API)
- Extended export service with filter awareness and missing-data report

**Schema gaps identified (flagged as open questions):**
- No `DangerSignAlert` model. The only danger-sign data in `DailyLog` is `dangerSignsReviewed: Boolean` — this is a checklist acknowledgement, not a clinical alert with categorisation or narrative. Surfacing "danger sign alerts raised" requires either: (a) treating `stoolAbnormal: Boolean` and low WHO-5 / low z-score flags as proxy alert signals, or (b) adding a dedicated schema table. This is a **schema gap** that must be resolved before implementing requirement 1.7.
- No session/activity log table. Engagement beyond `User.lastLoginAt` can only be proxied via `DailyLog` date presence. This feeds into the open question on engagement definition (see Open Questions §1).
- `ContentView` tracks unique views per item but not completion or time-on-content.
- `MessageDelivery` has no `readAt` field — no read-receipt data exists.

---

## Glossary

- **Dashboard**: The Researcher Analytics Dashboard at `/admin/participants`, visible only to the researcher role
- **Cohort_Overview**: Layer 1 of the Dashboard — aggregate KPIs and charts across all (or filtered) participants
- **Participant_List**: Layer 2 of the Dashboard — filterable, sortable table of enrolled mothers
- **Participant_Profile**: Layer 3 of the Dashboard — individual drill-down page for one mother
- **Filter_Panel**: Persistent filter controls that affect both Cohort_Overview and Participant_List simultaneously
- **Analytics_Service**: New backend service responsible for filter-aware cohort aggregation queries
- **Export_Service**: Existing `exportService.ts`, to be extended with filter awareness and missing-data reporting
- **Study_Group**: Either `study` or `control`, assigned by the researcher at enrolment
- **Control_Group**: Participants assigned to the `control` study group — receive standard care only
- **Checkpoint**: One of four formal assessment time points: `baseline`, `1_month`, `3_month`, `6_month`
- **Research_Instrument**: One of five data collection tools: Demographic proforma, Infant clinical outcome, Knowledge MCQ (15Q), WHO-5, PSOC (17-item)
- **Engagement**: The daily care checklist completion rate for Study-group participants — percentage of days in the past 28 days where a `DailyLog` record exists with `completedCount >= 5` (out of 7 checklist items). Applies to Study group only; Control group has no engagement data.
- **Engagement_Tier**: Categorical label derived from Engagement score: High ≥ 75%, Medium 40–74%, Low 10–39%, Inactive < 10%.
- **Danger_Sign_Flag**: An open `DangerSignAlert` record for a participant — i.e. a record where `status = 'OPEN'` or `status = 'ACKNOWLEDGED'` and `resolvedAt` is null. Stored in the new `DangerSignAlert` table (schema migration required, see OQ-5 resolution).
- **Stratum**: Birth-weight stratum assigned at enrolment (`VLBW` ≤ 1500 g, `LBW` 1501–2499 g, etc.)
- **Site**: The hospital at which a participant was enrolled
- **Overdue_Checkpoint**: A `FollowUpSchedule` record where `status = 'pending'` and `scheduledDate` is in the past
- **Corrected_Age**: Chronological age minus the number of weeks of prematurity — used throughout for clinical assessment
- **GrowthChart_Admin**: An admin-scoped growth chart component that accepts a `motherProfileId` and fetches data via the admin API, distinct from the mother-facing `GrowthChart.tsx`

---

## Open Questions

### OQ-1: Engagement Definition — ✅ RESOLVED
**Decision**: Candidate A — Daily Checklist Completion Rate (MVP).
**Definition**: Engagement score = percentage of days in the past 28 days on which a `DailyLog` record exists where `completedCount >= 5`. Tiers: High ≥ 75%, Medium 40–74%, Low 10–39%, Inactive < 10%.
**Rationale**: The daily care checklist is the core intervention artefact. Checklist completion is the most direct proxy for intervention fidelity. No new schema required — `checklistService.ts` already has this data.
**Fast-follow**: Revisit as Candidate C (composite score) once several weeks of real data exist and signal correlations can be evaluated.

### OQ-2: Control Group Assessment Data — ⚠️ PENDING CONFIRMATION BY DR. P. PONNARASI
**Working assumption** (based on RCT design): Control group participants have WHO-5, PSOC, and Knowledge MCQ assessments collected at all four checkpoints by research staff (in-person or phone interview), entered into the system via `StaffDataEntryPanel` or direct DB entry — not via app self-report.
**Action required**: Antik must confirm this directly with Dr. P. Ponnarasi before Requirement 4 (Outcome Score Charts) is implemented. If confirmed: charts show Study vs Control. If not: charts are Study-only and Req 4 criterion 6 applies.
**Design/tasks impact**: Requirement 4 criteria 1–3 remain marked ⚠️ [PENDING OQ-2 CONFIRMATION] until verified. Implementation tasks for Req 4 are sequenced last so they can be unblocked independently.

### OQ-3: i18n Scope — ✅ RESOLVED
**Decision**: No localisation required. Admin panel remains English-only. No string extraction needed.

### OQ-4: Real-Time vs. Cached Aggregation — ✅ RESOLVED
**Decision**: On-demand aggregation for MVP at N=272. Design document includes a note to revisit caching (materialised `CohortSnapshot` table, nightly refresh) if the study scales beyond ~2,000 participants or if response times exceed 2,000ms in production.

### OQ-5: Danger Sign Schema — ✅ RESOLVED
**Decision**: Option B — new `DangerSignAlert` table (schema migration required).
**Rationale**: (1) The planned mother-facing Danger Sign Checker feature will also need this table — building it now gives both features a single source of truth. (2) An RCT audit trail requires timestamps for when an alert was raised, acknowledged, and resolved — a proxy Boolean cannot carry this. (3) `stoolAbnormal` as a proxy understates alert count and is misleading in a research context.
**Schema addition required**: `DangerSignAlert` model with fields: `id`, `motherProfileId`, `raisedAt` (DateTime), `category` (enum: e.g. `STOOL_ABNORMAL`, `POOR_WEIGHT_GAIN`, `POOR_WELLBEING`, `DEVELOPMENTAL_CONCERN`, `OTHER`), `description` (String?), `acknowledgedAt` (DateTime?), `resolvedAt` (DateTime?), `resolvedBy` (String? — actorId), `status` (enum: `OPEN`, `ACKNOWLEDGED`, `RESOLVED`). Migration must not break existing `DailyLog` data.

---

## Requirements

### Requirement 1: Cohort Overview — Enrollment and Onboarding KPIs

**User Story:** As Dr. P. Ponnarasi, I want to see top-level enrollment KPIs at a glance, so that I can monitor study progress against targets without querying the database manually.

#### Acceptance Criteria

1. THE Dashboard SHALL display the total count of enrolled participants, where "enrolled" is defined as any `MotherProfile` record where `participantCode` is non-null.
2. THE Dashboard SHALL display the count of participants assigned to the Study group and the count assigned to the Control group, each alongside its target of 136. THE Dashboard SHALL additionally display a count of participants where `studyGroup` is null (labelled "Awaiting Assignment").
3. THE Dashboard SHALL display the count of enrolled participants per Site.
4. THE Dashboard SHALL display the count of participants with `onboardingCompletedAt` set (Onboarded) and the count without (Pending Onboarding), expressed as both a count and a percentage of total enrolled, where the denominator is the enrolled count from criterion 1.
5. WHEN the researcher applies a filter in the Filter_Panel, THE Dashboard SHALL recompute all KPI values in criteria 1–4 and 7 to reflect only participants matching the active filter within 2000ms of the filter change.
6. THE Dashboard SHALL display an enrollment-over-time line chart showing cumulative enrollment count by ISO 8601 calendar week (Monday–Sunday), with the x-axis spanning from the week containing the earliest `enrolledAt` date to the current week, and a horizontal reference line at 272.
7. THE Dashboard SHALL display a count of Study-group participants who have a `DailyLog` entry with `careDate` on or between (current date − 6 days) and the current date, inclusive — labelled "Active (last 7 days)". This metric is subject to the active Filter_Panel state. *Note: this metric applies to Study group only.*
8. THE Dashboard SHALL display a count of participants who have at least one `DangerSignAlert` record with `status IN ('OPEN', 'ACKNOWLEDGED')` and `raisedAt` within the selected date range. This metric is subject to the active Filter_Panel state.

---

### Requirement 2: Cohort Overview — Assessment Completion KPIs

**User Story:** As Dr. P. Ponnarasi, I want to see assessment completion rates per instrument per checkpoint, so that I can identify which participants are missing critical research data.

#### Acceptance Criteria

1. THE Dashboard SHALL display the assessment completion rate for each of the four Checkpoints (baseline, 1_month, 3_month, 6_month) for each of the five Research_Instruments (Demographic proforma, Infant clinical outcome, Knowledge MCQ, WHO-5, PSOC), expressed as a percentage of participants for whom that checkpoint was due — where "due" means the participant has a `FollowUpSchedule.scheduledDate` ≤ current server date for that checkpoint. For the Demographic proforma, completion is inferred from `onboardingCompletedAt` being non-null. For Infant clinical outcome, completion is inferred from `BabyProfile` being present.
2. IF a `FollowUpSchedule` record has `status = 'pending'` AND `scheduledDate < current server date`, THEN THE Dashboard SHALL count that record as an Overdue_Checkpoint. THE Dashboard SHALL display the total count of such records across all participants.
3. THE Dashboard SHALL display an actionable list of participants with at least one Overdue_Checkpoint, including the participant code, site, and which checkpoint is overdue, sorted by `scheduledDate` ascending. IF no overdue checkpoints exist, THE Dashboard SHALL display a zero-state message ("No overdue checkpoints").
4. WHEN the researcher applies a filter in the Filter_Panel, THE Dashboard SHALL recompute assessment completion rates to reflect only participants matching the active filter.
5. THE Dashboard SHALL display a bar chart of assessment completion rates grouped by Checkpoint and Research_Instrument, allowing the researcher to compare completion across all combinations. THE Dashboard SHALL only render a bar (including a zero-height bar labelled "0%") for combinations where the checkpoint is applicable to the instrument and participants were due for it; combinations that do not apply SHALL be omitted from the chart entirely.

---

### Requirement 3: Cohort Overview — Engagement Charts (Study Group Only)

**User Story:** As Dr. P. Ponnarasi, I want to see engagement trends for the Study group over time, so that I can monitor intervention uptake and identify periods of dropout.

#### Acceptance Criteria

1. WHEN the Engagement definition has been confirmed, THE Dashboard SHALL display an engagement trend line chart showing the mean Engagement score per ISO 8601 calendar week for the Study group, with the x-axis spanning from the week containing the earliest Study-group `enrolledAt` date to the current week. Engagement score = percentage of days in the past 28 days where a `DailyLog` record exists with `completedCount >= 5`.
2. THE Dashboard SHALL NOT display engagement charts for Control group participants.
3. WHEN the researcher applies a Site filter in the Filter_Panel, THE Dashboard SHALL display a grouped bar chart comparing, per Site, the percentage distribution of participants across Engagement Tiers (High / Medium / Low / Inactive) for Study group participants, where the percentages within each site sum to 100%. IF only one site is selected, THE Dashboard SHALL still render the grouped bar chart with a single group.
4. THE Dashboard SHALL display the text "Study group only" immediately above or below the title of each engagement chart.
5. IF the active filters yield zero Study-group participants, THEN THE Dashboard SHALL display a message "No Study-group data for the current filter" in place of each engagement chart.

---

### Requirement 4: Cohort Overview — Outcome Score Trends

**User Story:** As Dr. P. Ponnarasi, I want to see mean outcome scores per instrument at each checkpoint for both Study and Control groups, so that I can monitor intervention effect on a cohort level.

#### Acceptance Criteria

1. ⚠️ [PENDING OQ-2 CONFIRMATION BY DR. P. PONNARASI] WHEN Control group assessment data collection is confirmed, THE Dashboard SHALL display a line chart of mean WHO-5 percentage score (0–100) at each Checkpoint, computed as the mean across all participants of that group who have a `Who5Assessment` record at that `timePoint`, with separate series for Study group and Control group.
2. ⚠️ [PENDING OQ-2 CONFIRMATION BY DR. P. PONNARASI] WHEN Control group assessment data collection is confirmed, THE Dashboard SHALL display a line chart of mean PSOC total score (0–102) at each Checkpoint, computed as the mean across all participants of that group who have a `PsocAssessment` record at that `timePoint`, with separate series for Study group and Control group.
3. ⚠️ [PENDING OQ-2 CONFIRMATION BY DR. P. PONNARASI] WHEN Control group assessment data collection is confirmed, THE Dashboard SHALL display a line chart of mean Knowledge MCQ score (0–15) at each Checkpoint, computed as the mean across all participants of that group who have a `KnowledgeAssessment` record at that `timePoint`, with separate series for Study group and Control group.
4. THE Dashboard SHALL label each series with its group name (Study / Control) using distinct colours AND a distinct line style (e.g. solid vs. dashed) to remain legible in monochrome.
5. IF fewer than 5 participants of a given group have submitted an assessment at a given Checkpoint, THEN THE Dashboard SHALL display a data-sparsity notice for that data point, stating the group name, checkpoint label, and the message "fewer than 5 responses — interpret with caution", instead of plotting a mean value.
6. IF Control group assessment data is unavailable (OQ-2 unresolved or confirmed absent), THEN THE Dashboard SHALL display each outcome score chart with the Study group series only, and SHALL include a visible notice that Control group data is not available.

---

### Requirement 5: Filter Panel

**User Story:** As Dr. P. Ponnarasi, I want persistent filters that affect both the cohort overview and the participant list simultaneously, so that I can focus analysis on a specific subgroup without losing context.

#### Acceptance Criteria

1. THE Filter_Panel SHALL provide a Site filter with options for each Hospital (Bankura MCH, Burdwan MCH, Purba Bardhaman MCH, Deban Mahato MCH) plus an "All sites" default.
2. THE Filter_Panel SHALL provide a Group filter with options: Study, Control, Both (default).
3. THE Filter_Panel SHALL provide a Stratum filter with options corresponding to the distinct `birthWeightStratum` values present in the database plus "All strata".
4. THE Filter_Panel SHALL provide a Status filter with options: Onboarded, Pending, Both (default).
5. THE Filter_Panel SHALL provide a Checkpoint Window filter with the following options: "All checkpoints" (default), "Overdue" (next scheduled checkpoint has `scheduledDate` before today), "Due this week" (next scheduled checkpoint falls within the current ISO calendar week, Monday–Sunday), "Due this month" (next scheduled checkpoint falls within the current calendar month), "Due next month" (next scheduled checkpoint falls within the next calendar month).
6. THE Filter_Panel SHALL provide a Date Range filter for enrollment date (`enrolledAt`), with a start-date and end-date picker. The default state is no restriction (all enrollment dates). IF the researcher sets a start date after the end date, THEN THE Filter_Panel SHALL display an inline validation error AND SHALL NOT apply the filter until the error is resolved — the previous valid filter state SHALL remain active.
7. THE Filter_Panel SHALL provide an Engagement Tier filter with options: High (≥ 75%), Medium (40–74%), Low (10–39%), Inactive (< 10%), All (default). This filter applies to Study group participants only; selecting an Engagement Tier while Group filter is set to "Control" SHALL display a notice "Engagement data is not available for Control group participants" and SHALL NOT filter Control participants by tier.
8. WHEN the researcher changes any filter value, THE Dashboard Cohort_Overview KPIs and the Participant_List SHALL both update to reflect the new filter state within 2000ms.
9. THE Filter_Panel SHALL persist the active filter state in `sessionStorage` for the duration of the researcher's browser session, restoring it on page reload.
10. THE Filter_Panel SHALL provide a "Clear all filters" control that atomically resets all filters to their default values simultaneously: Site → "All sites", Group → "Both", Stratum → "All strata", Status → "Both", Checkpoint Window → "All checkpoints", Date Range → no restriction.

---

### Requirement 6: Participant List Enhancements

**User Story:** As Dr. P. Ponnarasi, I want a richer participant table with search, sort, and status indicators, so that I can quickly locate specific participants and identify those who need follow-up.

#### Acceptance Criteria

1. THE Participant_List SHALL display the following columns: Participant Code, Site, Group, Stratum, Enrollment Date, Days Since Enrollment, Last Active Date, Onboarding Status, Next/Overdue Checkpoint, Engagement Tier (Study group only), and Danger Sign Flag.
2. THE Participant_List SHALL compute Days Since Enrollment as the number of calendar days between `enrolledAt` and the current date.
3. THE Participant_List SHALL compute Last Active Date as the most recent `DailyLog.careDate` for Study group participants, or as the `User.lastLoginAt` value for Control group participants. IF no activity exists, THE Participant_List SHALL display "Never".
4. THE Participant_List SHALL display a Next/Overdue Checkpoint indicator per the following rules, evaluated in priority order: IF a participant has an Overdue_Checkpoint (`status = 'pending'` AND `scheduledDate < today`), THEN THE Participant_List SHALL display an amber overdue chip (overdue status takes priority). ELSE IF the participant has a `FollowUpSchedule` record with `scheduledDate` within the next 7 calendar days and `status = 'pending'`, THEN THE Participant_List SHALL display a blue upcoming chip. OTHERWISE THE Participant_List SHALL display no chip.
5. THE Participant_List SHALL be sortable by any displayed column, toggling between ascending and descending order on click. The default sort order on initial load is Enrollment Date ascending.
6. THE Participant_List SHALL provide a search input that filters rows by partial case-insensitive match on Participant Code.
7. WHEN the researcher clicks a participant row, THE Participant_List SHALL navigate to the Participant_Profile page for that participant.
8. THE Participant_List SHALL support bulk selection of participants via checkboxes. The header checkbox selects or deselects all rows currently visible after applying the active search and filter state — not all 272 participants unconditionally.
9. WHEN at least one participant is bulk-selected, THE Participant_List SHALL display an export button. Clicking the export button SHALL trigger an Excel download (.xlsx) containing one row per selected participant, with columns: Participant Code, Site, Group, Stratum, Enrollment Date, Days Since Enrollment, Last Active Date, Onboarding Status, and Next/Overdue Checkpoint label.
10. THE Participant_List SHALL display an Engagement Tier chip (High / Medium / Low / Inactive) for Study group participants, computed as described in the Engagement definition (Glossary). THE Participant_List SHALL display a dash "—" in the Engagement Tier column for Control group participants.
11. THE Participant_List SHALL display 50 rows per page with pagination controls. Sort and search SHALL operate across all pages (not just the visible page).

---

### Requirement 7: Site Comparison Chart

**User Story:** As Dr. P. Ponnarasi, I want to compare enrollment and engagement across sites in a single chart, so that I can identify sites that need additional support or are outperforming expectations.

#### Acceptance Criteria

1. THE Dashboard SHALL display a grouped bar chart comparing enrollment count per Site, with bars grouped by Study vs. Control group. THE Dashboard SHALL display each site using its full hospital name (e.g. "Bankura MCH", not a code).
2. THE Dashboard SHALL display a grouped bar chart comparing mean Engagement score per Site for Study group participants, using the checklist completion rate definition (Engagement = % of days in past 28 days with `completedCount >= 5`). THE Dashboard SHALL display each site using its full hospital name.
3. THE Dashboard SHALL label all Site comparison chart axes and legends with full hospital names, not database codes.

---

### Requirement 8: Individual Participant Profile — Header and Demographics

**User Story:** As Dr. P. Ponnarasi, I want a clear participant header with key identifiers and computed age values, so that I can orient myself when reviewing any participant's longitudinal data.

#### Acceptance Criteria

1. THE Participant_Profile SHALL display a header containing: Participant Code, Site name, Study Group, Stratum, Onboarding Status (displayed as "Onboarded" when `onboardingCompletedAt` is set, or "Pending" when it is not), Enrollment Date, Baby Corrected Age, and Baby Chronological Age — where both age values are displayed in whole weeks and remaining days (e.g. "8 weeks 3 days"), computed using the current date as the reference date.
2. THE Participant_Profile SHALL compute Corrected Age by calling the shared `calculateCorrectedAge` utility, passing `babyProfile.dateOfBirth`, `babyProfile.gestationalAgeWeeks`, and the current date as `referenceDate` — THE Participant_Profile SHALL NOT reimplement the age calculation logic.
3. THE Participant_Profile SHALL display a back-navigation link to the Participant_List, preserving the active Filter_Panel state.
4. IF `babyProfile` is null for the participant, THEN THE Participant_Profile SHALL display a notice that the baby profile has not yet been completed, and SHALL NOT attempt to render age or growth data.
5. IF `babyProfile` exists but `dateOfBirth` or `gestationalAgeWeeks` is missing or invalid, THEN THE Participant_Profile SHALL display an error notice indicating that age cannot be computed, and SHALL NOT attempt to render age or growth data.

---

### Requirement 9: Individual Participant Profile — Assessment Score History

**User Story:** As Dr. P. Ponnarasi, I want to see each participant's assessment scores across all four checkpoints in one view, so that I can track individual outcome trajectories.

#### Acceptance Criteria

1. THE Participant_Profile SHALL display a score history as a table with Research_Instruments as rows and Checkpoints as columns, in the order: baseline → 1_month → 3_month → 6_month left to right.
2. THE score history table SHALL display the Knowledge MCQ score and grade at each Checkpoint where a `KnowledgeAssessment` record exists for that participant. The score SHALL be displayed as returned by the backend API. IF the returned score exceeds 15, THE score history table SHALL display the actual value with a warning indicator (e.g. an amber superscript "!" with tooltip "Score exceeds expected maximum of 15").
3. THE score history table SHALL display the WHO-5 percentage score (0–100) at each Checkpoint where a `Who5Assessment` record exists, with an amber visual indicator (amber background cell or amber badge) shown when `poorWellbeingFlag = true`.
4. THE score history table SHALL display the PSOC `totalScore` (0–102), `efficacyScore`, and `satisfactionScore` at each Checkpoint where a `PsocAssessment` record exists.
5. THE score history table SHALL display the TDSC `suspectedDelay` status at each Checkpoint where a `TdscAssessment` record exists, with an amber visual indicator shown when `suspectedDelay = true`.
6. THE score history table SHALL display the Breastfeeding total score and grade at each Checkpoint where a Breastfeeding assessment record exists.
7. IF no assessment record exists for a given instrument at a given Checkpoint, THEN THE score history table SHALL display "Not recorded" for that cell, NOT an error or blank.
8. THE Participant_Profile SHALL display all scoring values exactly as returned by the backend API — THE Participant_Profile SHALL NOT recompute scores or interpret clinical thresholds differently from the backend services.

---

### Requirement 10: Individual Participant Profile — Growth and Clinical Data

**User Story:** As Dr. P. Ponnarasi, I want to see a participant's baby growth data and immunization status in the profile view, so that I have clinical context alongside the research instrument scores.

#### Acceptance Criteria

1. THE Participant_Profile SHALL display a GrowthChart_Admin component that renders the baby's growth readings plotted against WHO percentile curves, using corrected age (in weeks) on the x-axis.
2. THE GrowthChart_Admin SHALL fetch growth data via the admin API route (`/admin/participants/:id/growth`) rather than the mother-facing growth endpoint.
3. THE GrowthChart_Admin SHALL use the `mapGrowthReading()` function and WHO z-score reference data from the shared growth service layer — THE GrowthChart_Admin SHALL NOT duplicate z-score calculation logic.
4. THE Participant_Profile SHALL display a vaccine record table listing each vaccine's name, due date, completion date (if completed), and current status (e.g. "Completed", "Overdue", "Due").
5. IF no growth readings exist for a participant AND `dischargeWeight` is non-null and non-zero in `BabyProfile`, THEN THE Participant_Profile SHALL display the `dischargeWeight` as a single baseline data point on the chart, labelled "Discharge weight". IF `dischargeWeight` is also null or zero, OR if the researcher explicitly confirmed (per OQ answer) that the notice should show instead, THEN THE Participant_Profile SHALL display the notice "No growth data recorded" instead of the chart.
6. IF the admin growth API request fails, THEN THE GrowthChart_Admin SHALL display an error message "Unable to load growth data" and SHALL NOT crash the rest of the Participant_Profile page.

---

### Requirement 11: Individual Participant Profile — Activity Timeline

**User Story:** As Dr. P. Ponnarasi, I want to see a recent activity timeline for each participant, so that I can understand their engagement pattern and identify periods of inactivity.

#### Acceptance Criteria

1. THE Participant_Profile SHALL display a 30-day activity heatmap showing, for each of the 30 calendar days ending on the current date, whether a `DailyLog` entry exists for that date — rendered as a filled cell (activity present) or an empty cell (no activity).
2. THE Participant_Profile SHALL display the Follow-Up Schedule with all four Checkpoints, showing each checkpoint's `status`, `scheduledDate`, and `actualDate` (if completed). IF `actualDate` is null and `status` is not `pending`, THE Participant_Profile SHALL display "Not yet completed".
3. THE Participant_Profile SHALL display, for each Checkpoint, whether each of the three assessed research instruments (Knowledge MCQ, WHO-5, PSOC) has been completed, derived from the presence of an assessment record with the matching `timePoint`. Each instrument SHALL be shown as "Completed" or "Not recorded".
4. WHEN a Checkpoint `status` is `pending` AND `scheduledDate` is before the current date, THE Participant_Profile SHALL visually indicate this as overdue using an amber indicator (amber border or amber badge on the checkpoint row).
5. IF no `DailyLog` entries exist for the participant within the specific 30-day window being displayed (ending on the current date), THE Participant_Profile SHALL render the heatmap with all cells empty and display the label "No activity in the last 30 days".

---

### Requirement 12: Individual Participant Profile — Export

**User Story:** As Dr. P. Ponnarasi, I want to export a single participant's full dataset as a spreadsheet, so that I can perform offline analysis or share data with co-investigators.

#### Acceptance Criteria

1. THE Participant_Profile SHALL provide a per-participant export button that, when clicked, triggers a download of an Excel file named `participant_<participantCode>_<YYYY-MM-DD>.xlsx`, containing all assessment scores, growth readings, immunization records, and a checklist summary for that participant.
2. THE Export_Service SHALL generate the per-participant export using ExcelJS with five worksheet tabs: "Demographics", "Assessment Scores" (all instruments × all checkpoints in one sheet), "Growth Readings", "Immunization", and "Daily Log Summary" (one row per calendar day from enrollment date to current date, showing `DailyLog` presence, `completedCount`, and `dangerSignsReviewed` where a record exists).
3. THE Export_Service SHALL NOT include `User.passwordHash`, `User.pinHash`, or any authentication credential fields in any export output.
4. WHEN a per-participant export is generated, THE Export_Service SHALL record an audit log entry via the existing `recordAudit()` function, including the `motherProfileId` and the requesting researcher's `actorId`. IF `recordAudit()` throws an exception, THE Export_Service SHALL log the error and SHALL NOT block the file download.
5. IF the export generation fails due to a database or file-generation error, THEN THE Participant_Profile SHALL display an error message to the researcher and SHALL NOT initiate a file download.

---

### Requirement 13: Cohort Export and Missing-Data Report

**User Story:** As Dr. P. Ponnarasi, I want filter-aware cohort exports and a missing-data report, so that I can plan follow-up calls for participants with incomplete assessment data.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a cohort export button that generates an Excel download for all participants matching the active Filter_Panel state.
2. THE Export_Service SHALL accept filter parameters (Site, Group, Stratum, Status, enrollment date start, enrollment date end) and apply all provided non-null parameters as `WHERE` clauses to the cohort export query — THE Export_Service SHALL NOT export participants excluded by the active filters.
3. THE Export_Service SHALL generate a multi-sheet Excel workbook for cohort exports with the following tabs: "Participant Overview", "Knowledge MCQ Scores", "WHO-5 Scores", "PSOC Scores", "Growth Readings", and "Missing Data Report".
4. THE "Missing Data Report" tab SHALL list each participant who has at least one Research_Instrument assessment that was expected (i.e. the participant has a `FollowUpSchedule.scheduledDate` ≤ current server date for that checkpoint) but is absent from the database. Each row SHALL include: participant code, site name, phone number from `User.phone` (or "Not available" if null), the specific checkpoint label, and the specific instrument(s) missing at that checkpoint.
5. THE Export_Service SHALL NOT include `User.passwordHash`, `User.pinHash`, or any other authentication credential fields in any export output.
6. WHEN a cohort export is successfully generated and fully completed, THE Export_Service SHALL record an audit log entry via the existing `recordAudit()` function, including the active filter parameters as a JSON object in `metadata`. THE Export_Service SHALL NOT log audit entries for failed export attempts or for exports that fail partway through.
7. IF the active filter yields zero matching participants, THEN THE Export_Service SHALL return an error response with a message "No participants match the current filter — export aborted", and SHALL NOT generate an empty workbook.

---

### Requirement 14: Analytics Service — Filter-Aware Aggregation

**User Story:** As Dr. P. Ponnarasi, I want dashboard queries that are filter-aware and avoid N+1 database patterns, so that the dashboard remains responsive as data accumulates over the study period.

#### Acceptance Criteria

1. THE Analytics_Service SHALL implement all cohort aggregation queries for the KPIs defined in Requirements 1–4 using Prisma's `groupBy`, `count`, and `aggregate` primitives rather than fetching all records and computing in application memory.
2. THE Analytics_Service SHALL accept a filter object with the following optional fields: `hospitalId`, `studyGroup`, `birthWeightStratum`, `onboardingStatus`, `enrolledAfter`, `enrolledBefore` — and SHALL apply all non-null fields as `where` clauses in the same Prisma query. IF `enrolledAfter` is provided and is later than `enrolledBefore`, THEN THE Analytics_Service SHALL return an HTTP 400 response with a descriptive error message.
3. THE Analytics_Service SHALL NOT issue a separate database query per participant when computing cohort-level aggregates for Requirements 1–4.
4. WHEN the Filter_Panel state changes, THE Analytics_Service SHALL recompute all KPIs for Requirements 1–4 in a single API call and return the full result within 2000ms for the study's maximum dataset size of 272 participants.
5. IF the database is unavailable when an analytics request is made, THEN THE Analytics_Service SHALL return an HTTP 503 response with the message "Analytics service temporarily unavailable" — THE Analytics_Service SHALL NOT return a partial or stale result without indicating data freshness.

---

### Requirement 15: Visual Design Consistency

**User Story:** As Dr. P. Ponnarasi, I want the new dashboard to match the existing admin panel visual language, so that the interface feels like a coherent product rather than a patched-in addition.

#### Acceptance Criteria

1. THE Dashboard SHALL use the existing `care-canvas` background token, `surface-brand` black hero banner, pill-shaped nav tabs from the existing `AdminHeader` component, and `.care-chip` pastel status chips. IF the project has a `.dark` token set, THE Dashboard SHALL respect it. IF no dark tokens exist, THE Dashboard SHALL use light mode regardless of the user's system preferences — THE Dashboard SHALL NOT attempt to construct a dark appearance from non-existent tokens.
2. THE Dashboard SHALL use the pink active-tab pill styling from the existing `AdminHeader` component for the active navigation item — THE Dashboard SHALL NOT modify `AdminHeader.tsx`.
3. THE Dashboard SHALL NOT introduce a new design system, component library, or CSS framework token set beyond what is already present in the project's Tailwind configuration.
4. THE Dashboard SHALL NOT modify the Hospitals tab, the Learning tab, or any components used exclusively by those tabs.
5. THE Dashboard SHALL NOT modify any mother-facing app pages, routes, or database schema fields used by the mother-facing app.
6. WHEN a chart library is required for cohort-level charts, THE Dashboard SHALL use a library that builds without errors under the project's React 19 + Vite + Tailwind CSS 4 configuration. The confirmed library name SHALL be documented in `design.md` before any chart component is implemented — THE Dashboard SHALL NOT import a chart library that has not been confirmed in `design.md`.

---

### Requirement 16: Access Control

**User Story:** As the system architect, I want all new analytics endpoints to be restricted to the researcher role, so that participant data is not accessible to nurses or unauthenticated users.

#### Acceptance Criteria

1. THE Analytics_Service endpoints SHALL require both a valid authentication token AND the `researcher` role. A researcher with a valid token making a request to any analytics or export endpoint SHALL receive a successful (2xx) response when the query is valid.
2. IF a request to any analytics or export endpoint is made without a valid authentication token, THEN THE system SHALL return an HTTP 401 response.
3. IF a request to any analytics or export endpoint is made with a valid token belonging to a non-researcher role, THEN THE system SHALL return an HTTP 403 response.
4. IF a request to the per-participant export endpoint (`/admin/participants/:id/export`) is made without a valid authentication token, THEN THE system SHALL return an HTTP 401 response.
5. IF a request to the per-participant export endpoint is made with a valid token belonging to a non-researcher role, THEN THE system SHALL return an HTTP 403 response.
