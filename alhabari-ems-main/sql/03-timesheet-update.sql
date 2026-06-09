-- ════════════════════════════════════════════════════════════
-- Al Habari EMS — TIMESHEET SCHEMA UPDATE
-- ════════════════════════════════════════════════════════════
-- Run this ONCE in Supabase SQL Editor.
-- This rebuilds the timesheet table to use the simpler
-- Start / End / Break model (replacing Shift 1 / Shift 2 / Straight).
--
-- ⚠️ SAFE FOR YOU: All existing timesheet rows will be deleted.
-- You confirmed you haven't entered any real timesheet data yet,
-- so this is zero risk. Everything else (employees, PPE, vehicles,
-- users, etc.) is not touched.
-- ════════════════════════════════════════════════════════════

-- 1. Wipe any existing test timesheet rows
DELETE FROM timesheets;

-- 2. Drop the old shift columns
ALTER TABLE timesheets DROP COLUMN IF EXISTS straight;
ALTER TABLE timesheets DROP COLUMN IF EXISTS shift1_start;
ALTER TABLE timesheets DROP COLUMN IF EXISTS shift1_end;
ALTER TABLE timesheets DROP COLUMN IF EXISTS shift2_start;
ALTER TABLE timesheets DROP COLUMN IF EXISTS shift2_end;

-- 3. Add the new Start / End / Break columns
ALTER TABLE timesheets ADD COLUMN IF NOT EXISTS start_time TEXT;
ALTER TABLE timesheets ADD COLUMN IF NOT EXISTS end_time   TEXT;
ALTER TABLE timesheets ADD COLUMN IF NOT EXISTS break_min  INT DEFAULT 0;

-- Done! You should see "Success. No rows returned" below.
