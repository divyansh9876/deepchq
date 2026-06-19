# Database backup

Deepchq stores all data in a single JSON file (`DATABASE_URL`, default `data/deepchq.json`). On Render this lives on a **persistent disk** at `/app/data/deepchq.json`.

That disk is safer than ephemeral storage, but you should still back up off-server in case the disk is reset, corrupted, or the service is recreated.

## What the app does automatically

1. **Safer writes** — atomic write via a `.tmp` file, then rename (reduces corruption if the process crashes mid-write).
2. **Local copies** — every ~2 minutes after changes, keeps `deepchq.json.bak` and `deepchq.json.bak.1` on the same disk.
3. **Remote backup (optional)** — if `DATABASE_BACKUP_URL` is set, POSTs a JSON snapshot to your webhook.

## Remote backup setup (recommended)

### 1. Render env vars

```env
DATABASE_BACKUP_URL=https://your-webhook-or-worker.example/backup
DATABASE_BACKUP_SECRET=long-random-string
ANALYTICS_SECRET=another-long-secret
```

### 2. Where to send backups

| Option | How |
|--------|-----|
| **Google Drive + Sheets** | [GOOGLE-BACKUP.md](./GOOGLE-BACKUP.md) — free Apps Script (recommended) |
| **n8n / Make / Zapier** | Webhook → Google Drive, Dropbox, or email |
| **Cloudflare Worker** | Receive POST → store in **R2** |
| **Your own server** | Simple script saves `database` field to dated files |
| **Supabase Storage** | Worker or n8n uploads to a private bucket |

The POST body (default `DATABASE_BACKUP_MODE=json`):

```json
{
  "exportedAt": "2026-06-20T12:00:00.000Z",
  "filename": "deepchq-2026-06-20-12-00-00.json",
  "source": "https://deepchq.app",
  "stats": { "users": 12, "searches": 45, "funnelSessions": 100 },
  "database": { "users": [], "searches": [], ... }
}
```

Header: `x-backup-secret: <DATABASE_BACKUP_SECRET>`

Set `DATABASE_BACKUP_MODE=raw` to send the raw JSON file instead.

### 3. Manual or scheduled backup

```bash
# Status
curl -s -H "x-analytics-secret: YOUR_ANALYTICS_SECRET" \
  https://deepchq.app/api/admin/backup

# Run backup now (local + remote)
curl -s -X POST -H "x-analytics-secret: YOUR_ANALYTICS_SECRET" \
  https://deepchq.app/api/admin/backup
```

On Render, add a **Cron Job** service that runs the POST daily.

## Restore from backup

1. Download a backup file from your storage (Drive, R2, etc.).
2. On Render Shell:
   ```bash
   cp /app/data/deepchq.json /app/data/deepchq.json.before-restore
   # paste or upload the restored file to /app/data/deepchq.json
   ```
3. Restart the web service.

Or restore from local copies on disk:

```bash
ls -la /app/data/deepchq.json*
cp /app/data/deepchq.json.bak /app/data/deepchq.json
```

## Long-term: Postgres

For high traffic, use **Render Postgres** instead of JSON. Backups are automatic (daily snapshots). Migration is a separate project when you outgrow the JSON file.
