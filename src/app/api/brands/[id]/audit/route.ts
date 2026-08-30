import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { runGeoAudit } from "@/lib/geo/audit";
import { computeBrandMetrics } from "@/lib/geo/metrics";
import { generateRecommendations } from "@/lib/geo/recommendations";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const brand = db.brands.get(id);
  if (!brand || brand.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const audit = await runGeoAudit(id, brand.domain);
  db.audits.create(audit);

  const prompts = db.prompts.list(id);
  const scans = db.scanResults.latestPerPromptEngine(id);
  const metrics = computeBrandMetrics(brand, scans, prompts.length);
  const recs = generateRecommendations(brand, metrics, prompts, scans, audit);
  db.recommendations.replaceForBrand(id, recs);

  return NextResponse.json({ audit, recommendations: recs.length });
}
