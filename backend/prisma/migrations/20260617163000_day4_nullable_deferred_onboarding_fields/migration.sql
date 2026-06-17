-- Day 4 staged onboarding: hospital linking, study group assignment, and
-- participant-code allocation happen in Day 5, so these fields must be
-- nullable while mother profile data is collected.

ALTER TABLE "MotherProfile"
  ALTER COLUMN "participantCode" DROP NOT NULL,
  ALTER COLUMN "studyGroup" DROP NOT NULL,
  ALTER COLUMN "hospitalId" DROP NOT NULL;
