# Implementation Plan: Researcher Analytics Dashboard

## Overview

Rebuild the `/admin/participants` tab into a three-layer Researcher Analytics Dashboard: Cohort Overview (KPI strip + charts), Participant List (upgraded table), and Participant Profile (individual drill-down). The implementation is organised into six phases that map directly to the dependency order described in the task brief. No task may begin until all tasks it depends on are complete.

The design document uses TypeScript throughout — all new code is TypeScript.

---

## Tasks

### PHASE 0 — Foundation

- [x] 1. Install frontend dependencies (Recharts + React Query)
  - Run `npm install recharts@^2.15.0` in `frontend/`
  - Run `npm install @tanstack/react-query@^5.80.0` in `frontend/`
  - Verify `frontend/package.json` lists both packages at the pinned versions
  - Run `tsc -b && vite build` in `frontend/` — build must succeed with zero errors
  - Add `QueryClient` and `QueryClientProvider` to `frontend/src/main.tsx` wrapping the app
  - _Requirements: Req 15 criteria 3, 6; Design §1, §6.3_

- [x] 2. Prisma schema migration — DangerSignAlert
  - Add `DangerSignCategory` enum to `backend/prisma/schema.prisma` with values: `STOOL_ABNORMAL`, `POOR_WEIGHT_GAIN`, `POOR_WELLBEING`, `DEVELOPMENTAL_CONCERN`, `OTHER`
  - Add `DangerSignStatus` enum with values: `OPEN`, `ACKNOWLEDGED`, `RESOLVED`
  - Add `DangerSignAlert` model with all fields from Design §2, including `@@index([motherProfileId, status])` and `@@index([raisedAt])`
  - Add `dangerSignAlerts DangerSignAlert[]` relation to `MotherProfile`
  - Run `npx prisma migrate dev --name add_danger_sign_alerts` in `backend/`
  - Verify the generated migration SQL contains `CREATE TABLE "danger_sign_alerts"` and both indexes
  - Run `npx prisma generate` — the Prisma client must regenerate without errors
  - _Requirements: Req 1 criterion 8; Req 11 (danger sign flag); Design §2; OQ-5_

- [x] 3. Create `FilterContext.tsx`
  - Create `frontend/src/features/admin/FilterContext.tsx`
  - Export `FilterState` interface with all 8 fields from Design §6.1 (`hospitalId`, `studyGroup`, `birthWeightStratum`, `onboardingStatus`, `checkpointWindow`, `enrolledAfter`, `enrolledBefore`, `engagementTier`)
  - Implement `FilterContextProvider` using `React.createContext` + `useState`, initialising from `sessionStorage` key `"admin-participant-filters"` on mount
  - Expose `filters`, `setFilter(key, value)`, `clearFilters()` (atomically resets all to `null`)
  - Persist every state change to `sessionStorage` via a `useEffect`
  - Export `useFilters()` convenience hook
  - No UI — this task is context and state management only
  - _Requirements: Req 5 criteria 8, 9, 10; Design §6.1_

---

### PHASE 1 — Backend analytics service

- [x] 4. Create `analyticsService.ts` — cohort overview
  - Create `backend/src/services/analyticsService.ts`
  - Export `CohortFilter` interface matching Design §5.1 (all 8 optional fields with correct types)
  - Implement `buildWhereClause(filter: CohortFilter)` helper that converts filter fields to a Prisma `MotherProfile` `where` object; if `enrolledAfter > enrolledBefore` throw a typed 400 error
  - Implement `getCohortOverview(filter: CohortFilter)` that returns `totalEnrolled`, `studyCount`, `controlCount`, `awaitingAssignment`, `onboardedCount`, `pendingCount`, `onboardedPct`, `activeLastSevenDays` (Study group only, single `DailyLog` count query), `openDangerSignCount` (single `DangerSignAlert` count query where `status IN [OPEN, ACKNOWLEDGED]`), `overdueCheckpointCount`, and `overdueParticipants[]`
  - All counts use Prisma `groupBy` or `_count` — no per-participant N+1 queries
  - _Requirements: Req 1 all criteria; Req 14 criteria 1–5; Design §4.2, §5.1_

- [x] 5. Extend `analyticsService.ts` — enrollment trend + assessment completion
  - Add `getEnrollmentTrend(filter: CohortFilter)` returning `{ weeks: { weekStart: string, newEnrollments: number, cumulative: number }[], target: 272 }` — group `enrolledAt` by ISO week using `date_trunc('week', enrolled_at)` via Prisma `$queryRaw`; x-axis spans from earliest `enrolledAt` to current week
  - Add `getAssessmentCompletion(filter: CohortFilter)` returning completion rates for all 4 checkpoints × 5 instruments; derive denominators from `FollowUpSchedule.scheduledDate <= today`; skip inapplicable instrument×checkpoint combinations
  - Both functions inherit `buildWhereClause` from Task 4
  - _Requirements: Req 1 criterion 6; Req 2 criteria 1, 4, 5; Design §4.2_

- [x] 6. Extend `analyticsService.ts` — engagement trend + site comparison
  - Add `computeEngagementScore(logs: DailyLogRow[]): number` pure utility function: counts logs with `completedCount >= 5` (derived from summing the 7 boolean fields) in past 28 days, divides by 28, multiplies by 100
  - Add `computeEngagementTier(score: number): 'high' | 'medium' | 'low' | 'inactive'` pure utility: High ≥ 75, Medium 40–74, Low 10–39, Inactive < 10
  - Add `getEngagementTrend(filter: CohortFilter)` — Study group only; single batch `DailyLog` query; group by ISO week; return weekly mean engagement percentage
  - Add `getSiteComparison(filter: CohortFilter)` — returns per-site `studyCount`, `controlCount`, `meanEngagementPct`, `assessmentCompletionPct` using full hospital names from the `Hospital` table
  - Export `computeEngagementScore` and `computeEngagementTier` for reuse in Tasks 7, 9, 11
  - _Requirements: Req 3 criteria 1–5; Req 7 criteria 1–3; Design §3, §4.2, §5.1_

- [x] 7. Extend `analyticsService.ts` — outcome scores
  - Add `getOutcomeScores(filter: CohortFilter)` returning `{ who5, psoc, knowledge }` each as arrays of `{ checkpoint, study: { mean, n }, control: null }` per checkpoint
  - Default mode: Study group only (`control: null`); design note for OQ-2: when Control group data is confirmed, `control` field will be populated
  - If `n < 5` for any group at a checkpoint, return `{ mean: null, n, sparse: true }` for that data point
  - Use Prisma `aggregate` (`_avg`, `_count`) per `timePoint` — no per-row calculations in app layer
  - _Requirements: Req 4 criteria 1–6; Design §4.2_

- [x] 8. Create `analyticsController.ts` and `analyticsRoutes.ts`, mount in `adminRoutes.ts`
  - Create `backend/src/controllers/analyticsController.ts` with 6 handler functions: `getOverview`, `getEnrollmentTrend`, `getAssessmentCompletion`, `getEngagementTrend`, `getSiteComparison`, `getOutcomeScores`
  - Each handler parses query params into a `CohortFilter` object, calls the corresponding `analyticsService` function, and responds with `{ success: true, data: ... }`
  - Handle `enrolledAfter > enrolledBefore` as 400; DB unavailability as 503 with message "Analytics service temporarily unavailable"
  - Create `backend/src/routes/analyticsRoutes.ts` with `GET /overview`, `/enrollment-trend`, `/assessment-completion`, `/engagement-trend`, `/site-comparison`, `/outcome-scores`
  - In `backend/src/routes/adminRoutes.ts`, add `import analyticsRouter from './analyticsRoutes.js'` and `router.use('/analytics', analyticsRouter)` — no other changes to that file
  - _Requirements: Req 14 criteria 2, 4, 5; Req 16 criteria 1–3; Design §4.2, §5.4_

---

### PHASE 2 — Backend participant list + profile extensions

- [x] 9. Extend `listParticipants()` in `adminService.ts`
  - Update `listParticipants()` signature to accept `CohortFilter` (import from `analyticsService.ts`)
  - Add all new filter fields (`studyGroup`, `onboardingStatus`, `enrolledAfter`, `enrolledBefore`, `checkpointWindow`, `engagementTier`) to the Prisma `where` clause
  - For each result row, compute and attach: `daysSinceEnrollment` (calendar days from `enrolledAt` to today), `lastActiveDate` (most recent `DailyLog.careDate` for Study; `User.lastLoginAt` for Control — use batched sub-query), `engagementScore`, `engagementTier` (using `computeEngagementScore`/`computeEngagementTier` from Task 6 — single `DailyLog` batch query for all matching IDs), `nextCheckpoint` (earliest pending `FollowUpSchedule`), `isOverdue` (pending + `scheduledDate < today`), `isDueSoon` (pending + `scheduledDate` within 7 days), `hasDangerSignFlag` (any `DangerSignAlert` with `status IN [OPEN, ACKNOWLEDGED]`)
  - All enrichment uses batched queries — one query per enrichment type across all participants, then joined in memory
  - Update `frontend/src/features/admin/types.ts` to add the new fields to `ParticipantListItem`
  - _Requirements: Req 6 criteria 1–4, 10, 11; Req 14 criterion 3; Design §4.2, §5.3_

- [x] 10. Add `GET /admin/participants/:id/growth` endpoint
  - Add `getAdminParticipantGrowth(motherProfileId: string)` to `adminService.ts`
  - Fetch `MotherProfile` by ID including `babyProfile` and all `growthReadings`
  - Call `mapGrowthReading()` from `growthService.ts` for each reading (read-only reuse)
  - If no readings exist and `babyProfile.weightAtDischargeGrams > 0`, include the discharge weight as a baseline data point
  - Return `{ babyProfile: { dateOfBirth, gestationalAgeWeeks, weightAtDischargeGrams }, readings: [...with correctedAgeWeeks] }`
  - Add handler `getParticipantGrowth` to `adminController.ts`
  - Register `router.get('/participants/:id/growth', getParticipantGrowth)` in `adminRoutes.ts`
  - _Requirements: Req 10 criteria 1–3, 5; Design §4.2, §8_

- [x] 11. Extend `getParticipantDetail()` in `adminService.ts`
  - Add `dailyLogs30Day` to the response: `DailyLog` records for the past 30 days with `careDate` and `completedCount` (computed from the 7 boolean fields inline — `[breastfeedingDone, kmcDone, temperatureDone, weightCheckDone, skinCordCareDone, sleepDone, stoolDone].filter(Boolean).length`)
  - Add `engagementScore` and `engagementTier` using `computeEngagementScore`/`computeEngagementTier` from Task 6
  - Add `dangerSignAlerts` to the include: all `DangerSignAlert` records for the participant, ordered `raisedAt desc`
  - Update `frontend/src/features/admin/types.ts`: extend `ParticipantDetail` with `dailyLogs30Day`, `engagementScore`, `engagementTier`, and `dangerSignAlerts` fields
  - _Requirements: Req 11 criteria 1, 5; Req 12 all; Design §4.2, §5.3_

---

### PHASE 3 — Backend export extensions

- [x] 12. Add `generateParticipantExport()` to `exportService.ts` + route
  - Add `generateParticipantExport(motherProfileId: string): Promise<Buffer>` to `backend/src/services/exportService.ts` — do NOT modify the existing `buildParticipantExportWorkbook`
  - Build an ExcelJS workbook with 5 sheets: "Demographics" (all `MotherProfile` + `BabyProfile` fields), "Assessment Scores" (all instruments × 4 checkpoints), "Growth Readings" (all readings with `correctedAgeWeeks`), "Immunization" (all `VaccineRecord` rows), "Daily Log Summary" (one row per calendar day from `enrolledAt` to today, showing `DailyLog` presence, `completedCount`, `dangerSignsReviewed`)
  - Exclude `passwordHash` and `pinHash` from all sheets
  - Call `recordAudit()` on success only; if `recordAudit()` throws, log the error and continue (do not rethrow)
  - Add `getParticipantExport` handler to `exportController.ts` (or `adminController.ts`) and register `router.get('/participants/:id/export', getParticipantExport)` in `adminRoutes.ts`
  - _Requirements: Req 12 criteria 1–5; Req 16 criteria 4, 5; Design §9_

- [x] 13. Add `generateCohortExport()` to `exportService.ts` + route
  - Add `generateCohortExport(filter: CohortFilter): Promise<Buffer>` to `exportService.ts`
  - Return 400 with `"No participants match the current filter — export aborted"` if the filter yields zero participants before building the workbook
  - Build a 6-sheet workbook: "Participant Overview", "Knowledge MCQ Scores", "WHO-5 Scores", "PSOC Scores", "Growth Readings", "Missing Data Report"
  - "Missing Data Report" sheet: one row per missing instrument per checkpoint per participant — include participant code, site name, `User.phone` (or "Not available"), checkpoint label, missing instrument name(s)
  - Exclude `passwordHash` and `pinHash`
  - Call `recordAudit()` on full success only; do NOT audit partial or failed exports
  - Add `postCohortExport` handler and register `router.post('/export/cohort', postCohortExport)` in `adminRoutes.ts`
  - Add `downloadCohortExport(filters)` function to `frontend/src/features/admin/api.ts`
  - _Requirements: Req 13 criteria 1–7; Design §9_

---

### PHASE 4 — Frontend filter panel + participant list

- [x] 14. Build `FilterPanel.tsx`
  - Create `frontend/src/features/admin/FilterPanel.tsx`
  - Render 7 filter controls in a single horizontal bar on a `bg-care-canvas` background:
    - **Site**: `<select>` populated from `GET /admin/hospitals` (fetch once, cache); default "All sites"
    - **Group**: static `<select>` with Study / Control / Both (default)
    - **Stratum**: static `<select>` with under_1500 / 1500_to_2500 / over_2500 / All (default)
    - **Status**: static `<select>` with Onboarded / Pending / Both (default)
    - **Checkpoint Window**: static `<select>` with 5 options from Req 5 criterion 5
    - **Date Range**: two `<input type="date">` fields; validate start ≤ end; show inline error and leave previous filter state active if start > end
    - **Engagement Tier**: static `<select>`; when Group = "Control", show notice "Engagement data is not available for Control group participants" and disable this control
  - Each change calls `setFilter(key, value)` from `useFilters()`
  - "Clear all" button calls `clearFilters()`
  - _Requirements: Req 5 criteria 1–10; Design §6.1, §13_

- [x] 15. Rebuild `ParticipantList.tsx` — enhanced table
  - Rewrite `frontend/src/pages/admin/ParticipantList.tsx` (keep the file path and route)
  - Use `useQuery(['admin', 'participants', filters], ...)` from React Query with `useFilters()` to drive server-side filtering
  - Render columns: Participant Code, Site, Group, Stratum, Enrollment Date, Days Since Enrollment, Last Active Date, Onboarding Status, Next Checkpoint (amber overdue chip / blue upcoming chip), Engagement Tier chip (Study only, dash for Control), Danger Sign icon (`AlertTriangle` from Lucide, `text-red-500`) — chips use Tailwind tokens from Design §14
  - Sortable column headers; default sort: Enrollment Date asc; clicking a sorted header toggles asc/desc; sort operates across all pages
  - Search input: case-insensitive partial match on Participant Code; search operates across all pages
  - 50 rows/page pagination with `< 1 2 3 ... >` controls
  - Row checkbox for bulk select; header checkbox selects all visible rows only; "Export selected" button appears when ≥ 1 row is selected and calls the per-participant export API (`GET /admin/participants/:id/export`) for each selected row
  - Row click navigates to `/admin/participants/:id`; pass active filter state as URL search params so back-navigation restores it
  - _Requirements: Req 6 all criteria; Design §7_

---

### PHASE 5 — Frontend cohort overview

- [x] 16. Build `EnrollmentKPIStrip` + `OverdueCheckpointList`
  - Create `frontend/src/components/admin/EnrollmentKPIStrip.tsx`
  - Add `useAnalyticsOverview(filters: FilterState)` hook in `frontend/src/features/admin/analyticsHooks.ts` using `useQuery(['admin','analytics','overview', filters], ...)` with 60-second stale time
  - Render 7 KPI cards (`bg-white rounded-2xl shadow-sm p-4`): Total Enrolled, Study (n/136), Control (n/136), Onboarded (count + %), Active last 7d, Overdue Checkpoints count, Open Danger Signs count
  - Create `frontend/src/components/admin/OverdueCheckpointList.tsx`: collapsible list of `overdueParticipants` showing participant code, site, and overdue checkpoint label; zero-state: "No overdue checkpoints"
  - _Requirements: Req 1 criteria 1–5, 7–8; Req 2 criteria 2–3; Design §4.2, §13_

- [x] 17. Build `EnrollmentTrendChart` and `AssessmentCompletionChart`
  - Create `frontend/src/components/admin/EnrollmentTrendChart.tsx`
  - Use Recharts `LineChart`; x-axis: ISO week start dates; y-axis: cumulative enrollment count; add a `ReferenceLine` at y=272 labelled "Target"
  - Add `useEnrollmentTrend(filters)` and `useAssessmentCompletion(filters)` hooks to `analyticsHooks.ts`
  - Create `frontend/src/components/admin/AssessmentCompletionChart.tsx`
  - Use Recharts `BarChart` grouped by Checkpoint; one bar per instrument; skip instrument×checkpoint combinations not present in the API response; render a zero-height bar (labelled "0%") for combinations present but with 0% completion
  - _Requirements: Req 1 criterion 6; Req 2 criteria 1, 4, 5; Design §4.2_

- [x] 18. Build `EngagementTrendChart` and `SiteComparisonChart`
  - Create `frontend/src/components/admin/EngagementTrendChart.tsx`
  - Use Recharts `LineChart`; label: "Study group only" displayed immediately above/below chart title; if zero Study-group participants match filter, display "No Study-group data for the current filter" instead of chart
  - Add `useEngagementTrend(filters)` and `useSiteComparison(filters)` hooks to `analyticsHooks.ts`
  - Create `frontend/src/components/admin/SiteComparisonChart.tsx`
  - Use Recharts `BarChart`; bars grouped by Study vs Control per site; x-axis labels use full hospital names (not codes)
  - _Requirements: Req 3 criteria 1–5; Req 7 criteria 1–3; Design §4.2_

- [x] 19. Build `OutcomeScoreCharts`
  - Create `frontend/src/components/admin/OutcomeScoreCharts.tsx` containing 3 `LineChart` instances (WHO-5, PSOC, Knowledge MCQ) each in its own sub-component
  - Add `useOutcomeScores(filters)` hook to `analyticsHooks.ts`
  - Default mode: Study-only line (solid); show a visible notice "Control group data is not available" when `control` is null for all checkpoints
  - When `sparse: true` for a data point (`n < 5`), render a tooltip/notice: "fewer than 5 responses — interpret with caution" for that point instead of a plotted mean
  - When OQ-2 is confirmed and Control data becomes available: Study line = solid, Control line = dashed (same colour palette distinguishable in monochrome)
  - _Requirements: Req 4 criteria 1–6; Design §4.2_

- [x] 20. Compose `CohortOverview.tsx` and wire `ParticipantsPage.tsx`
  - Create `frontend/src/components/admin/CohortOverview.tsx` that assembles `EnrollmentKPIStrip`, `OverdueCheckpointList`, `EnrollmentTrendChart`, `AssessmentCompletionChart`, `EngagementTrendChart`, `SiteComparisonChart`, `OutcomeScoreCharts` in the layout from Design §13
  - Create (or update) `frontend/src/pages/admin/ParticipantsPage.tsx` as the route root for `/admin/participants`:
    - Wrap with `<FilterContextProvider>`
    - Render `<FilterPanel />` → `<CohortOverview />` → `<ParticipantListTable />` (the rebuilt `ParticipantList`)
  - Ensure `AdminHeader.tsx` is not modified
  - Register `/admin/participants` route in `frontend/src/routes/AppRoutes.tsx` pointing to `ParticipantsPage`
  - _Requirements: Req 15 criteria 1–5; Design §7, §13_

---

### PHASE 6 — Frontend participant profile

- [x] 21. Build `AssessmentScoreHistoryTable.tsx`
  - Create `frontend/src/components/admin/AssessmentScoreHistoryTable.tsx`
  - Render instruments as rows, checkpoints (baseline → 1_month → 3_month → 6_month) as columns
  - Instruments: Knowledge MCQ (score/grade), WHO-5 (percentageScore, amber cell when `poorWellbeingFlag = true`), PSOC (totalScore, efficacyScore, satisfactionScore), TDSC (suspectedDelay, amber indicator when `true`), Breastfeeding (totalScore, grade)
  - MCQ score > 15: display actual value with amber superscript "!" and tooltip "Score exceeds expected maximum of 15"
  - Missing assessment: display "Not recorded" — not blank, not an error
  - Display values exactly as returned by API — no client-side score recomputation
  - _Requirements: Req 9 criteria 1–8; Design §7_

- [x] 22. Build `GrowthChartAdmin.tsx`
  - Create `frontend/src/components/admin/GrowthChartAdmin.tsx`
  - Fetch from `GET /admin/participants/:id/growth` using `useQuery(['admin','participant',id,'growth'], ...)`
  - Use Recharts `ComposedChart` with `Line` for actual readings and `ReferenceLine` for WHO percentile curves (3rd, 10th, 50th, 90th, 97th); x-axis is `correctedAgeWeeks`
  - If no readings exist but discharge weight is present in `babyProfile`, render that as a single baseline data point labelled "Discharge weight"
  - If no readings AND no discharge weight: display "No growth data recorded"
  - Wrap in an error boundary; on API failure: display "Unable to load growth data" without crashing the parent page
  - Do NOT import from or modify `GrowthChart.tsx`
  - _Requirements: Req 10 criteria 1–6; Design §8_

- [x] 23. Build `ActivityHeatmap30Day.tsx` and `FollowUpSchedulePanel.tsx`
  - Create `frontend/src/components/admin/ActivityHeatmap30Day.tsx`
  - Accept `dailyLogs30Day: { careDate: string, completedCount: number }[]` as prop
  - Render 30 cells (today − 29 days to today) in a single row; filled cell = DailyLog present; empty cell = absent; zero-state label: "No activity in the last 30 days" when all cells empty
  - Create `frontend/src/components/admin/FollowUpSchedulePanel.tsx`
  - Render 4 checkpoint rows (baseline → 1_month → 3_month → 6_month); each row shows status chip and instrument completion indicators (Knowledge MCQ / WHO-5 / PSOC completed or "Not recorded")
  - Overdue row: amber indicator (amber border + amber badge) when `status = 'pending'` AND `scheduledDate < today`
  - _Requirements: Req 11 criteria 1–5; Design §7_

- [x] 24. Build `DangerSignAlertHistory.tsx` and `VaccineRecordTable.tsx`
  - Create `frontend/src/components/admin/DangerSignAlertHistory.tsx`
  - Accept `dangerSignAlerts` array as prop
  - Render alert rows with: `raisedAt` (formatted date), `category`, status badge (OPEN = red, ACKNOWLEDGED = amber, RESOLVED = green), `resolvedAt` + `resolvedBy` when resolved
  - Create `frontend/src/components/admin/VaccineRecordTable.tsx`
  - Accept `vaccineRecords` array as prop; render columns: Vaccine Name, Due Date, Completion Date, Status
  - _Requirements: Req 11 criterion 1; Req 10 criterion 4; Design §7_

- [x] 25. Compose `ParticipantProfilePage.tsx` and register route
  - Create `frontend/src/pages/admin/ParticipantProfilePage.tsx`
  - Assemble `ProfileHeader`:
    - Back link to `/admin/participants` with active filter state preserved as URL search params
    - Display: Participant Code, Site, Group, Stratum, Onboarding Status ("Onboarded" / "Pending"), Enrollment Date
    - Call `calculateCorrectedAge` utility (from `frontend/src/features/dashboard/date.ts` or equivalent) with `babyProfile.dateOfBirth`, `babyProfile.gestationalAgeWeeks`, current date; display as "X weeks Y days"
    - If `babyProfile` is null: show notice "Baby profile not yet completed" and skip age + growth rendering
    - If `babyProfile.dateOfBirth` or `gestationalAgeWeeks` is missing/invalid: show "Age cannot be computed"
  - Assemble all sub-components: `AssessmentScoreHistoryTable`, `GrowthChartAdmin`, `ActivityHeatmap30Day`, `FollowUpSchedulePanel`, `VaccineRecordTable`, `DangerSignAlertHistory`
  - Add per-participant export button that calls `GET /admin/participants/:id/export` and triggers download named `participant_<code>_<YYYY-MM-DD>.xlsx`; on failure show inline error message
  - Register route `/admin/participants/:id` in `AppRoutes.tsx` pointing to `ParticipantProfilePage`
  - _Requirements: Req 8 all criteria; Req 12 criteria 1, 4, 5; Design §7_

---

## Notes

- Tasks marked with `*` suffix are optional and can be skipped for faster MVP — there are none in this plan since the design document contains no Correctness Properties section, so property-based tests do not apply; use the project's existing Vitest unit test patterns for any testing
- Tasks within each phase are ordered so that each builds on the previous; tasks in different phases are independent of each other within the same wave
- All backend TypeScript files are compiled with `tsc` and must build error-free before a task is considered done
- The design document uses `mapGrowthReading` from `growthService.ts` — Task 10 calls it read-only; do not modify `growthService.ts`
- `AdminHeader.tsx`, `GrowthChart.tsx`, and all mother-facing pages must not be modified
- The `CohortFilter` type defined in `analyticsService.ts` (Task 4) is the single shared filter type used by Tasks 5–13

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1", "2", "3"] },
    { "id": 1, "tasks": ["4"] },
    { "id": 2, "tasks": ["5", "6"] },
    { "id": 3, "tasks": ["7", "8"] },
    { "id": 4, "tasks": ["9", "10", "11"] },
    { "id": 5, "tasks": ["12", "13"] },
    { "id": 6, "tasks": ["14", "15"] },
    { "id": 7, "tasks": ["16", "17", "18", "19"] },
    { "id": 8, "tasks": ["20"] },
    { "id": 9, "tasks": ["21", "22", "23", "24"] },
    { "id": 10, "tasks": ["25"] }
  ]
}
```
