/**
 * @file validators/learningValidator.ts
 * @description Request-body validators for learning CMS article endpoints.
 *
 * Uses plain TypeScript (no external validation library) to keep the
 * dependency surface small and align with the existing project style.
 *
 * All validation errors are returned as an array of field-level objects so
 * the client can highlight the specific fields that failed.
 *
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */

// ---------------------------------------------------------------------------
// Valid value sets
// ---------------------------------------------------------------------------

const VALID_CATEGORIES = new Set([
  'feeding',
  'kmc',
  'growth',
  'danger_signs',
  'emotional_support',
  'immunization',
  'newborn_care',
]);

const VALID_STATUSES = new Set(['draft', 'published', 'archived']);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ValidationError {
  field: string;
  message: string;
}

export interface CreateArticleInput {
  title?: string;
  body?: string;
  category?: string;
  tags?: string[];
  status?: string;
  coverImageUrl?: string | null;
  imageUrls?: string[];
  audioUrl?: string | null;
  videoUrl?: string | null;
}

// ---------------------------------------------------------------------------
// Validator
// ---------------------------------------------------------------------------

/**
 * Validates a create or update article request body.
 *
 * @param body     - The (possibly partial) request body to validate.
 * @param isCreate - When `true`, treat `title`, `body`, and `category` as
 *                   required fields even if absent.  When `false` (update),
 *                   only validate a field if it is explicitly present in the
 *                   body.
 * @returns Array of `{ field, message }` objects; empty array on success.
 */
export function validateArticle(
  body: Partial<CreateArticleInput>,
  isCreate: boolean
): ValidationError[] {
  const errors: ValidationError[] = [];

  // ── title (required on create; validated on update only if present) ────────
  if (isCreate || body.title !== undefined) {
    if (!body.title || body.title.trim() === '')
      errors.push({ field: 'title', message: 'Title is required' });
  }

  // ── body (required on create; validated on update only if present) ─────────
  if (isCreate || body.body !== undefined) {
    if (!body.body || body.body.trim() === '')
      errors.push({ field: 'body', message: 'Body is required' });
  }

  // ── category (required on create; validated on update only if present) ─────
  if (isCreate || body.category !== undefined) {
    if (!body.category || !VALID_CATEGORIES.has(body.category))
      errors.push({ field: 'category', message: 'Invalid category' });
  }

  // ── status (optional; validated only if present) ───────────────────────────
  if (body.status !== undefined && !VALID_STATUSES.has(body.status))
    errors.push({
      field: 'status',
      message: 'Status must be draft, published, or archived',
    });

  // ── single https:// URL fields ─────────────────────────────────────────────
  const urlFields = ['coverImageUrl', 'audioUrl', 'videoUrl'] as const;
  for (const f of urlFields) {
    const val = (body as Record<string, unknown>)[f];
    if (
      val !== undefined &&
      val !== null &&
      (typeof val !== 'string' || !val.startsWith('https://'))
    )
      errors.push({
        field: f,
        message: `${f} must be a valid https:// URL`,
      });
  }

  // ── imageUrls array (each entry must be https://) ─────────────────────────
  if (Array.isArray(body.imageUrls)) {
    body.imageUrls.forEach((url, i) => {
      if (!url.startsWith('https://'))
        errors.push({
          field: `imageUrls[${i}]`,
          message: 'Each imageUrl must be a valid https:// URL',
        });
    });
  }

  return errors;
}
