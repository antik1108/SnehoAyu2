-- AlterTable
ALTER TABLE "growth_readings" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "knowledge_assessments" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "learning_articles" ADD COLUMN     "summary" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "tags" DROP DEFAULT,
ALTER COLUMN "image_urls" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "psoc_assessments" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "tdsc_assessments" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "vaccine_records" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "who5_assessments" ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateTable
CREATE TABLE "kmc_daily_logs" (
    "id" UUID NOT NULL,
    "mother_profile_id" UUID NOT NULL,
    "baby_profile_id" UUID NOT NULL,
    "log_date" DATE NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "duration_category" VARCHAR(20) NOT NULL,
    "provider" VARCHAR(20),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kmc_daily_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kmc_daily_logs_mother_profile_id_log_date_key" ON "kmc_daily_logs"("mother_profile_id", "log_date");

-- AddForeignKey
ALTER TABLE "kmc_daily_logs" ADD CONSTRAINT "kmc_daily_logs_mother_profile_id_fkey" FOREIGN KEY ("mother_profile_id") REFERENCES "MotherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
