-- ════════════════════════════════════════════════════════════
-- Al Habari EMS — PASSWORD RESET UPDATE
-- ════════════════════════════════════════════════════════════
-- Run this ONCE in Supabase SQL Editor.
-- 1. Deletes the 5 extra demo accounts (keeps only `admin`)
-- 2. Adds a new table for password reset requests
--
-- SAFE: Your real data (employees, timesheets, PPE, vehicles,
-- etc.) is NOT touched. Only the login accounts change.
-- ════════════════════════════════════════════════════════════

-- 1. Remove the 5 demo accounts (keeps `admin` for you)
DELETE FROM users WHERE username IN ('storekeeper','management','siteadmin','timekeeper','pmvadmin');

-- 2. Create password_resets table — stores user reset requests
CREATE TABLE IF NOT EXISTS password_resets (
  id            BIGINT PRIMARY KEY,
  user_id       BIGINT,
  username      TEXT,
  display       TEXT,
  requested_at  TIMESTAMPTZ DEFAULT now(),
  status        TEXT DEFAULT 'pending',    -- pending | approved | denied
  reviewed_by   TEXT,
  reviewed_at   TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;

-- Allow access with anon key (same as other tables)
CREATE POLICY "anon_all_password_resets" ON password_resets FOR ALL USING (true) WITH CHECK (true);

-- Done! You should see "Success. No rows returned" below.
