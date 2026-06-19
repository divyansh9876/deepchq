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

**In Apps Script editor** (before connecting Render):

1. Set `BACKUP_SECRET` in the script
2. Run function **`testBackup`** (Run ▶)
3. Check Drive → **Deepchq Backups** and spreadsheet **Deepchq Data**
4. **Deploy → Manage deployments → Edit → New version** (required after code changes!)

**From production:**

```bash
curl -X POST -H "x-analytics-secret: YOUR_ANALYTICS_SECRET" \
  https://deepchq.app/api/admin/backup
```

Response includes `remote.spreadsheetUrl` on success.

---

## 6. JSON updates but Sheet does not?

This usually means the script saved the JSON file then **crashed on the Sheet step**. Fix:

1. Re-paste the latest `scripts/google-apps-script/deepchq-backup.gs` into Apps Script
2. **Deploy → Manage deployments → Edit → New version → Deploy** (editing code alone is not enough)
3. Run **`testBackup`** in the editor — check **Execution log** for errors
4. Open spreadsheet inside folder **Deepchq Backups** (not an old copy in Drive root)
5. Confirm `DATABASE_BACKUP_SECRET` on Render matches `BACKUP_SECRET` in the script

---

## 7. Troubleshooting

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
