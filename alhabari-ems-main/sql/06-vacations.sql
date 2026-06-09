-- ════════════════════════════════════════════════════════════
-- Al Habari EMS — VACATIONS TABLE SETUP
-- ════════════════════════════════════════════════════════════
-- Run this ONCE in Supabase SQL Editor.
-- Creates the vacations table for Time Keeper to track employee
-- vacation periods. Active vacations block timesheet entry by
-- Site Admin until Time Keeper marks the employee as back.
--
-- SAFE: Does NOT touch any existing data.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS vacations (
  id           BIGINT PRIMARY KEY,
  emp_id       BIGINT NOT NULL,
  emp_code     TEXT,
  emp_name     TEXT,
  start_date   DATE NOT NULL,
  end_date     DATE NOT NULL,
  reason       TEXT,
  status       TEXT DEFAULT 'active',     -- active | closed
  added_by     TEXT,
  added_at     TIMESTAMPTZ DEFAULT now(),
  closed_by    TEXT,
  closed_at    TIMESTAMPTZ
);

-- Index for fast lookups by employee + date range
CREATE INDEX IF NOT EXISTS idx_vacations_emp_active ON vacations(emp_id, status, start_date, end_date);

-- Enable Row Level Security
ALTER TABLE vacations ENABLE ROW LEVEL SECURITY;

-- Allow access with anon key (same as other tables)
DO $$
BEGIN
  BEGIN
    CREATE POLICY "anon_all_vacations" ON vacations FOR ALL USING (true) WITH CHECK (true);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- Done! You should see "Success. No rows returned" below.
