import api from '../../lib/api';

export async function recordContentView(slug: string, category: string): Promise<void> {
  await api.post('/content/view', { slug, category });
}

export async function getViewedSlugs(): Promise<string[]> {
  const res = await api.get<{ success: boolean; data: { slugs: string[] } }>('/content/views');
  return res.data.data.slugs;
}
