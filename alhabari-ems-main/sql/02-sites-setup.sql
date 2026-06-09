-- ════════════════════════════════════════════════════════════
-- Al Habari EMS — SETUP + CLEAR SITES & JOB CENTERS
-- ════════════════════════════════════════════════════════════
-- This script does TWO things safely:
--   1. Creates the sites and job_centers tables (if they don't exist)
--   2. Clears them empty so you can add your real sites fresh
--
-- Run this ONCE in Supabase SQL Editor.
-- Safe to run even if you've never run the sites update before.
-- ════════════════════════════════════════════════════════════

-- 1. Create sites table (if not already there)
CREATE TABLE IF NOT EXISTS sites (
  name        TEXT PRIMARY KEY,
  color       TEXT DEFAULT '#888780',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. Create job_centers table (if not already there)
CREATE TABLE IF NOT EXISTS job_centers (
  name        TEXT PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security on these tables
ALTER TABLE sites        ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_centers  ENABLE ROW LEVEL SECURITY;

-- 4. Allow the anon key (your web app) to access these tables
--    These will error harmlessly if the policies already exist — that's fine.
DO $$
BEGIN
  BEGIN
    CREATE POLICY "anon_all_sites"        ON sites        FOR ALL USING (true) WITH CHECK (true);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    CREATE POLICY "anon_all_job_centers"  ON job_centers  FOR ALL USING (true) WITH CHECK (true);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- 5. Now clear out everything so you can add your real sites fresh
DELETE FROM sites;
DELETE FROM job_centers;

-- Done! You should see "Success. No rows returned" below.
--
-- Next: log in to your web app → Settings → Sites & Jobs
--       → add your real sites and job/cost centers one at a time.
