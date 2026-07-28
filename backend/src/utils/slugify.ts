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
