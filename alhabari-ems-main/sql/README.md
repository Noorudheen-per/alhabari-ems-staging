# SQL Migrations

All Supabase schema migrations for Al Habari EMS, in order.

---

## Run order (for fresh DB)

Run these scripts **in numerical order** in Supabase SQL Editor:

| # | File | What it does |
|---|---|---|
| 01 | [`01-schema.sql`](01-schema.sql) | Original tables: users, employees, sites, ppe_stock, ppe_distributions, ppe_requests, equipment, timesheets, audit_log |
| 02 | [`02-sites-setup.sql`](02-sites-setup.sql) | Sites table with colors, initial site list |
| 03 | [`03-timesheet-update.sql`](03-timesheet-update.sql) | Adds night-shift, payroll-lock columns |
| 04 | [`04-password-reset.sql`](04-password-reset.sql) | password_resets table |
| 05 | [`05-pmv-timesheet.sql`](05-pmv-timesheet.sql) | PMV module: vehicles, vehicle_services, pmv_timesheets, pmv_rate_sheet |
| 06 | [`06-vacations.sql`](06-vacations.sql) | Vacations table separate from timesheets |
| 07 | [`07-storage.sql`](07-storage.sql) | Storage buckets for photos and docs |
| 08 | [`08-supply-requests.sql`](08-supply-requests.sql) | Unified PPE+Tools supply request workflow (v40) |
| 09 | [`09-timesheet-force-ot.sql`](09-timesheet-force-ot.sql) | Adds `force_ot` column for "All OT" override (v42) |
| 10 | [`10-id-sequences.sql`](10-id-sequences.sql) | **CRITICAL** — adds auto-generating sequences for `employees` and `vacations` tables (v42b). The `timesheets` and `supply_requests` tables already had auto-generation in their original schema. |

---

## All migrations are idempotent

Every script uses:
- `CREATE TABLE IF NOT EXISTS`
- `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
- `CREATE INDEX IF NOT EXISTS`
- `DROP POLICY IF EXISTS` before `CREATE POLICY`
- Wrapped publication adds in `DO $$ ... END $$` blocks with existence checks

**Safe to re-run.** No data loss. No errors on second run.

---

## Verifying a migration worked

After running each migration, check Supabase Dashboard → Table Editor — you should see new tables/columns appear.

For sequence migration (`10-id-sequences.sql`):
```sql
SELECT column_name, column_default
FROM information_schema.columns
WHERE table_name IN ('timesheets','employees','supply_requests','vacations')
  AND column_name = 'id';
```
Expected: `column_default` should contain `nextval('..._id_seq'::regclass)` for all four tables.

---

## When a new migration is needed

Whenever a feature requires a schema change:

1. Claude generates new migration file (e.g. `11-feature-xyz.sql`)
2. Add to this folder
3. Update this README's run order table
4. Run in Supabase SQL Editor on production
5. Then push the new `index.html` (which uses the new schema)

**Always run SQL before pushing code** — otherwise the app may try to write to columns that don't exist yet.

---

## Rollback / disaster recovery

To restore from a backup:

1. Supabase Dashboard → Settings → Database → Database backups
2. Download a snapshot
3. To restore: open new project → SQL Editor → run snapshot SQL

For Point-in-Time-Recovery (Pro tier):
1. Settings → Database → Backups → Restore point in time
2. Pick exact timestamp (within last 7 days)
3. Confirm

---

## Critical notes

- ⚠️ Never run `DROP TABLE` in production
- ⚠️ Never run `TRUNCATE` in production unless you have a fresh backup
- ⚠️ The `anon` key is public; security comes from RLS policies — keep them strict
- ✅ All `anon_all_*` policies allow read+write to anon role; this is intentional for current setup
- ✅ The auth model relies on app-layer `hasPerm()` checks, not RLS row filtering
