# Supabase Setup

Backend = Supabase (Mumbai region, Pro tier ~$25/mo).

---

## Project info

- **URL:** `https://djiobwevvaiaoodnwfsg.supabase.co`
- **Anon public key** (safe to commit): `sb_publishable_gzvEQjqQWPBbYB719Yl2Mg_qARrum3d`
- **Region:** Mumbai (closest to Doha)

⚠️ **Never commit the service-role key.** It's only used server-side. The anon key is safe because security comes from Row Level Security (RLS) policies.

---

## Tables

| Table | Purpose | Realtime sync? |
|---|---|---|
| `users` | Login + role + perms | ✓ |
| `employees` | Employee profiles + nested PPE/training/gate-pass JSON | ✓ |
| `sites` | Project sites with colors | ✓ |
| `job_centers` | Departments / cost centers | ✓ |
| `medical_types` | Pre-defined medical certification names | ✓ |
| `password_resets` | Password reset queue | ✓ |
| `ppe_stock` | PPE inventory with category | ✓ |
| `ppe_distributions` | Issue history | ✓ |
| `ppe_requests` | Legacy PPE request flow | ✓ |
| `equipment` | Tools registry | ✓ |
| `tool_requests` | Tool request flow | ✓ |
| `timesheets` | Daily attendance entries | ✓ |
| `holidays` | Site holidays (auto-OT) | ✓ |
| `vacations` | Vacation tracking | ✓ |
| `vehicles` | PMV registry | ✓ |
| `vehicle_services` | Service history | ✓ |
| `pmv_timesheets` | Daily vehicle deployment | ✓ |
| `pmv_rate_sheet` | Hourly/daily/monthly rates by vehicle type | ✓ |
| `audit_log` | Event log (every create/update/delete) | ✓ |
| `active_sessions` | Login session tracking | ✓ |
| `settings` | Key-value app settings | ✓ |
| `supply_requests` | Unified PPE+Tools workflow | ✓ |

---

## Storage buckets

Photos and document files (added in v29) are stored in Supabase Storage, not as base64 in the DB:

| Bucket | Contents |
|---|---|
| `employee-photos` | Profile photos |
| `gate-pass-docs` | Gate pass scans |
| `medical-docs` | Medical certificate scans |
| `vehicle-docs` | Istimara, insurance, TPC scans |
| `equipment-docs` | Equipment certificates |

All buckets are **public** with RLS for upload/delete, since URL paths are unguessable UUIDs.

---

## Row Level Security (RLS)

Currently all tables use a permissive `anon_all_*` policy:

```sql
CREATE POLICY anon_all_employees ON employees
  FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);
```

This means: **the anon key can read/write everything**. Security is enforced at the **application layer** via `hasPerm()` checks.

This trade-off was chosen for simplicity. If the app ever exposes the anon key publicly (it does — anyone can read the JS file), the data is theoretically readable to anyone with the URL.

For higher security in the future:
1. Switch to Supabase Auth (real user accounts)
2. Replace `anon_all_*` policies with per-user/per-role policies
3. Use JWT claims to check `auth.uid()`

For now, the app is **internal use only** with no link sharing — risk is acceptable.

---

## Realtime sync

- Subscribed to all 22 tables via single `ems-sync` channel
- Triggers `RT_TABLE_HANDLERS[table]` in `index.html` on any insert/update/delete
- Multi-user updates appear within 1–2 seconds across all logged-in clients

---

## Migrations

All schema changes are versioned SQL files in [`sql/`](../sql/) folder. See [`sql/README.md`](../sql/README.md) for run order.

**Critical:** v42b ([`08-id-sequences.sql`](../sql/08-id-sequences.sql)) converts `id` columns to auto-generating sequences. Without this, multi-user concurrent saves cause data loss. Run this if you haven't.

---

## Backups

Pro tier includes:
- **Daily snapshots** for 7 days (free with Pro)
- **Point-in-Time-Recovery** to any moment in last 7 days

Manual download:
- Supabase Dashboard → Settings → Database → Database backups → Download

---

## Common admin tasks

### Reset a user password
Settings → Manage Users → click user → set new password (admin only)

### View event log
Settings → Event Log tab — shows every create/update/delete with user, timestamp, target

### Run a migration
Supabase Dashboard → SQL Editor → New query → paste contents of `.sql` file from `/sql/` folder → Run

### Truncate all data (⚠️ destructive)
Use [`sql/00-clear-all-data.sql`](../sql/00-clear-all-data.sql) — only for dev/test environments

---

## Cost monitoring

Pro tier included:
- 8 GB DB storage (currently using ~50 MB)
- 100 GB bandwidth
- 5 GB Storage (photos)
- 2M Edge Function invocations

At ~30 users we're far below limits. Should comfortably scale to 300+ users on Pro plan.
