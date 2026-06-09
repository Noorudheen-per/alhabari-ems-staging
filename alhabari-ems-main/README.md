# Al Habari Engineering — Employee Management System (EMS)

Internal web application for **Al Habari Engineering & General Contracting W.L.L.** (Doha, Qatar) — manages employees, timesheets, PPE, equipment, vehicles, supply requests, and procurement workflows across multiple project sites.

> 🌐 **Live URL:** [alhabariengams.netlify.app](https://alhabariengams.netlify.app)
> 📍 **Repository:** Private — internal use only
> 🏗️ **Built:** April 2026 onwards · current version: **v42**

---

## What it does

A single-file web application that handles end-to-end employee operations for ~20–30 users today (scaling toward 300+):

| Module | Purpose |
|---|---|
| 🏠 Home | Role-based dashboard with alerts |
| 👤 Employee Details | Profiles, photos, training, gate passes, PPE, medicals |
| 🎓 Training & Medical | Track certifications, expiries, monthly summaries |
| 🚪 Gate Pass Admin | Site-wise gate pass tracking with renewal |
| 🦺 PPE Management | Stock, distribution, history, request workflow |
| 🛠️ Equipment & Tools | Issue, return, maintenance |
| 📍 Site Admin | Daily timesheet entry + dashboard |
| ⏱️ Time Keeper | Review timesheets, holidays, vacations, payroll lock |
| 📊 Management Dashboard | KPIs, charts, headcount analytics |
| 🚜 PMV (Plant/Machinery/Vehicles) | Vehicle registry, services, daily timesheets |
| 📦 Procurement | Vendors, MRs, POs, GRNs (ERP-integrated) |
| 📋 Supply Requests | Unified PPE+Tools workflow with PDF Delivery Notes |
| ⚙️ Settings | Users, sites, password resets, event log |

---

## Tech stack

- **Frontend:** Single HTML file (`index.html`) — vanilla JS, CSS, no build step
- **Backend:** Supabase (PostgreSQL + Storage + Realtime) — Mumbai region, Pro tier
- **Hosting:** Netlify (auto-deploys from this GitHub repo)
- **External libs (CDN):** SheetJS (Excel I/O), Supabase JS client, Open-Meteo (weather)

Why single-file? Easy to deploy, no build pipeline, no npm dependencies, anyone can read the source. Everything runs in the browser.

---

## Quick links

- 📖 [Deployment guide](docs/deployment.md) — how to push updates
- 🗄️ [Supabase setup](docs/supabase-setup.md) — DB schema + migrations
- 👥 [Roles & permissions](docs/roles-and-permissions.md) — who can do what
- 🧩 [Modules overview](docs/modules.md) — what each module does
- 📜 [Changelog](docs/changelog.md) — version history v22 → v42
- 🐛 [Roadmap](docs/roadmap.md) — what's planned next

---

## How to update the app

1. Edit `index.html` (locally or via GitHub web UI)
2. Commit + push to `main` branch
3. Netlify auto-deploys within ~30 seconds
4. Hard-refresh in browser to see changes

See [`docs/deployment.md`](docs/deployment.md) for full details.

---

## License & ownership

© Al Habari Engineering & General Contracting W.L.L. — proprietary internal software. Not for redistribution.
