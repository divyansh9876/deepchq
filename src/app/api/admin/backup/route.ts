import { NextRequest, NextResponse } from "next/server";
import { isAnalyticsAuthorized } from "@/lib/analytics/auth";
import {
  getDbFilePath,
  pushRemoteBackup,
  runDatabaseBackup,
  rotateLocalBackups,
} from "@/lib/db/backup";
import fs from "fs";

export async function GET(req: NextRequest) {
  if (!isAnalyticsAuthorized(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Set ANALYTICS_SECRET and pass x-analytics-secret." },
      { status: 401 },
    );
  }

  const file = getDbFilePath();
  const exists = fs.existsSync(file);
  const stat = exists ? fs.statSync(file) : null;

  return NextResponse.json({
    file,
    exists,
    sizeBytes: stat?.size ?? 0,
    modifiedAt: stat?.mtime.toISOString() ?? null,
    remoteBackupConfigured: Boolean(process.env.DATABASE_BACKUP_URL?.trim()),
    localBackupCopies: 2,
  });
}

export async function POST(req: NextRequest) {
  if (!isAnalyticsAuthorized(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Set ANALYTICS_SECRET and pass x-analytics-secret." },
      { status: 401 },
    );
  }

  const localOnly = req.nextUrl.searchParams.get("local") === "1";
  const remoteOnly = req.nextUrl.searchParams.get("remote") === "1";

  if (remoteOnly) {
    const remote = await pushRemoteBackup();
    return NextResponse.json({ remote });
  }

  if (localOnly) {
    rotateLocalBackups();
    return NextResponse.json({ local: true });
  }

  const result = await runDatabaseBackup();
  return NextResponse.json(result);
}
