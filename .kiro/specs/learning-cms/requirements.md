# Requirements Document

## Introduction

The Learning CMS is a full-stack content management system for the SnehoAyu app that replaces the current static, hardcoded Bengali article content with a database-driven system. It gives researchers the ability to create, edit, publish, and archive Bengali learning articles — each of which may include images, audio, and video hosted on Cloudflare R2. All authenticated users (mother, nurse, researcher) can browse and read published articles through a dynamic mother-facing Learning Hub. The feature spans a new Prisma model (`LearningArticle`), a Cloudflare R2 upload service, public and admin REST API routes, an admin portal section, and updates to the existing `LearningHub.tsx` page and `ContentView` view-tracking system.

---

## Glossary

- **LearningArticle**: The primary database entity representing a single piece of Bengali learning content, including metadata, body text, status, and media URLs.
- **CMS**: Content Management System — the set of admin-facing tools that allow researchers to manage LearningArticle records.
- **Researcher**: A user with the `researcher` role; the only role authorised to create, edit, publish, or delete content.
- **Mother**: A user with the `mother` role; can read published articles and has view tracking applied.
- **Nurse**: A user with the `nurse` role; can read published articles.
- **R2**: Cloudflare R2 object storage; the external service where all media files are stored.
- **R2_Service**: The internal backend service module that handles file uploads to Cloudflare R2 via the S3-compatible API.
- **Slug**: A URL-safe, unique string identifier derived from an article's title, used to identify and link to individual articles.
- **Status**: The publication lifecycle state of a LearningArticle — one of `draft`, `published`, or `archived`.
- **ContentView**: The existing Prisma model that records which articles a mother has viewed; extended to reference LearningArticle slugs.
- **AdminHeader**: The existing sticky navigation header component rendered on all `/admin/*` pages; requires a new "Learning" nav link.
- **LearningHub**: The existing mother-facing page at `/learn`; currently reads from a static TypeScript file and must be converted to fetch from the API.
- **API_Client**: The existing Axios-based frontend HTTP client at `frontend/src/lib/api.ts` with JWT auth and token refresh.
- **requireAuth**: The existing Express middleware that validates a JWT access token and attaches `req.user`.
- **requireRole**: The existing Express middleware factory that enforces a specific role on `req.user`.
- **Multer**: The Node.js `multipart/form-data` parsing library used for file upload handling.
- **MIME type**: The media type of an uploaded file (e.g., `image/jpeg`, `audio/mpeg`, `video/mp4`); validated server-side before upload.

---

## Requirements

### Requirement 1: LearningArticle Data Model

**User Story:** As a researcher, I want a structured database model for learning articles, so that article content and metadata can be persisted, queried, and managed reliably.

#### Acceptance Criteria

1. THE Database SHALL store LearningArticle records with the following fields: `id` (UUID, primary key), `title` (Bengali string, required), `slug` (unique URL-safe string, required), `category` (string, required), `tags` (string array), `body` (Markdown text, required), `status` (enum: `draft` | `published` | `archived`, default `draft`), `authorId` (foreign key to User, required), `coverImageUrl` (string, optional), `imageUrls` (string array), `audioUrl` (string, optional), `videoUrl` (string, optional), `publishedAt` (DateTime, optional), `createdAt` (DateTime, auto-set), `updatedAt` (DateTime, auto-updated).
2. THE Database SHALL enforce uniqueness on the `slug` field across all LearningArticle records.
3. THE Database SHALL enforce a foreign key relationship from `LearningArticle.authorId` to `User.id`.
4. WHEN a LearningArticle's `status` is set to `published`, THE Database SHALL set `publishedAt` to the current timestamp if `publishedAt` is not already set.
5. THE Database SHALL index LearningArticle records on `status` and `category` to support efficient filtered queries.
6. THE Database SHALL preserve the existing `ContentItem` and `ContentView` models without modification, as they continue to serve the view-tracking feature for backward compatibility.

---

### Requirement 2: Slug Generation

**User Story:** As a researcher, I want article slugs to be generated automatically from the article title, so that I do not have to manually enter a URL-safe identifier.

#### Acceptance Criteria

1. WHEN a LearningArticle is created with a `title`, THE Slug_Generator SHALL produce a URL-safe slug by converting the title to lowercase, replacing spaces and special characters with hyphens, and removing characters that are not alphanumeric or hyphens.
2. WHEN the produced slug already exists in the database, THE Slug_Generator SHALL append a numeric suffix (e.g., `-2`, `-3`) until the slug is unique.
3. THE Slug_Generator SHALL produce slugs of no more than 100 characters in length, truncating before suffix addition if necessary.
4. FOR ALL valid LearningArticle titles, THE Slug_Generator SHALL produce a slug that, when used to query the API at `GET /api/learning/:slug`, returns the corresponding article (round-trip property).

---

### Requirement 3: Cloudflare R2 Upload Service

**User Story:** As a researcher, I want to upload media files to cloud storage, so that article images, audio, and videos are served reliably without storing binary data in the database.

#### Acceptance Criteria

1. THE R2_Service SHALL read the following environment variables at startup: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, and `R2_PUBLIC_URL`.
2. IF any of the five required R2 environment variables are absent at startup, THEN THE R2_Service SHALL throw a configuration error and prevent the server from starting.
3. WHEN a file is uploaded, THE R2_Service SHALL generate a unique filename by prepending a UUID v4 to the original filename, separated by a hyphen.
4. WHEN a file upload to R2 succeeds, THE R2_Service SHALL return the full public URL constructed as `{R2_PUBLIC_URL}/{unique_filename}`.
5. THE R2_Service SHALL enforce the following file size limits server-side: images (MIME type `image/*`) ≤ 5 MB, audio (MIME type `audio/*`) ≤ 50 MB, video (MIME type `video/*`) ≤ 200 MB.
6. IF a file exceeds its category size limit, THEN THE R2_Service SHALL reject the upload with HTTP 413 and return an error message specifying the limit that was exceeded.
7. THE R2_Service SHALL validate MIME types server-side and accept only: `image/jpeg`, `image/png`, `image/webp` for images; `audio/mpeg`, `audio/ogg`, `audio/mp4` for audio; `video/mp4`, `video/webm` for video.
8. IF an uploaded file has a MIME type not in the accepted list, THEN THE R2_Service SHALL reject the upload with HTTP 415 and return a descriptive error message listing the accepted types.
9. THE R2_Service SHALL use the `@aws-sdk/client-s3` library with the S3-compatible Cloudflare R2 endpoint for all upload operations.
10. THE R2_Service SHALL use Multer with `memoryStorage` to receive `multipart/form-data` file uploads before delegating to the upload logic.

---

### Requirement 4: Media Upload API Endpoint

**User Story:** As a researcher, I want a dedicated API endpoint to upload media files, so that I can attach images, audio, and video to learning articles via the admin interface.

#### Acceptance Criteria

1. THE API SHALL expose a `POST /api/admin/learning/upload` endpoint protected by `requireAuth` and `requireRole('researcher')`.
2. WHEN a valid file is submitted to `POST /api/admin/learning/upload`, THE Upload_Controller SHALL upload the file via R2_Service and return HTTP 201 with a JSON body containing `{ url: string, filename: string, mimeType: string, sizeBytes: number }`.
3. IF the request to `POST /api/admin/learning/upload` contains no file, THEN THE Upload_Controller SHALL return HTTP 400 with an error message.
4. IF the upload to R2 fails due to a network or service error, THEN THE Upload_Controller SHALL return HTTP 502 with an error message and SHALL NOT expose internal credentials or bucket configuration in the response.

---

### Requirement 5: Admin Article CRUD API

**User Story:** As a researcher, I want API endpoints to create, read, update, and delete learning articles, so that I can manage the full content lifecycle from the admin portal.

#### Acceptance Criteria

1. THE API SHALL expose the following admin endpoints, all protected by `requireAuth` and `requireRole('researcher')`:
   - `GET /api/admin/learning` — paginated list of all articles (all statuses)
   - `GET /api/admin/learning/:id` — single article by ID
   - `POST /api/admin/learning` — create a new article
   - `PUT /api/admin/learning/:id` — update an existing article
   - `DELETE /api/admin/learning/:id` — delete an article
2. WHEN `POST /api/admin/learning` is called with a valid request body, THE Learning_Admin_Controller SHALL create a new LearningArticle with `status: draft`, set `authorId` to `req.user.id`, generate a slug from the title, and return HTTP 201 with the created article.
3. WHEN `PUT /api/admin/learning/:id` is called and the article `status` is changed to `published`, THE Learning_Admin_Controller SHALL set `publishedAt` to the current timestamp if it is not already set, and return HTTP 200 with the updated article.
4. WHEN `DELETE /api/admin/learning/:id` is called and the article exists, THE Learning_Admin_Controller SHALL permanently delete the article and return HTTP 204.
5. IF `POST /api/admin/learning` is called with a missing `title`, missing `body`, or missing `category`, THEN THE Learning_Admin_Controller SHALL return HTTP 422 with a field-level error array identifying each invalid field.
6. IF `GET /api/admin/learning/:id` or `PUT /api/admin/learning/:id` or `DELETE /api/admin/learning/:id` is called with an ID that does not exist, THEN THE Learning_Admin_Controller SHALL return HTTP 404.
7. THE `GET /api/admin/learning` endpoint SHALL accept optional query parameters `page` (default 1), `limit` (default 20, maximum 100), `status` (filter by status), and `category` (filter by category), and SHALL return a JSON response containing `{ articles: LearningArticle[], total: number, page: number, limit: number }`.
8. THE Learning_Admin_Controller SHALL follow the existing Controller → Service → Prisma pattern established in `adminController.ts` and `contentController.ts`.

---

### Requirement 6: Article Content Validation

**User Story:** As a researcher, I want article content to be validated before saving, so that data integrity and content standards are enforced consistently.

#### Acceptance Criteria

1. THE Learning_Validator SHALL reject a create or update request if `title` is absent or an empty string, and SHALL return an error message for the `title` field.
2. THE Learning_Validator SHALL reject a create or update request if `body` is absent or an empty string, and SHALL return an error message for the `body` field.
3. THE Learning_Validator SHALL reject a create or update request if `category` is absent or not one of the permitted category values (`feeding`, `kmc`, `growth`, `danger_signs`, `emotional_support`, `immunization`, `newborn_care`), and SHALL return an error message for the `category` field.
4. THE Learning_Validator SHALL reject a create or update request if `status` is provided but is not one of `draft`, `published`, or `archived`, and SHALL return an error message for the `status` field.
5. IF `coverImageUrl`, `imageUrls` entries, `audioUrl`, or `videoUrl` are provided, THEN THE Learning_Validator SHALL verify that each is a non-empty string beginning with `https://`, and SHALL return an error message for any field that does not meet this condition.
6. THE Learning_Validator SHALL be implemented as a plain TypeScript function with no external validation library dependencies, consistent with the project's existing validator pattern.

---

### Requirement 7: Public Article Read API

**User Story:** As a mother or nurse, I want to read published learning articles via the API, so that the frontend can display dynamic content fetched from the database.

#### Acceptance Criteria

1. THE API SHALL expose `GET /api/learning` protected by `requireAuth`, returning only LearningArticle records with `status: published`, ordered by `publishedAt` descending.
2. THE API SHALL expose `GET /api/learning/:slug` protected by `requireAuth`, returning the single LearningArticle matching the slug if its `status` is `published`.
3. IF `GET /api/learning/:slug` is called with a slug that does not match any published article, THEN THE Learning_Controller SHALL return HTTP 404.
4. THE `GET /api/learning` endpoint SHALL accept optional query parameters `category` (filter by category) and `search` (full-text search across `title`, `tags`, and `body`), and SHALL return a JSON response containing `{ articles: PublishedArticle[], total: number }`.
5. WHEN `GET /api/learning` is called with a `search` query parameter, THE Learning_Controller SHALL return only articles whose `title`, `body`, or `tags` fields contain the search string (case-insensitive).
6. THE `GET /api/learning` response SHALL include per-article fields: `id`, `slug`, `title`, `category`, `tags`, `coverImageUrl`, `audioUrl`, `videoUrl`, `publishedAt`, and a `durationMin` value estimated as `Math.ceil(wordCount / 200)` where `wordCount` is the number of words in the `body` field. The `body` field SHALL be omitted from the list response.
7. THE `GET /api/learning/:slug` response SHALL include all fields from the list response plus the full `body` field.

---

### Requirement 8: View Tracking Integration

**User Story:** As a researcher, I want to track which articles each mother has viewed, so that engagement data can be analysed alongside clinical outcomes.

#### Acceptance Criteria

1. WHEN `GET /api/learning/:slug` is called by a user with role `mother`, THE Learning_Controller SHALL record a view by upserting a `ContentView` record linking the mother's profile to the `ContentItem` identified by the article slug.
2. IF no `ContentItem` record exists for the article slug, THEN THE Learning_Controller SHALL create one before creating the `ContentView` record, using the article's category as the `ContentItem.category` value.
3. WHEN `GET /api/learning/:slug` is called by a user with role `nurse` or `researcher`, THE Learning_Controller SHALL NOT create a `ContentView` record.
4. THE `GET /api/learning` list response SHALL include a `viewedSlugs` array when called by a user with role `mother`, containing the slugs of all articles the mother has previously viewed.
5. WHEN `GET /api/learning` is called by a user with role `nurse` or `researcher`, THE Learning_Controller SHALL return an empty `viewedSlugs` array.

---

### Requirement 9: LearningHub Frontend — Dynamic Data Fetching

**User Story:** As a mother, I want the Learning Hub to show me articles fetched from the database, so that content updates made by researchers are reflected immediately without a code deployment.

#### Acceptance Criteria

1. THE LearningHub component SHALL fetch the published articles list from `GET /api/learning` via the existing API_Client on mount, replacing all references to the static `learningHubContent.ts` import.
2. WHILE the article list is loading, THE LearningHub component SHALL render a loading indicator using the existing `LoadingScreen` component or an equivalent inline skeleton.
3. IF the fetch from `GET /api/learning` fails, THE LearningHub component SHALL display an inline error message using `normalizeApiError` from `../../lib/apiError` and SHALL NOT crash the page.
4. THE LearningHub component SHALL support category filtering by rendering a horizontal scrollable row of category pills, passing the selected category as a query parameter to `GET /api/learning`.
5. THE LearningHub component SHALL support a text search input that sends the search string as the `search` query parameter to `GET /api/learning`, with a debounce of 300 ms to avoid excessive requests.
6. THE LearningHub component SHALL display a "viewed" badge (using the existing `CheckCircle2` icon pattern) on article cards whose slugs appear in the `viewedSlugs` array returned by the API.
7. THE LearningHub component SHALL display a featured article banner for the first published article that has a `coverImageUrl` set, consistent with the existing featured card design.

---

### Requirement 10: Article Detail Page

**User Story:** As a mother, I want to open a full article page with Bengali text, images, audio, and video, so that I can consume the learning content comfortably.

#### Acceptance Criteria

1. THE Router SHALL expose a new route at `/learn/:slug` that renders the ArticleDetail component, lazy-loaded using `React.lazy`.
2. WHEN the ArticleDetail component mounts, THE ArticleDetail component SHALL fetch the article from `GET /api/learning/:slug` via the API_Client.
3. WHILE the article is loading, THE ArticleDetail component SHALL display the existing `LoadingScreen` component.
4. IF the fetch fails with HTTP 404, THE ArticleDetail component SHALL display a "article not found" message and a back link to `/learn`.
5. IF the fetch fails with any other error, THE ArticleDetail component SHALL display an error message derived from `normalizeApiError`.
6. THE ArticleDetail component SHALL render the article `body` as formatted Markdown using a lightweight Markdown renderer.
7. WHEN an article has an `audioUrl`, THE ArticleDetail component SHALL render the existing `AudioPlayer` component with `src` set to the `audioUrl`.
8. WHEN an article does not have an `audioUrl`, THE ArticleDetail component SHALL NOT render the audio player section.
9. WHEN an article has a `videoUrl`, THE ArticleDetail component SHALL render an HTML `<video>` element with `controls` and `src` set to the `videoUrl`.
10. WHEN an article does not have a `videoUrl`, THE ArticleDetail component SHALL NOT render the video player section.
11. WHEN an article has `imageUrls` containing one or more entries, THE ArticleDetail component SHALL render each image in a responsive layout.
12. THE ArticleDetail component SHALL render within the existing `AppShell` component, with the article `title` as the shell title and a back button that navigates to `/learn`.
13. THE ArticleDetail component SHALL use the `useTranslation` hook for all non-article strings (back label, read time label, audio label, etc.).

---

### Requirement 11: Admin Portal — Learning Management Dashboard

**User Story:** As a researcher, I want a dashboard page in the admin portal showing content statistics, so that I can monitor the state of the content library at a glance.

#### Acceptance Criteria

1. THE Router SHALL expose a new admin route at `/admin/learning` protected by `RequireRole(['researcher'])`, rendering the LearningDashboard component, lazy-loaded using `React.lazy`.
2. THE LearningDashboard component SHALL display three summary counts fetched from `GET /api/admin/learning`: total articles, draft articles, and published articles.
3. THE LearningDashboard component SHALL provide a navigation link to the article list at `/admin/learning/articles`.
4. THE LearningDashboard component SHALL provide a "New Article" action button linking to `/admin/learning/articles/new`.
5. WHILE data is loading, THE LearningDashboard component SHALL display a loading skeleton consistent with the existing admin portal style.
6. IF the data fetch fails, THE LearningDashboard component SHALL display an error message using `normalizeApiError`.

---

### Requirement 12: Admin Portal — Article List

**User Story:** As a researcher, I want to see a paginated list of all articles (draft, published, and archived), so that I can review the complete content inventory and navigate to individual articles.

#### Acceptance Criteria

1. THE Router SHALL expose a route at `/admin/learning/articles` protected by `RequireRole(['researcher'])`, rendering the AdminArticleList component, lazy-loaded using `React.lazy`.
2. THE AdminArticleList component SHALL fetch from `GET /api/admin/learning` and display all articles in a table or card list showing: title, category, status badge, author, and `publishedAt` or `createdAt` date.
3. THE AdminArticleList component SHALL support pagination using the `page` and `limit` query parameters, displaying navigation controls when total articles exceed the page limit.
4. THE AdminArticleList component SHALL provide a status filter that passes the selected status as the `status` query parameter.
5. WHEN an article row is clicked, THE AdminArticleList component SHALL navigate to the article edit page at `/admin/learning/articles/:id/edit`.
6. WHEN the "Preview" action is triggered on an article row, THE AdminArticleList component SHALL navigate to `/admin/learning/articles/:id/preview`.
7. IF the data fetch fails, THE AdminArticleList component SHALL display an error message using `normalizeApiError`.

---

### Requirement 13: Admin Portal — Create and Edit Article

**User Story:** As a researcher, I want a form-based interface to create and edit Bengali learning articles, so that I can manage content without writing code or directly accessing the database.

#### Acceptance Criteria

1. THE Router SHALL expose a route at `/admin/learning/articles/new` and `/admin/learning/articles/:id/edit`, both protected by `RequireRole(['researcher'])`, rendering the ArticleForm component, lazy-loaded using `React.lazy`.
2. WHEN the ArticleForm component is rendered for an existing article (`/edit` route), THE ArticleForm component SHALL fetch the article from `GET /api/admin/learning/:id` and pre-populate all form fields.
3. THE ArticleForm component SHALL provide form fields for: `title` (text input), `category` (select), `tags` (comma-separated text input or tag input), `body` (textarea), `status` (select: draft / published / archived), `coverImageUrl` (text input or file upload), `audioUrl` (file upload), `videoUrl` (file upload).
4. WHEN a file is selected in the cover image, audio, or video upload field, THE ArticleForm component SHALL POST the file to `POST /api/admin/learning/upload` via the API_Client and populate the corresponding URL field with the returned `url`.
5. WHILE a file upload is in progress, THE ArticleForm component SHALL display a loading indicator on the relevant upload field and disable the form submit button.
6. IF a file upload fails, THE ArticleForm component SHALL display an inline error adjacent to the upload field using `normalizeApiError`, and SHALL NOT populate the URL field.
7. WHEN the form is submitted and all required fields are valid, THE ArticleForm component SHALL POST to `POST /api/admin/learning` (create) or PUT to `PUT /api/admin/learning/:id` (edit) via the API_Client.
8. WHEN the create or update request succeeds, THE ArticleForm component SHALL navigate to `/admin/learning/articles` and display a success notification.
9. IF the create or update request returns HTTP 422, THE ArticleForm component SHALL display field-level error messages adjacent to each invalid field using the existing `InlineFormError` component.
10. IF the create or update request fails with any other error, THE ArticleForm component SHALL display a top-level error message using `normalizeApiError`.
11. THE ArticleForm component SHALL validate client-side that `title` and `body` are non-empty before submitting, to avoid unnecessary network requests.

---

### Requirement 14: Admin Portal — Article Preview

**User Story:** As a researcher, I want to preview an article as it will appear to mothers, so that I can verify formatting and media playback before publishing.

#### Acceptance Criteria

1. THE Router SHALL expose a route at `/admin/learning/articles/:id/preview` protected by `RequireRole(['researcher'])`, rendering the ArticlePreview component, lazy-loaded using `React.lazy`.
2. WHEN the ArticlePreview component mounts, THE ArticlePreview component SHALL fetch the article from `GET /api/admin/learning/:id` and render it using the same ArticleDetail layout used on the mother-facing detail page.
3. THE ArticlePreview component SHALL render a top banner indicating that this is a preview and the article's current status (draft / published / archived).
4. THE ArticlePreview component SHALL provide an "Edit" link back to `/admin/learning/articles/:id/edit`.

---

### Requirement 15: AdminHeader Navigation Extension

**User Story:** As a researcher, I want a "Learning" navigation link in the admin header, so that I can reach the Learning CMS from any admin page without manual URL entry.

#### Acceptance Criteria

1. THE AdminHeader component SHALL include a new NavLink to `/admin/learning` alongside the existing "Participants" and "Hospitals" nav pills.
2. THE new NavLink SHALL use the `BookOpen` icon from `lucide-react` with the label "Learning".
3. THE new NavLink SHALL apply the same active/inactive styling pattern as the existing Participants and Hospitals links (`bg-secondary text-primary` when active, `text-text-muted hover:bg-primary/5` when inactive).
4. THE ROUTES constant in `frontend/src/routes/paths.ts` SHALL include `ADMIN_LEARNING: '/admin/learning'`, `ADMIN_LEARNING_ARTICLES: '/admin/learning/articles'`, `ADMIN_LEARNING_NEW: '/admin/learning/articles/new'`.

---

### Requirement 16: Content Language Enforcement

**User Story:** As a researcher, I want the system to enforce Bengali-only content, so that all articles are consistently in the correct language for the mother audience.

#### Acceptance Criteria

1. THE API documentation and admin form placeholders SHALL indicate that all `title` and `body` content must be in Bengali.
2. THE ArticleForm component SHALL display a visible language reminder label ("বাংলায় লিখুন" — Write in Bengali) adjacent to the `title` and `body` fields.
3. THE Learning_Admin_Controller SHALL accept `title` and `body` values in any Unicode string without language detection enforcement, as server-side script detection is out of scope; content language is the researcher's responsibility.

---

### Requirement 17: Access Control Enforcement

**User Story:** As a system administrator, I want all admin CMS operations to be restricted to the researcher role and all read operations to require authentication, so that content integrity and user data security are maintained.

#### Acceptance Criteria

1. THE API SHALL return HTTP 401 for any request to `GET /api/learning`, `GET /api/learning/:slug`, `GET /api/admin/learning`, `GET /api/admin/learning/:id`, `POST /api/admin/learning`, `PUT /api/admin/learning/:id`, `DELETE /api/admin/learning/:id`, and `POST /api/admin/learning/upload` that does not include a valid Bearer token.
2. THE API SHALL return HTTP 403 for any request to `POST /api/admin/learning`, `PUT /api/admin/learning/:id`, `DELETE /api/admin/learning/:id`, or `POST /api/admin/learning/upload` made by a user whose role is not `researcher`.
3. THE API SHALL return HTTP 403 for any request to `GET /api/admin/learning` or `GET /api/admin/learning/:id` made by a user whose role is not `researcher`.
4. WHILE accessing `/admin/learning`, `/admin/learning/articles`, `/admin/learning/articles/new`, or `/admin/learning/articles/:id/edit`, THE Frontend Router SHALL redirect unauthenticated users to the login page using the existing `RequireRole` guard component.
5. THE Learning_Admin_Controller SHALL use the existing `requireAuth` and `requireRole('researcher')` middleware composition already established in `adminRoutes.ts`.

---

### Requirement 18: Error Handling and Resilience

**User Story:** As a user, I want clear error messages when something goes wrong, so that I can understand what happened and take corrective action.

#### Acceptance Criteria

1. IF `POST /api/admin/learning` is called and the slug generation produces a slug that conflicts after all numeric suffix attempts up to `-99` have been exhausted, THEN THE Learning_Admin_Controller SHALL return HTTP 409 with a message indicating a title conflict.
2. IF `PUT /api/admin/learning/:id` is called and `status` is changed from `published` to `draft` or `archived`, THE Learning_Admin_Controller SHALL permit the transition and clear `publishedAt` by setting it to `null`.
3. THE backend SHALL catch all Prisma errors and map them to appropriate HTTP status codes: unique constraint violations → HTTP 409, foreign key violations → HTTP 409, record not found → HTTP 404.
4. THE frontend components SHALL use `normalizeApiError` from `../../lib/apiError` for all API error handling, consistent with the existing pattern used in authentication pages.
5. WHEN the R2 upload returns a network error or a non-2xx response from Cloudflare, THE R2_Service SHALL throw a structured error with a `code` property of `R2_UPLOAD_FAILED` so the Upload_Controller can map it to HTTP 502.

---

### Requirement 19: Backend Route Registration

**User Story:** As a developer, I want the new learning routes to be registered in the existing Express application, so that the API is reachable without modifying the core server bootstrap.

#### Acceptance Criteria

1. THE Express application SHALL register public learning routes under `/api/learning` using a new `learningRoutes.ts` router file.
2. THE Express application SHALL register admin learning routes under `/api/admin/learning` by extending the existing `adminRoutes.ts` file or adding a dedicated `adminLearningRoutes.ts` import.
3. THE new route files SHALL follow the existing ESM import style with `.js` extensions used throughout `backend/src/routes/`.
4. THE new `learningService.ts` and `learningAdminService.ts` SHALL follow the Controller → Service → Prisma pattern established in the existing codebase.
