import { AI_ENGINES, type EngineId } from "@/lib/brand";
import { db } from "@/lib/db/client";
import { button, esc, layout, sendEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/env";
import { runGeoAudit } from "@/lib/geo/audit";
import { computeBrandMetrics, visibilityLabel } from "@/lib/geo/metrics";
import { generateRecommendations } from "@/lib/geo/recommendations";
import { runVisibilityScan } from "@/lib/geo/scan";
import { engineAllowed, limitsFor } from "@/lib/plans";
import type { Brand, User } from "@/lib/types";

const DAY = 86400_000;

export function enginesFor(user: User): EngineId[] {
  const limits = limitsFor(user);
  return AI_ENGINES.map((e) => e.id).filter((id) => engineAllowed(limits, id));
}

function refreshRecommendations(brand: Brand) {
  const prompts = db.prompts.list(brand.id);
  const scans = db.scanResults.latestPerPromptEngine(brand.id);
  const audit = db.audits.latest(brand.id);
  const metrics = computeBrandMetrics(brand, scans, prompts.length);
  const recs = generateRecommendations(brand, metrics, prompts, scans, audit);
  db.recommendations.replaceForBrand(brand.id, recs);
  return { metrics, recs };
}

export async function auditBrand(brand: Brand) {
  const audit = await runGeoAudit(brand.id, brand.domain);
  db.audits.create(audit);
  db.brands.update(brand.id, { lastAuditAt: audit.createdAt });
  refreshRecommendations(brand);
  return audit;
}

export async function scanBrand(brand: Brand, user: User) {
  const limits = limitsFor(user);
  const prompts = db.prompts.list(brand.id).slice(0, limits.prompts);
  if (!prompts.length) return null;
  const before = db.scanResults.history(brand.id, 1)[0] ?? null;
  const results = await runVisibilityScan(brand, prompts, enginesFor(user));
  db.scanResults.createMany(results);
  db.brands.update(brand.id, { lastScanAt: new Date() });
  const { metrics, recs } = refreshRecommendations(brand);
  return { scanned: results.length, metrics, recommendations: recs.length, previous: before };
}

/** Full automated cycle for one brand: re-audit when stale, scan, regenerate the action plan. */
export async function runBrandCycle(brand: Brand, user: User) {
  const auditStale = !brand.lastAuditAt || Date.now() - brand.lastAuditAt.getTime() > 7 * DAY;
  if (auditStale) await auditBrand(brand).catch((e) => console.warn("[cycle] audit failed", brand.id, e));
  return scanBrand(db.brands.get(brand.id) ?? brand, user);
}

function isDue(brand: Brand, user: User) {
  if (brand.autoScan === false) return false;
  const every = limitsFor(user).scanEveryDays * DAY;
  return !brand.lastScanAt || Date.now() - brand.lastScanAt.getTime() >= every - 60 * 60_000;
}

async function sendDigest(user: User, brands: Brand[]) {
  if (user.digestEnabled === false || !brands.length) return;
  const rows = brands
    .map((b) => {
      const hist = db.scanResults.history(b.id, 2);
      const cur = hist.at(-1);
      const prev = hist.length > 1 ? hist[0] : null;
      if (!cur) return "";
      const delta = prev ? cur.visibilityRate - prev.visibilityRate : 0;
      const arrow = delta > 0 ? `<span style="color:#059669">▲ ${delta} pts</span>` : delta < 0 ? `<span style="color:#dc2626">▼ ${-delta} pts</span>` : `<span style="color:#64748b">no change</span>`;
      const top = db.recommendations.list(b.id).find((r) => r.status !== "done");
      return `<tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9"><b>${esc(b.name)}</b><br><span style="color:#64748b;font-size:13px">${esc(b.domain)}</span></td>
<td style="padding:10px 0;border-bottom:1px solid #f1f5f9;text-align:right"><b>${cur.visibilityRate}%</b> ${visibilityLabel(cur.visibilityRate)}<br><span style="font-size:13px">${arrow}</span></td></tr>
${top ? `<tr><td colspan="2" style="padding:4px 0 14px;color:#475569;font-size:13px">Next action: ${esc(top.title)}</td></tr>` : ""}`;
    })
    .join("");
  if (!rows) return;
  await sendEmail({
    to: user.email,
    subject: `Your AI search visibility report — ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    html: layout(
      "Your latest AI visibility scan",
      `<p style="color:#475569;margin:0 0 12px">We re-scanned your tracked prompts automatically. Here is where you stand:</p>
<table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>
${button(`${SITE_URL}/dashboard`, "Open full report")}`,
    ),
  });
  db.users.update(user.id, { lastDigestAt: new Date() });
}

async function handleTrials(user: User) {
  if (!user.trialEndsAt || user.subscriptionStatus || user.planTier === "free") return;
  const left = user.trialEndsAt.getTime() - Date.now();
  if (left <= 0) {
    db.users.update(user.id, { planTier: "free", trialEndsAt: null });
    await sendEmail({
      to: user.email,
      subject: "Your Deepchq trial has ended",
      html: layout(
        "Your trial ended — your data is safe",
        `<p style="color:#475569">You're now on the free plan (1 brand, 5 prompts, 3 engines). Upgrade any time to keep weekly scans across all six engines.</p>${button(`${SITE_URL}/settings`, "Choose a plan")}`,
      ),
    });
  } else if (left < 3 * DAY && left > 2 * DAY) {
    await sendEmail({
      to: user.email,
      subject: "3 days left in your Deepchq trial",
      html: layout(
        "3 days left in your trial",
        `<p style="color:#475569">Keep weekly scans, all six engines and competitor share of voice by picking a plan before your trial ends.</p>${button(`${SITE_URL}/settings`, "Upgrade now")}`,
      ),
    });
  }
}

let running = false;

/** The scheduled job. Safe to call often: it only does work that is due. */
export async function runDueWork() {
  if (running) return { skipped: true };
  running = true;
  const started = Date.now();
  let scanned = 0;
  let failed = 0;
  try {
    for (const user of db.users.all()) {
      await handleTrials(user).catch((e) => console.warn("[cron] trial", user.id, e));
      const fresh = db.users.get(user.id)!;
      const brands = db.brands.list(user.id).slice(0, limitsFor(fresh).brands);
      const done: Brand[] = [];
      for (const brand of brands) {
        if (!isDue(brand, fresh)) continue;
        try {
          const r = await runBrandCycle(brand, fresh);
          if (r) {
            scanned += 1;
            done.push(brand);
          }
        } catch (e) {
          failed += 1;
          console.warn("[cron] brand cycle failed", brand.id, e);
        }
      }
      if (done.length) await sendDigest(fresh, done).catch((e) => console.warn("[cron] digest", e));
    }
    db.scanResults.prune(new Date(Date.now() - 400 * DAY));
    db.meta.set({ lastCronAt: new Date().toISOString() });
    return { skipped: false, scanned, failed, ms: Date.now() - started };
  } finally {
    running = false;
  }
}
