-- ════════════════════════════════════════════════════════════════════
-- v42 Timesheet bug fixes:
-- 1. Add force_ot column (was being lost on save)
-- ════════════════════════════════════════════════════════════════════

ALTER TABLE timesheets ADD COLUMN IF NOT EXISTS force_ot BOOLEAN DEFAULT false;

-- Backfill existing rows: leave as false (no historical force_ot data was saved)

-- Optional: index on (ts_date, site) for faster Daily Sheet queries
CREATE INDEX IF NOT EXISTS idx_timesheets_date_site ON timesheets(ts_date, site);
