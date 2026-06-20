-- CreateTable
CREATE TABLE "tdsc_assessments" (
    "id" UUID NOT NULL,
    "mother_profile_id" UUID NOT NULL,
    "time_point" VARCHAR(20) NOT NULL,
    "assessment_date" DATE NOT NULL,
    "corrected_age_days" INTEGER NOT NULL,
    "results" JSONB NOT NULL,
    "suspected_delay" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tdsc_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vaccine_records" (
    "id" UUID NOT NULL,
    "mother_profile_id" UUID NOT NULL,
    "vaccine_id" VARCHAR(50) NOT NULL,
    "vaccine_name" VARCHAR(150) NOT NULL,
    "due_date" DATE NOT NULL,
    "completed_date" DATE,
    "batch_number" VARCHAR(50),
    "administered_by" VARCHAR(150),
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vaccine_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "breastfeeding_assessments" (
    "id" UUID NOT NULL,
    "mother_profile_id" UUID NOT NULL,
    "time_point" VARCHAR(20) NOT NULL,
    "responses" JSONB NOT NULL,
    "total_score" INTEGER NOT NULL,
    "grade" VARCHAR(20) NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "breastfeeding_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_items" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_views" (
    "id" UUID NOT NULL,
    "mother_profile_id" UUID NOT NULL,
    "content_item_id" UUID NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "care_messages" (
    "id" UUID NOT NULL,
    "week_number" INTEGER NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "text_bn" TEXT NOT NULL,
    "text_hi" TEXT,
    "text_en" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "care_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_deliveries" (
    "id" UUID NOT NULL,
    "mother_profile_id" UUID NOT NULL,
    "care_message_id" UUID NOT NULL,
    "delivered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channel" VARCHAR(20) NOT NULL DEFAULT 'sms',

    CONSTRAINT "message_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_call_sessions" (
    "id" UUID NOT NULL,
    "mother_profile_id" UUID NOT NULL,
    "initiated_by_user_id" UUID,
    "scheduled_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "duration_minutes" INTEGER,
    "channel" VARCHAR(20) NOT NULL DEFAULT 'whatsapp',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_call_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tdsc_assessments_mother_profile_id_time_point_key" ON "tdsc_assessments"("mother_profile_id", "time_point");

-- CreateIndex
CREATE UNIQUE INDEX "vaccine_records_mother_profile_id_vaccine_id_key" ON "vaccine_records"("mother_profile_id", "vaccine_id");

-- CreateIndex
CREATE INDEX "vaccine_records_mother_profile_id_status_idx" ON "vaccine_records"("mother_profile_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "breastfeeding_assessments_mother_profile_id_time_point_key" ON "breastfeeding_assessments"("mother_profile_id", "time_point");

-- CreateIndex
CREATE UNIQUE INDEX "content_items_slug_key" ON "content_items"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "content_views_mother_profile_id_content_item_id_key" ON "content_views"("mother_profile_id", "content_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "care_messages_week_number_type_key" ON "care_messages"("week_number", "type");

-- CreateIndex
CREATE INDEX "message_deliveries_mother_profile_id_delivered_at_idx" ON "message_deliveries"("mother_profile_id", "delivered_at");

-- CreateIndex
CREATE INDEX "video_call_sessions_mother_profile_id_created_at_idx" ON "video_call_sessions"("mother_profile_id", "created_at");

-- AddForeignKey
ALTER TABLE "tdsc_assessments" ADD CONSTRAINT "tdsc_assessments_mother_profile_id_fkey" FOREIGN KEY ("mother_profile_id") REFERENCES "MotherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccine_records" ADD CONSTRAINT "vaccine_records_mother_profile_id_fkey" FOREIGN KEY ("mother_profile_id") REFERENCES "MotherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "breastfeeding_assessments" ADD CONSTRAINT "breastfeeding_assessments_mother_profile_id_fkey" FOREIGN KEY ("mother_profile_id") REFERENCES "MotherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_views" ADD CONSTRAINT "content_views_mother_profile_id_fkey" FOREIGN KEY ("mother_profile_id") REFERENCES "MotherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_views" ADD CONSTRAINT "content_views_content_item_id_fkey" FOREIGN KEY ("content_item_id") REFERENCES "content_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_call_sessions" ADD CONSTRAINT "video_call_sessions_mother_profile_id_fkey" FOREIGN KEY ("mother_profile_id") REFERENCES "MotherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
