-- CreateTable
CREATE TABLE "daily_logs" (
    "id" UUID NOT NULL,
    "mother_profile_id" UUID NOT NULL,
    "care_date" DATE NOT NULL,
    "breastfeeding_done" BOOLEAN NOT NULL DEFAULT false,
    "breastfeeding_feeds_count" INTEGER,
    "breastfeeding_volume_ml" INTEGER,
    "kmc_done" BOOLEAN NOT NULL DEFAULT false,
    "kmc_minutes" INTEGER,
    "temperature_morning_c" DECIMAL(4,1),
    "temperature_evening_c" DECIMAL(4,1),
    "temperature_done" BOOLEAN NOT NULL DEFAULT false,
    "weight_check_done" BOOLEAN NOT NULL DEFAULT false,
    "weight_grams" INTEGER,
    "skin_cord_care_done" BOOLEAN NOT NULL DEFAULT false,
    "medication_done" BOOLEAN,
    "medication_notes" TEXT,
    "danger_signs_reviewed" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_logs_mother_profile_id_care_date_key" ON "daily_logs"("mother_profile_id", "care_date");

-- CreateIndex
CREATE INDEX "daily_logs_mother_profile_id_care_date_idx" ON "daily_logs"("mother_profile_id", "care_date");

-- AddForeignKey
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_mother_profile_id_fkey" FOREIGN KEY ("mother_profile_id") REFERENCES "MotherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;