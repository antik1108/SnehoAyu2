-- CreateTable
CREATE TABLE IF NOT EXISTS "learning_articles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "body" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "author_id" UUID NOT NULL,
    "cover_image_url" TEXT,
    "image_urls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "audio_url" TEXT,
    "video_url" TEXT,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "learning_articles_slug_key" ON "learning_articles"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "learning_articles_status_idx" ON "learning_articles"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "learning_articles_category_idx" ON "learning_articles"("category");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "learning_articles_status_category_idx" ON "learning_articles"("status", "category");

-- AddForeignKey
ALTER TABLE "learning_articles" ADD CONSTRAINT "learning_articles_author_id_fkey" 
    FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
