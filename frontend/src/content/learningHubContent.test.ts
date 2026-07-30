import { describe, it, expect } from 'vitest';
import { learningHubContent } from './learningHubContent';

describe('Preservation Property Tests: Article Content Integrity', () => {
  it('Property 1: Long article bodies (>200 words) contain at least one ## heading or structured paragraphs', () => {
    const articlesWithoutHeadings: string[] = [];

    learningHubContent.forEach((article) => {
      if (article.body.split(/\s+/).length > 200 && !article.body.includes('## ') && !article.body.includes('\n\n')) {
        articlesWithoutHeadings.push(article.slug);
      }
    });

    expect(articlesWithoutHeadings).toEqual([]);
  });

  it('Property 2: The learning hub content array contains 85 articles', () => {
    expect(learningHubContent).toHaveLength(85);
  });

  it('Property 2: All articles have a positive durationMin', () => {
    const failures = learningHubContent
      .filter((a) => typeof a.durationMin !== 'number' || a.durationMin <= 0)
      .map((a) => a.slug);

    expect(failures).toEqual([]);
  });

  it('Property 2: All articles have a valid LearningCategory value', () => {
    const validCategories = [
      'feeding',
      'kmc',
      'growth',
      'danger_signs',
      'emotional_support',
      'immunization',
      'newborn_care',
      'mother_care',
      'emergency',
    ];

    const failures = learningHubContent
      .filter((a) => !validCategories.includes(a.category))
      .map((a) => ({ slug: a.slug, category: a.category }));

    expect(failures).toEqual([]);
  });

  it('Integration assertion (static): source array has unique slugs', () => {
    const slugs = learningHubContent.map((a) => a.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });
});
