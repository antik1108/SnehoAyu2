import { PrismaClient } from '../../generated/prisma/index.js';
import { createError } from '../middlewares/errorHandler.js';

export function generateSlug(title: string): string {
  // Transliterate or strip Bengali/Unicode: keep alphanumeric (Latin), replace
  // everything else (including Bengali script) with hyphens so the slug is
  // URL-safe ASCII. If the title is entirely Bengali we fall back to a
  // timestamp-based slug below in generateUniqueSlug.
  const ascii = title
    .toLowerCase()
    // Replace Bengali and other non-ASCII chars with a space
    .replace(/[^\x00-\x7F]/g, ' ')
    // Keep only alphanumeric and spaces/hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);

  return ascii || '';
}

export async function generateUniqueSlug(
  title: string,
  prisma: PrismaClient
): Promise<string> {
  const base = generateSlug(title);

  // If the title is entirely Bengali (or non-ASCII), base will be empty.
  // Use a short timestamp so every article still gets a unique slug.
  const safeBase = base || `article-${Date.now()}`;

  let slug = safeBase;
  let i = 2;
  while (i <= 99) {
    const exists = await prisma.learningArticle.findUnique({ where: { slug } });
    if (!exists) return slug;
    slug = `${safeBase.slice(0, 96)}-${i}`;
    i++;
  }
  throw createError(
    409,
    'SLUG_CONFLICT',
    'Title too similar to an existing article. Please use a slightly different title.'
  );
}
