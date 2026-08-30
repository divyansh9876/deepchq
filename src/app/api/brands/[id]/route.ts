import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { computeBrandMetrics } from "@/lib/geo/metrics";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const brand = db.brands.get(id);
  if (!brand || brand.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const prompts = db.prompts.list(id);
  const scans = db.scanResults.latestPerPromptEngine(id);
  const audit = db.audits.latest(id);
  const recommendations = db.recommendations.list(id);
  const metrics = computeBrandMetrics(brand, scans, prompts.length);

  return NextResponse.json({
    brand,
    prompts,
    scans,
    audit,
    recommendations,
    metrics,
  });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const brand = db.brands.get(id);
  if (!brand || brand.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  db.brands.delete(id);
  return NextResponse.json({ ok: true });
}
