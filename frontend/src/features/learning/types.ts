export interface PublishedArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  coverImageUrl: string | null;
  audioUrl: string | null;
  videoUrl: string | null;
  publishedAt: string;
  durationMin: number;
}

export interface ArticleDetail extends PublishedArticle {
  body: string;
  imageUrls: string[];
}

export interface ArticleListResponse {
  articles: PublishedArticle[];
  total: number;
  viewedSlugs: string[];
}
