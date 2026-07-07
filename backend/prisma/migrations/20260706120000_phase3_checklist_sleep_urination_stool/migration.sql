-- Phase 3: extend daily_logs with Sleep and Urination/Stool checklist items
-- Source: SnehoAyu_Content_Knowledge_Base.md §4.4 — Daily checklist for assessing the newborn

ALTER TABLE "daily_logs"
  ADD COLUMN "sleep_done"        BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "urination_done"    BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "urination_count"   INTEGER,
  ADD COLUMN "stool_done"        BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "stool_abnormal"    BOOLEAN NOT NULL DEFAULT false;
