-- CreateTable
CREATE TABLE "who5_assessments" (
    "id" UUID NOT NULL,
    "mother_profile_id" UUID NOT NULL,
    "follow_up_schedule_id" UUID,
    "time_point" VARCHAR(20) NOT NULL,
    "responses" JSONB NOT NULL,
    "raw_score" INTEGER NOT NULL,
    "max_score" INTEGER NOT NULL DEFAULT 25,
    "percentage_score" INTEGER NOT NULL,
    "poor_wellbeing_flag" BOOLEAN NOT NULL DEFAULT false,
    "interpretation" VARCHAR(40) NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "who5_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "psoc_assessments" (
    "id" UUID NOT NULL,
    "mother_profile_id" UUID NOT NULL,
    "follow_up_schedule_id" UUID,
    "time_point" VARCHAR(20) NOT NULL,
    "raw_responses" JSONB NOT NULL,
    "scored_responses" JSONB NOT NULL,
    "efficacy_score" INTEGER NOT NULL,
    "satisfaction_score" INTEGER NOT NULL,
    "total_score" INTEGER NOT NULL,
    "max_score" INTEGER NOT NULL DEFAULT 102,
    "classification" VARCHAR(40),
    "classification_method" VARCHAR(80),
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "psoc_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "who5_assessments_mother_profile_id_time_point_key" ON "who5_assessments"("mother_profile_id", "time_point");

-- CreateIndex
CREATE INDEX "who5_assessments_mother_profile_id_time_point_idx" ON "who5_assessments"("mother_profile_id", "time_point");

-- CreateIndex
CREATE UNIQUE INDEX "psoc_assessments_mother_profile_id_time_point_key" ON "psoc_assessments"("mother_profile_id", "time_point");

-- CreateIndex
CREATE INDEX "psoc_assessments_mother_profile_id_time_point_idx" ON "psoc_assessments"("mother_profile_id", "time_point");

-- AddForeignKey
ALTER TABLE "who5_assessments" ADD CONSTRAINT "who5_assessments_mother_profile_id_fkey" FOREIGN KEY ("mother_profile_id") REFERENCES "MotherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "who5_assessments" ADD CONSTRAINT "who5_assessments_follow_up_schedule_id_fkey" FOREIGN KEY ("follow_up_schedule_id") REFERENCES "FollowUpSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "psoc_assessments" ADD CONSTRAINT "psoc_assessments_mother_profile_id_fkey" FOREIGN KEY ("mother_profile_id") REFERENCES "MotherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "psoc_assessments" ADD CONSTRAINT "psoc_assessments_follow_up_schedule_id_fkey" FOREIGN KEY ("follow_up_schedule_id") REFERENCES "FollowUpSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
