-- DropForeignKey
ALTER TABLE "MotherProfile" DROP CONSTRAINT "MotherProfile_hospitalId_fkey";

-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "nextParticipantNumber" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "MotherProfile" ADD CONSTRAINT "MotherProfile_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;
