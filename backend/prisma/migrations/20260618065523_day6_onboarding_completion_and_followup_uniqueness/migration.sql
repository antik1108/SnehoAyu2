/*
  Warnings:

  - A unique constraint covering the columns `[motherProfileId,timePoint]` on the table `FollowUpSchedule` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MotherProfile" ADD COLUMN     "onboarding_completed_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "FollowUpSchedule_motherProfileId_timePoint_key" ON "FollowUpSchedule"("motherProfileId", "timePoint");
