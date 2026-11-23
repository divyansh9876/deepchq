import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { runDueWork } from "@/lib/automation/cycle";

export const maxDuration = 800;

function authorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const given = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function handle(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await runDueWork());
}

export const GET = handle;
export const POST = handle;
