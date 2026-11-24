import { NextResponse } from "next/server";
import { requireBrand } from "@/lib/auth/guard";
import { db } from "@/lib/db/client";
import { HttpError, rateLimit, route } from "@/lib/http";
import { limitsFor } from "@/lib/plans";
import { scanBrand } from "@/lib/automation/cycle";

type Ctx = { params: Promise<{ id: string }> };

export const maxDuration = 300;

export const POST = route<Ctx>(async (_req, { params }) => {
  const { user, brand } = await requireBrand((await params).id);
  rateLimit(`scan:${brand.id}`, 1, 20_000);
  const limits = limitsFor(user);
  const brandIds = db.brands.list(user.id).map((b) => b.id);
  const today = db.scanResults.runsSince(brandIds, new Date(Date.now() - 86400_000));
  if (today >= limits.manualScansPerDay) {
    throw new HttpError(429, `You've used today's ${limits.manualScansPerDay} scans. Scheduled scans still run automatically.`, {
      upgrade: true,
    });
  }
  const result = await scanBrand(brand, user);
  if (!result) throw new HttpError(400, "Add at least one prompt before scanning.");
  return NextResponse.json(result);
});
