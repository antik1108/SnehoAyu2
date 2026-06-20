import prisma from '../lib/prisma.js';
import { createError } from '../middlewares/errorHandler.js';

type RequestUser = { id: string; role: string };

function assertMotherUser(user: RequestUser | undefined): RequestUser {
  if (!user) throw createError(401, 'AUTH_TOKEN_REQUIRED', 'Authentication required. Please log in.');
  if (user.role !== 'mother') throw createError(403, 'MOTHER_ROLE_REQUIRED', 'Only authenticated mothers can track content views.');
  return user;
}

export async function recordContentView(user: RequestUser, slug: string, category: string) {
  const currentUser = assertMotherUser(user);
  const motherProfile = await prisma.motherProfile.findUnique({ where: { userId: currentUser.id } });
  if (!motherProfile) throw createError(409, 'MOTHER_PROFILE_REQUIRED', 'Complete the mother profile first.');

  const contentItem = await prisma.contentItem.upsert({
    where: { slug },
    update: {},
    create: { slug, category },
  });

  await prisma.contentView.upsert({
    where: { motherProfileId_contentItemId: { motherProfileId: motherProfile.id, contentItemId: contentItem.id } },
    update: { viewedAt: new Date() },
    create: { motherProfileId: motherProfile.id, contentItemId: contentItem.id },
  });

  return { success: true, message: 'View recorded.' };
}

export async function getViewedSlugs(user: RequestUser) {
  const currentUser = assertMotherUser(user);
  const motherProfile = await prisma.motherProfile.findUnique({ where: { userId: currentUser.id } });
  if (!motherProfile) throw createError(409, 'MOTHER_PROFILE_REQUIRED', 'Complete the mother profile first.');

  const views = await prisma.contentView.findMany({
    where: { motherProfileId: motherProfile.id },
    include: { contentItem: true },
  });

  return { success: true, data: { slugs: views.map((v) => v.contentItem.slug) } };
}
