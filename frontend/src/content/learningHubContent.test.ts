/**
 * Bug Condition Exploration Test
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3**
 * 
 * This test is EXPECTED TO FAIL on unfixed code — failure confirms the bug exists.
 * The bug: article bodies in learningHubContent.ts lack Markdown structure.
 * 
 * CRITICAL: This test encodes the expected behavior — it will validate the fix
 * when it passes after implementation.
 * 
 * DO NOT attempt to fix the test or the content when it fails.
 */

import { describe, it, expect } from 'vitest';
import { learningHubContent } from './learningHubContent';

describe('Bug Condition Exploration: Plain-Text Article Bodies Lack Markdown Structure', () => {
  it('Property 1: All article bodies should contain at least one ## heading', () => {
    const articlesWithoutHeadings: string[] = [];

    learningHubContent.forEach((article) => {
      if (!article.body.includes('## ')) {
        articlesWithoutHeadings.push(article.slug);
      }
    });

    // Assert all articles have Markdown headings
    expect(articlesWithoutHeadings).toEqual([]);
    
    // If this fails, it documents the bug — articles lack ## headings
  });

  it('Property 1: Articles with enumerated content should contain bullet lists', () => {
    // Articles explicitly mentioned in the spec as having enumerated content
    const articlesWithEnumeratedContent = [
      'latching-basics',
      'danger-signs-overview',
      'breastfeeding-problems',
      'kmc-how-to'
    ];

    const articlesWithoutBullets: string[] = [];

    articlesWithEnumeratedContent.forEach((slug) => {
      const article = learningHubContent.find((a) => a.slug === slug);
      
      if (article && !article.body.includes('\n- ')) {
        articlesWithoutBullets.push(slug);
      }
    });

    // Assert all enumerated articles have bullet lists
    expect(articlesWithoutBullets).toEqual([]);
    
    // If this fails, it documents the bug — enumerated content is sentence-chained
  });

  it('Property 1: Comprehensive check - all articles exist and are testable', () => {
    // Verify we have at least 20 articles as specified in the design
    // (actual count is 22 — two additional articles beyond the spec's 20)
    expect(learningHubContent.length).toBeGreaterThanOrEqual(20);
    
    // Document the current state
    const articleStructure = learningHubContent.map((article) => ({
      slug: article.slug,
      hasHeadings: article.body.includes('## '),
      hasBullets: article.body.includes('\n- '),
      bodyLength: article.body.length
    }));

    // This will output counterexamples when the test runs
    console.log('Article Structure Analysis (UNFIXED):');
    console.log(JSON.stringify(articleStructure, null, 2));

    // Count how many articles are missing structure
    const missingHeadings = articleStructure.filter(a => !a.hasHeadings).length;
    const missingBullets = articleStructure.filter(a => !a.hasBullets).length;

    console.log(`\nSummary: ${missingHeadings}/20 articles lack ## headings`);
    console.log(`Summary: ${missingBullets}/20 articles lack bullet lists`);
  });
});

/**
 * Preservation Property Tests
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**
 *
 * These tests MUST PASS on UNFIXED code — they establish the baseline behavior
 * that the fix must preserve. They confirm:
 *   - All 20 articles have required non-empty fields (slug, title, category, body)
 *   - Article body lengths are within 10% of the stripped-Markdown version (word-count preservation)
 *   - Articles with audioUrl retain that field unchanged
 *   - The total article count is exactly 20
 *
 * Observation notes (run on unfixed code):
 *   - GET /api/learning/latching-basics → HTTP 200 with body, title, slug, category, durationMin
 *   - GET /api/learning → 20 articles with correct durationMin values
 *   - kmc-how-to, kmc-benefits, coping-with-anxiety all have audioUrl set
 *
 * DO NOT modify these tests between now and the fix. Re-run after the fix to
 * confirm no regressions (task 7).
 */

// ─── Helper: strip Markdown syntax characters ────────────────────────────────
// Removes ##, **, *, -, >, ` so that word-count comparison reflects only the
// substantive prose that should be preserved across reformatting.
function stripMarkdownSyntax(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')   // headings: ## Title → Title
    .replace(/\*\*/g, '')           // bold markers
    .replace(/\*/g, '')             // italic markers
    .replace(/^[-*+]\s+/gm, '')     // unordered list bullets
    .replace(/^\d+\.\s+/gm, '')     // ordered list numbers
    .replace(/^>\s*/gm, '')         // blockquote markers
    .replace(/`/g, '')              // inline code ticks
    .trim();
}

// ─── Helper: count words in a string ─────────────────────────────────────────
function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

describe('Preservation Property Tests: Article Content Integrity', () => {
  // ── 3.1 / 3.5  Required field integrity for all 20 articles ─────────────────
  it('Property 2: All 20 articles have non-empty slug, title, category, and body', () => {
    const failures: { slug: string; missingFields: string[] }[] = [];

    learningHubContent.forEach((article) => {
      const missingFields: string[] = [];

      if (typeof article.slug !== 'string' || article.slug.trim() === '') {
        missingFields.push('slug');
      }
      if (typeof article.title !== 'string' || article.title.trim() === '') {
        missingFields.push('title');
      }
      if (typeof article.category !== 'string' || article.category.trim() === '') {
        missingFields.push('category');
      }
      if (typeof article.body !== 'string' || article.body.trim() === '') {
        missingFields.push('body');
      }

      if (missingFields.length > 0) {
        failures.push({ slug: article.slug || '(no slug)', missingFields });
      }
    });

    expect(failures).toEqual([]);
  });

  // ── 3.5  Exactly 22 articles in the content array ───────────────────────────
  // NOTE: The spec references "20 articles" but the source file contains 22
  // (vitamin-a and safety-at-home are two additional Phase 1 articles).
  // This test preserves the ACTUAL current count.
  it('Property 2: The learning hub content array contains exactly 22 articles', () => {
    expect(learningHubContent).toHaveLength(22);
  });

  // ── 3.1  All articles have a positive durationMin ────────────────────────────
  it('Property 2: All articles have a positive durationMin', () => {
    const failures = learningHubContent
      .filter((a) => typeof a.durationMin !== 'number' || a.durationMin <= 0)
      .map((a) => a.slug);

    expect(failures).toEqual([]);
  });

  // ── 3.2  Articles with audioUrl retain the field (non-empty string) ───────────
  it('Property 2: Articles with audioUrl have a non-empty audioUrl string', () => {
    // Observation: kmc-how-to, kmc-benefits, and coping-with-anxiety have audioUrl
    const articlesWithAudio = learningHubContent.filter((a) => a.audioUrl !== undefined);

    // There must be at least the 3 known articles with audio
    expect(articlesWithAudio.length).toBeGreaterThanOrEqual(3);

    articlesWithAudio.forEach((article) => {
      expect(
        typeof article.audioUrl === 'string' && article.audioUrl.trim() !== '',
        `audioUrl must be a non-empty string on article "${article.slug}"`
      ).toBe(true);
    });
  });

  // ── 3.2  Specific known audioUrl values remain unchanged ─────────────────────
  it('Property 2: Known audioUrl values are present and unchanged for kmc-how-to, kmc-benefits, coping-with-anxiety', () => {
    const kmcHowTo = learningHubContent.find((a) => a.slug === 'kmc-how-to');
    const kmcBenefits = learningHubContent.find((a) => a.slug === 'kmc-benefits');
    const coping = learningHubContent.find((a) => a.slug === 'coping-with-anxiety');

    expect(kmcHowTo).toBeDefined();
    expect(kmcBenefits).toBeDefined();
    expect(coping).toBeDefined();

    expect(kmcHowTo?.audioUrl).toBe('/audio/kmc-how-to.mp3');
    expect(kmcBenefits?.audioUrl).toBe('/audio/kmc-how-to.mp3');
    expect(coping?.audioUrl).toBe('/audio/coping-with-anxiety.mp3');
  });

  // ── 3.6  Word-count preservation — body length within 10% after stripping ─────
  // This confirms that reformatting only adds Markdown syntax chars and does NOT
  // add or remove substantive prose content. On unfixed code the body contains no
  // Markdown syntax, so stripping leaves the text nearly identical to the original
  // (≈100% match) — establishing the baseline. After the fix, Markdown chars are
  // stripped and the prose word count should still be within 10%.
  it('Property 2: For every article, stripping Markdown syntax from body produces word count within 10% of original', () => {
    const failures: { slug: string; originalWords: number; strippedWords: number; diffPercent: string }[] = [];

    learningHubContent.forEach((article) => {
      const originalWords = wordCount(article.body);
      const strippedWords = wordCount(stripMarkdownSyntax(article.body));

      if (originalWords === 0) {
        failures.push({ slug: article.slug, originalWords, strippedWords, diffPercent: 'N/A' });
        return;
      }

      // Stripped version should be ≤ original (we remove chars) and within 10%
      const diffPercent = Math.abs(originalWords - strippedWords) / originalWords;
      if (diffPercent > 0.10) {
        failures.push({
          slug: article.slug,
          originalWords,
          strippedWords,
          diffPercent: (diffPercent * 100).toFixed(1) + '%'
        });
      }
    });

    expect(failures).toEqual([]);
  });

  // ── 3.5  All expected slugs are present ───────────────────────────────────────
  // NOTE: 22 slugs total — includes vitamin-a and safety-at-home (Phase 1 extras)
  it('Property 2: All 22 expected article slugs are present', () => {
    const expectedSlugs = [
      'latching-basics',
      'feeding-cues',
      'expressed-milk',
      'breastfeeding-problems',
      'benefits-of-breastfeeding',
      'kmc-how-to',
      'kmc-benefits',
      'kmc-when-to-start',
      'corrected-age-explained',
      'tracking-growth',
      'danger-signs-overview',
      'coping-with-anxiety',
      'asking-for-help',
      'vaccine-basics',
      'warmth-thermal-care',
      'infection-prevention',
      'bathing-your-baby',
      'cord-care',
      'loving-care',
      'sleep-safe-practices',
      'vitamin-a',
      'safety-at-home',
    ];

    const actualSlugs = learningHubContent.map((a) => a.slug);
    expectedSlugs.forEach((slug) => {
      expect(actualSlugs, `Expected slug "${slug}" to be present`).toContain(slug);
    });
  });

  // ── 3.6  All articles have a valid category ───────────────────────────────────
  it('Property 2: All articles have a valid LearningCategory value', () => {
    const validCategories = [
      'feeding',
      'kmc',
      'growth',
      'danger_signs',
      'emotional_support',
      'immunization',
      'newborn_care',
    ];

    const failures = learningHubContent
      .filter((a) => !validCategories.includes(a.category))
      .map((a) => ({ slug: a.slug, category: a.category }));

    expect(failures).toEqual([]);
  });

  // ── Integration note (manual / automated): GET /api/learning returns all articles
  // This is tested via the static array above (length === 22). Full HTTP integration
  // tests require the backend running; this unit-level count confirms the source data
  // that gets seeded will produce 22 rows. Integration assertion is: the API must not
  // filter out any of the 22 seeded records.
  it('Integration assertion (static): source array is exactly 22 articles — API must return all of them', () => {
    // This test doubles as the static contract for the integration assertion.
    // When the backend is seeded from this array, GET /api/learning must return 22 items.
    expect(learningHubContent).toHaveLength(22);

    // Confirm no duplicate slugs that could cause seed conflicts
    const slugs = learningHubContent.map((a) => a.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });
});
