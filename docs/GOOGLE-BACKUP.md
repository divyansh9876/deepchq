# Backup to Google Drive + Google Sheets

Send Deepchq data to **Google Drive** (JSON snapshots) and **Google Sheets** (readable tables for users, leads, searches, subscriptions).

Uses a free **Google Apps Script** — no extra npm packages on Render.

---

## 1. Create the script

1. Open [Google Drive](https://drive.google.com) → **New** → **More** → **Google Apps Script**
2. Name the project **Deepchq Backup**
3. Delete any default code and paste the contents of:
   ```
   scripts/google-apps-script/deepchq-backup.gs
   ```
4. At the top of the script, set:
   ```javascript
   const BACKUP_SECRET = "choose-a-long-random-string";
   ```
   Use the same value you will set as `DATABASE_BACKUP_SECRET` on Render.

5. **Save** the project.

---

## 2. Deploy as web app

1. Click **Deploy** → **New deployment**
2. Type: **Web app**
3. **Execute as:** Me
4. **Who has access:** Anyone
5. Click **Deploy** → authorize Google account
6. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/...../exec`)

---

## 3. Render environment variables

```env
DATABASE_BACKUP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
DATABASE_BACKUP_SECRET=choose-a-long-random-string
ANALYTICS_SECRET=another-secret-for-admin-dashboard
```

Redeploy Deepchq.

---

## 4. What you get in Google

### Google Drive

Folder: **Deepchq Backups**

- Timestamped JSON files (`deepchq-2026-06-20-12-00-00.json`)
- Keeps the last **60** backups (older ones auto-deleted)

### Google Spreadsheet

File: **Deepchq Data**

| Tab | Contents |
|-----|----------|
| **Users** | email, plan, signup date |
| **Funnel Leads** | name, email, ad platform, UTM, step |
| **Searches** | who was searched, status, linked user |
| **Subscriptions** | plan, interval, Razorpay id, status |

Sheets refresh on each backup (full snapshot, not append-only).

---

## 5. Test

```bash
curl -X POST -H "x-analytics-secret: YOUR_ANALYTICS_SECRET" \
  https://deepchq.app/api/admin/backup
```

Or wait ~2 minutes after a signup/search — auto-backup runs after DB changes.

Check Drive folder and **Deepchq Data** spreadsheet.

---

## 6. Troubleshooting

| Issue | Fix |
|-------|-----|
| `Unauthorized` in logs | `BACKUP_SECRET` in script must match `DATABASE_BACKUP_SECRET` on Render |
| Script returns HTML login page | Redeploy web app with **Anyone** access |
| Empty sheets | Trigger a backup after you have users/leads in the app |
| Permission denied | Re-authorize script: Deploy → Manage deployments → edit |

---

## Security

- The JSON backup contains **emails and password hashes** — keep the Drive folder private.
- Do not share the Web app URL publicly without the secret check (script validates `backupSecret` in the POST body).
- Only share the **Deepchq Data** spreadsheet with people who need CRM access.

---

## Optional: daily cron

On Render, add a **Cron Job** that runs daily:

```bash
curl -s -X POST -H "x-analytics-secret: $ANALYTICS_SECRET" \
  https://deepchq.app/api/admin/backup
```
