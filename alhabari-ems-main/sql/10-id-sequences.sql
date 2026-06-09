-- ════════════════════════════════════════════════════════════════════
-- v42b: Fix auto-generation of IDs for employees + vacations tables
--
-- Verified DB state (from query result on 2026-05-06):
--   timesheets       — already identity column ✓ skipping
--   supply_requests  — already has nextval default ✓ skipping
--   employees        — id has no default ✗ this script fixes
--   vacations        — id has no default ✗ this script fixes
--
-- Run blocks one at a time if needed. Idempotent — safe to re-run.
-- ════════════════════════════════════════════════════════════════════


-- ──────────────────────────────────────────────
-- BLOCK 1: employees
-- ──────────────────────────────────────────────

-- Step 1: Create sequence (skip if already exists)
CREATE SEQUENCE IF NOT EXISTS employees_id_seq;

-- Step 2: Set sequence above current max id (so new IDs don't collide with existing)
SELECT setval('employees_id_seq', GREATEST(COALESCE((SELECT MAX(id) FROM employees), 0), 0) + 1, false);

-- Step 3: Set the column default
ALTER TABLE employees ALTER COLUMN id SET DEFAULT nextval('employees_id_seq');

-- Step 4: Bind sequence ownership to the column
ALTER SEQUENCE employees_id_seq OWNED BY employees.id;


-- ──────────────────────────────────────────────
-- BLOCK 2: vacations
-- ──────────────────────────────────────────────

CREATE SEQUENCE IF NOT EXISTS vacations_id_seq;

SELECT setval('vacations_id_seq', GREATEST(COALESCE((SELECT MAX(id) FROM vacations), 0), 0) + 1, false);

ALTER TABLE vacations ALTER COLUMN id SET DEFAULT nextval('vacations_id_seq');

ALTER SEQUENCE vacations_id_seq OWNED BY vacations.id;


-- ──────────────────────────────────────────────
-- VERIFY (optional — run separately to confirm)
-- ──────────────────────────────────────────────
-- SELECT table_name, column_name, is_identity, column_default
-- FROM information_schema.columns
-- WHERE table_name IN ('employees', 'vacations') AND column_name = 'id'
-- ORDER BY table_name;
--
-- Expected: column_default for both tables should show nextval(...)
