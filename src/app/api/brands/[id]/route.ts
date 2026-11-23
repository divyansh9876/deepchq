import { NextResponse } from "next/server";
import { z } from "zod";
import { requireBrand } from "@/lib/auth/guard";
import { db } from "@/lib/db/client";
import { computeBrandMetrics } from "@/lib/geo/metrics";
import { route } from "@/lib/http";
import { limitsFor } from "@/lib/plans";
import { enginesFor } from "@/lib/automation/cycle";
import { isLiveEngine } from "@/lib/geo/engines";

type Ctx = { params: Promise<{ id: string }> };

export const GET = route<Ctx>(async (_req, { params }) => {
  const { user, brand } = await requireBrand((await params).id);
  const prompts = db.prompts.list(brand.id);
  const scans = db.scanResults.latestPerPromptEngine(brand.id);
  const engines = enginesFor(user);
  return NextResponse.json({
    brand,
    prompts,
    scans,
    audit: db.audits.latest(brand.id),
    recommendations: db.recommendations.list(brand.id),
    metrics: computeBrandMetrics(brand, scans, prompts.length),
    history: db.scanResults.history(brand.id),
    limits: limitsFor(user),
    engines: engines.map((id) => ({ id, live: isLiveEngine(id) })),
  });
});

const patchSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  competitors: z.array(z.string().trim().min(1).max(80)).max(8).optional(),
  autoScan: z.boolean().optional(),
});

export const PATCH = route<Ctx>(async (req, { params }) => {
  const { brand } = await requireBrand((await params).id);
  const body = patchSchema.parse(await req.json());
  db.brands.update(brand.id, body);
  return NextResponse.json({ brand: db.brands.get(brand.id) });
});

export const DELETE = route<Ctx>(async (_req, { params }) => {
  const { brand } = await requireBrand((await params).id);
  db.brands.delete(brand.id);
  return NextResponse.json({ ok: true });
});
