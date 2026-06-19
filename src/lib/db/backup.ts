import fs from "fs";
import path from "path";
import { readDbSnapshot } from "./client";

const LOCAL_BACKUP_COPIES = 2;
let backupTimer: ReturnType<typeof setTimeout> | null = null;

export function getDbFilePath(): string {
  const raw =
    process.env.DATABASE_URL?.replace(/^file:/, "") ??
    path.join(process.cwd(), "data", "deepchq.json");
  return raw;
}

/** Keep the last N copies next to the DB file (deepchq.json.bak, .bak.1, …). */
export function rotateLocalBackups(): void {
  const file = getDbFilePath();
  if (!fs.existsSync(file)) return;

  const dir = path.dirname(file);
  const base = path.basename(file);

  for (let i = LOCAL_BACKUP_COPIES; i >= 1; i -= 1) {
    const from = path.join(dir, `${base}.bak${i === 1 ? "" : `.${i - 1}`}`);
    const to = path.join(dir, `${base}.bak.${i}`);
    if (fs.existsSync(from)) fs.copyFileSync(from, to);
  }

  fs.copyFileSync(file, path.join(dir, `${base}.bak`));
}

export type RemoteBackupResult = {
  ok: boolean;
  skipped?: boolean;
  status?: number;
  error?: string;
  exportedAt?: string;
  remote?: Record<string, unknown>;
};

/** POST a JSON snapshot to DATABASE_BACKUP_URL (webhook, n8n, worker → S3/Drive). */
export async function pushRemoteBackup(): Promise<RemoteBackupResult> {
  const url = process.env.DATABASE_BACKUP_URL?.trim();
  if (!url) {
    return { ok: true, skipped: true };
  }

  const file = getDbFilePath();
  if (!fs.existsSync(file)) {
    return { ok: false, error: "Database file not found" };
  }

  const secret = process.env.DATABASE_BACKUP_SECRET?.trim();
  const exportedAt = new Date().toISOString();
  const filename = `deepchq-${exportedAt.slice(0, 19).replace(/[:T]/g, "-")}.json`;
  const mode = process.env.DATABASE_BACKUP_MODE?.trim() ?? "json";

  const headers: Record<string, string> = {};
  if (secret) headers["x-backup-secret"] = secret;

  let body: string;
  if (mode === "raw") {
    headers["Content-Type"] = "application/json";
    headers["x-backup-filename"] = filename;
    body = fs.readFileSync(file, "utf8");
  } else {
    headers["Content-Type"] = "application/json";
    const snapshot = readDbSnapshot();
    body = JSON.stringify({
      exportedAt,
      filename,
      backupSecret: secret,
      source: process.env.NEXT_PUBLIC_APP_URL ?? "deepchq",
      stats: {
        users: snapshot.users.length,
        searches: snapshot.searches.length,
        funnelSessions: snapshot.funnelSessions.length,
        subscriptions: snapshot.subscriptions.length,
      },
      database: snapshot,
    });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        status: res.status,
        error: text.slice(0, 500) || `HTTP ${res.status}`,
      };
    }

    const text = await res.text().catch(() => "");
    let remote: Record<string, unknown> | undefined;
    try {
      remote = JSON.parse(text) as Record<string, unknown>;
    } catch {
      remote = { raw: text.slice(0, 200) };
    }

    const sheetErrors = remote?.sheetErrors as string[] | undefined;
    if (sheetErrors?.length) {
      console.error("[db-backup] Google Sheets sync errors:", sheetErrors);
      return {
        ok: false,
        exportedAt,
        error: `Sheets sync failed: ${sheetErrors.join("; ")}`,
        remote,
      };
    }

    if (remote?.ok === false) {
      return {
        ok: false,
        exportedAt,
        error: String(remote.error ?? "Remote backup failed"),
        remote,
      };
    }

    return { ok: true, exportedAt, remote };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Backup request failed",
    };
  }
}

export async function runDatabaseBackup(): Promise<{
  local: boolean;
  remote: RemoteBackupResult;
}> {
  rotateLocalBackups();
  const remote = await pushRemoteBackup();
  return { local: true, remote };
}

/** Debounced local + remote backup after DB writes. */
export function scheduleDatabaseBackup(): void {
  if (backupTimer) return;

  const delayMs = Number(process.env.DATABASE_BACKUP_DEBOUNCE_MS ?? "120000");
  backupTimer = setTimeout(() => {
    backupTimer = null;
    try {
      rotateLocalBackups();
    } catch (err) {
      console.error("[db-backup] local rotation failed", err);
    }
    void pushRemoteBackup().catch((err) => {
      console.error("[db-backup] remote push failed", err);
    });
  }, delayMs);
}
