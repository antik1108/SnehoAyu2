# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Plain-Text Article Bodies Lack Markdown Structure
  - **CRITICAL**: This test MUST FAIL on unfixed code — failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior — it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate that current article bodies have no Markdown headings or lists
  - **Scoped PBT Approach**: Scope the property to the concrete failing cases — iterate over all 20 articles in `learningHubContent.ts` and assert each `body` contains at least one `## ` heading
  - Import `learningHubContent` from `frontend/src/content/learningHubContent.ts` in a Vitest unit test
  - For each article, assert: `article.body` contains `'## '` (at least one section heading)
  - Additionally for articles with enumerated content (e.g., `latching-basics`, `danger-signs-overview`, `breastfeeding-problems`, `kmc-how-to`): assert `article.body` contains `'\n- '` (at least one bullet item)
  - Run test with `vitest --run` in `frontend/` on UNFIXED content
  - **EXPECTED OUTCOME**: Test FAILS (proves the bug — bodies are plain text only)
  - Document counterexamples found (e.g., "latching-basics body contains no `## `, danger-signs-overview is one long comma-run paragraph")
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Article Content Integrity and API Continuity
  - **IMPORTANT**: Follow observation-first methodology — observe current behavior on UNFIXED code first
  - Observe: `GET /api/learning/latching-basics` returns HTTP 200 with `body`, `title`, `slug`, `category`, `durationMin` on unfixed code
  - Observe: `GET /api/learning` returns 20 articles with correct `durationMin` values on unfixed code
  - Observe: For articles with `audioUrl` (e.g., `kmc-how-to`, `kmc-benefits`, `coping-with-anxiety`), the field is present and unchanged in the API response
  - Write Vitest unit tests against `learningHubContent.ts`:
    - For all 20 articles: assert `article.slug`, `article.title`, `article.category`, `article.body` are non-empty strings
    - For all 20 articles: assert `article.body` length after stripping Markdown syntax chars is within 10% of the original length (word-count preservation)
    - For articles with `audioUrl`: assert `article.audioUrl` is still set after body reformatting
  - Write integration assertion (can be manual or automated): `GET /api/learning` returns exactly 20 articles
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 3. Add `summary` field to the DB schema, migration, and API

  - [x] 3.1 Add `summary` column to the Prisma schema
    - Open `backend/prisma/schema.prisma`
    - In the `LearningArticle` model, add the line: `summary  String?  @db.Text`
    - Place it after the `body` field for clarity
    - Run `npx prisma generate` to update the Prisma client types
    - _Bug_Condition: summaryColumnMissing — 'summary' NOT IN DB_COLUMNS('learning_articles')_
    - _Expected_Behavior: DB column exists; API can return summary for articles that have one_
    - _Preservation: all existing LearningArticle fields unchanged; nullable column so no data loss_
    - _Requirements: 2.4, 3.6, 3.7_

  - [x] 3.2 Create and apply the database migration
    - In `backend/`, run: `npx prisma migrate dev --name add_article_summary`
    - Confirm the generated migration SQL contains `ALTER TABLE "learning_articles" ADD COLUMN "summary" TEXT;`
    - Verify the migration applies cleanly against the local PostgreSQL database
    - _Requirements: 2.4, 3.7_

  - [x] 3.3 Update the seed script to write `summary` to the DB
    - Locate the backend seed script that reads from `learningHubContent.ts` and upserts `LearningArticle` records
    - In the `prisma.learningArticle.upsert` (or `create`) call, add `summary: item.summary ?? null`
    - Re-run the seed to confirm `summary` is persisted for all 20 articles
    - _Requirements: 2.4, 3.7_

  - [x] 3.4 Verify `learningService.ts` returns `summary` in the article detail response
    - Open `backend/src/services/learningService.ts`
    - In `getPublishedArticleBySlug`, the `return { ...article, durationMin }` spread already
      includes all Prisma model fields — once the column exists, `summary` will be included
      automatically; confirm this is the case (no `select` clause excludes it)
    - Confirm `listPublishedArticles` does NOT include `summary` in its `select` clause
      (summary is a detail-only field; the list response omits it to reduce payload)
    - _Requirements: 2.4, 3.6_

- [x] 4. Reformat all 20 article bodies in `learningHubContent.ts` with Markdown structure

  - [x] 4.1 Reformat the 5 feeding articles
    - Open `frontend/src/content/learningHubContent.ts`
    - **`latching-basics`**: Add `## ভালো লেচের লক্ষণ` before the signs paragraph; convert signs list to `- ` bullets; add `## লেচ ঠিক না হলে কী করবেন` before the fix paragraph; bold `"C" shape`, `deep, wide latch`
    - **`feeding-cues`**: Add `## প্রাথমিক ক্ষুধার লক্ষণ` before the sign list; convert signs to `- ` bullets; add `## কতক্ষণ ও কতবার খাওয়াবেন` before the frequency paragraph
    - **`expressed-milk`**: Add `## বুকের দুধ সংরক্ষণের নিয়ম` before storage table; convert storage durations to `- ` bullets; add `## বুকের দুধের ধরন` before types paragraph; add `## শিশু পর্যাপ্ত দুধ পাচ্ছে কি না` before signs-of-adequate-milk list; convert signs to `- ` bullets
    - **`breastfeeding-problems`**: Add `## ফাটা বা ব্যথাযুক্ত স্তনবৃন্ত`, `## দুধ কম মনে হলে`, `## স্তনে দুধ জমা (এনগর্জমেন্ট)` headings; convert remedies to `- ` bullets; wrap mastitis warning in `>` blockquote
    - **`benefits-of-breastfeeding`**: Add `## শিশুর জন্য উপকারিতা`, `## মায়ের জন্য উপকারিতা`, `## এক্সক্লুসিভ বুকের দুধ খাওয়ানো` headings; convert benefit lists to `- ` bullets
    - _Bug_Condition: isBugCondition(article) — body lacks '## '_
    - _Expected_Behavior: body contains '## ' headings and '\n- ' bullets_
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 4.2 Reformat the 3 KMC articles
    - **`kmc-how-to`**: Add `## কীভাবে অবস্থান নেবেন` before position steps; convert dress/position steps to numbered list `1.`; add `## KMC চলাকালীন` before the activities paragraph; add `## পোশাক সম্পর্কে` before clothing notes
    - **`kmc-benefits`**: Add `## শিশুর শারীরিক স্থিতিশীলতা`, `## বুকের দুধের উপর প্রভাব`, `## প্রতিদিন কতক্ষণ KMC করবেন` headings; convert duration categories (Short/Extended/Long/Continuous) to `- ` bullets with bold labels
    - **`kmc-when-to-start`**: Add `## জন্মের ওজন অনুযায়ী শুরুর সময়` heading; convert each birth-weight band to a `- ` bullet; add `## ফলো-আপ` before the check-up schedule paragraph; convert check-up schedule to `- ` bullets
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 4.3 Reformat the 2 growth articles
    - **`corrected-age-explained`**: Add `## সংশোধিত বয়স কীভাবে হিসাব করবেন` before the calculation example; bold the example figures; add `## অ্যাপে কীভাবে ব্যবহার হয়` before the app-usage paragraph
    - **`tracking-growth`**: Add `## প্রথম ৭ দিন — ওজন কমা স্বাভাবিক`, `## ১৪ দিন পর ওজন বৃদ্ধি`, `## বৃদ্ধির লক্ষ্যমাত্রা` headings; bold the numeric targets (25–30g/day, day 14, doubled birth weight)
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 4.4 Reformat the 1 danger signs article
    - **`danger-signs-overview`**: Add `## এখনই হাসপাতালে যান` heading before the immediate-action signs; convert the comma-run danger sign list to `- ` bullets; wrap the entire immediate block in `>` blockquote; add `## শীঘ্রই ডাক্তার দেখান (একই দিনে)` heading before the consult-soon signs; convert to `- ` bullets
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 4.5 Reformat the 2 emotional support articles
    - **`coping-with-anxiety`**: Add `## বিশ্রাম ও ঘুম`, `## খাবার ও পানীয়`, `## সাহায্য নেওয়া` headings; convert practical self-care items to `- ` bullets; wrap the "speak to your nurse" sentence in `>` blockquote
    - **`asking-for-help`**: Add `## সাহায্য চাওয়া দুর্বলতা নয়`, `## স্তন্যদানে পরিবারের ভূমিকা`, `## আপনার যত্নদল` headings; bold key phrases
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 4.6 Reformat the 1 immunization article
    - **`vaccine-basics`**: Add `## টিকার সময়সূচি` heading before the schedule; convert each vaccine-stage line to a `- ` bullet (e.g., `- **জন্মের সময়:** BCG, OPV-0, হেপাটাইটিস বি (১ম ডোজ)`); bold each age milestone; add `## মনে রাখুন` heading before the practical reminders; wrap the missed-dose instruction in `>` blockquote
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 4.7 Reformat the 6 newborn care articles (warmth, infection, bathing, cord, loving care, sleep)
    - **`warmth-thermal-care`**: Add `## ঘর ও পোশাক`, `## শিশুর মাথা ঢাকুন`, `## KMC — সবচেয়ে কার্যকর উষ্ণতা` headings; convert clothing tips to `- ` bullets
    - **`infection-prevention`**: Add `## হাত ধোয়া`, `## বাড়িতে আগন্তুক ব্যবস্থাপনা`, `## নাভির যত্ন`, `## বুকের দুধ — সেরা সুরক্ষা` headings; convert hygiene rules to `- ` bullets; bold "single most effective" handwashing statement
    - **`bathing-your-baby`**: Add `## স্পঞ্জ বাথ (নাভি পড়ার আগে)`, `## নাভি পড়ার পরে`, `## গোসলের সময় উষ্ণতা বজায় রাখুন`, `## চোখ ও কান পরিষ্কার` headings; convert step-by-step bath instructions to numbered list
    - **`cord-care`**: Add `## একমাত্র নিয়ম: পরিষ্কার ও শুকনো`, `## নাভি কখন পড়বে`, `## বিপদচিহ্ন — এখনই চিকিৎসকের কাছে যান` headings; convert danger signs to `- ` bullets; wrap danger-sign block in `>` blockquote
    - **`loving-care`**: Add `## প্রতিটি শিশু আলাদা`, `## সাড়া দেওয়া কেন জরুরি`, `## ভালোবাসা দিয়ে যত্ন করুন` headings; bold key developmental statements
    - **`sleep-safe-practices`**: Add `## স্বাভাবিক ঘুমের ধরন`, `## নিরাপদ ঘুমের অবস্থান`, `## বিপদচিহ্ন`, `## মায়ের জন্য পরামর্শ` headings; bold "back to sleep" instruction; wrap the danger-sign sleep warning in `>` blockquote
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 4.8 Reformat the 2 remaining newborn care articles (vitamin A, safety)
    - **`vitamin-a`**: Add `## ভিটামিন এ ক্যাপসুল কখন নেবেন`, `## খাবার থেকে ভিটামিন এ` headings; bold the dosage (200,000 IU) and timing (8 weeks); wrap the "speak to health worker if late" instruction in `>` blockquote
    - **`safety-at-home`**: Apply same pattern — identify section labels, promote to `## ` headings, convert enumerated items to `- ` bullets, wrap urgent warnings in `>` blockquotes
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 5. Write and publish the content author style guide

  - [x] 5.1 Create `docs/ARTICLE_WRITING_GUIDE.md`
    - Create the `docs/` directory at the repo root if it does not already exist
    - Write `ARTICLE_WRITING_GUIDE.md` with the following sections:
      - **Introduction** — who this guide is for, what app it supports
      - **Markdown Basics** — table of `## `, `**bold**`, `- `, `> ` with one-line descriptions
      - **Section Headings (`##`)** — when to use, Bengali example
      - **Bold Terms (`**...**`)** — for clinical thresholds and key terms, Bengali example
      - **Bullet Lists (`- `)** — for enumerated steps or signs, Bengali example
      - **Warning Callouts (`> `)** — for urgent instructions, Bengali example
      - **Full Example Article** — a short Bengali excerpt demonstrating all four patterns
      - **What to Avoid** — walls of prose, inline section labels, comma-separated lists
    - _Requirements: 2.5_

- [ ] 6. Verify bug condition exploration test now passes
  - **Property 1: Expected Behavior** - Markdown Structure in Article Bodies
  - **IMPORTANT**: Re-run the SAME test from task 1 — do NOT write a new test
  - The test from task 1 asserts all 20 article bodies contain `## ` headings
  - Re-run with `vitest --run` in `frontend/` after completing tasks 4.1–4.8
  - **EXPECTED OUTCOME**: Test PASSES (confirms all article bodies now have Markdown structure)
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 7. Verify preservation tests still pass
  - **Property 2: Preservation** - Article Content Integrity and API Continuity
  - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
  - Re-run word-count preservation tests and slug/title/category integrity tests
  - Manually (or via integration test) confirm `GET /api/learning` returns 20 articles
  - Manually confirm `GET /api/learning/kmc-how-to` includes `audioUrl` and non-empty `body`
  - After applying the DB migration (task 3.2) and re-seeding (task 3.3), confirm `GET /api/learning/latching-basics` response includes a non-empty `summary` field
  - **EXPECTED OUTCOME**: All tests PASS (no regressions in content or API)

- [ ] 8. Checkpoint — Ensure all tests pass
  - Run `vitest --run` in `frontend/` — all unit tests green
  - Run `npx prisma migrate status` in `backend/` — migration applied, no drift
  - Manually open `/learn/latching-basics` in the browser — confirm `<h2>` headings render inside `.article-prose`, pull-quote summary block is visible
  - Manually open `/learn/danger-signs-overview` — confirm danger signs render as a bullet list inside a `>` blockquote callout
  - Confirm Learning Hub list page `/learn` still shows all 20 article cards
  - Ensure all tests pass; ask the user if any questions arise
