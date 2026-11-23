import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { esc, notifyAdmin } from "@/lib/email";
import { normalizeUrl, runGeoAudit } from "@/lib/geo/audit";
import { bareDomain } from "@/lib/geo/engines";
import { clientIp, HttpError, rateLimit, route } from "@/lib/http";
import { assertPublicUrl, UnsafeUrlError } from "@/lib/net/safe-fetch";

const runSchema = z.object({ url: z.string().trim().min(3).max(300) });
const emailSchema = z.object({ id: z.string().max(64), email: z.string().trim().email().max(200) });

export const maxDuration = 60;

/** Free, no-signup GEO audit. Results are cached per domain for an hour and get a shareable URL. */
export const POST = route(async (req) => {
  const { url } = runSchema.parse(await req.json());
  const normalized = normalizeUrl(url);
  try {
    await assertPublicUrl(normalized);
  } catch (e) {
    throw new HttpError(400, e instanceof UnsafeUrlError ? e.message : "Invalid URL.");
  }
  const domain = bareDomain(normalized);
  const cached = db.publicAudits.recentForDomain(domain, 60 * 60_000);
  if (cached) return NextResponse.json({ id: cached.id, cached: true });

  rateLimit(`public-audit:${clientIp(req)}`, 8, 60 * 60_000);
  rateLimit("public-audit:global", 300, 60 * 60_000);
  const audit = await runGeoAudit("public", normalized);
  db.publicAudits.create({ ...audit, domain });
  return NextResponse.json({ id: audit.id, cached: false });
});

/** Attach an email to an audit ("send me this report") — becomes a lead. */
export const PATCH = route(async (req) => {
  rateLimit(`public-audit-email:${clientIp(req)}`, 5, 60 * 60_000);
  const { id, email } = emailSchema.parse(await req.json());
  const audit = db.publicAudits.get(id);
  if (!audit) throw new HttpError(404, "Report not found.");
  db.publicAudits.attachEmail(id, email.toLowerCase());
  void notifyAdmin(`Audit lead: ${audit.domain}`, `<p>${esc(email)} requested the report for ${esc(audit.domain)} (score ${audit.overallScore}).</p>`);
  return NextResponse.json({ ok: true });
});
