# Article Readability Bugfix Design

## Overview

Learning Hub articles render as unstructured walls of plain text. The root causes are:

1. **Plain-text article bodies** — `learningHubContent.ts` (the seeded source) uses `\n\n`
   separators only. Section labels are inline prose, enumerated items are sentence-chained.
   ReactMarkdown renders the `body` field as-is, so without proper Markdown syntax there is
   no heading or list structure regardless of the CSS.
2. **Missing `summary` DB column** — `LearningArticle` has no `summary` field. The static
   content file and `ArticleDetail.tsx` both reference `summary`, but it is never persisted
   or returned by the API.
3. **No content author guide** — The Bengali content author has no reference for Markdown
   conventions, so future articles will reproduce the same defects.

The fix is additive and surgical: reformat the 20 existing article bodies with Markdown
structure, add the `summary` column to the DB and wire it through the API, and publish a
writing guide. No rendering code changes are required — `.article-prose` CSS and
`ReactMarkdown` are already correct.

---

## Glossary

- **Bug_Condition (C)**: The condition that causes unstructured rendering — article body text
  lacks Markdown syntax (`##`, `**`, `-`) AND/OR the `summary` field is absent from the
  DB schema.
- **Property (P)**: The desired behavior — articles render with visible heading and list
  hierarchy; the pull-quote summary appears when the field is present.
- **Preservation**: All 20 articles continue to load and display their body text; no existing
  API fields are removed; the DB seed runs without error; audio/video/image sections are
  unaffected.
- **`learningHubContent.ts`**: `frontend/src/content/learningHubContent.ts` — the static
  TypeScript array that is the source of truth for article bodies seeded into the DB.
- **`LearningArticle`**: The Prisma model at `backend/prisma/schema.prisma` representing a
  single article stored in `learning_articles`.
- **`learningService.ts`**: `backend/src/services/learningService.ts` — the service that
  reads `LearningArticle` records and returns them to the API consumer.
- **`.article-prose`**: The CSS class in `frontend/src/index.css` that styles `h2`, `p`,
  `ul`, `ol`, `blockquote` elements inside the article body container.
- **`summary`**: An optional short lead text (1–2 sentences) displayed as a pull-quote above
  the article body when present.
- **`ARTICLE_WRITING_GUIDE.md`**: A Markdown file for the Bengali content author describing
  how to structure articles.

---

## Bug Details

### Bug Condition

The readability defect manifests for any article whose `body` field contains only
`\n\n`-separated prose with no Markdown syntax, **or** for any article page that cannot
display a summary because the `summary` column does not exist in the DB.

**Formal Specification:**
```
FUNCTION isBugCondition(article)
  INPUT: article of type LearningContentItem | LearningArticle
  OUTPUT: boolean

  bodyLacksMarkdown ← NOT (article.body CONTAINS '## '
                           OR article.body CONTAINS '**'
                           OR article.body CONTAINS '\n- ')
  summaryColumnMissing ← 'summary' NOT IN DB_COLUMNS('learning_articles')

  RETURN bodyLacksMarkdown OR summaryColumnMissing
END FUNCTION
```

### Examples

- **Feeding — Latching Basics**: Body begins "A good latch is the foundation…" with no `##`
  headings. Section concepts like "Signs of a good latch" and "If the latch is poor" are
  embedded in paragraphs. Expected: `## লেচের লক্ষণ` heading + bullet list of signs.
- **KMC — How to Do KMC**: "How to get into position:" is a paragraph lead with no heading.
  Steps are comma-separated. Expected: `## কীভাবে অবস্থান নেবেন` heading + numbered list.
- **Danger Signs**: "Seek medical care immediately…" followed by a long comma-separated
  symptom run. Expected: `## তাৎক্ষণিকভাবে হাসপাতালে যান` heading + bullet list.
- **Summary field**: All 20 articles in `learningHubContent.ts` have a `summary` string but
  the pull-quote never renders because `LearningArticle.summary` does not exist in the DB.

---

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- All 20 articles must continue to load and return HTTP 200 from `GET /api/learning/:slug`.
- The `body`, `title`, `category`, `tags`, `slug`, `coverImageUrl`, `imageUrls`, `audioUrl`,
  `videoUrl`, `publishedAt`, and `durationMin` fields must remain in every API response.
- The DB seed script must run without error; `summary` is a nullable additive column.
- Audio player, video player, and inline image sections in `ArticleDetail.tsx` must remain
  functional.
- The Learning Hub list page (`/learn`) must continue to display all articles with correct
  read-time chips.
- The admin CMS article form must continue to save all existing fields correctly.

**Scope:**
All behaviour that does NOT involve the `body` content format or the `summary` DB column
must be completely unaffected. This includes: authentication, view tracking (`ContentView`),
category filtering, search, the `durationMin` estimate, growth/daily-log/assessment features,
and all non-learning routes.

---

## Hypothesized Root Cause

1. **Static content file never Markdown-formatted**: `learningHubContent.ts` was authored
   as plain readable English/Bengali prose. The original render path used `<p>` tags directly,
   and when `ReactMarkdown` was introduced it was treated as a drop-in replacement without
   reformatting the source content.

2. **`summary` column overlooked during schema design**: The `LearningContentItem` TypeScript
   interface in the static file always had `summary`, and `ArticleDetail.tsx` conditionally
   renders it. But when the `LearningArticle` Prisma model was created for the CMS, `summary`
   was not carried over, leaving a silent disconnect.

3. **No content authoring process**: There was no step in the content workflow that checked
   for Markdown structure or provided the author with formatting conventions, so the defect
   has no external gate.

---

## Correctness Properties

Property 1: Bug Condition — Markdown Structure in Article Bodies

_For any_ article in `learningHubContent.ts` where the body contains section labels or
enumerable items (i.e., isBugCondition returns true for the body format), the reformatted
body SHALL contain at least one `## ` heading and, where the original content lists items,
at least one `- ` bullet or numbered list item, causing ReactMarkdown to render visible
structural elements via the `.article-prose` CSS rules.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation — Existing Article Content Integrity

_For any_ article body before and after reformatting, the substantive Bengali/English
information content SHALL be identical (no facts added or removed). For all API calls
`GET /api/learning/:slug` against any of the 20 slugs, the response SHALL continue to return
HTTP 200 with all pre-existing fields populated. For all non-buggy inputs (audio, video,
images, view tracking, list page), the fixed code SHALL produce the same result as the
original code.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**

---

## Fix Implementation

### Changes Required

**Change 1 — Reformat article bodies in `learningHubContent.ts`**

File: `frontend/src/content/learningHubContent.ts`

For each of the 20 articles, convert the `body` string to valid Markdown:
- Identify section label sentences (typically short Bengali phrases followed by `:` or
  ending a paragraph alone, e.g., "Signs of a good latch:", "How to get into position:").
  Promote them to `## Bengali Heading` (translate where appropriate to match the target
  reader's language).
- Convert comma-separated or sentence-chained enumerations to `- ` bullet lists.
- Wrap actionable caution text (e.g., "Seek medical care immediately if…") in `>` blockquotes
  for the warning callout treatment.
- Mark key clinical terms with `**bold**` (e.g., temperature thresholds, weight targets).
- Preserve all factual content verbatim; do not paraphrase.

**Change 2 — Add `summary` field to Prisma schema**

File: `backend/prisma/schema.prisma`

Add to `LearningArticle` model:
```
summary  String?  @db.Text
```

**Change 3 — Create DB migration**

Run `prisma migrate dev --name add_article_summary` to generate and apply the migration SQL:
```sql
ALTER TABLE "learning_articles" ADD COLUMN "summary" TEXT;
```
The column is nullable so existing rows are unaffected.

**Change 4 — Update seed script / `learningHubContent.ts` synchronisation**

File: whichever backend seed script reads from `learningHubContent.ts`

Ensure the `summary` field from each `LearningContentItem` is written to
`LearningArticle.summary` when seeding. Add `summary: item.summary` to the
`prisma.learningArticle.upsert` call.

**Change 5 — Update `learningService.ts` to return `summary`**

File: `backend/src/services/learningService.ts`

In `getPublishedArticleBySlug`, the current `return { ...article, durationMin }` already
spreads the full Prisma record, so `summary` will be included automatically once the
column exists. Verify the `select` clause in `listPublishedArticles` does NOT select
`summary` (it should remain body-only for the list response; summary is detail-only).

**Change 6 — Update `ArticleDetail` TypeScript type (already done)**

File: `frontend/src/features/learning/types.ts`

`summary?: string` is already present on the `ArticleDetail` interface. No change needed.

**Change 7 — Publish `ARTICLE_WRITING_GUIDE.md`**

File: `docs/ARTICLE_WRITING_GUIDE.md` (create `docs/` dir if absent)

Content: Markdown syntax reference for the Bengali content author, covering:
- `##` for section headings (with Bengali examples)
- `**bold**` for key clinical terms
- `- ` for bullet lists and when to use them
- `>` for warning callouts
- A full example article excerpt in Bengali

---

## Testing Strategy

### Validation Approach

Two phases: first surface counterexamples on UNFIXED content to confirm the defect, then
verify the fix produces the correct structure and preserves all unchanged behaviors.

### Exploratory Bug Condition Checking

**Goal**: Confirm that the plain-text `body` fields produce no Markdown elements in the DOM
before the fix — demonstrating the bug exists.

**Test Plan**: Write a Node.js test (or Vitest unit test) that imports `learningHubContent.ts`
directly and asserts Markdown structure. Run on UNFIXED (current) content — expect failure.

**Test Cases**:
1. **No `##` headings test**: For each of the 20 articles, assert that `body` contains at
   least one `## ` heading. (Will fail on unfixed content — confirms bug.)
2. **No bullet list test**: For articles with enumerated items (e.g., `danger-signs-overview`,
   `latching-basics`, `breastfeeding-problems`), assert that `body` contains at least one
   `\n- `. (Will fail on unfixed content.)
3. **Summary DB column test**: Assert that the `LearningArticle` Prisma model fields include
   `summary`. (Will fail before migration is applied.)

**Expected Counterexamples**:
- `body` of `latching-basics` contains no `## ` — plain paragraphs only.
- `body` of `danger-signs-overview` is one long paragraph with comma-separated danger signs.
- `LearningArticle` model fields do not include `summary`.

### Fix Checking

**Goal**: Verify that for all 20 articles where the bug condition held, the fixed content and
schema produce the expected behavior.

**Pseudocode:**
```
FOR ALL article WHERE isBugCondition(article) DO
  result ← reformattedBody(article)
  ASSERT result CONTAINS '## '
  ASSERT result (where enumerable) CONTAINS '\n- '
  ASSERT DB_COLUMNS('learning_articles') INCLUDES 'summary'
END FOR
```

### Preservation Checking

**Goal**: Verify that reformatting does not change the factual information content of any
article, and that the API continues to return all expected fields.

**Pseudocode:**
```
FOR ALL article WHERE NOT isBugCondition(article) DO
  ASSERT originalWordCount ≈ fixedWordCount  (within 5% tolerance for Markdown syntax chars)
  ASSERT GET /api/learning/:slug returns HTTP 200
  ASSERT response INCLUDES { slug, title, body, category, durationMin }
  ASSERT audio/video/image fields unchanged
END FOR
```

**Testing Approach**: Property-based testing is recommended for body content preservation
because it can generate assertions across all 20 article slugs automatically.

**Test Cases**:
1. **API round-trip test**: For all 20 slugs, assert `GET /api/learning/:slug` returns 200
   and body is non-empty after fix. Verify same slugs work before and after.
2. **Word count preservation test**: For each article, assert that the word count of the
   reformatted body (stripping Markdown syntax characters) stays within 5% of the original.
3. **Summary API test**: After migration + seed, assert `GET /api/learning/:slug` response
   includes a non-empty `summary` string for articles that had one in `learningHubContent.ts`.
4. **Audio/video unchanged test**: Confirm `audioUrl` and `videoUrl` fields are unaffected
   by the body reformatting (they come from separate fields).

### Unit Tests

- Parse each reformatted `body` string through a Markdown parser and assert at least one
  `heading` node and at least one `list` node for articles with section structure.
- Assert `summary` column exists in the generated Prisma client types after migration.
- Assert the seed script writes `summary` to the DB for all 20 articles.

### Property-Based Tests

- Generate a random subset of the 20 article slugs and assert each API call returns 200
  with all required fields.
- For each article body, assert no required clinical fact (key Bengali phrase) was dropped
  during reformatting by checking presence of distinctive terms.
- Assert that for any article missing `summary` in the source, the API returns `summary`
  as `null` or absent (not an empty string), preserving the conditional render guard.

### Integration Tests

- Open `/learn/latching-basics` in a browser test (Playwright or manual) and assert the DOM
  contains `<h2>` elements inside `.article-prose`.
- Assert the pull-quote `border-l-4 border-secondary` block renders when `summary` is set.
- Confirm the Learning Hub list page (`/learn`) still shows 20 cards after all changes.
