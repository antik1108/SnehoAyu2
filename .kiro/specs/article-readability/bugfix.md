# Bugfix Requirements Document

## Introduction

Learning Hub articles in SnehoAyu render as a dense, unstructured wall of text on both mobile
and desktop. The primary users — mothers of premature babies in West Bengal reading on Android
phones — are faced with unbroken Bengali paragraphs with no visual hierarchy, no section
headings, and no breathing room. This is demotivating and reduces comprehension of critical
infant-care information.

Three distinct defects compound the problem:

1. **Plain-text bodies** — article content in `learningHubContent.ts` (the seeded source) uses
   `\n\n` line breaks only; there are no `##` headings, `**bold**` terms, or `- ` bullet lists,
   so even a working Markdown renderer produces a wall of paragraphs.
2. **Missing `summary` field in the DB and API** — the static content file has a per-article
   `summary` string but the `LearningArticle` Prisma model has no `summary` column, so the
   pull-quote lead paragraph in `ArticleDetail.tsx` never renders.
3. **No style guide for future content** — the Bengali content author has no guidance on how
   to structure articles with Markdown, leading to recurring unstructured content.

*(Note: the `@tailwindcss/typography` package and `.article-prose` CSS class fixes have already
been applied and are outside the scope of these remaining tasks.)*

---

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user opens any Learning Hub article THEN the system renders the full body as one
    or more unbroken paragraphs with no visual section headings, making Bengali content hard
    to scan and read on a mobile screen.

1.2 WHEN an article body contains section labels (e.g., "এটি কী?", "কীভাবে করবেন?",
    "কখন হাসপাতালে যাবেন?") written inline as plain text THEN the system renders them as
    ordinary paragraph text indistinguishable from the surrounding body copy.

1.3 WHEN an article body contains enumerated items written as comma-separated or
    sentence-chained lists THEN the system renders them as run-on prose rather than
    visual bullet or numbered lists.

1.4 WHEN a mother opens an article detail page THEN the system renders no pull-quote lead
    paragraph above the body, because the `summary` field is absent from the `LearningArticle`
    DB schema and the API never returns it.

1.5 WHEN a Bengali content author creates or edits an article in the CMS THEN the system
    provides no guidance on Markdown structure, resulting in future articles that will
    reproduce the same plain-text readability defect.

### Expected Behavior (Correct)

2.1 WHEN a user opens any Learning Hub article THEN the system SHALL render the body with
    clear visual section headings (`##`), bold key terms (`**`), and bullet lists (`-`)
    wherever the content warrants them, giving the article visible structure.

2.2 WHEN an article body contains a Bengali section label (e.g., "## এটি কী?") THEN the
    system SHALL render it as a styled `<h2>` heading with the `.article-prose h2` treatment
    (18 px, weight 800, secondary-color underline).

2.3 WHEN an article body contains a `- ` bullet list THEN the system SHALL render it as an
    HTML `<ul>` list with secondary-color bullet markers as defined in `.article-prose ul`.

2.4 WHEN a mother opens an article detail page and the article has a `summary` THEN the
    system SHALL display the summary as a pull-quote lead paragraph with a left border in
    `border-secondary`, above the `<hr>` divider and the body text.

2.5 WHEN a Bengali content author creates or edits an article THEN the system SHALL have a
    published `ARTICLE_WRITING_GUIDE.md` they can reference for Markdown conventions,
    Bengali examples, and heading/list/callout patterns.

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user opens an article that has no `summary` THEN the system SHALL CONTINUE TO
    render the article body without the pull-quote section (the conditional block is
    already guarded by `{article.summary && ...}`).

3.2 WHEN a user opens an article that has an `audioUrl` THEN the system SHALL CONTINUE TO
    render the `AudioPlayer` component correctly below the article body.

3.3 WHEN a user opens an article that has a `videoUrl` THEN the system SHALL CONTINUE TO
    render the `<video>` element correctly below the article body.

3.4 WHEN a user opens an article that has `imageUrls` THEN the system SHALL CONTINUE TO
    render all inline images in the responsive layout below the body.

3.5 WHEN a mother navigates to the Learning Hub list THEN the system SHALL CONTINUE TO
    display all 20 articles with correct titles, categories, and read-time chips.

3.6 WHEN an article is fetched via `GET /api/learning/:slug` THEN the system SHALL CONTINUE
    TO return all existing fields (`id`, `slug`, `title`, `category`, `tags`, `body`,
    `coverImageUrl`, `imageUrls`, `audioUrl`, `videoUrl`, `publishedAt`, `durationMin`);
    the new `summary` field is additive and optional.

3.7 WHEN the database seed script runs THEN the system SHALL CONTINUE TO seed all 20 articles
    without error; the `summary` migration adds a nullable column so existing rows are
    unaffected.

3.8 WHEN the admin CMS article form is used to create or edit an article THEN the system
    SHALL CONTINUE TO save `title`, `body`, `category`, `tags`, and media URLs correctly;
    `summary` is an optional additive field.
