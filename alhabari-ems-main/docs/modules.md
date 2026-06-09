# Modules Overview

The 13 main modules of Al Habari EMS. Each is a logical "page" inside the single `index.html`.

---

## 🏠 Home
**Function:** `goHome()` · **Renders:** Role-based dashboard

Lands here after login. Shows:
- Greeting with user's name + role
- Module tiles filtered by user's permissions
- Pending alerts (PPE requests awaiting approval, supply requests, password resets)
- Quick action buttons relevant to user

---

## 👤 Employee Details
**Function:** `openEmployee()` · **Module:** Employee profiles

Tabs:
- **List view** — searchable table of all employees with filters by site, designation
- **Add Employee** — create new with photo upload, QID, mobile, etc.
- **Profile view** — full employee record with sub-tabs:
  - Trainings (cert + expiry tracking)
  - Gate Passes (site + expiry)
  - PPE issued (history with brand/size)
  - Medical records (multi-record support)

Site Admins see all employees but can't edit unless they have `employees_edit` perm.

---

## 🎓 Training & Medical
**Function:** `openTraining()` · **Module:** Cert tracking

Tabs:
- **Group view** — bulk add training to multiple employees at once (e.g. company-wide First Aid)
- **Search view** — find specific trainings, filter by expiry status
- **Medical view** — same for medical certifications
- **Monthly summary** — count of trainings/medicals issued by month

---

## 🚪 Gate Pass Admin
**Function:** `openGatePassAdmin()` · **Module:** Gate pass tracking

Cross-employee table view with:
- Filters (site, expiring soon, expired, all active)
- Renew modal (extends expiry, marks old as renewed)
- Search by employee name, gate pass ID

---

## 🦺 PPE Management
**Function:** `openPPE()` · **8 tabs:**

1. **Dashboard** — total stock, low-stock alerts, value
2. **Site Summary** — distribution by site
3. **Stock** — manage SKUs (item × brand × size), add/edit
4. **Employee PPE** — see who has what
5. **History** *(v41)* — combined PPE+Tools distribution log with filters + CSV
6. **Purchase** — record stock additions
7. **Distribute** — direct issuance to employee (legacy flow)
8. **Requests** — legacy PPE request workflow (being phased out for Supply Requests)

---

## 🛠️ Equipment & Tools
**Function:** `openEquipment()` · **Module:** Tool registry

- Tool list with status (available, in-use, maintenance, retired)
- Issue/return workflow with employee assignment
- Service/maintenance log
- Edit + delete with permission checks
- Filter by category, status, site

---

## 📍 Site Admin
**Function:** `openSiteAdmin()` · **3 tabs (v42):**

1. **📊 Dashboard** *(new in v42)* — Site-scoped stats:
   - Total Man-Hours (MTD), Yesterday Headcount, Days Active, Equipment In Use
   - Live clock + Doha weather
   - Last 7 days headcount chart
   - Headcount by designation
   - Today's activity breakdown

2. **📝 Entry Grid** — Excel-like compact grid for daily timesheet entry
   - One row per employee
   - Columns: Name, Day Type, Start, End, Break, Total, Normal, OT, Site, Remarks
   - "All OT" checkbox (forces all hours as OT — for holidays etc.)
   - "Same as yesterday" auto-fill button
   - Lots of keyboard shortcuts for fast entry

3. **📋 Daily Sheet** — Excel-style read/edit view
   - Date navigation (prev/next/picker)
   - Search, site filter, pagination (25/50/100)
   - Inline edit per row
   - Edited rows highlighted yellow with orange edited cells
   - Export to CSV

---

## ⏱️ Time Keeper
**Function:** `openTimeKeeper()` · **4 tabs:**

1. **Timesheets** — Pending review queue with site/date filters, payroll lock control
2. **Daily Sheet** — Same as Site Admin but with Day Type column + all sites visible
3. **Holidays** — Add/remove company holidays (auto-OT logic)
4. **Vacations** — Add vacations, mark completed, conflict detection with timesheets

---

## 📊 Management Dashboard
**Function:** `openManagementDashboard()` · **Module:** Company-wide KPIs

- 5 KPI cards (Total Headcount, Present Today, MTD Manhours, Equipment In Use, PPE Value)
- 7 SVG charts (headcount trend, manhours trend, by-designation, by-site, etc.)
- Drill into Project pages for site-level detail
- Date selector for any historical date

Available to users with `management_view` perm.

---

## 🚜 PMV (Plant / Machinery / Vehicles)
**Function:** `openPMV()` · **Module:** Vehicle management

- Vehicle registry with plate, type, driver, docs (Istimara, Insurance, TPC)
- Service history with cost tracking
- Daily timesheet entry per vehicle (with AM/PM toggle in v42)
- Billing types: hourly / daily / monthly (pro-rated)
- Operator vs without-operator pricing
- Override cost field for one-off rates
- Filters: active, expired docs, expiring soon

---

## 📦 Procurement
**Function:** `openProcurement()` · **5 tabs (legacy):**

1. **Dashboard** — open MRs, POs, pending GRNs
2. **Vendors** — supplier directory
3. **MRs** — Material Requisitions
4. **POs** — Purchase Orders
5. **GRNs** — Goods Receipt Notes

⚠️ **Being simplified** — see [roadmap](roadmap.md). User asked for a single dashboard table with: Sl No, Date, MR No, Site, PO Number, Status, GRN — with site-scoped view for site admins.

---

## 📋 Supply Requests *(v40 — primary workflow)*
**Function:** `openRequests()` · **Module:** Unified PPE+Tools workflow

Replaces the old PPE Request flow with a multi-step workflow:

1. Site Admin creates REQ with multiple items → token like `REQ-2026-001`
2. SK checks stock:
   - Has stock → Issue + auto-prompt **PDF Delivery Note** → status `dispatched`
   - No stock → Escalate → status `sent_to_admin`
3. Admin reviews → enters MR Number from external ERP → status `mr_created`
4. Procurement enters PO Number from external ERP → status `po_raised`
5. Admin marks Purchased → adds quantities to PPE_STOCK → status `with_sk_final`
6. SK creates DN & dispatches → auto-prompt PDF DN → status `dispatched`
7. Site Admin confirms receipt qty → status `completed`
   - Shortfall? Auto-creates follow-up REQ

PDF Delivery Note (v40) opens in new tab, A4 portrait, brand maroon, with signature blocks.

---

## ⚙️ Settings
**Function:** `openSettings()` · **Module:** Admin tools

Tabs:
- **Manage Users** — create/edit/delete users, assign roles, custom permissions
- **Sites & Job Centers** — add/remove sites with colors, manage cost centers
- **Medical Types** — manage pre-defined medical certification names
- **Password Resets** — review queue of reset requests
- **Storage Migration** — one-time tool to move base64 images to Supabase Storage
- **Event Log** — audit trail of every create/update/delete

Admin (`settings` perm) only.

---

## Module relationships

```
   Employees ──┬─→ Timesheets ──→ Site Admin Dashboard
               │                  Time Keeper
               │                  Management Dashboard
               ├─→ Trainings
               ├─→ Gate Passes
               ├─→ PPE issued ←─┐
               └─→ Medicals     │
                                │
   PPE Stock ──→ Distribute ────┤
                                │
   Supply Requests ──→ MR/PO ──→ Stock added → Dispatch → DN PDF
                                │
   Equipment ──→ Issue/Return ──┘

   Vehicles ──→ Services
            └─→ PMV Timesheets ──→ Management Dashboard
```
