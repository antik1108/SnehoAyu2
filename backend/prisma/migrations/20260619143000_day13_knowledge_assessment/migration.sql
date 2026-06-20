-- CreateTable
CREATE TABLE "knowledge_assessments" (
    "id" UUID NOT NULL,
    "mother_profile_id" UUID NOT NULL,
    "follow_up_schedule_id" UUID,
    "time_point" VARCHAR(20) NOT NULL,
    "responses" JSONB NOT NULL,
    "score" INTEGER NOT NULL,
    "max_score" INTEGER NOT NULL DEFAULT 15,
    "percentage" INTEGER NOT NULL,
    "grade" VARCHAR(20) NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_assessments_mother_profile_id_time_point_key" ON "knowledge_assessments"("mother_profile_id", "time_point");

-- CreateIndex
CREATE INDEX "knowledge_assessments_mother_profile_id_time_point_idx" ON "knowledge_assessments"("mother_profile_id", "time_point");

-- AddForeignKey
ALTER TABLE "knowledge_assessments" ADD CONSTRAINT "knowledge_assessments_mother_profile_id_fkey" FOREIGN KEY ("mother_profile_id") REFERENCES "MotherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_assessments" ADD CONSTRAINT "knowledge_assessments_follow_up_schedule_id_fkey" FOREIGN KEY ("follow_up_schedule_id") REFERENCES "FollowUpSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
