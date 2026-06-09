# Roadmap

What's planned next, partially done, and on the wishlist.

---

## 🚧 In progress / next session

### Procurement simplification
**User-requested:** Replace the 5-tab procurement module (Vendors, MRs, POs, GRNs, Dashboard) with **one simple table dashboard**:

| Sl No | Date | MR No | Site | PO Number | Status | DN/GRN |
|---|---|---|---|---|---|---|

- Filter: search, site, status, date range
- Site Admins see only their own site
- Export CSV

Removes need for: New MR form, PO form, Vendor Directory.

---

## 🐛 Known issues

| # | Issue | Severity | Workaround |
|---|---|---|---|
| 1 | PPE_STOCK case-sensitivity inconsistency between supply requests and direct distribution flows | Low | Type item names consistently |
| 2 | `todayStr()` returns yesterday's UTC date during 00:00–03:00 Doha time | Low | Don't enter timesheets at midnight |
| 3 | Site Admin sees employees from all sites (by design with `employees` perm) | By design | — |
| 4 | Other tables besides timesheets/employees/supply_requests/vacations still use client-generated IDs (collision risk) | Medium | Less concurrent activity on those tables; fix later |

---

## 📋 Planned features (priority order)

### Round 3 — Resigned/Terminated employee handling
- Employee status field (active/resigned/terminated/on-hold)
- Hide resigned from default lists, show in archive view
- Auto-flag expired gate passes/medicals as low-priority for resigned

### Project Requirement Profiles + Find Eligible Employees
- Define project requirements (X welders, Y helpers, must-have certifications, language, nationality)
- Auto-search EMPLOYEES for matching candidates
- Save shortlists per project

### HSE Module
- Incident reporting with photo upload
- Toolbox Talks attendance tracking
- Training Matrix view (employee × training type)
- HSE KPI dashboard

### Employee Self-Service Portal
- Employees log in with their own QID
- View own training expiries, gate pass status, vacation balance
- Submit vacation requests
- Reduces HR admin burden

### Bulk Photo/Doc Upload
- Drag-drop ZIP file with photos named by Emp ID
- Auto-match to EMPLOYEES records
- Useful for onboarding 100+ employees at once

### Payroll Export
- One-click monthly payroll Excel
- Configurable per-employee rates
- OT multiplier (1.5×, 2× on holidays)
- Includes vacation accrual

### Mobile app (PWA)
- Install to home screen
- Offline mode for site supervisors with poor connectivity
- Camera integration for direct photo capture

---

## 🎯 Wishlist (no commitment)

- Email notifications (welcome new user, password reset, request status changes)
- WhatsApp Business API for site supervisor alerts
- Two-factor authentication
- Multi-language UI (Arabic, Hindi, Tagalog)
- Migration to React (if codebase grows beyond 25k lines)
- Native iOS/Android apps with biometric login
- AI-assisted features:
  - Photo auto-crop for ID cards
  - QID OCR for fast employee onboarding
  - Anomaly detection in timesheets (unusual hours)

---

## 🚫 Explicitly NOT planned

These were considered and rejected:

- ❌ Multi-tenancy (single company use only)
- ❌ Public-facing employee directory
- ❌ Customer/client portal (separate domain)
- ❌ Inventory management beyond PPE/Tools (full ERP is out of scope; integration with existing ERP is the model)
- ❌ Custom workflow engine (current state machine in code is sufficient)
