import { NextResponse } from "next/server";
import { requireBrand } from "@/lib/auth/guard";
import { HttpError, rateLimit, route } from "@/lib/http";
import { limitsFor } from "@/lib/plans";
import { auditBrand } from "@/lib/automation/cycle";

type Ctx = { params: Promise<{ id: string }> };

export const POST = route<Ctx>(async (_req, { params }) => {
  const { user, brand } = await requireBrand((await params).id);
  rateLimit(`audit:${brand.id}`, 1, 15_000);
  const every = limitsFor(user).auditsEveryDays;
  if (every && brand.lastAuditAt && Date.now() - brand.lastAuditAt.getTime() < every * 86400_000) {
    const next = new Date(brand.lastAuditAt.getTime() + every * 86400_000).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    throw new HttpError(402, `Free plan includes one audit per ${every} days (next on ${next}). Upgrade for unlimited audits.`, {
      upgrade: true,
    });
  }
  const audit = await auditBrand(brand);
  return NextResponse.json({ audit });
});
