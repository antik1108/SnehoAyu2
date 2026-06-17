-- Baseline plus Day 2 password authentication support.
-- The repo had no prior migration history, so this migration can initialize
-- an empty database while preserving existing tables when they are present.

CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE IF NOT EXISTS "Hospital" (
  "id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "district" TEXT NOT NULL,
  "state" TEXT NOT NULL DEFAULT 'West Bengal',
  "type" TEXT NOT NULL,
  "emergencyPhone" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "User" (
  "id" UUID NOT NULL,
  "phone" TEXT NOT NULL,
  "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
  "email" TEXT,
  "passwordHash" TEXT NOT NULL,
  "pinHash" TEXT,
  "role" TEXT NOT NULL,
  "preferredLanguage" TEXT NOT NULL DEFAULT 'bn',
  "hospitalId" UUID,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "lastLoginAt" TIMESTAMP(3),
  "failedPasswordAttempts" INTEGER NOT NULL DEFAULT 0,
  "passwordLockedUntil" TIMESTAMP(3),
  "failedPinAttempts" INTEGER NOT NULL DEFAULT 0,
  "pinLockedUntil" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "passwordHash" TEXT,
  ADD COLUMN IF NOT EXISTS "failedPasswordAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "passwordLockedUntil" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "failedPinAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "pinLockedUntil" TIMESTAMP(3);

UPDATE "User"
SET "passwordHash" = '$2b$12$oXG9rX4h9d39H0SAbc6xCe/51Kdy4/4tpOFoFFYaJdHng2lHEzS0S'
WHERE "passwordHash" IS NULL;

ALTER TABLE "User"
  ALTER COLUMN "phone" SET NOT NULL,
  ALTER COLUMN "passwordHash" SET NOT NULL,
  ALTER COLUMN "pinHash" DROP NOT NULL,
  ALTER COLUMN "isActive" SET DEFAULT true,
  ALTER COLUMN "preferredLanguage" SET DEFAULT 'bn';

CREATE TABLE IF NOT EXISTS "OtpVerification" (
  "id" UUID NOT NULL,
  "phone" TEXT NOT NULL,
  "otpHash" TEXT NOT NULL,
  "purpose" TEXT NOT NULL,
  "isUsed" BOOLEAN NOT NULL DEFAULT false,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "usedAt" TIMESTAMP(3),
  CONSTRAINT "OtpVerification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "RefreshToken" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "deviceInfo" TEXT,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "revokedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "MotherProfile" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "participantCode" TEXT NOT NULL,
  "studyGroup" TEXT NOT NULL,
  "hospitalId" UUID NOT NULL,
  "fullName" TEXT,
  "ageRange" TEXT NOT NULL,
  "educationMother" TEXT NOT NULL,
  "educationFather" TEXT NOT NULL,
  "occupationMother" TEXT NOT NULL,
  "occupationFather" TEXT NOT NULL,
  "incomeClass" TEXT NOT NULL,
  "familyType" TEXT NOT NULL,
  "familyMembersCount" TEXT NOT NULL,
  "religion" TEXT NOT NULL,
  "residenceType" TEXT NOT NULL,
  "contactNumber" TEXT,
  "prevPretermEducation" BOOLEAN NOT NULL DEFAULT false,
  "educationSource" TEXT[],
  "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MotherProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "BabyProfile" (
  "id" UUID NOT NULL,
  "motherProfileId" UUID NOT NULL,
  "babyName" TEXT,
  "sex" TEXT NOT NULL,
  "dateOfBirth" TIMESTAMP(3) NOT NULL,
  "gestationalAgeWeeks" DECIMAL(4,1) NOT NULL,
  "birthWeightGrams" INTEGER NOT NULL,
  "weightAtDischargeGrams" INTEGER NOT NULL,
  "placeOfDelivery" TEXT NOT NULL,
  "nicuStayDays" INTEGER NOT NULL,
  "skinToSkinAtBirth" BOOLEAN NOT NULL,
  "kmcInNicu" BOOLEAN NOT NULL,
  "feedingAtDischarge" TEXT NOT NULL,
  "criedAtBirth" BOOLEAN NOT NULL,
  "neededResuscitation" BOOLEAN NOT NULL,
  "birthWeightStratum" TEXT NOT NULL,
  "dischargeDate" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BabyProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "NurseProfile" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "hospitalId" UUID NOT NULL,
  "fullName" TEXT NOT NULL,
  "employeeId" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "NurseProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ResearcherProfile" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "fullName" TEXT NOT NULL,
  "designation" TEXT,
  "email" TEXT NOT NULL,
  "accessLevel" TEXT NOT NULL DEFAULT 'full',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ResearcherProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "FollowUpSchedule" (
  "id" UUID NOT NULL,
  "motherProfileId" UUID NOT NULL,
  "timePoint" TEXT NOT NULL,
  "scheduledDate" TIMESTAMP(3) NOT NULL,
  "actualDate" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'pending',
  "dataComplete" BOOLEAN NOT NULL DEFAULT false,
  "collectedByUserId" UUID,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "FollowUpSchedule_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Hospital_code_key" ON "Hospital"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "User_phone_key" ON "User"("phone");
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_phone_idx" ON "User"("phone");
CREATE UNIQUE INDEX IF NOT EXISTS "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");
CREATE INDEX IF NOT EXISTS "RefreshToken_userId_idx" ON "RefreshToken"("userId");
CREATE INDEX IF NOT EXISTS "RefreshToken_tokenHash_idx" ON "RefreshToken"("tokenHash");
CREATE INDEX IF NOT EXISTS "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");
CREATE UNIQUE INDEX IF NOT EXISTS "MotherProfile_userId_key" ON "MotherProfile"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "MotherProfile_participantCode_key" ON "MotherProfile"("participantCode");
CREATE UNIQUE INDEX IF NOT EXISTS "BabyProfile_motherProfileId_key" ON "BabyProfile"("motherProfileId");
CREATE UNIQUE INDEX IF NOT EXISTS "NurseProfile_userId_key" ON "NurseProfile"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "ResearcherProfile_userId_key" ON "ResearcherProfile"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "ResearcherProfile_email_key" ON "ResearcherProfile"("email");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'User_hospitalId_fkey') THEN
    ALTER TABLE "User" ADD CONSTRAINT "User_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'RefreshToken_userId_fkey') THEN
    ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MotherProfile_userId_fkey') THEN
    ALTER TABLE "MotherProfile" ADD CONSTRAINT "MotherProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MotherProfile_hospitalId_fkey') THEN
    ALTER TABLE "MotherProfile" ADD CONSTRAINT "MotherProfile_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'BabyProfile_motherProfileId_fkey') THEN
    ALTER TABLE "BabyProfile" ADD CONSTRAINT "BabyProfile_motherProfileId_fkey" FOREIGN KEY ("motherProfileId") REFERENCES "MotherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'NurseProfile_userId_fkey') THEN
    ALTER TABLE "NurseProfile" ADD CONSTRAINT "NurseProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'NurseProfile_hospitalId_fkey') THEN
    ALTER TABLE "NurseProfile" ADD CONSTRAINT "NurseProfile_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ResearcherProfile_userId_fkey') THEN
    ALTER TABLE "ResearcherProfile" ADD CONSTRAINT "ResearcherProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FollowUpSchedule_motherProfileId_fkey') THEN
    ALTER TABLE "FollowUpSchedule" ADD CONSTRAINT "FollowUpSchedule_motherProfileId_fkey" FOREIGN KEY ("motherProfileId") REFERENCES "MotherProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
