-- CreateEnum
CREATE TYPE "DangerSignCategory" AS ENUM ('STOOL_ABNORMAL', 'POOR_WEIGHT_GAIN', 'POOR_WELLBEING', 'DEVELOPMENTAL_CONCERN', 'OTHER');

-- CreateEnum
CREATE TYPE "DangerSignStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED', 'RESOLVED');

-- CreateTable
CREATE TABLE "danger_sign_alerts" (
    "id" UUID NOT NULL,
    "mother_profile_id" UUID NOT NULL,
    "raised_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" "DangerSignCategory" NOT NULL,
    "description" TEXT,
    "acknowledged_at" TIMESTAMP(3),
    "resolved_at" TIMESTAMP(3),
    "resolved_by" VARCHAR(100),
    "status" "DangerSignStatus" NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "danger_sign_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "danger_sign_alerts_mother_profile_id_status_idx" ON "danger_sign_alerts"("mother_profile_id", "status");

-- CreateIndex
CREATE INDEX "danger_sign_alerts_raised_at_idx" ON "danger_sign_alerts"("raised_at");

-- AddForeignKey
ALTER TABLE "danger_sign_alerts" ADD CONSTRAINT "danger_sign_alerts_mother_profile_id_fkey" FOREIGN KEY ("mother_profile_id") REFERENCES "MotherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
