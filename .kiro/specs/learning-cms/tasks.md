# Implementation Plan: Learning CMS

## Overview

Replace the hardcoded `learningHubContent.ts` static file with a database-driven content
pipeline. The implementation is sequenced backend-first (infrastructure → logic → routes),
then frontend (types → API → routing → pages), then tests. Each step builds on the previous
and ends with everything wired together into the existing Express and React applications.

---

## Tasks

- [x] 1. Install backend dependencies
  - Run `npm install @aws-sdk/client-s3 multer` and `npm install -D @types/multer` inside `backend/`
  - Verify packages appear in `backend/package.json`
  - _Requirements: 3.9, 3.10_

- [x] 2. Update Prisma schema
  - [x] 2.1 Add `LearningArticle` model to `backend/prisma/schema.prisma`
    - Define all fields: `id`, `title`, `slug`, `category`, `tags`, `body`, `status`, `authorId`, `coverImageUrl`, `imageUrls`, `audioUrl`, `videoUrl`, `publishedAt`, `createdAt`, `updatedAt`
    - Add `@@index([status])`, `@@index([category])`, `@@index([status, category])`, `@@map("learning_articles")`
    - Add `learningArticles LearningArticle[]` relation to the existing `User` model
    - _Requirements: 1.1, 1.2, 1.3, 1.5_

  - [x] 2.2 Create migration SQL file
    - Create `backend/prisma/migrations/20260729_learning_cms/migration.sql`
    - Write `CREATE TABLE IF NOT EXISTS learning_articles (...)` with all columns, FK constraint to `users.id`, and three indexes
    - Run `npx prisma generate` inside `backend/` to regenerate the Prisma client
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6_

- [x] 3. Add R2 environment variables to `.env.example`
  - Append the optional R2 block to `backend/.env.example`:
    `R2_ACCOUNT_ID=`, `R2_ACCESS_KEY_ID=`, `R2_SECRET_ACCESS_KEY=`, `R2_BUCKET_NAME=`, `R2_PUBLIC_URL=`
  - Include a comment: `# Cloudflare R2 — optional in development; required for file uploads in production`
  - _Requirements: 3.1, 3.2_

- [x] 4. Implement `backend/src/utils/slugify.ts`
  - [x] 4.1 Implement `generateSlug(title: string): string`
    - Lowercase the title, strip non-word / non-hyphen characters, collapse whitespace to hyphens, trim leading/trailing hyphens, truncate to 100 characters
    - Export as a named function
    - _Requirements: 2.1, 2.3_

  - [x] 4.2 Implement `generateUniqueSlug(title: string, prisma: PrismaClient): Promise<string>`
    - Call `generateSlug(title)` to get the base slug
    - Query `prisma.learningArticle.findUnique` in a loop; append `-2` … `-99` suffix until the slug is free
    - Throw a 409 `SLUG_CONFLICT` error if all 98 suffixes are exhausted
    - _Requirements: 2.2, 18.1_

  - [ ]* 4.3 Write property-based tests for `slugify.ts` — Property 1
    - **Property 1: Slug character safety** — for any Unicode title, `generateSlug` returns only `[a-z0-9-]` and is non-empty when the title has at least one alphanumeric character
    - **Validates: Requirements 2.1**
    - Located at `backend/tests/slugify.property.test.ts`

  - [ ]* 4.4 Write property-based tests for `slugify.ts` — Property 2
    - **Property 2: Slug length invariant** — for any string of any length, `generateSlug` returns a string of length ≤ 100
    - **Validates: Requirements 2.3**
    - Located at `backend/tests/slugify.property.test.ts`

  - [ ]* 4.5 Write property-based tests for `slugify.ts` — Property 3
    - **Property 3: Slug round-trip** — creating a LearningArticle and fetching it via `GET /api/learning/:slug` returns the same article
    - **Validates: Requirements 2.4**
    - Located at `backend/tests/slugify.property.test.ts`

- [x] 5. Implement `backend/src/services/r2Service.ts`
  - Read all five R2 env vars via `getR2Config()`; throw 503 `R2_NOT_CONFIGURED` if any are absent
  - Implement `uploadToR2(buffer, originalName, mimeType)`: sanitize filename, prepend UUID v4, construct `S3Client` with `@aws-sdk/client-s3`, send `PutObjectCommand`, return `{ url, filename, mimeType, sizeBytes }`
  - On non-2xx / network failure from Cloudflare, throw 502 `R2_UPLOAD_FAILED`
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.9, 4.4, 18.5_

- [x] 6. Implement `backend/src/middlewares/uploadMiddleware.ts`
  - Configure `multer` with `memoryStorage()`, outer `fileSize` limit of 200 MB, and a `fileFilter` that rejects MIME types not in the ten-item allowlist (returns 415 `INVALID_MIME_TYPE`)
  - Export `upload` (multer instance) for use in routes
  - Document that per-type size checking (5 MB image / 50 MB audio / 200 MB video) is performed in the controller after multer runs
  - _Requirements: 3.5, 3.6, 3.7, 3.8, 3.10_

- [x] 7. Implement `backend/src/validators/learningValidator.ts`
  - [x] 7.1 Implement `validateArticle(body, isCreate): ValidationError[]`
    - Validate `title` (required, non-empty), `body` (required, non-empty), `category` (must be one of 7 allowed values), `status` (if present, must be `draft`/`published`/`archived`)
    - Validate `coverImageUrl`, `audioUrl`, `videoUrl`, and each entry in `imageUrls` must be `https://` if provided
    - Return array of `{ field, message }` objects; return `[]` on success
    - No external validation library — plain TypeScript only
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ]* 7.2 Write property-based tests for `learningValidator.ts` — Property 4
    - **Property 4: Title and body required (whitespace rejection)** — any whitespace-only or empty string for `title` or `body` produces a validation error for that field
    - **Validates: Requirements 6.1, 6.2**
    - Located at `backend/tests/learningValidator.property.test.ts`

  - [ ]* 7.3 Write property-based tests for `learningValidator.ts` — Property 5
    - **Property 5: Category allowlist enforcement** — `validateArticle` produces no category error iff the category is one of the 7 valid values; all other strings produce a category error
    - **Validates: Requirements 6.3**
    - Located at `backend/tests/learningValidator.property.test.ts`

  - [ ]* 7.4 Write property-based tests for `learningValidator.ts` — Property 6
    - **Property 6: URL field https:// prefix enforcement** — any non-null, non-undefined URL field value is accepted iff it starts with `https://`; all other strings produce a validation error
    - **Validates: Requirements 6.5**
    - Located at `backend/tests/learningValidator.property.test.ts`

- [x] 8. Implement `backend/src/services/learningAdminService.ts`
  - [x] 8.1 Implement `createArticle(input, authorId, prisma)`: call `generateUniqueSlug`, set `status: 'draft'`, set `authorId`, insert via `prisma.learningArticle.create`, return created record
    - _Requirements: 5.2, 1.4_

  - [x] 8.2 Implement `updateArticle(id, input, prisma)`: apply status transition rules for `publishedAt` — set to `now()` when transitioning to `published` if currently null; set to `null` when transitioning to `draft` or from `archived` to `draft`; preserve when transitioning to `archived`
    - Throw 404 `ARTICLE_NOT_FOUND` if record does not exist
    - _Requirements: 5.3, 1.4, 18.2_

  - [x] 8.3 Implement `deleteArticle(id, prisma)`: hard delete via `prisma.learningArticle.delete`; throw 404 if not found
    - _Requirements: 5.4, 5.6_

  - [x] 8.4 Implement `listArticles(params, prisma)`: support `page`, `limit` (max 100), `status`, `category` filters; return `{ articles, total, page, limit }`
    - _Requirements: 5.7_

  - [x] 8.5 Implement `getArticleById(id, prisma)`: fetch by UUID; throw 404 `ARTICLE_NOT_FOUND` if absent
    - _Requirements: 5.6_

- [x] 9. Implement `backend/src/controllers/learningAdminController.ts`
  - Implement handlers for all five admin endpoints:
    - `GET /api/admin/learning` → call `listArticles`, return 200
    - `GET /api/admin/learning/:id` → call `getArticleById`, return 200
    - `POST /api/admin/learning` → run `validateArticle`, call `createArticle`, return 201
    - `PUT /api/admin/learning/:id` → run `validateArticle`, call `updateArticle`, return 200
    - `DELETE /api/admin/learning/:id` → call `deleteArticle`, return 204
    - `POST /api/admin/learning/upload` → run per-type size check after multer, call `uploadToR2`, return 201
  - On validation errors, return 422 `VALIDATION_ERROR` with `details` array
  - Follow the existing Controller → Service → Prisma pattern
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 17.1, 17.2, 17.3_

- [x] 10. Implement `backend/src/routes/adminLearningRoutes.ts`
  - Create an Express Router; apply `requireAuth` and `requireRole('researcher')` to all routes
  - Register: `POST /upload` (multer middleware first), `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`
  - Use `.js` ESM import extensions consistent with the existing route files
  - _Requirements: 17.1, 17.2, 17.3, 19.2, 19.3_

- [x] 11. Implement `backend/src/services/learningService.ts`
  - [x] 11.1 Implement `listPublishedArticles(filters, userId, role, prisma)`:
    - Query `status: 'published'` ordered by `publishedAt` descending
    - Support `category` and `search` (case-insensitive substring across `title`, `body`, `tags`)
    - Compute `durationMin = Math.ceil(wordCount / 200)` per article; omit `body` from response
    - If role is `mother`, fetch `viewedSlugs` via a `ContentView` join; otherwise return `[]`
    - Return `{ articles, total, viewedSlugs }`
    - _Requirements: 7.1, 7.4, 7.5, 7.6, 8.4, 8.5_

  - [x] 11.2 Implement `getPublishedArticleBySlug(slug, userId, role, prisma)`:
    - Fetch `status: 'published'` article by slug; throw 404 `ARTICLE_NOT_FOUND` if absent
    - If role is `mother`: upsert `ContentItem` (slug, category), fetch mother profile, upsert `ContentView`
    - If role is `nurse` or `researcher`: skip view tracking
    - Compute and return `durationMin` on the full article
    - _Requirements: 7.2, 7.3, 7.7, 8.1, 8.2, 8.3_

  - [ ]* 11.3 Write property-based tests — Property 9
    - **Property 9: durationMin calculation** — for any article body string, duration equals `Math.ceil(wordCount / 200)` and is ≥ 1 for any non-empty body
    - **Validates: Requirements 7.6**
    - Located at `backend/tests/learningService.property.test.ts`

  - [ ]* 11.4 Write property-based tests — Property 10
    - **Property 10: Pagination consistency invariant** — paginating through all pages of N articles with any valid limit yields exactly N articles total with no duplicates or omissions
    - **Validates: Requirements 5.7**
    - Located at `backend/tests/learningService.property.test.ts`

  - [ ]* 11.5 Write property-based tests — Property 11
    - **Property 11: View tracking idempotence** — calling `getPublishedArticleBySlug` any number of times (≥ 1) for the same slug and mother results in exactly one `ContentView` record; no duplicates created
    - **Validates: Requirements 8.1, 8.2**
    - Located at `backend/tests/learningService.property.test.ts`

- [x] 12. Implement `backend/src/controllers/learningController.ts`
  - Implement `listArticles` handler: call `learningService.listPublishedArticles`, return 200
  - Implement `getArticle` handler: call `learningService.getPublishedArticleBySlug`, return 200; handle 404
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.3, 8.4, 17.1_

- [x] 13. Implement `backend/src/routes/learningRoutes.ts`
  - Create an Express Router; apply `requireAuth` to all routes
  - Register `GET /` → `listArticles`, `GET /:slug` → `getArticle`
  - Use `.js` ESM import extensions
  - _Requirements: 17.1, 19.1, 19.3_

- [x] 14. Register both routers in `backend/src/app.ts`
  - Import `learningRouter` from `./routes/learningRoutes.js` and `adminLearningRouter` from `./routes/adminLearningRoutes.js`
  - Add `app.use('/api/learning', learningRouter)` and `app.use('/api/admin/learning', adminLearningRouter)` after the existing admin router registration
  - _Requirements: 19.1, 19.2, 19.3_

- [x] 15. Checkpoint — backend complete
  - Ensure the backend TypeScript compiles without errors (`npm run build` inside `backend/`)
  - Ensure all backend tests pass
  - Ask the user if questions arise before proceeding to the frontend

- [x] 16. Install frontend dependencies
  - Run `npm install react-markdown` inside `frontend/`
  - Verify `react-markdown` appears in `frontend/package.json`
  - _Requirements: 10.6_

- [x] 17. Add ROUTES constants to `frontend/src/routes/paths.ts`
  - Add: `LEARN_ARTICLE: '/learn/:slug'`, `ADMIN_LEARNING: '/admin/learning'`, `ADMIN_LEARNING_ARTICLES: '/admin/learning/articles'`, `ADMIN_LEARNING_NEW: '/admin/learning/articles/new'`, `ADMIN_LEARNING_EDIT: '/admin/learning/articles/:id/edit'`, `ADMIN_LEARNING_PREVIEW: '/admin/learning/articles/:id/preview'`
  - _Requirements: 15.4_

- [x] 18. Add lazy-loaded routes to `frontend/src/routes/AppRoutes.tsx`
  - Lazy-load five new pages: `ArticleDetail`, `LearningDashboard`, `AdminArticleList`, `ArticleForm`, `ArticlePreview`
  - Register `/learn/:slug` wrapped with `<RequireAuth>`
  - Register `/admin/learning`, `/admin/learning/articles`, `/admin/learning/articles/new`, `/admin/learning/articles/:id/edit`, `/admin/learning/articles/:id/preview` all wrapped with `<RequireAuth><RequireRole roles={['researcher']}>`
  - _Requirements: 10.1, 11.1, 12.1, 13.1, 14.1, 17.4_

- [x] 19. Update `frontend/src/components/admin/AdminHeader.tsx`
  - Import `BookOpen` from `lucide-react` alongside the existing icons
  - Add a `<NavLink to={ROUTES.ADMIN_LEARNING}>` pill with `BookOpen` icon and "Learning" label
  - Apply `bg-secondary text-primary` when active, `text-text-muted hover:bg-primary/5` otherwise — identical to existing nav pill pattern
  - _Requirements: 15.1, 15.2, 15.3_

- [x] 20. Create `frontend/src/features/learning/types.ts`
  - Export `PublishedArticle`, `ArticleDetail` (extends `PublishedArticle` with `body` and `imageUrls`), and `ArticleListResponse` interfaces matching the API contract
  - _Requirements: 7.6, 7.7_

- [x] 21. Create `frontend/src/features/learning/api.ts`
  - Implement `fetchArticles(filters: { category?: string; search?: string })`: `GET /api/learning` via existing Axios API client; return `ArticleListResponse`
  - Implement `fetchArticleBySlug(slug: string)`: `GET /api/learning/:slug`; return `ArticleDetail`
  - _Requirements: 9.1, 10.2_

- [x] 22. Create `frontend/src/features/learningAdmin/types.ts`
  - Export `AdminArticle`, `CreateArticleInput`, `UpdateArticleInput`, `UploadResponse`, `ArticleListAdminResponse` interfaces matching the admin API contract
  - _Requirements: 5.7, 13.3_

- [x] 23. Create `frontend/src/features/learningAdmin/api.ts`
  - Implement `adminFetchArticles(params)`, `adminFetchArticle(id)`, `createArticle(input)`, `updateArticle(id, input)`, `deleteArticle(id)`, `uploadMedia(formData: FormData)` — all via the existing Axios API client
  - _Requirements: 5.1, 4.1, 13.7_

- [x] 24. Rewrite `frontend/src/pages/LearningHub.tsx`
  - Remove static `learningHubContent.ts` import; replace with `fetchArticles()` on mount
  - State: `articles`, `loading`, `error`, `viewedSlugs`, `category`, `search`
  - Implement 300 ms debounced search using `useRef` + `setTimeout`
  - Render loading with `<LoadingScreen>` on first fetch; inline spinner on filter changes
  - Render category filter pills; pass `category` as query param
  - Render "viewed" badge on cards whose slugs are in `viewedSlugs`
  - Render featured article banner for first article with `coverImageUrl`
  - On card click, `navigate(ROUTES.LEARN_ARTICLE.replace(':slug', slug))`
  - On error, show inline error banner via `normalizeApiError`
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [x] 25. Create `frontend/src/pages/learning/ArticleDetail.tsx`
  - On mount, read `slug` via `useParams()` and call `fetchArticleBySlug(slug)`
  - While loading: render `<LoadingScreen>`
  - On 404: render Bengali "নিবন্ধটি পাওয়া যায়নি" message and back link to `/learn`
  - On other error: render `normalizeApiError` message
  - Render `body` via `<ReactMarkdown>`
  - Conditionally render `<AudioPlayer src={audioUrl}>` when `audioUrl` is set
  - Conditionally render `<video controls src={videoUrl} className="w-full rounded-xl">` when `videoUrl` is set
  - Conditionally render responsive image grid when `imageUrls` is non-empty
  - Wrap in `<AppShell title={article.title}>` with back button to `/learn`
  - Use `useTranslation` for all non-article UI strings
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10, 10.11, 10.12, 10.13_

- [x] 26. Create `frontend/src/pages/admin/LearningDashboard.tsx`
  - On mount, call `adminFetchArticles({ limit: 100 })` and derive total / draft / published counts
  - Display three stat cards: total articles, draft articles, published articles
  - Provide navigation link to `/admin/learning/articles` and "New Article" button to `/admin/learning/articles/new`
  - While loading, render skeleton cards consistent with existing admin portal style
  - On error, render error message via `normalizeApiError`
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [x] 27. Create `frontend/src/pages/admin/AdminArticleList.tsx`
  - Fetch from `adminFetchArticles({ page, limit, status, category })` on mount and on filter change
  - Render table with columns: title, category, status badge, author, date
  - Implement pagination controls (previous / next) when total > limit
  - Implement status filter dropdown passing `status` query param
  - On row click → navigate to `/admin/learning/articles/:id/edit`
  - On "Preview" action → navigate to `/admin/learning/articles/:id/preview`
  - On error → display `normalizeApiError` error card
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

- [x] 28. Create `frontend/src/pages/admin/ArticleForm.tsx`
  - For edit mode (`/edit` route): fetch article via `adminFetchArticle(id)` on mount and pre-populate all fields
  - Render fields: `title`, `category` (select), `tags` (comma-separated), `body` (textarea), `status` (select), `coverImageUrl` (file upload + URL input), `audioUrl` (file upload), `videoUrl` (file upload)
  - Render Bengali language reminder ("বাংলায় লিখুন") adjacent to `title` and `body` fields
  - On file select: POST to `uploadMedia(formData)`, populate URL field with returned `url`
  - While upload in progress: show spinner on that field, disable submit button
  - On upload failure: show `normalizeApiError` inline error; leave URL field empty
  - Client-side validation: `title` and `body` must be non-empty before submit
  - On submit: POST (`createArticle`) or PUT (`updateArticle`) then navigate to `/admin/learning/articles` on success
  - On 422: render field-level `<InlineFormError>` for each failing field
  - On other error: render top-level error banner via `normalizeApiError`
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 13.10, 13.11, 16.2_

- [x] 29. Create `frontend/src/pages/admin/ArticlePreview.tsx`
  - On mount, fetch article via `adminFetchArticle(id)` using `useParams()`
  - Render the article using the same layout as `ArticleDetail` (Markdown body, conditional audio/video/images)
  - Render a top banner showing "Preview mode" and the article's current status
  - Provide an "Edit" link back to `/admin/learning/articles/:id/edit`
  - _Requirements: 14.1, 14.2, 14.3, 14.4_

- [x] 30. Checkpoint — frontend complete
  - Ensure the frontend TypeScript compiles without errors (`npm run build` inside `frontend/`)
  - Ensure all frontend unit tests pass
  - Ask the user if questions arise before proceeding to tests

- [x] 31. Write property-based tests for upload validation (Properties 7 and 8)
  - [x]* 31.1 Write property-based test — Property 7
    - **Property 7: MIME type allowlist** — for any MIME type string, the upload validator returns `true` iff it is one of the 10 accepted types; all other strings are rejected
    - **Validates: Requirements 3.7, 3.8**
    - Located at `backend/tests/uploadValidation.property.test.ts`

  - [x]* 31.2 Write property-based test — Property 8
    - **Property 8: Per-type file size limits** — for any (mimeType, fileSize) pair where mimeType is accepted, the size validator accepts the file iff `fileSize ≤ limit(mimeType)` where `image/*` → 5 MB, `audio/*` → 50 MB, `video/*` → 200 MB
    - **Validates: Requirements 3.5, 3.6**
    - Located at `backend/tests/uploadValidation.property.test.ts`

- [x] 32. Write integration tests for admin and public API endpoints
  - [x]* 32.1 Write integration tests for admin endpoints
    - Test `POST /api/admin/learning` — creates article, sets `status: draft`, generates slug, returns 201
    - Test `PUT /api/admin/learning/:id` with `status: published` — sets `publishedAt`; re-publish preserves existing `publishedAt`
    - Test `PUT /api/admin/learning/:id` with `status: draft` — clears `publishedAt`
    - Test `DELETE /api/admin/learning/:id` — returns 204; subsequent GET returns 404
    - Test 422 response when required fields are missing
    - Test 403 response for non-researcher roles
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 17.2, 17.3_

  - [x]* 32.2 Write integration tests for public endpoints
    - Test `GET /api/learning` — returns only published articles with `durationMin`, without `body`
    - Test `GET /api/learning?category=kmc` — returns only matching category articles
    - Test `GET /api/learning?search=` — returns case-insensitive matches across title/body/tags
    - Test `GET /api/learning/:slug` with mother role — returns full article; creates `ContentView`; second call does not duplicate `ContentView`
    - Test `GET /api/learning/:slug` with nurse role — returns article; no `ContentView` created
    - Test 404 on unpublished or non-existent slug
    - Test 401 response for unauthenticated requests
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.2, 8.3, 17.1_

- [x] 33. Final checkpoint — all tests pass
  - Ensure all backend and frontend tests pass
  - Confirm both new routers are reachable via a smoke test (`curl` or similar)
  - Ask the user if questions arise

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints (tasks 15, 30, 33) ensure incremental validation before moving to the next phase
- Property tests (Properties 1–11) validate universal correctness invariants; unit tests in integration tasks validate specific examples and edge cases
- The R2 upload service degrades gracefully: the server starts without R2 env vars, and upload endpoints return 503 `R2_NOT_CONFIGURED` only when called

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1", "3"] },
    { "id": 1, "tasks": ["2.2"] },
    { "id": 2, "tasks": ["4.1", "4.2"] },
    { "id": 3, "tasks": ["4.3", "4.4", "4.5", "5", "6"] },
    { "id": 4, "tasks": ["7.1"] },
    { "id": 5, "tasks": ["7.2", "7.3", "7.4", "8.1", "8.2", "8.3", "8.4", "8.5"] },
    { "id": 6, "tasks": ["9", "11.1", "11.2"] },
    { "id": 7, "tasks": ["10", "12", "13"] },
    { "id": 8, "tasks": ["11.3", "11.4", "11.5", "14"] },
    { "id": 9, "tasks": ["17", "20", "22"] },
    { "id": 10, "tasks": ["18", "19", "21", "23"] },
    { "id": 11, "tasks": ["24", "25", "26", "27"] },
    { "id": 12, "tasks": ["28", "29"] },
    { "id": 13, "tasks": ["31.1", "31.2", "32.1", "32.2"] }
  ]
}
```

---

## Deployment Guide

Your hosting stack: **Render** (backend), **Vercel** (frontend), **Neon** (PostgreSQL).
Cloudflare R2 is used for all media storage — images, audio, and video.

---

### Note on Cloudflare R2 vs AWS S3

The `r2Service.ts` uses `@aws-sdk/client-s3` — this is **correct and intentional**.
Cloudflare R2 exposes an S3-compatible API. The only difference from real AWS S3 is
the endpoint URL, which is set to `https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com`.
No actual AWS account or AWS S3 bucket is used. The SDK just speaks S3 protocol to
Cloudflare's servers.

---

### Step 1 — Neon: Run the database migration

1. Open your Neon project dashboard → **SQL Editor**
2. Run the migration SQL from `backend/prisma/migrations/20260729_learning_cms/migration.sql`
3. Verify the `learning_articles` table was created:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_name = 'learning_articles';
   ```
4. Alternatively, if you deploy the backend first, Render will run
   `npx prisma migrate deploy` automatically on startup (it's already in the `start` script
   in `backend/package.json`).

---

### Step 2 — Cloudflare R2: Set up the bucket and credentials

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com) → **R2 Object Storage**
2. Click **Create bucket** → choose a name (e.g. `snehoayu-media`) → select a region close to your users
3. In the bucket settings, enable **Public access** (or set up a custom domain) so uploaded files are publicly readable via URL
4. Copy the **Public bucket URL** — it will look like:
   `https://pub-<hash>.r2.dev` or `https://media.yourdomain.com` if you use a custom domain
5. Go to **R2 → Manage R2 API Tokens** → **Create API Token**
   - Permission: **Object Read & Write** (scoped to your bucket)
   - Copy the **Access Key ID** and **Secret Access Key** — you can only see the secret once
6. Find your **Account ID** in the Cloudflare dashboard sidebar (top right)

You now have all five values needed for the backend env vars.

---

### Step 3 — Render: Deploy the backend

1. Go to [render.com](https://render.com) → your backend web service → **Environment** tab
2. Add these environment variables (in addition to the ones already set):

   | Variable | Value |
   |---|---|
   | `R2_ACCOUNT_ID` | Your Cloudflare Account ID |
   | `R2_ACCESS_KEY_ID` | R2 API Token Access Key ID |
   | `R2_SECRET_ACCESS_KEY` | R2 API Token Secret Access Key |
   | `R2_BUCKET_NAME` | Your bucket name (e.g. `snehoayu-media`) |
   | `R2_PUBLIC_URL` | Public URL of the bucket (e.g. `https://pub-<hash>.r2.dev`) — **no trailing slash** |

3. Trigger a manual deploy (or push to your connected branch)
4. Confirm the deploy log shows:
   - `npx prisma migrate deploy` ran successfully
   - No `R2_NOT_CONFIGURED` warnings at startup (the R2 service is lazy — no startup warning expected, but test an upload to confirm)
5. After deploy, test the upload endpoint:
   ```bash
   curl -X POST https://your-backend.onrender.com/api/admin/learning/upload \
     -H "Authorization: Bearer <your-researcher-token>" \
     -F "file=@test-image.jpg"
   ```
   You should get back a JSON with a `url` pointing to your R2 bucket.

---

### Step 4 — Vercel: Deploy the frontend

1. Go to [vercel.com](https://vercel.com) → your frontend project → **Settings → Environment Variables**
2. Confirm `VITE_API_BASE_URL` is set to your Render backend URL:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```
   (No trailing slash, no `/api` — the frontend's `api.ts` appends `/api` automatically)
3. No R2 variables are needed in Vercel — all media uploads go through your Render backend.
4. Trigger a redeploy (push to main or click **Redeploy** in Vercel)
5. After deploy, verify:
   - The Learning Hub at `/learn` loads articles from the API (empty list is fine before any articles are created)
   - The admin portal at `/admin/learning` is accessible with a researcher account

---

### Step 5 — End-to-end smoke test

Do this after all three services are deployed:

1. Log in as a researcher
2. Go to `/admin/learning` → click **New Article**
3. Fill in a Bengali title, body, and category → upload a cover image → click **Publish**
4. Confirm the article appears in the article list with status **Published**
5. Log in as a mother (or open a new private window)
6. Go to `/learn` → confirm the article appears in the list
7. Click the article → confirm it opens at `/learn/:slug` with the correct content and cover image loading from the R2 URL
8. Go back to `/learn` → confirm the article now shows a "viewed" badge

---

### Common issues and fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| Upload returns `R2_NOT_CONFIGURED` | R2 env vars missing on Render | Add all 5 R2 vars in Render → Environment, redeploy |
| Upload returns `R2_UPLOAD_FAILED` | Wrong credentials or bucket name | Double-check `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and `R2_BUCKET_NAME` in Render |
| Uploaded image URL returns 403 | Bucket not set to public | Enable public access on the R2 bucket in Cloudflare dashboard |
| `/learn` shows empty list | Migration not run | Run migration SQL on Neon or trigger a backend redeploy |
| `/admin/learning` redirects away | `RequireRole` guard | Make sure you are logged in with a `researcher` role account |
| CORS error on upload | Backend CORS config | Add your Vercel domain to `CORS_ORIGINS` in Render env vars |
| Frontend can't reach API | `VITE_API_BASE_URL` not set | Set it in Vercel env vars and redeploy |

---

### R2 CORS configuration (required for direct browser access to media)

If you ever serve R2 files directly to the browser (images in `<img>`, audio in `<audio>`,
video in `<video>`), you need to configure CORS on the R2 bucket so browsers can load the
files from your Vercel domain.

In Cloudflare R2 → your bucket → **Settings → CORS Policy**, add:

```json
[
  {
    "AllowedOrigins": [
      "https://your-app.vercel.app",
      "https://yourdomain.com"
    ],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

This is only needed for media playback. Upload requests go server-side (backend → R2)
so CORS on R2 is not needed for uploads.
