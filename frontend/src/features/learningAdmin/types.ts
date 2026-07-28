export interface AdminArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  body: string;
  status: 'draft' | 'published' | 'archived';
  authorId: string;
  coverImageUrl: string | null;
  imageUrls: string[];
  audioUrl: string | null;
  videoUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleInput {
  title: string;
  body: string;
  category: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  coverImageUrl?: string | null;
  imageUrls?: string[];
  audioUrl?: string | null;
  videoUrl?: string | null;
}

export type UpdateArticleInput = Partial<CreateArticleInput>;

export interface UploadResponse {
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

export interface ArticleListAdminResponse {
  articles: AdminArticle[];
  total: number;
  page: number;
  limit: number;
}
