# Design Document — Researcher Analytics Dashboard

## Overview

This document describes the technical design for rebuilding the `/admin/participants` tab into a three-layer Researcher Analytics Dashboard. The design is grounded in the actual codebase investigation (see requirements.md §Investigation Summary) and all open questions have been resolved before writing this document.

The three layers are:
1. **Cohort Overview** — KPI strip + charts at the top, filter-driven
2. **Participant List** — enhanced table below the overview, same filter state
3. **Participant Profile** — individual drill-down at `/admin/participants/:id`

---

## Architecture

The dashboard is a pure read layer over the existing SnehoAyu database. No mother-facing schema or behaviour is changed. The architecture adds:

- **Backend**: a new `analyticsService.ts` + `analyticsController.ts` + `analyticsRoutes.ts` for cohort aggregation; extensions to `adminService.ts` for enriched participant list/profile; extensions to `exportService.ts` for filter-aware Excel exports; and one Prisma migration for `DangerSignAlert`.
- **Frontend**: a `FilterContext` (React context + sessionStorage) as the single filter state source; `CohortOverview` components consuming analytics API hooks (React Query); an upgraded `ParticipantListTable`; a new `ParticipantProfilePage` with sub-components for score history, growth chart, activity heatmap, and alert history.
- **Data flow**: `FilterContext.filters` → serialised as URL query params → each analytics/list API hook refetches on filter change → React Query caches responses with a 60-second stale time.

All new admin routes inherit `requireAuth + requireRole('researcher')` from the existing parent `/admin` router — no new middleware.

---

## Components and Interfaces

See §7 (Component Tree) for the full frontend component hierarchy and §4 (API Contract) for all backend interface shapes. Key shared TypeScript interfaces:

- `CohortFilter` — shared filter type used by all analytics service functions, the extended `listParticipants()`, and both export functions.
- `FilterState` — frontend mirror of `CohortFilter` stored in `FilterContext`.
- `ParticipantListItem` (extended) — adds `daysSinceEnrollment`, `lastActiveDate`, `engagementScore`, `engagementTier`, `nextCheckpoint`, `isOverdue`, `isDueSoon`, `hasDangerSignFlag`.
- `ParticipantDetail` (extended) — adds `dailyLogs30Day`, `engagementScore`, `engagementTier`, `dangerSignAlerts`.

---

## Data Models

See §2 (New Schema: DangerSignAlert) for the full Prisma model definition. All other models (`MotherProfile`, `DailyLog`, `FollowUpSchedule`, `KnowledgeAssessment`, `Who5Assessment`, `PsocAssessment`, `GrowthReading`, `VaccineRecord`, etc.) are read-only from the dashboard's perspective — no fields are added or modified on existing tables.

---

## Error Handling

- **Filter validation**: `enrolledAfter > enrolledBefore` → 400 from backend; frontend also validates inline and refuses to apply the range.
- **DB unavailability**: all analytics endpoints return 503 with `"Analytics service temporarily unavailable"`.
- **Zero-result export**: `generateCohortExport` returns 400 with `"No participants match the current filter — export aborted"` before building the workbook.
- **Growth chart failure**: `GrowthChartAdmin` has an error boundary; displays `"Unable to load growth data"` without crashing the parent page.
- **Audit log failure**: if `recordAudit()` throws inside an export function, the error is logged and the export download proceeds — audit failure is non-blocking.
- **Sparse data**: when `n < 5` participants have submitted an assessment at a given checkpoint, the API returns `{ mean: null, sparse: true }` and the chart renders a notice instead of a point.
- **Missing baby profile**: `ParticipantProfilePage` renders a notice and skips age/growth rendering entirely.

---

## Testing Strategy

- **Backend analytics functions**: unit-test `computeEngagementScore`, `computeEngagementTier`, `buildWhereClause`, and `computeEngagementTier` tier boundaries with Vitest (the project's existing test runner).
- **Export functions**: test with a minimal in-memory fixture that the correct sheets are generated and that `passwordHash`/`pinHash` are absent from all output sheets.
- **FilterContext**: unit-test `setFilter`, `clearFilters`, and `sessionStorage` restoration with Vitest + `jsdom` (already in devDependencies).
- **Engagement calculation boundary conditions**: test score = 0, score = 9.9 (Inactive), score = 10 (Low), score = 40 (Medium), score = 75 (High), score = 100.
- **Integration**: use the existing Supertest patterns in `backend/` to test that all analytics routes return 401 without a token and 403 with a nurse token.

---

## Correctness Properties

### Property 1: Engagement tier boundaries are mutually exclusive and exhaustive
For any engagement score in the range [0, 100], `computeEngagementTier(score)` returns exactly one tier. Score = 75 → High. Score = 74.99 → Medium. Score = 40 → Medium. Score = 39.99 → Low. Score = 10 → Low. Score = 9.99 → Inactive. Score = 0 → Inactive.
**Validates: Requirements 3.1, 5.7, 6.10**

### Property 2: Filter application is idempotent
Applying the same `CohortFilter` to `getCohortOverview` twice in succession returns identical results (given no data changes between calls).
**Validates: Requirements 1.5, 5.8, 14.2**

### Property 3: Export credential exclusion
No cell in any generated Excel workbook contains the literal value of a `passwordHash` or `pinHash` field. This must hold for both per-participant and cohort exports, regardless of filter.
**Validates: Requirements 12.3, 13.5**

### Property 4: Overdue detection is precise
A participant has `isOverdue = true` if and only if they have at least one `FollowUpSchedule` record where `status = 'pending'` AND `scheduledDate < today UTC midnight`. No other condition sets `isOverdue = true`.
**Validates: Requirements 2.2, 6.4**

### Property 5: Cohort KPI totals are internally consistent
At all times: `studyCount + controlCount + awaitingAssignment = totalEnrolled`, where `totalEnrolled` is the count of `MotherProfile` records with non-null `participantCode` matching the active filter.
**Validates: Requirements 1.1, 1.2**

---

## 1. Chart Library Selection

**Confirmed library: Recharts 2.x**

- React 19 compatible (uses React's reconciler, no legacy context API)
- Vite + ESM compatible (ships ESM, tree-shakeable)
- Tailwind CSS 4 agnostic (SVG-based, no CSS conflicts)
- No existing chart library is installed — Recharts must be added

**Installation:**
```bash
npm install recharts@^2.15.0
```

This is the only new frontend dependency introduced by this feature.

---

## 2. New Schema: DangerSignAlert

A new Prisma model is required (OQ-5 resolution). Add to `schema.prisma`:

```prisma
enum DangerSignCategory {
  STOOL_ABNORMAL
  POOR_WEIGHT_GAIN
  POOR_WELLBEING
  DEVELOPMENTAL_CONCERN
  OTHER
}

enum DangerSignStatus {
  OPEN
  ACKNOWLEDGED
  RESOLVED
}

model DangerSignAlert {
  id              String             @id @default(uuid()) @db.Uuid
  motherProfileId String             @map("mother_profile_id") @db.Uuid
  motherProfile   MotherProfile      @relation(fields: [motherProfileId], references: [id], onDelete: Restrict)
  raisedAt        DateTime           @default(now()) @map("raised_at")
  category        DangerSignCategory
  description     String?            @db.Text
  acknowledgedAt  DateTime?          @map("acknowledged_at")
  resolvedAt      DateTime?          @map("resolved_at")
  resolvedBy      String?            @map("resolved_by") @db.VarChar(100)
  status          DangerSignStatus   @default(OPEN)
  createdAt       DateTime           @default(now()) @map("created_at")
  updatedAt       DateTime           @updatedAt @map("updated_at")

  @@index([motherProfileId, status])
  @@index([raisedAt])
  @@map("danger_sign_alerts")
}
```

Also add the relation to `MotherProfile`:
```prisma
dangerSignAlerts     DangerSignAlert[]
```

Migration name: `add_danger_sign_alerts`. No breaking changes to existing tables.

**Danger_Sign_Flag definition:** a participant has an active flag when they have at least one `DangerSignAlert` record where `status IN (OPEN, ACKNOWLEDGED)` and `resolvedAt IS NULL`.

---

## 3. Engagement Calculation

**Definition (OQ-1 resolution — Candidate A):**

Engagement score = (count of `DailyLog` records with `completedCount >= 5` in the past 28 days) ÷ 28 × 100

**Tier thresholds:**
| Tier | Score range |
|---|---|
| High | ≥ 75% |
| Medium | 40–74% |
| Low | 10–39% |
| Inactive | < 10% |

**`completedCount` derivation** (computed from `DailyLog` boolean fields, not stored):
```
completedCount = [breastfeedingDone, kmcDone, temperatureDone,
                  weightCheckDone, skinCordCareDone, sleepDone, stoolDone]
                 .filter(Boolean).length  // out of 7
```

`completedCount >= 5` means at least 5 of the 7 care tasks were documented.

**Prisma query pattern** (per-participant, called once and batched):
```ts
// Get all DailyLog records in past 28 days for a set of motherProfileIds
const logs = await prisma.dailyLog.findMany({
  where: {
    motherProfileId: { in: motherProfileIds },
    careDate: { gte: subDays(today, 27) },
  },
  select: {
    motherProfileId: true,
    breastfeedingDone: true, kmcDone: true, temperatureDone: true,
    weightCheckDone: true, skinCordCareDone: true, sleepDone: true, stoolDone: true,
  },
});
// Compute score per participant in application layer (no N+1 — single query)
```

For the cohort overview engagement trend (weekly mean), group by ISO week on the backend using a raw Prisma query or `date_trunc('week', care_date)` in PostgreSQL.

---

## 4. API Contract

All new routes are registered under the existing `/admin` router in `adminRoutes.ts`, which already applies `requireAuth + requireRole('researcher')` to every route.

### 4.1 Common Filter Query Parameters

All analytics endpoints accept these optional query params:

| Param | Type | Description |
|---|---|---|
| `hospitalId` | string (UUID) | Filter by site |
| `studyGroup` | `study` \| `control` | Filter by group |
| `birthWeightStratum` | string | Filter by stratum |
| `onboardingStatus` | `onboarded` \| `pending` | Filter by status |
| `enrolledAfter` | ISO date string | Enrollment date range start |
| `enrolledBefore` | ISO date string | Enrollment date range end |
| `checkpointWindow` | `overdue` \| `due_this_week` \| `due_this_month` \| `due_next_month` | Filter by next checkpoint timing |
| `engagementTier` | `high` \| `medium` \| `low` \| `inactive` | Filter by engagement tier (Study group only) |

### 4.2 New Endpoints

**`GET /admin/analytics/overview`**
Returns all cohort KPIs in one response.
```jsonc
{
  "totalEnrolled": 210,
  "studyCount": 108,
  "controlCount": 97,
  "awaitingAssignment": 5,
  "onboardedCount": 195,
  "pendingCount": 15,
  "onboardedPct": 92.9,
  "activeLastSevenDays": 62,
  "openDangerSignCount": 3,
  "overdueCheckpointCount": 14,
  "overdueParticipants": [
    { "id": "...", "participantCode": "BNK-001", "hospitalName": "Bankura MCH", "overdueCheckpoints": ["3_month"] }
  ]
}
```

**`GET /admin/analytics/enrollment-trend`**
```jsonc
{
  "weeks": [
    { "weekStart": "2025-06-02", "newEnrollments": 12, "cumulative": 12 },
    { "weekStart": "2025-06-09", "newEnrollments": 8, "cumulative": 20 }
  ],
  "target": 272
}
```

**`GET /admin/analytics/assessment-completion`**
```jsonc
{
  "rates": [
    { "checkpoint": "baseline", "instrument": "knowledge_mcq", "due": 180, "completed": 172, "pct": 95.6 },
    { "checkpoint": "1_month",  "instrument": "who5",          "due": 120, "completed": 98,  "pct": 81.7 }
  ]
}
```

**`GET /admin/analytics/engagement-trend`** (Study group only)
```jsonc
{
  "weeks": [
    { "weekStart": "2025-06-02", "meanEngagementPct": 68.4 },
    { "weekStart": "2025-06-09", "meanEngagementPct": 71.2 }
  ]
}
```

**`GET /admin/analytics/outcome-scores`** (OQ-2 pending confirmation)
```jsonc
{
  "who5": [
    { "checkpoint": "baseline", "study": { "mean": 52.4, "n": 108 }, "control": null },
    { "checkpoint": "1_month",  "study": { "mean": 61.0, "n": 95 },  "control": null }
  ],
  "psoc":      [ /* same shape */ ],
  "knowledge": [ /* same shape */ ]
}
```
If `n < 5` for a group at a checkpoint, `mean` is `null` and a `"sparse": true` flag is included.

**`GET /admin/analytics/site-comparison`**
```jsonc
{
  "sites": [
    {
      "hospitalId": "...",
      "hospitalName": "Bankura MCH",
      "studyCount": 38,
      "controlCount": 37,
      "meanEngagementPct": 72.1,
      "assessmentCompletionPct": 88.4
    }
  ]
}
```

**`GET /admin/participants`** (extended — replaces existing)
Existing params (`hospitalId`, `birthWeightStratum`) plus all new filter params.
Each item adds:
```jsonc
{
  "daysSinceEnrollment": 45,
  "lastActiveDate": "2025-07-28",
  "engagementTier": "high",
  "engagementScore": 82.1,
  "nextCheckpoint": { "timePoint": "3_month", "scheduledDate": "2025-08-15", "status": "pending" },
  "isOverdue": false,
  "isDueSoon": true,
  "hasDangerSignFlag": false
}
```

**`GET /admin/participants/:id`** (extended — replaces existing)
Adds to existing response:
```jsonc
{
  "dailyLogs30Day": [ { "careDate": "2025-07-28", "completedCount": 6 } ],
  "engagementScore": 82.1,
  "engagementTier": "high",
  "dangerSignAlerts": [
    { "id": "...", "raisedAt": "2025-07-10T09:00:00Z", "category": "POOR_WELLBEING",
      "status": "RESOLVED", "resolvedAt": "2025-07-12T14:00:00Z", "resolvedBy": "researcher-id" }
  ]
}
```

**`GET /admin/participants/:id/growth`** (new admin-scoped endpoint)
```jsonc
{
  "babyProfile": { "dateOfBirth": "2025-03-01", "gestationalAgeWeeks": 30.0, "weightAtDischargeGrams": 1420 },
  "readings": [
    { "readingDate": "2025-03-15", "weightGrams": 1580, "lengthCm": "40.2",
      "correctedAgeWeeks": 1.71, "chronologicalAgeWeeks": 2.0 }
  ]
}
```

**`POST /admin/export/cohort`**
Body: `{ filters: FilterParams, anonymize?: boolean }`
Response: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
Filename: `snehoayu-cohort-export-YYYY-MM-DD.xlsx`
Sheets: Participant Overview, Knowledge MCQ Scores, WHO-5 Scores, PSOC Scores, Growth Readings, Missing Data Report.

**`GET /admin/participants/:id/export`**
Response: xlsx blob
Filename: `participant_<code>_YYYY-MM-DD.xlsx`
Sheets: Demographics, Assessment Scores, Growth Readings, Immunization, Daily Log Summary.

---

## 5. Backend Service Architecture

### 5.1 New: `analyticsService.ts`

Responsible for all cohort aggregation. Key design principles:
- Single Prisma query per aggregate — no N+1
- All filter params applied as `where` clauses in the same query
- Returns typed result objects consumed by `analyticsController.ts`

```ts
// Cohort filter type (shared across all analytics functions)
export interface CohortFilter {
  hospitalId?: string;
  studyGroup?: 'study' | 'control';
  birthWeightStratum?: string;
  onboardingStatus?: 'onboarded' | 'pending';
  enrolledAfter?: Date;
  enrolledBefore?: Date;
  checkpointWindow?: 'overdue' | 'due_this_week' | 'due_this_month' | 'due_next_month';
  engagementTier?: 'high' | 'medium' | 'low' | 'inactive';
}
```

**Key query patterns:**

Enrollment counts — uses Prisma `groupBy`:
```ts
await prisma.motherProfile.groupBy({
  by: ['studyGroup'],
  where: buildWhere(filter),
  _count: { id: true },
});
```

Assessment completion — single query across all instruments:
```ts
// Count KnowledgeAssessment records per (motherProfileId, timePoint)
// joined to FollowUpSchedule to determine denominator
// All in one Prisma query using _count + where
```

Engagement scores (batched, not per-participant N+1):
```ts
// 1. Fetch all matching motherProfileIds
// 2. Single DailyLog query for all of them in past 28 days
// 3. Compute engagement per participant in memory (array of ~136 items max)
// 4. Aggregate tiers using .reduce()
```

### 5.2 Extended: `exportService.ts`

Add two new export functions alongside the existing `generateExport()`:

```ts
export async function generateCohortExport(filter: CohortFilter): Promise<Buffer>
export async function generateParticipantExport(motherProfileId: string): Promise<Buffer>
```

Both use ExcelJS (already installed: `"exceljs": "^4.4.0"`). The existing `generateExport()` function is not modified.

### 5.3 Extended: `adminService.ts`

`listParticipants()` is extended (not replaced) to accept the full `CohortFilter` and return the enriched list shape. The new logic appends engagement tier, lastActiveDate, checkpoint flags, and danger sign flag to each result row using batched sub-queries (no N+1).

### 5.4 New: `analyticsController.ts` + `analyticsRoutes.ts`

Rather than polluting `adminController.ts`, analytics endpoints get their own controller and route file. The route file is imported into `adminRoutes.ts`:

```ts
// adminRoutes.ts addition
import analyticsRouter from './analyticsRoutes.js';
router.use('/analytics', analyticsRouter);
```

`analyticsRoutes.ts` applies no additional middleware — it inherits `requireAuth + requireRole('researcher')` from the parent router.

---

## 6. Filter State Architecture (Frontend)

### 6.1 FilterContext

A single React context holds the filter state and is the single source of truth:

```ts
// frontend/src/features/admin/FilterContext.tsx
interface FilterState {
  hospitalId: string | null;
  studyGroup: 'study' | 'control' | null;
  birthWeightStratum: string | null;
  onboardingStatus: 'onboarded' | 'pending' | null;
  checkpointWindow: 'overdue'|'due_this_week'|'due_this_month'|'due_next_month' | null;
  enrolledAfter: string | null;   // ISO date
  enrolledBefore: string | null;  // ISO date
  engagementTier: 'high'|'medium'|'low'|'inactive' | null;
}
```

`FilterContext` exposes:
- `filters: FilterState` — current state
- `setFilter(key, value)` — update one filter
- `clearFilters()` — reset all to null (atomic)

State is persisted to `sessionStorage` under key `"admin-participant-filters"` and restored on mount.

### 6.2 How Filters Drive All Three Sections

```
FilterContext.filters
  ├── FilterPanel (reads + writes — renders dropdowns/pickers)
  ├── CohortOverview (reads — passes as query params to analytics API)
  │   ├── useAnalyticsOverview(filters)  → GET /admin/analytics/overview?...
  │   ├── useEnrollmentTrend(filters)    → GET /admin/analytics/enrollment-trend?...
  │   ├── useAssessmentCompletion(filters)
  │   ├── useEngagementTrend(filters)
  │   ├── useOutcomeScores(filters)
  │   └── useSiteComparison(filters)
  └── ParticipantListTable (reads — passes as query params to /admin/participants?...)
```

Every hook transforms `FilterState` to `URLSearchParams` via a shared `buildFilterParams(filters)` utility. When `filters` changes, all hooks re-fetch automatically (React Query `queryKey` includes the serialised filter).

### 6.3 React Query Setup

All data fetching uses React Query (`@tanstack/react-query`). This is already a common pattern in React 19 projects — needs to be added if not present.

Check: `frontend/package.json` does not list `@tanstack/react-query`. Add it:
```bash
npm install @tanstack/react-query@^5.80.0
```

Query keys follow this pattern:
```ts
['admin', 'analytics', 'overview', filters]
['admin', 'participants', filters]
['admin', 'participant', id]
```

Stale time: 60 seconds (data is acceptable up to 1 minute old; matches the ≤2s response requirement).

---

## 7. Component Tree

```
/admin/participants  →  ParticipantsPage
├── FilterContextProvider
├── FilterPanel
│   ├── SiteSelect
│   ├── GroupSelect
│   ├── StratumSelect
│   ├── StatusSelect
│   ├── CheckpointWindowSelect
│   ├── DateRangePicker
│   ├── EngagementTierSelect
│   └── ClearFiltersButton
├── CohortOverview
│   ├── EnrollmentKPIStrip          (7 KPI cards)
│   ├── OverdueCheckpointList        (actionable list, collapsible)
│   ├── EnrollmentTrendChart         (Recharts LineChart)
│   ├── AssessmentCompletionChart    (Recharts BarChart)
│   ├── EngagementTrendChart         (Recharts LineChart, Study only)
│   ├── SiteComparisonChart          (Recharts BarChart)
│   └── OutcomeScoreCharts           (3× Recharts LineChart, OQ-2 pending)
└── ParticipantListTable
    ├── SearchInput
    ├── BulkExportButton             (shown when rows selected)
    ├── TableHeader                  (sortable columns)
    ├── TableBody                    (50 rows/page)
    │   └── ParticipantRow
    │       ├── CheckpointChip       (amber overdue / blue upcoming)
    │       ├── EngagementTierChip   (Study only)
    │       └── DangerSignIcon       (if hasDangerSignFlag)
    └── Pagination

/admin/participants/:id  →  ParticipantProfilePage
├── ProfileHeader
│   ├── BackLink                     (preserves FilterContext state via URL search params)
│   ├── ParticipantMetaStrip         (code, site, group, stratum, status)
│   └── AgeDisplay                   (corrected + chronological, "X weeks Y days")
├── AssessmentScoreHistoryTable
│   └── InstrumentRow × 5           (columns: baseline, 1mo, 3mo, 6mo)
├── GrowthChartAdmin                 (Recharts LineChart + WHO percentile reference lines)
├── ActivityHeatmap30Day             (30 cells, filled/empty)
├── FollowUpSchedulePanel
│   └── CheckpointRow × 4           (status + instrument completion indicators)
├── VaccineRecordTable
└── DangerSignAlertHistory
    └── AlertRow × N                (badge by status: OPEN/ACKNOWLEDGED/RESOLVED)
```

---

## 8. GrowthChart_Admin Design

The mother-facing `GrowthChart.tsx` fetches from the mother's own `/dashboard/growth` endpoint and is tightly coupled to that context. It cannot be reused directly.

`GrowthChartAdmin` is a new component in `frontend/src/components/admin/`:
- Fetches from `GET /admin/participants/:id/growth`
- Receives the `readings` array and `babyProfile` as props from `ParticipantProfilePage`
- Uses `correctedAgeWeeks` (from `GrowthReading.correctedAgeWeeks`) as the x-axis
- Renders WHO percentile reference lines (3rd, 10th, 50th, 90th, 97th) for weight-for-age
- Uses Recharts `ComposedChart` with `Line` for actual readings + `ReferenceLine` for percentiles
- WHO z-score reference data is served by the backend through `/admin/participants/:id/growth` — the frontend does not embed WHO tables

---

## 9. Export Service Design

**`generateCohortExport(filter)`** workbook structure:

| Sheet | Content |
|---|---|
| Participant Overview | One row per participant: Code, Site, Group, Stratum, Enrolled, Days Since Enrollment, Status, Last Active, Engagement Tier |
| Knowledge MCQ Scores | One row per participant × 4 checkpoint columns: score, grade |
| WHO-5 Scores | One row per participant × 4 checkpoints: percentageScore, poorWellbeingFlag |
| PSOC Scores | One row per participant × 4 checkpoints: totalScore, efficacy, satisfaction |
| Growth Readings | One row per reading: Code, Date, Weight, Length, HC, Corrected Age |
| Missing Data Report | Participant Code, Site, Phone, Checkpoint, Missing Instrument(s) |

**`generateParticipantExport(motherProfileId)`** workbook:

| Sheet | Content |
|---|---|
| Demographics | All `MotherProfile` and `BabyProfile` fields |
| Assessment Scores | All instruments × all checkpoints in one sheet |
| Growth Readings | All readings with corrected age |
| Immunization | All `VaccineRecord` rows |
| Daily Log Summary | One row per calendar day from enrollment to today |

Both functions: no `passwordHash`, no `pinHash`, audit log via `recordAudit()` on success only.

---

## 10. Existing Reuse Summary

| File | Action | Notes |
|---|---|---|
| `adminService.ts` | Extend `listParticipants()` | Add full filter params + engagement/checkpoint columns |
| `adminService.ts` | Extend `getParticipantDetail()` | Add `dailyLogs30Day`, `engagementScore`, `dangerSignAlerts` |
| `adminRoutes.ts` | Add 2 lines | Import and mount `analyticsRoutes` + export routes |
| `exportService.ts` | Add 2 new functions | `generateCohortExport`, `generateParticipantExport` — do NOT touch existing `generateExport` |
| `ParticipantList.tsx` | Rewrite | Keep route structure, replace table with new component |
| `ParticipantDetail.tsx` | Replace shell | Use `ParticipantDetailView.tsx` as the upgraded visual layer |
| `ParticipantDetailView.tsx` | Extend | Add score table, heatmap, timeline, danger sign history |
| `AdminHeader.tsx` | **Do not touch** | Pill nav already handles tab routing |
| `GrowthChart.tsx` | **Do not touch** | Mother-facing only — create `GrowthChartAdmin.tsx` instead |
| `growthService.ts` | Read-only reuse | `mapGrowthReading()` called from new admin endpoint handler |
| `checklistService.ts` | Read-only reuse | `DailyLog` data used for engagement calculation |
| `age.ts` / `calculateCorrectedAge` | Read-only reuse | Called in `ParticipantProfilePage` for age display |
| `AuditLog` / `recordAudit` | Reuse | Called from export functions on success |

**Build new:**
- `analyticsService.ts`
- `analyticsController.ts`
- `analyticsRoutes.ts`
- `FilterContext.tsx`
- `FilterPanel.tsx` + sub-components
- `CohortOverview.tsx` + all chart sub-components
- `GrowthChartAdmin.tsx`
- `ActivityHeatmap30Day.tsx`
- `AssessmentScoreHistoryTable.tsx`
- `DangerSignAlertHistory.tsx`
- Prisma migration: `add_danger_sign_alerts`

---

## 11. Access Control

All new routes inherit authentication from the parent `/admin` router:

```ts
// adminRoutes.ts (existing, unchanged)
router.use(requireAuth, requireRole('researcher'));
```

New routes added to this router automatically require a valid researcher JWT. No new middleware needed.

| Condition | Response |
|---|---|
| No token | 401 |
| Valid token, non-researcher role | 403 |
| Valid researcher token | 2xx |

---

## 12. Aggregation Strategy & Caching

**MVP approach: on-demand aggregation**

All analytics queries execute against live PostgreSQL at request time. With N=272 participants, even the most complex query (assessment completion matrix: 4 checkpoints × 5 instruments × participant count) runs in well under 200ms on modern PostgreSQL with proper indexes. The ≤2000ms response SLA is comfortably met.

**Why on-demand is correct here:**
- N=272 is tiny. A single `groupBy` query on `FollowUpSchedule` returns at most 272×4 = 1,088 rows.
- Dr. Ponnarasi uses this dashboard sporadically, not in high-frequency polling.
- On-demand means data is always current — no stale snapshot edge cases to reason about.

**Future caching path (revisit if N > ~2,000 or if the study scales to multiple cohorts):**
- Add a `CohortSnapshot` table: `{ id, snapshotDate, filterHash, payload JSON, createdAt }`
- Nightly cron (or Postgres `pg_cron`) regenerates snapshots for common filter combinations
- Analytics endpoint checks for a same-day snapshot before running live queries
- No schema changes to participant data — snapshot is a derived, disposable cache

---

## 13. UI Layout

The `/admin/participants` page layout (top-to-bottom):

```
┌─────────────────────────────────────────────────────────┐
│  [AdminHeader — black banner + pill nav — DO NOT TOUCH] │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  FilterPanel (horizontal bar, cream background)         │
│  [Site ▾] [Group ▾] [Stratum ▾] [Status ▾]             │
│  [Checkpoint ▾] [Enrolled: from—to] [Tier ▾] [Clear ×] │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  CohortOverview                                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌─────┐ │
│  │Total │ │Study │ │Ctrl  │ │Onbrd │ │Active│ │⚠️ 3 │ │
│  │  210 │ │108/  │ │97/   │ │92%   │ │7d:62 │ │danger│ │
│  │      │ │136   │ │136   │ │      │ │      │ │signs │ │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └─────┘ │
│  [Overdue checkpoints: 14 participants ▼ expand list]   │
│                                                         │
│  [Enrollment Trend (line)]  [Assessment Completion(bar)]│
│  [Engagement Trend (line)]  [Site Comparison (bar)]     │
│  [Outcome Scores: WHO-5, PSOC, Knowledge (3 lines)]     │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  ParticipantListTable                                   │
│  [🔍 Search code...]                  [Export selected] │
│  CODE | SITE | GROUP | STRATUM | ENROLLED | DAYS | ...  │
│  ──────────────────────────────────────────────────     │
│  [rows × 50/page]                                       │
│  < 1 2 3 4 5 >                                          │
└─────────────────────────────────────────────────────────┘
```

The individual profile page `/admin/participants/:id`:

```
┌──────────────────────────────────────────────────────┐
│ ← Back to Participants list                           │
│ BNK-001 · Bankura MCH · Study · LBW · Onboarded      │
│ Enrolled: 2025-03-15 · Corrected age: 18w 3d         │
│ Chronological age: 20w 1d                            │
└──────────────────────────────────────────────────────┘
┌──────────────────────┐ ┌──────────────────────────── ┐
│ Assessment Scores    │ │ 30-Day Activity Heatmap      │
│ (instruments × chk)  │ │ ■ ■ □ ■ ■ □ □ ■ ■ ...      │
└──────────────────────┘ └──────────────────────────── ┘
┌──────────────────────────────────────────────────────┐
│ Growth Chart (WHO percentiles + corrected age x-axis) │
└──────────────────────────────────────────────────────┘
┌──────────────────────┐ ┌──────────────────────────── ┐
│ Follow-Up Schedule   │ │ Immunization Records        │
│ Baseline ✓ 2025-03  │ │ BCG ✓ · Penta-1 ✓ · ...    │
│ 1 month  ✓ 2025-04  │ └──────────────────────────── ┘
│ 3 month  ⚠ OVERDUE  │
│ 6 month  ○ 2025-09  │
└──────────────────────┘
┌──────────────────────────────────────────────────────┐
│ Danger Sign Alerts (0 open, 1 resolved)              │
│ 2025-07-10 POOR_WELLBEING → RESOLVED 2025-07-12      │
└──────────────────────────────────────────────────────┘
                        [📥 Export this participant]
```

---

## 14. Visual Design System Mapping

All new components use existing Tailwind tokens. No new CSS variables introduced.

| Element | Token / Class |
|---|---|
| Page background | `bg-care-canvas` (cream/off-white) |
| Hero banner | Managed by `AdminHeader.tsx` — do not touch |
| Active tab pill | Managed by `AdminHeader.tsx` — do not touch |
| Status chip "Onboarded" | `care-chip` teal variant (existing) |
| Status chip "Pending" | `care-chip` amber variant (existing) |
| KPI card | `bg-white rounded-2xl shadow-sm p-4` (matches existing cards) |
| Overdue chip | `bg-amber-100 text-amber-800 rounded-full px-2 py-0.5 text-xs` |
| Upcoming chip | `bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs` |
| Engagement High | `bg-emerald-100 text-emerald-800` |
| Engagement Medium | `bg-yellow-100 text-yellow-800` |
| Engagement Low | `bg-orange-100 text-orange-800` |
| Inactive | `bg-gray-100 text-gray-500` |
| Danger sign icon | `text-red-500` (Lucide `AlertTriangle`) |

Dark mode: If `.dark` tokens are added to the project in future, components will inherit them automatically through Tailwind's class-based dark mode. No explicit dark handling is built now — none exists in the current design system.
