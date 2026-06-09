-- ════════════════════════════════════════════════════════════
-- Al Habari Engineering EMS — Supabase Database Schema
-- ════════════════════════════════════════════════════════════
-- HOW TO USE:
-- 1. Open your Supabase project → SQL Editor (left sidebar)
-- 2. Click "+ New query"
-- 3. Paste this ENTIRE file
-- 4. Click RUN (bottom right)
-- 5. Wait for "Success. No rows returned"
-- Done!
-- ════════════════════════════════════════════════════════════

-- USERS (login accounts)
CREATE TABLE IF NOT EXISTS users (
  id          BIGINT PRIMARY KEY,
  username    TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  display     TEXT,
  role        TEXT,
  status      TEXT DEFAULT 'approved',
  site        TEXT,
  perms       JSONB DEFAULT '[]'::jsonb,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- EMPLOYEES (with nested trainings, gate passes, PPE as JSON)
CREATE TABLE IF NOT EXISTS employees (
  id          BIGINT PRIMARY KEY,
  name        TEXT NOT NULL,
  role        TEXT,
  dept        TEXT,
  emp_id      TEXT,
  nat         TEXT,
  qid         TEXT,
  mobile      TEXT,
  photo       TEXT,
  site        TEXT,
  trainings   JSONB DEFAULT '[]'::jsonb,
  medical     JSONB DEFAULT '{}'::jsonb,
  gate_passes JSONB DEFAULT '[]'::jsonb,
  ppe         JSONB DEFAULT '[]'::jsonb,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- PPE STOCK
CREATE TABLE IF NOT EXISTS ppe_stock (
  id          BIGINT PRIMARY KEY,
  item        TEXT NOT NULL,
  size        TEXT,
  brand       TEXT,
  purchased   INT DEFAULT 0,
  distributed INT DEFAULT 0,
  category    TEXT,
  unit_cost   NUMERIC DEFAULT 0,
  remarks     TEXT
);

-- PPE DISTRIBUTIONS (every time PPE is issued)
CREATE TABLE IF NOT EXISTS ppe_distributions (
  id          BIGINT PRIMARY KEY,
  item        TEXT,
  size        TEXT,
  brand       TEXT,
  qty         INT,
  dist_date   DATE,
  dist_type   TEXT,
  employee_id BIGINT,
  emp_name    TEXT,
  site        TEXT,
  unit_cost   NUMERIC DEFAULT 0
);

-- PPE REQUESTS (purchase requests through approval workflow)
CREATE TABLE IF NOT EXISTS ppe_requests (
  id            BIGINT PRIMARY KEY,
  item          TEXT,
  qty           INT,
  notes         TEXT,
  requested_by  TEXT,
  requester_id  BIGINT,
  request_date  DATE,
  status        TEXT DEFAULT 'pending',
  admin_note    TEXT,
  mgmt_note     TEXT,
  procure_note  TEXT,
  reject_note   TEXT
);

-- EQUIPMENT / TOOLS
CREATE TABLE IF NOT EXISTS equipment (
  id              BIGINT PRIMARY KEY,
  name            TEXT,
  asset_no        TEXT,
  serial_no       TEXT,
  category        TEXT,
  brand           TEXT,
  purchase_date   DATE,
  warranty_until  DATE,
  status          TEXT,
  location        TEXT,
  issued_to       TEXT,
  issued_date     DATE,
  return_date     DATE,
  notes           TEXT
);

-- TIMESHEETS (site admin daily entries)
CREATE TABLE IF NOT EXISTS timesheets (
  id              BIGINT PRIMARY KEY,
  employee_id     BIGINT,
  emp_code        TEXT,
  emp_name        TEXT,
  designation     TEXT,
  job_center      TEXT,
  ts_date         DATE,
  straight        BOOLEAN DEFAULT false,
  shift1_start    TEXT,
  shift1_end      TEXT,
  shift2_start    TEXT,
  shift2_end      TEXT,
  total_hrs       NUMERIC DEFAULT 0,
  normal_hrs      NUMERIC DEFAULT 0,
  overtime_hrs    NUMERIC DEFAULT 0,
  day_type        TEXT,
  remarks         TEXT,
  site            TEXT,
  site_admin_id   BIGINT,
  site_admin_name TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- TOOL REQUESTS (site admin → store keeper)
CREATE TABLE IF NOT EXISTS tool_requests (
  id            BIGINT PRIMARY KEY,
  tool          TEXT,
  qty           INT,
  duration      TEXT,
  purpose       TEXT,
  requested_by  TEXT,
  requester_id  BIGINT,
  site          TEXT,
  request_date  DATE,
  status        TEXT
);

-- AUDIT LOG
CREATE TABLE IF NOT EXISTS audit_log (
  id           BIGINT PRIMARY KEY,
  user_id      BIGINT,
  user_name    TEXT,
  action       TEXT,
  category     TEXT,
  target       TEXT,
  details      TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- HOLIDAYS
CREATE TABLE IF NOT EXISTS holidays (
  id            BIGINT PRIMARY KEY,
  holiday_date  DATE UNIQUE,
  label         TEXT,
  added_by      TEXT,
  added_at      TEXT
);

-- VEHICLES (PMV)
CREATE TABLE IF NOT EXISTS vehicles (
  id                  BIGINT PRIMARY KEY,
  plate_no            TEXT NOT NULL,
  vehicle_type        TEXT,
  make                TEXT,
  model               TEXT,
  year                INT,
  driver_name         TEXT,
  driver_mobile       TEXT,
  current_km          INT DEFAULT 0,
  current_hours       INT,
  site                TEXT,
  istimara_no         TEXT,
  istimara_expiry     DATE,
  istimara_doc        JSONB,
  insurance_no        TEXT,
  insurance_expiry    DATE,
  insurance_doc       JSONB,
  tpc_no              TEXT,
  tpc_expiry          DATE,
  tpc_doc             JSONB,
  last_service_date   DATE,
  last_service_km     INT,
  last_service_hours  INT,
  status              TEXT DEFAULT 'active',
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT now()
);

-- VEHICLE SERVICES
CREATE TABLE IF NOT EXISTS vehicle_services (
  id                   BIGINT PRIMARY KEY,
  vehicle_id           BIGINT REFERENCES vehicles(id) ON DELETE CASCADE,
  service_date         DATE NOT NULL,
  service_type         TEXT,
  at_km                INT,
  at_hours             INT,
  mechanic             TEXT,
  workshop             TEXT,
  parts                JSONB DEFAULT '[]'::jsonb,
  labour_cost          NUMERIC DEFAULT 0,
  notes                TEXT,
  next_service_date    DATE,
  next_service_km      INT,
  next_service_hours   INT,
  created_by           TEXT,
  created_at           TIMESTAMPTZ DEFAULT now()
);

-- ════════════════════════════════════════════════════════════
-- ENABLE ROW LEVEL SECURITY + ALLOW ACCESS FROM BROWSER
-- (For a small internal team this is fine. For public apps,
-- you'd write more restrictive policies.)
-- ════════════════════════════════════════════════════════════

ALTER TABLE users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppe_stock         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppe_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppe_requests      ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment         ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_requests     ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log         ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays          ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_services  ENABLE ROW LEVEL SECURITY;

-- Allow anyone with the anon key to read and write
CREATE POLICY "anon_all_users"             ON users             FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_employees"         ON employees         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_ppe_stock"         ON ppe_stock         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_ppe_distributions" ON ppe_distributions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_ppe_requests"      ON ppe_requests      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_equipment"         ON equipment         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_timesheets"        ON timesheets        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_tool_requests"     ON tool_requests     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_audit_log"         ON audit_log         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_holidays"          ON holidays          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_vehicles"          ON vehicles          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_vehicle_services"  ON vehicle_services  FOR ALL USING (true) WITH CHECK (true);

-- Done! You should see "Success. No rows returned" below.
