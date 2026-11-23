import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";

export const dynamic = "force-dynamic";

export function GET() {
  try {
    db.health();
    return NextResponse.json({ ok: true, lastCronAt: db.meta.get().lastCronAt ?? null });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 503 });
  }
}
