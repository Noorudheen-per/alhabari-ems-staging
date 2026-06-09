# Changelog

Version history of Al Habari EMS.

Format: each version lists shipped features + bug fixes. Most recent at top.

---

## v42b — May 6, 2026 (current)

### 🗄️ Database migration

- **Migration 10 added** ([`sql/10-id-sequences.sql`](../sql/10-id-sequences.sql)) — adds auto-generating id sequences for `employees` and `vacations` tables. These were causing `null value in column "id"` errors when v42 app code stopped sending client-generated IDs.
- **Verified DB state** of all 4 critical tables:
  - `timesheets` — already an identity column ✓ (no migration needed)
  - `supply_requests` — already had `nextval` default from v40 schema ✓
  - `employees` — now has `nextval` default ✓ (fixed by migration 10)
  - `vacations` — now has `nextval` default ✓ (fixed by migration 10)
- **Multi-user concurrent saves now collision-safe** across all high-traffic tables.

### 📝 Notes
- v42 deployment of `index.html` was correct — the issue was the missing DB migration. Now both pieces are in place.
- Earlier draft of migration 10 (broken — included `timesheets` block which threw error 42601 because the column is already an identity) replaced with a clean version that targets only `employees` and `vacations`.

---

## v42 — May 6, 2026

### 🚨 Critical fixes
- **Multi-user data-loss bug fixed (app side)** — When two users saved timesheets simultaneously, both clients generated the same local id and overwrote each other. Fixed in app code: id no longer sent on INSERT for new records (DB auto-generates and returns it). The matching DB migration shipped in v42b.
- **Daily Sheet save respects forceOT** — editing via Daily Sheet preserves the "All OT" override
- **Daily Sheet save respects holidays** — editing on holiday auto-applies all-hours-OT logic
- **`deleteTraining`/`deleteGatePass` null-check** — no longer crashes on race condition (idx out of bounds)
- **`renderProcMRs` undefined `_mrFilter`** — crashed Procurement → MRs tab; fixed
- **`supply_requests` realtime sync** — was missing from realtime handlers, required manual page refresh

### ✨ New features
- **Site Admin Dashboard tab** — site-scoped stats (man-hours MTD, yesterday headcount, days active, equipment in use), live clock + Doha weather, 7-day headcount chart, designation breakdown, today's activity, quick actions
- **Widescreen layout** for desktop (≥1280px → 1400px max) and large desktop (≥1600px → 1640px max). Mobile unchanged.
- **PMV daily timesheet AM/PM toggle** — quick-pick AM/PM buttons next to start/end time inputs
- **Daily Sheet UI refresh** — matches user's reference image:
  - Date | Day Type badge | Go To Date layout
  - Maroon brand header for table
  - HH:MM time format throughout
  - Yellow row + orange edited cells + "edited" badge for edited rows
  - "Showing X of Y entries" footer with numbered pagination + 25/50/100 selector
  - "Export to Excel" button (top right)
- **PDF Delivery Note generator** — A4 portrait, branded header, signature blocks (Issued/Verified/Received). Auto-prompts after SK creates DN, also accessible via Print DN button on action bar.

### 🔧 Workflow changes
- **Supply Requests now ERP-integrated:**
  - Removed auto-generated MR/PO numbers
  - Admin enters MR number from external ERP → forwards to Procurement
  - Procurement enters PO number from external ERP
  - Removed unused fields: supplier, ETA, PO date

### 📋 Other
- 16 tables now use `_fromDB` flag to differentiate INSERT (new record) vs UPSERT (existing record)
- Bug audit complete: 232 onclick handlers verified, all 13 modules + sub-tabs tested

---

## v41 — May 5, 2026

- **PPE History tab** — combines PPE_DISTRIBUTIONS + emp.ppe[] + Tools from SUPPLY_REQUESTS into one timeline
- Filters: site, month (last 12), type (PPE/Tool/Both), employee
- CSV download of distribution history

---

## v40 — May 4, 2026

- **Supply Requests module** — unified PPE+Tools workflow (replaces old PPE Request flow)
- New table: `supply_requests`
- 8-step workflow: Submit → SK Issue → Escalate → Admin Review (MR) → Procurement (PO) → Admin Mark Purchased → SK Dispatch → Site Admin Confirm
- Token-based: `REQ-2026-001`, `MR-2026-001`, `PO-2026-001`, `DN-2026-001` (later: ERP-typed)
- Multi-item per request with per-item status

---

## v38 — May 3, 2026

- Stabilization sweep
- Token generation uses `max(existing) + 1` instead of `length + 1` (no collision after deletion)

---

## v34 — May 1, 2026

### Critical timesheet fixes
- Authoritative recalc on save (was saving stale `totalHrs`)
- `forceOT` flag preserved when "Same as Yesterday" copied from previous day
- Double-absent prevention with confirmation prompt
- Holiday hours auto-OT
- `recalcTsRow` properly handles `forceOT` undefined → false
- `loadSameAsYesterday` preserves `forceOT`

### Other
- Site Admin CSV download (last 30 days, scoped to their site)
- Delete timesheet with reason (admin/TK direct, Site Admin submits request)
- "All OT" override checkbox

---

## v29 — Apr 28, 2026

- **Storage migration** — moved photos and document files from base64-in-DB to Supabase Storage
- 5 new buckets: employee-photos, gate-pass-docs, medical-docs, vehicle-docs, equipment-docs
- One-time migration tool in Settings
- Database size dropped ~40 MB → ~5 MB (faster loads)

---

## v25 — Apr 27, 2026

- **Night shift support** — start time after end time correctly calculated as overnight shift
- **Payroll lock** — Time Keeper can lock dates ≤ X; no edits allowed below that date
- Site Admin sees "🔒 Locked" badge on locked dates and submits delete *requests* instead

---

## v23 — Apr 26, 2026

- Hot-fix release
- RLS policy adjustments

---

## v22 — Apr 25, 2026

- **Vacations table** — separate from timesheets
- Vacation conflict detection with timesheets
- Vacation status: pending / active / completed / cancelled

---

## v18 — Apr 23, 2026

- **PMV module** — Plant/Machinery/Vehicles separate from handheld Equipment
- Vehicle docs: Istimara, Insurance, TPC with expiry tracking
- Service history with cost
- Daily PMV timesheet (vehicle deployment per site)

---

## v17 — Apr 22, 2026

- Initial Supabase backend
- Realtime sync across all tables
- Multi-user support

---

## v9 — Apr 22, 2026

- First publishable build
- Single HTML file
- LocalStorage-only (no backend yet)
- Core modules: Employee Details, Timesheet, PPE basic
