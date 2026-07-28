# Design Document — Learning CMS

## Overview

The Learning CMS replaces the hardcoded `learningHubContent.ts` static file with a
database-driven content pipeline. Researchers (admin role) use a new admin portal section
to create, edit, publish and archive Bengali learning articles. All authenticated users
(mother, nurse, researcher) read published articles through a rewritten LearningHub page
and a new ArticleDetail page.

The system spans:
- **Backend**: new Prisma model, R2 upload service, public + admin REST API, slug generator
- **Frontend**: rewritten LearningHub, new ArticleDetail, new admin portal pages
- **Infrastructure**: Cloudflare R2 object storage for images, audio, video

Key design drivers:
- Reuse existing `requireAuth` / `requireRole` middleware; no new auth primitives.
- Keep `ContentItem` / `ContentView` view-tracking models unchanged.
- R2 upload is optional in development (server starts without R2 env vars; upload endpoints
  return 503 if R2 is not configured at call time).
- Markdown body rendering uses `react-markdown` on the client; the database stores raw Markdown.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Frontend (React 19 + Vite)                                     │
│                                                                 │
│  LearningHub (/learn)          ArticleDetail (/learn/:slug)     │
│  AdminArticleList              ArticleForm (new/edit)           │
│  LearningDashboard             ArticlePreview                   │
│        │                              │                         │
│        └──────── Axios API Client ────┘                         │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTP + JWT
┌─────────────────────────▼───────────────────────────────────────┐
│  Express Backend (Node.js + TypeScript ESM)                     │
│                                                                 │
│  /api/learning/*          learningRoutes.ts                     │
│    learningController.ts  ──▶  learningService.ts               │
│                                                                 │
│  /api/admin/learning/*    adminLearningRoutes.ts                │
│    learningAdminController.ts  ──▶  learningAdminService.ts     │
│    uploadMiddleware.ts (multer)                                  │
│    r2Service.ts  ──▶  Cloudflare R2 (S3-compatible API)         │
│                                                                 │
│  Common: slugify.ts, learningValidator.ts                       │
│  ORM: Prisma → PostgreSQL (learning_articles table)             │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow — Public Article Read (mother)

```
1. LearningHub mounts
2. GET /api/learning?category=feeding&search=...  (requireAuth)
3. learningService.listArticles(filters, userId, role)
4. Prisma: SELECT published articles matching filters
5. IF role === 'mother': also SELECT viewedSlugs via ContentView join
6. Compute durationMin = Math.ceil(wordCount / 200) per article
7. Return { articles, total, viewedSlugs }

8. User clicks article card
9. Router.push(/learn/:slug)
10. ArticleDetail mounts
11. GET /api/learning/:slug  (requireAuth)
12. learningService.getArticleBySlug(slug, userId, role)
13. Prisma: findUnique by slug where status='published'
14. IF role === 'mother': upsert ContentItem then ContentView (view tracking)
15. Return full article with body
```

### Data Flow — Admin Article Create

```
1. Researcher fills ArticleForm
2. (Optional) POST /api/admin/learning/upload  → R2 → returns { url }
3. ArticleForm populates URL field with returned url
4. POST /api/admin/learning  { title, body, category, tags, status, ... }
5. learningValidator.validateArticle(body) — throws 422 on failure
6. learningAdminService.createArticle(input, authorId)
7. slugify(title) → generateUniqueSlug(title, prisma)
8. Prisma: create LearningArticle
9. Return 201 with article
10. Frontend navigates to /admin/learning/articles
```

---

## Components and Interfaces

### Backend Files (new)

```
backend/src/
  services/
    r2Service.ts              — R2 upload logic (S3-compatible)
    learningService.ts        — public read: list, getBySlug + view tracking
    learningAdminService.ts   — admin CRUD: create, update, delete, list (all statuses)
  controllers/
    learningController.ts     — handlers for /api/learning
    learningAdminController.ts — handlers for /api/admin/learning
  validators/
    learningValidator.ts      — plain TS: validateArticle, validateUpload
  routes/
    learningRoutes.ts         — /api/learning  (requireAuth)
    adminLearningRoutes.ts    — /api/admin/learning  (requireAuth + requireRole('researcher'))
  middlewares/
    uploadMiddleware.ts       — multer memoryStorage, MIME filter, size limits
  utils/
    slugify.ts                — generateSlug, generateUniqueSlug
```

### Frontend Files (new)

```
frontend/src/
  features/
    learning/
      api.ts    — fetchArticles(filters), fetchArticleBySlug(slug)
      types.ts  — PublishedArticle, ArticleDetail, ArticleListResponse
    learningAdmin/
      api.ts    — adminFetchArticles, adminFetchArticle, createArticle,
                   updateArticle, deleteArticle, uploadMedia
      types.ts  — AdminArticle, CreateArticleInput, UpdateArticleInput,
                   UploadResponse, ArticleListAdminResponse
  pages/
    learning/
      ArticleDetail.tsx      — /learn/:slug  (lazy)
    admin/
      LearningDashboard.tsx  — /admin/learning  (lazy, researcher only)
      AdminArticleList.tsx   — /admin/learning/articles  (lazy)
      ArticleForm.tsx        — /admin/learning/articles/new + /:id/edit  (lazy)
      ArticlePreview.tsx     — /admin/learning/articles/:id/preview  (lazy)
```

### API Contracts

#### Public Endpoints — `GET /api/learning`

Request query params:
- `category?: string` — one of the 7 category values
- `search?: string` — case-insensitive substring match across title, body, tags

Response `200`:
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "uuid",
        "slug": "kangaroo-care",
        "title": "কাঙ্গারু মাদার কেয়ার",
        "category": "kmc",
        "tags": ["preterm", "kmc"],
        "coverImageUrl": "https://r2.example.com/abc.jpg",
        "audioUrl": null,
        "videoUrl": null,
        "publishedAt": "2026-07-01T10:00:00.000Z",
        "durationMin": 3
      }
    ],
    "total": 42,
    "viewedSlugs": ["kangaroo-care", "feeding-cues"]
  }
}
```
Note: `body` is omitted from the list response. `viewedSlugs` is `[]` for nurse/researcher.

#### Public Endpoint — `GET /api/learning/:slug`

Response `200`:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "kangaroo-care",
    "title": "কাঙ্গারু মাদার কেয়ার",
    "category": "kmc",
    "tags": ["preterm"],
    "body": "# KMC\n\nMarkdown content here...",
    "coverImageUrl": "https://r2.example.com/abc.jpg",
    "imageUrls": [],
    "audioUrl": null,
    "videoUrl": null,
    "publishedAt": "2026-07-01T10:00:00.000Z",
    "durationMin": 3
  }
}
```
Response `404`: article not found or not published.

#### Admin Endpoint — `POST /api/admin/learning`

Request body:
```json
{
  "title": "কাঙ্গারু মাদার কেয়ার",
  "body": "Markdown text...",
  "category": "kmc",
  "tags": ["preterm"],
  "status": "draft",
  "coverImageUrl": "https://...",
  "imageUrls": [],
  "audioUrl": null,
  "videoUrl": null
}
```
Response `201`: `{ success: true, data: AdminArticle }` with generated `slug` and `authorId`.

Validation errors `422`:
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    { "field": "title", "message": "Title is required" },
    { "field": "category", "message": "Invalid category" }
  ]
}
```

#### Admin Endpoint — `GET /api/admin/learning`

Query params: `page` (default 1), `limit` (default 20, max 100), `status?`, `category?`

Response `200`:
```json
{
  "success": true,
  "data": {
    "articles": [ /* AdminArticle[] */ ],
    "total": 55,
    "page": 1,
    "limit": 20
  }
}
```

#### Upload Endpoint — `POST /api/admin/learning/upload`

Request: `multipart/form-data` with field `file`.

Response `201`:
```json
{
  "success": true,
  "data": {
    "url": "https://r2.example.com/a1b2c3d4-kangaroo.jpg",
    "filename": "a1b2c3d4-kangaroo.jpg",
    "mimeType": "image/jpeg",
    "sizeBytes": 204800
  }
}
```

### Route Registration Updates

**`backend/src/app.ts`** — add after existing admin router:
```ts
import learningRouter from './routes/learningRoutes.js';
import adminLearningRouter from './routes/adminLearningRoutes.js';
// ...
app.use('/api/learning', learningRouter);
app.use('/api/admin/learning', adminLearningRouter);
```
Note: `adminLearningRouter` is a separate router file (not appended to the existing
`adminRoutes.ts`) to keep the files focused. Both routers apply their own `requireAuth` /
`requireRole` middleware internally.

**`frontend/src/routes/paths.ts`** — add:
```ts
LEARN_ARTICLE: '/learn/:slug',
ADMIN_LEARNING: '/admin/learning',
ADMIN_LEARNING_ARTICLES: '/admin/learning/articles',
ADMIN_LEARNING_NEW: '/admin/learning/articles/new',
ADMIN_LEARNING_EDIT: '/admin/learning/articles/:id/edit',
ADMIN_LEARNING_PREVIEW: '/admin/learning/articles/:id/preview',
```

**`frontend/src/routes/AppRoutes.tsx`** — lazy-load all 5 new pages:
```tsx
const ArticleDetail = lazy(() => import('../pages/learning/ArticleDetail').then(...));
const LearningDashboard = lazy(() => import('../pages/admin/LearningDashboard').then(...));
const AdminArticleList = lazy(() => import('../pages/admin/AdminArticleList').then(...));
const ArticleForm = lazy(() => import('../pages/admin/ArticleForm').then(...));
const ArticlePreview = lazy(() => import('../pages/admin/ArticlePreview').then(...));
```

Admin pages wrapped with `<RequireAuth><RequireRole roles={['researcher']}>`.
`ArticleDetail` wrapped with `<RequireAuth>` only (all roles can read).

**`frontend/src/components/admin/AdminHeader.tsx`** — add `BookOpen` NavLink:
```tsx
import { Users, Building2, BookOpen, LogOut } from 'lucide-react';
// ...
<NavLink to={ROUTES.ADMIN_LEARNING} className={({ isActive }) =>
  `flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold transition-colors ${
    isActive ? 'bg-secondary text-primary' : 'text-text-muted hover:bg-primary/5'
  }`
}>
  <BookOpen className="h-4 w-4" aria-hidden="true" />
  Learning
</NavLink>
```

---

## Data Models

### Prisma Schema Addition

```prisma
model LearningArticle {
  id            String    @id @default(uuid()) @db.Uuid
  title         String
  slug          String    @unique @db.VarChar(100)
  category      String    @db.VarChar(50)
  tags          String[]
  body          String    @db.Text
  status        String    @default("draft") @db.VarChar(20)
  authorId      String    @map("author_id") @db.Uuid
  author        User      @relation(fields: [authorId], references: [id])
  coverImageUrl String?   @map("cover_image_url")
  imageUrls     String[]  @map("image_urls")
  audioUrl      String?   @map("audio_url")
  videoUrl      String?   @map("video_url")
  publishedAt   DateTime? @map("published_at")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  @@index([status])
  @@index([category])
  @@index([status, category])
  @@map("learning_articles")
}
```

Also add `learningArticles LearningArticle[]` to the `User` model.

### Migration

New file: `backend/prisma/migrations/20260729_learning_cms/migration.sql`

Creates `learning_articles` table, FK to `users.id`, and all three indexes.
Uses `IF NOT EXISTS` guards for idempotency.

### TypeScript Types (Frontend)

```ts
// features/learning/types.ts
export interface PublishedArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  coverImageUrl: string | null;
  audioUrl: string | null;
  videoUrl: string | null;
  publishedAt: string;
  durationMin: number;
}

export interface ArticleDetail extends PublishedArticle {
  body: string;
  imageUrls: string[];
}

export interface ArticleListResponse {
  articles: PublishedArticle[];
  total: number;
  viewedSlugs: string[];
}
```

```ts
// features/learningAdmin/types.ts
export interface AdminArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  body: string;
  status: 'draft' | 'published' | 'archived';
  authorId: string;
  coverImageUrl: string | null;
  imageUrls: string[];
  audioUrl: string | null;
  videoUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleInput {
  title: string;
  body: string;
  category: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  coverImageUrl?: string | null;
  imageUrls?: string[];
  audioUrl?: string | null;
  videoUrl?: string | null;
}

export type UpdateArticleInput = Partial<CreateArticleInput>;

export interface UploadResponse {
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

export interface ArticleListAdminResponse {
  articles: AdminArticle[];
  total: number;
  page: number;
  limit: number;
}
```

### Key Service Implementations

#### `backend/src/utils/slugify.ts`

```ts
import { PrismaClient } from '../../generated/prisma/index.js';
import { createError } from '../middlewares/errorHandler.js';

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')   // strip non-word chars (Unicode \w preserves Bengali)
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
}

export async function generateUniqueSlug(
  title: string,
  prisma: PrismaClient
): Promise<string> {
  const base = generateSlug(title);
  let slug = base;
  let i = 2;
  while (i <= 99) {
    const exists = await prisma.learningArticle.findUnique({ where: { slug } });
    if (!exists) return slug;
    slug = `${base.slice(0, 96)}-${i}`;
    i++;
  }
  throw createError(
    409,
    'SLUG_CONFLICT',
    'Title too similar to an existing article. Please use a slightly different title.'
  );
}
```

#### `backend/src/services/r2Service.ts` (key shape)

```ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
}

function getR2Config(): R2Config {
  const vars = ['R2_ACCOUNT_ID','R2_ACCESS_KEY_ID','R2_SECRET_ACCESS_KEY',
                 'R2_BUCKET_NAME','R2_PUBLIC_URL'];
  const missing = vars.filter(v => !process.env[v]);
  if (missing.length > 0) {
    throw createError(503, 'R2_NOT_CONFIGURED',
      `R2 storage is not configured. Missing: ${missing.join(', ')}`);
  }
  return { /* env vars */ } as R2Config;
}

export async function uploadToR2(
  buffer: Buffer, originalName: string, mimeType: string
): Promise<{ url: string; filename: string; mimeType: string; sizeBytes: number }> {
  const config = getR2Config();   // throws 503 if not configured
  const sanitized = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filename = `${randomUUID()}-${sanitized}`;
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
  });
  await client.send(new PutObjectCommand({
    Bucket: config.bucketName,
    Key: filename,
    Body: buffer,
    ContentType: mimeType,
  }));
  return { url: `${config.publicUrl}/${filename}`, filename, mimeType, sizeBytes: buffer.length };
}
```

#### `backend/src/middlewares/uploadMiddleware.ts` (key shape)

```ts
import multer from 'multer';

const ALLOWED_MIMES = new Set([
  'image/jpeg', 'image/png', 'image/webp',
  'audio/mpeg', 'audio/ogg', 'audio/mp4',
  'video/mp4', 'video/webm',
]);

const SIZE_LIMITS: Record<string, number> = {
  'image/': 5 * 1024 * 1024,   // 5 MB
  'audio/': 50 * 1024 * 1024,  // 50 MB
  'video/': 200 * 1024 * 1024, // 200 MB
};

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 }, // outer cap = video limit
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.has(file.mimetype)) cb(null, true);
    else cb(createError(415, 'INVALID_MIME_TYPE', `Unsupported file type: ${file.mimetype}`));
  },
});
// Per-type size check is done in the controller after multer runs (buffer.length check).
```

#### `backend/src/services/learningService.ts` (view tracking section)

```ts
// After fetching the published article by slug:
if (req.user.role === 'mother') {
  await prisma.contentItem.upsert({
    where: { slug },
    update: {},
    create: { slug, category: article.category },
  });
  const motherProfile = await prisma.motherProfile.findUnique({
    where: { userId: req.user.id },
  });
  if (motherProfile) {
    const contentItem = await prisma.contentItem.findUnique({ where: { slug } });
    await prisma.contentView.upsert({
      where: { motherProfileId_contentItemId: {
        motherProfileId: motherProfile.id,
        contentItemId: contentItem!.id,
      }},
      update: { viewedAt: new Date() },
      create: {
        motherProfileId: motherProfile.id,
        contentItemId: contentItem!.id,
      },
    });
  }
}
```

#### `backend/src/services/learningService.ts` (durationMin)

```ts
function estimateDuration(body: string): number {
  return Math.ceil(body.split(/\s+/).filter(Boolean).length / 200);
}
```

#### `backend/src/validators/learningValidator.ts`

```ts
// Valid sets
const VALID_CATEGORIES = new Set([
  'feeding','kmc','growth','danger_signs',
  'emotional_support','immunization','newborn_care',
]);
const VALID_STATUSES = new Set(['draft','published','archived']);

export interface ValidationError { field: string; message: string; }

export function validateArticle(
  body: Partial<CreateArticleInput>,
  isCreate: boolean
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (isCreate || body.title !== undefined) {
    if (!body.title || body.title.trim() === '')
      errors.push({ field: 'title', message: 'Title is required' });
  }
  if (isCreate || body.body !== undefined) {
    if (!body.body || body.body.trim() === '')
      errors.push({ field: 'body', message: 'Body is required' });
  }
  if (isCreate || body.category !== undefined) {
    if (!body.category || !VALID_CATEGORIES.has(body.category))
      errors.push({ field: 'category', message: 'Invalid category' });
  }
  if (body.status !== undefined && !VALID_STATUSES.has(body.status))
    errors.push({ field: 'status', message: 'Status must be draft, published, or archived' });

  const urlFields = ['coverImageUrl','audioUrl','videoUrl'] as const;
  for (const f of urlFields) {
    const val = (body as Record<string, unknown>)[f];
    if (val !== undefined && val !== null && (typeof val !== 'string' || !val.startsWith('https://')))
      errors.push({ field: f, message: `${f} must be a valid https:// URL` });
  }
  if (Array.isArray(body.imageUrls)) {
    body.imageUrls.forEach((url, i) => {
      if (!url.startsWith('https://'))
        errors.push({ field: `imageUrls[${i}]`, message: 'Each imageUrl must be a valid https:// URL' });
    });
  }

  return errors;
}
```

#### `frontend/src/pages/LearningHub.tsx` — Rewrite Summary

State: `articles`, `loading`, `error`, `viewedSlugs`, `category`, `search`.
- `category` and `search` are passed as query params to `GET /api/learning`.
- 300 ms `debounce` on the search input (implement with `useRef` + `setTimeout`).
- Article click → `navigate(ROUTES.LEARN_ARTICLE.replace(':slug', slug))`.
- Viewed badge via `viewedSlugs` from API response (no longer calls separate
  `getViewedSlugs()` endpoint; data comes bundled in the list response).
- Loading: render `<LoadingScreen />` on first fetch; inline spinner on filter changes.
- Featured article: first article in the response with a `coverImageUrl`.

#### `frontend/src/pages/learning/ArticleDetail.tsx` — Summary

- Fetch from `GET /api/learning/:slug` on mount via `useParams()`.
- Loading: `<LoadingScreen />`.
- 404: "নিবন্ধটি পাওয়া যায়নি" + back link.
- Render `body` via `<ReactMarkdown>` from `react-markdown`.
- Render `<AudioPlayer src={audioUrl} />` when `audioUrl` is set.
- Render `<video controls src={videoUrl} className="w-full rounded-xl" />` when `videoUrl` is set.
- Render images in a responsive `<div className="grid gap-3">` when `imageUrls` is non-empty.
- Wrapped in `<AppShell title={article.title} subtitle={t('learningHub.title')}>`.

#### `frontend/src/pages/admin/ArticleForm.tsx` — Upload UX

```ts
type UploadState = 'idle' | 'uploading' | 'done' | 'error';

interface UploadFields {
  coverImage: UploadState;
  audio: UploadState;
  video: UploadState;
}
```

On file input change → call `uploadMedia(formData)` → populate URL field.
Submit button disabled while any field is `'uploading'`.
Error shown via `<InlineFormError>` adjacent to the upload field.
Client-side validation: `title` and `body` must be non-empty before POST/PUT.

### Environment Variables

Add to `backend/.env.example` (optional block — server starts without these):
```
# Cloudflare R2 — optional in development; required for file uploads in production
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
```

Upload endpoints return HTTP 503 (`R2_NOT_CONFIGURED`) if env vars are absent at call time.

### New npm Dependencies

Backend:
```
@aws-sdk/client-s3   — R2 / S3-compatible upload
multer               — multipart/form-data parsing
@types/multer        — TypeScript types for multer
```

Frontend:
```
react-markdown       — Markdown rendering in ArticleDetail and ArticlePreview
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions
of a system — essentially, a formal statement about what the system should do. Properties serve
as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

The prework analysis identified that the slug generator, content validator, file upload
validation, durationMin calculation, search filter, and view-tracking upsert are all pure or
near-pure functions appropriate for property-based testing. HTTP endpoint behavior, UI
rendering, and infrastructure checks (R2, DB schema) are covered by example-based and
integration tests instead.

**Property reflection summary**: After reviewing all candidates, Properties 1 and 2 (slug
character safety + length) are complementary and non-redundant; Property 3 (slug round-trip)
is distinct because it tests the full create-then-fetch pipeline. Properties 4, 5, and 6
(validator fields) each test independent logical sub-predicates — not redundant with each
other. Properties 7 and 8 (MIME + size validation) both act on the same (mimeType, size)
input but verify different aspects. Properties 9 and 10 (durationMin + pagination invariant)
are orthogonal. Property 11 (view idempotence) is unique.

---

### Property 1: Slug character safety

*For any* Unicode string used as an article title, `generateSlug(title)` SHALL return a string
containing only lowercase ASCII letters, digits, and hyphens (`[a-z0-9-]`), and SHALL be
non-empty for any title with at least one alphanumeric character.

**Validates: Requirements 2.1**

---

### Property 2: Slug length invariant

*For any* string of any length used as an article title, `generateSlug(title)` SHALL return a
string of length ≤ 100 characters.

**Validates: Requirements 2.3**

---

### Property 3: Slug round-trip

*For any* valid article title, creating a LearningArticle with that title SHALL produce a slug
such that `GET /api/learning/:slug` returns the same article (i.e., the article is reachable
via the generated slug).

**Validates: Requirements 2.4**

---

### Property 4: Title and body required (whitespace rejection)

*For any* string composed entirely of whitespace characters (or the empty string), passing it
as `title` or as `body` to `validateArticle` SHALL produce a validation error for that field;
the function SHALL NOT accept blank-only content as valid.

**Validates: Requirements 6.1, 6.2**

---

### Property 5: Category allowlist enforcement

*For any* string, passing it as `category` to `validateArticle` SHALL produce no category
error if and only if it is one of the seven valid category values (`feeding`, `kmc`, `growth`,
`danger_signs`, `emotional_support`, `immunization`, `newborn_care`); all other strings SHALL
produce a category validation error.

**Validates: Requirements 6.3**

---

### Property 6: URL field https:// prefix enforcement

*For any* string value passed as `coverImageUrl`, `audioUrl`, or `videoUrl` to
`validateArticle`, the function SHALL accept the value if and only if it starts with
`https://`; all other non-null, non-undefined string values SHALL produce a validation error
for the corresponding field.

**Validates: Requirements 6.5**

---

### Property 7: MIME type allowlist

*For any* MIME type string, the upload MIME validator SHALL return `true` if and only if the
string is one of the ten accepted types (`image/jpeg`, `image/png`, `image/webp`,
`audio/mpeg`, `audio/ogg`, `audio/mp4`, `video/mp4`, `video/webm`); all other strings SHALL
be rejected.

**Validates: Requirements 3.7, 3.8**

---

### Property 8: Per-type file size limits

*For any* (mimeType, fileSize) pair where mimeType is an accepted MIME type, the size
validator SHALL accept the file if `fileSize ≤ limit(mimeType)` and reject it otherwise, where
`limit` maps `image/*` → 5 MB, `audio/*` → 50 MB, `video/*` → 200 MB.

**Validates: Requirements 3.5, 3.6**

---

### Property 9: durationMin calculation

*For any* article body string, the estimated reading duration SHALL equal
`Math.ceil(body.split(/\s+/).filter(Boolean).length / 200)`, and SHALL be ≥ 1 for any
non-empty body.

**Validates: Requirements 7.6**

---

### Property 10: Pagination consistency invariant

*For any* collection of N articles and any valid `limit` value (1 ≤ limit ≤ 100), paginating
through all pages SHALL yield exactly N articles in total across all pages, with no article
appearing more than once and no article from the collection omitted.

**Validates: Requirements 5.7**

---

### Property 11: View tracking idempotence

*For any* article slug and mother profile, calling `recordView(slug, motherProfileId)` any
number of times (≥ 1) SHALL result in exactly one `ContentView` record linking that
`motherProfileId` to the `ContentItem` for that slug; repeated calls SHALL NOT create
duplicate records.

**Validates: Requirements 8.1, 8.2**

---

## Error Handling

### Backend Error Catalogue

| Code | HTTP | When |
|------|------|------|
| `VALIDATION_ERROR` | 422 | Article create/update with missing/invalid fields |
| `SLUG_CONFLICT` | 409 | Slug suffixes -2 through -99 all taken |
| `ARTICLE_NOT_FOUND` | 404 | GET/PUT/DELETE on non-existent article ID or slug |
| `R2_NOT_CONFIGURED` | 503 | Upload called but R2 env vars absent |
| `R2_UPLOAD_FAILED` | 502 | R2 returns error during PutObject |
| `INVALID_MIME_TYPE` | 415 | Uploaded file MIME type not in allowlist |
| `FILE_TOO_LARGE` | 413 | Uploaded file exceeds per-type size limit |
| `UNAUTHORIZED` | 401 | Missing or expired JWT (existing middleware) |
| `FORBIDDEN` | 403 | Role not researcher on admin endpoints (existing middleware) |

All errors follow the existing shape:
```json
{ "success": false, "code": "...", "message": "...", "details": [...] }
```

### Prisma Error Mapping

The existing `globalErrorHandler` already maps:
- `P2002` (unique constraint) → 409
- `P2025` (record not found) → 404
- `P2003` (FK violation) → 409

No new mapping needed for the Learning CMS.

### Frontend Error Handling

All components use `normalizeApiError(err).message` from `../../lib/apiError`.

- **LearningHub**: inline error banner below search bar; does not unmount the page shell.
- **ArticleDetail**: full-page error with back link; 404 shown as Bengali "not found" message.
- **AdminArticleList / LearningDashboard**: error card in the content area.
- **ArticleForm**:
  - 422 → field-level `<InlineFormError>` next to each failing field.
  - Other errors → top-level error banner.
  - Upload failure → inline error adjacent to the upload button; URL field stays empty.

### Status Transition Rules

| From | To | publishedAt behaviour |
|------|----|-----------------------|
| draft | published | Set to `now()` if null |
| published | draft | Set to `null` |
| published | archived | Preserved (keep original publish date) |
| archived | published | Set to `now()` only if currently null |
| archived | draft | Set to `null` |

---

## Testing Strategy

### Unit Tests (example-based)

Located in `backend/tests/` and `frontend/src/**/*.test.ts`.

| Area | Test cases |
|------|-----------|
| `slugify.ts` | Known Bengali title → expected ASCII slug; title with only special chars → empty or short slug; very long title → truncated to 100 |
| `learningValidator.ts` | Null title → error; whitespace title → error; valid article → no errors; unknown category → error; http:// URL → error; https:// URL → accepted |
| `learningAdminService` | Create article sets status=draft, authorId=req.user.id; publish sets publishedAt; re-publish preserves publishedAt; unpublish clears publishedAt |
| `uploadMiddleware` | Accepted MIME passes; unknown MIME rejected; over-limit file rejected |
| `ArticleDetail` | Renders LoadingScreen; renders 404 message; renders body as Markdown; renders AudioPlayer when audioUrl present; hides AudioPlayer when absent |
| `ArticleForm` | Disables submit while uploading; shows inline error on upload failure; shows field errors on 422 |
| Access control | 401 when no token; 403 when role=mother on admin endpoints |

### Property-Based Tests

Use **fast-check** (already idiomatic in TypeScript projects; no extra setup beyond
`npm install --save-dev fast-check`). Minimum 100 runs per property.

Tag format in test comments: `Feature: learning-cms, Property <N>: <property_text>`

```ts
// Property 1 example — slug character safety
import fc from 'fast-check';
import { generateSlug } from '../src/utils/slugify.js';

test('slug contains only [a-z0-9-]', () => {
  // Feature: learning-cms, Property 1: slug character safety
  fc.assert(
    fc.property(fc.string(), (title) => {
      const slug = generateSlug(title);
      return slug === '' || /^[a-z0-9-]+$/.test(slug);
    }),
    { numRuns: 200 }
  );
});
```

Each correctness property (1–11) gets one property-based test.
Properties 3 and 11 require a test database; use an in-memory Prisma + pg test container
pattern consistent with the existing `vitest` + `supertest` setup.

### Integration Tests

| Endpoint | Scenarios |
|----------|-----------|
| POST /api/admin/learning/upload | 201 on valid file; 400 on no file; 415 on wrong MIME; 503 when R2 not configured |
| POST /api/admin/learning | 201 create; 401 no token; 403 wrong role; 422 missing fields |
| PUT /api/admin/learning/:id | 200 update; 404 not found; publishedAt set on publish |
| DELETE /api/admin/learning/:id | 204 deleted; 404 not found |
| GET /api/learning | 200 only published; category filter; search filter |
| GET /api/learning/:slug | 200 full body; 404 draft not visible; view recorded for mother |

### Accessibility

All new admin pages use semantic HTML (`<table>` for article list, `<form>` with `<label>`s,
`<button type="submit">`). Color-only status indicators (draft/published/archived badges)
include text labels. File upload inputs include `<label>` associations. Full WCAG 2.1 AA
validation requires manual testing with assistive technologies.
