-- ════════════════════════════════════════════════════════════
-- Al Habari EMS — PMV TIMESHEET & RATES SETUP
-- ════════════════════════════════════════════════════════════
-- Run this ONCE in Supabase SQL Editor.
-- Adds:
--   1. New columns on `vehicles` table for hire rates + Personal Use flag
--   2. New `pmv_timesheets` table for daily equipment deployment log
--
-- SAFE: Does NOT touch existing data. New columns default to safe values.
-- ════════════════════════════════════════════════════════════

-- 1. Add Personal Use flag and Rates JSON column to existing vehicles table
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS personal_use BOOLEAN DEFAULT FALSE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS rates JSONB DEFAULT '{}'::jsonb;

-- 2. Create pmv_timesheets table — daily equipment deployment log
CREATE TABLE IF NOT EXISTS pmv_timesheets (
  id              BIGINT PRIMARY KEY,
  vehicle_id      BIGINT NOT NULL,
  plate_no        TEXT,
  vehicle_type    TEXT,
  ts_date         DATE NOT NULL,
  site            TEXT,
  focal_person    TEXT,
  start_time      TEXT,
  end_time        TEXT,
  break_min       INTEGER DEFAULT 0,
  total_hrs       NUMERIC(8,2) DEFAULT 0,
  status          TEXT DEFAULT 'working',  -- working | idle_charged | idle_free | breakdown
  with_operator   BOOLEAN DEFAULT TRUE,
  billing_type    TEXT DEFAULT 'hourly',   -- hourly | daily | monthly
  rate_per_unit   NUMERIC(10,2) DEFAULT 0,
  calculated_cost NUMERIC(12,2) DEFAULT 0,
  override_cost   NUMERIC(12,2),           -- nullable: only set if user overrode
  final_cost      NUMERIC(12,2) DEFAULT 0,
  notes           TEXT,
  created_by      TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast filtering
CREATE INDEX IF NOT EXISTS idx_pmv_ts_date ON pmv_timesheets(ts_date);
CREATE INDEX IF NOT EXISTS idx_pmv_ts_vehicle ON pmv_timesheets(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_pmv_ts_site ON pmv_timesheets(site);
CREATE INDEX IF NOT EXISTS idx_pmv_ts_date_site ON pmv_timesheets(ts_date, site);

-- Enable Row Level Security
ALTER TABLE pmv_timesheets ENABLE ROW LEVEL SECURITY;

-- Allow access with anon key (same as other tables)
DO $$
BEGIN
  BEGIN
    CREATE POLICY "anon_all_pmv_timesheets" ON pmv_timesheets FOR ALL USING (true) WITH CHECK (true);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- Done! You should see "Success. No rows returned" below.
