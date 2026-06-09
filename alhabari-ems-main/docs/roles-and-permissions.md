# Roles & Permissions

Who can do what in Al Habari EMS.

---

## Roles

Defined in `ROLE_PRESETS` near the top of `index.html`:

| Role | Default perms | Use case |
|---|---|---|
| **admin** | All permissions including `settings` | IT admin / superuser |
| **management** | `management_view`, `ppe`, `ppe_approve`, `equipment`, `pmv` | Top management overview |
| **storekeeper** | `ppe`, `equipment`, `storekeeper` | PPE/tools warehouse staff |
| **procurement** | `procurement` | Procurement officer |
| **siteadmin** | `employees`, `site_admin` | Site supervisors entering daily timesheets |
| **timekeeper** | `timekeeper` | Reviews timesheets, manages payroll lock |
| **pmv_admin** | `pmv`, `pmv_edit` | Manages vehicles, drivers, services |
| **hr** | `employees`, `employees_edit`, `training`, `training_edit`, `gatepass_edit` | HR officer |
| **viewer** | View-only access to most modules | Audit/observer role |

Roles can be customized per-user in **Settings → Manage Users**.

---

## Permissions

Each permission gates one capability:

| Permission | What it grants |
|---|---|
| `settings` | Full admin: settings page, user management, all deletes |
| `site_admin` | Site Admin module — daily timesheet entry |
| `timekeeper` | Time Keeper module — review timesheets, holidays, vacations, payroll lock |
| `employees` | View employee list and profiles |
| `employees_edit` | Add/edit employee profiles, photos |
| `training` | View trainings |
| `training_edit` | Add/edit trainings + medicals |
| `gatepass_edit` | Add/edit gate passes |
| `ppe` | View PPE module (stock, distribution) |
| `ppe_approve` | Approve PPE/Tool requests at management level |
| `equipment` | View Equipment module |
| `storekeeper` | Issue from stock, dispatch supply requests, create DNs |
| `procurement` | Enter MR/PO numbers from ERP, mark POs |
| `management_view` | Management Dashboard |
| `pmv` | View PMV module |
| `pmv_edit` | Add/edit vehicles, services, daily timesheets |

---

## Site scoping

Some users are scoped to one site (set on user record):

- **Site Admin** with `session.site = "Site A"` only sees:
  - Employees at Site A
  - Timesheets at Site A
  - Daily Sheet shows Site A only (filter is locked)
  - Site Admin Dashboard scoped to Site A
  - Procurement requests from Site A

Admins, Time Keepers, and Management see all sites by default.

---

## Special access rules

### Delete operations
- **Employees** — admin or timekeeper only
- **Timesheets** — admin or timekeeper. Site Admins can submit a delete *request* for locked entries.
- **PPE stock** — admin only
- **Vehicles** — admin or pmv_edit
- **Training/Gate pass/PPE distribution records** — `*_edit` perm holders + admin

### Payroll lock
When a date is locked (set in Time Keeper):
- Timesheets ≤ that date cannot be edited even by admin
- Site Admins must request unlock from admin
- PMV timesheets follow the same rule

### Storage migration
- Settings → Storage Migration — admin only
- Re-entry guard prevents double-runs

---

## Multi-role users

A user can have multiple permissions stacked. Common combos:

| Combo | Use case |
|---|---|
| `admin` + `site_admin` + `timekeeper` | IT person who also enters timesheets for one site |
| `storekeeper` + `procurement` | Small office where one person handles both |
| `siteadmin` + `pmv_edit` | Site supervisor who also logs vehicle deployment |

Custom user perms can be set explicitly via **Settings → Manage Users → Edit Permissions**.

---

## How permission checks work in code

```javascript
// Anywhere in the app:
if (!hasPerm("settings")) {
  toast("Only admin can do this");
  return;
}
```

This checks `session.perms` array which is loaded from the `users.perms` JSONB column.

For UI gating (hiding buttons):
```javascript
${hasPerm("ppe_approve") ? `<button onclick="...">Approve</button>` : ""}
```

For backend safety, all delete operations also re-check `hasPerm()` before mutating data.

---

## Adding a new role/perm

1. In `index.html`, find `ROLE_PRESETS` near the top
2. Add new role:
   ```javascript
   newrole: {label: "Description", perms: ["perm1", "perm2"]}
   ```
3. Add new perm to `PERM_CATALOG` if it's a new capability:
   ```javascript
   new_perm: {label: "What it grants", icon: "🆕"}
   ```
4. Add `hasPerm("new_perm")` checks in the relevant render functions and action handlers
5. Test as a user with that role
