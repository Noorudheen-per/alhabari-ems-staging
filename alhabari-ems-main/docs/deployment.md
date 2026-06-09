# Deployment Guide

How to push updates to the live app at [alhabariengams.netlify.app](https://alhabariengams.netlify.app).

---

## TL;DR — fastest path

1. Get new `index.html` from Claude
2. On GitHub: open repo → click `index.html` → click ✏️ pencil → paste content → "Commit changes"
3. Wait ~30 seconds — Netlify auto-deploys
4. Hard-refresh (Ctrl+F5 / Cmd+Shift+R) to see changes

---

## One-time setup: connect Netlify to GitHub

1. Log into Netlify → open your site `alhabariengams`
2. **Site configuration** → **Build & deploy** → **Continuous deployment**
3. Click **Link site to Git** → choose **GitHub** → authorize → pick `alhabari-ems` repo
4. Settings:
   - **Branch:** `main`
   - **Build command:** *(leave empty)*
   - **Publish directory:** `.`
5. **Save**

Now every push to `main` triggers a deploy automatically.

---

## Three ways to update `index.html`

### Method 1: GitHub web UI (no install — easiest)

Best for quick fixes from any device.

1. Go to https://github.com/YOUR-USERNAME/alhabari-ems
2. Click `index.html` in the file list
3. Click ✏️ pencil icon (top right of file view)
4. Select all (Ctrl+A) → delete → paste new content
5. Scroll down → **Commit message:** "Fix XYZ" or "Add feature ABC"
6. Click **Commit changes**

✅ Done — Netlify deploys automatically.

### Method 2: GitHub Desktop (installed app)

Best if you update often and want history visualization.

1. Install [GitHub Desktop](https://desktop.github.com/)
2. **File → Clone repository →** pick `alhabari-ems`
3. Replace `index.html` with new version locally
4. App shows "1 file changed" with diff
5. Type commit message → **Commit to main**
6. Click **Push origin**

### Method 3: Netlify drag-drop (NOT recommended now)

⚠️ Bypasses Git history. Only for emergencies if GitHub is down.

---

## SQL migrations (Supabase changes)

When new features need DB schema changes:

1. New SQL files go in `sql/` folder, numbered (`08-*.sql`, `09-*.sql`, etc.)
2. Open **Supabase dashboard** → **SQL Editor** → **New query**
3. Open SQL file from GitHub → copy contents → paste into Supabase
4. Click **Run** → verify success

Run migrations **in numerical order** for fresh DB. For existing DB, run only new ones — all migrations are idempotent (safe to re-run).

See [`sql/README.md`](../sql/README.md) for full migration order.

---

## Hard-refresh (clearing cache)

Browsers cache `index.html`. After deploy, users must hard-refresh:

| Platform | Shortcut |
|---|---|
| Windows Chrome/Edge/Firefox | `Ctrl + F5` |
| Mac Chrome/Edge/Firefox | `Cmd + Shift + R` |
| Mac Safari | `Cmd + Option + R` |
| iPhone Safari | Pull down 3× or close + reopen tab |
| Android Chrome | Swipe down to refresh |

**Tip:** Tell the team after every deploy "hard-refresh to see new feature."

---

## Rollback (broken version)

GitHub keeps every version. To roll back:

1. Open repo on GitHub → click **History** above file list
2. Find the last good commit
3. Click commit hash → click `index.html` → **Raw** → copy content
4. Edit current `index.html` → paste old content → commit "Rollback to <date>"
5. Netlify redeploys old version automatically

---

## Common issues

| Symptom | Likely cause | Fix |
|---|---|---|
| Changes not visible | Browser cached | Hard-refresh |
| Deploy stuck "Building" | Netlify slow | Check Netlify deploy log; usually retry works |
| "Cloud disconnected" banner | Supabase RLS policy issue | Check Supabase → Auth → policies |
| SQL migration error 42710 | Object already exists | Re-run — all migrations are idempotent |
| Login fails | User row missing in `users` table | Check Settings → Manage Users |

---

## Backup strategy

3 layers of backup:

1. **GitHub** — full code history per commit
2. **Netlify** — last 5+ deploys retained, can re-publish any
3. **Supabase** — daily DB backups (Pro tier: Point-in-Time-Recovery for 7 days)
