-- CreateTable
CREATE TABLE "growth_readings" (
    "id" UUID NOT NULL,
    "baby_profile_id" UUID NOT NULL,
    "mother_profile_id" UUID NOT NULL,
    "recorded_by_user_id" UUID NOT NULL,
    "reading_date" DATE NOT NULL,
    "weight_grams" INTEGER NOT NULL,
    "length_cm" DECIMAL(5,2) NOT NULL,
    "head_circumference_cm" DECIMAL(5,2) NOT NULL,
    "chronological_age_days" INTEGER NOT NULL,
    "chronological_age_weeks" DECIMAL(6,2) NOT NULL,
    "corrected_age_days" INTEGER NOT NULL,
    "corrected_age_weeks" DECIMAL(6,2) NOT NULL,
    "time_point" VARCHAR(20),
    "source" VARCHAR(30) NOT NULL DEFAULT 'manual',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "growth_readings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "growth_readings_baby_profile_id_reading_date_key" ON "growth_readings"("baby_profile_id", "reading_date");

-- CreateIndex
CREATE INDEX "growth_readings_mother_profile_id_reading_date_idx" ON "growth_readings"("mother_profile_id", "reading_date");

-- CreateIndex
CREATE INDEX "growth_readings_baby_profile_id_reading_date_idx" ON "growth_readings"("baby_profile_id", "reading_date");

-- AddForeignKey
ALTER TABLE "growth_readings" ADD CONSTRAINT "growth_readings_baby_profile_id_fkey" FOREIGN KEY ("baby_profile_id") REFERENCES "BabyProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "growth_readings" ADD CONSTRAINT "growth_readings_mother_profile_id_fkey" FOREIGN KEY ("mother_profile_id") REFERENCES "MotherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "growth_readings" ADD CONSTRAINT "growth_readings_recorded_by_user_id_fkey" FOREIGN KEY ("recorded_by_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
