import { requireBrand } from "@/lib/auth/guard";
import { db } from "@/lib/db/client";
import { engineName } from "@/lib/geo/metrics";
import { HttpError, route } from "@/lib/http";
import { limitsFor } from "@/lib/plans";

type Ctx = { params: Promise<{ id: string }> };

function cell(v: unknown) {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@]/.test(s)) s = `'${s}`; // block spreadsheet formula injection
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export const GET = route<Ctx>(async (_req, { params }) => {
  const { user, brand } = await requireBrand((await params).id);
  if (!limitsFor(user).csvExport) throw new HttpError(402, "CSV export is on Growth and Agency plans.", { upgrade: true });
  const prompts = new Map(db.prompts.list(brand.id).map((p) => [p.id, p]));
  const header = ["date", "prompt", "stage", "engine", "data", "mentioned", "cited", "position", "sentiment", "competitors", "sources", "answer"];
  const rows = db.scanResults.list(brand.id).map((s) => [
    s.createdAt.toISOString(),
    prompts.get(s.promptId)?.text ?? "",
    prompts.get(s.promptId)?.stage ?? "",
    engineName(s.engine),
    s.live ? "live" : "estimated",
    s.mentioned ? "yes" : "no",
    s.cited ? "yes" : "no",
    s.position ?? "",
    s.sentiment ?? "",
    s.competitorsMentioned.join("; "),
    s.sources.join("; "),
    s.answerSnippet,
  ]);
  const csv = [header, ...rows].map((r) => r.map(cell).join(",")).join("\n");
  const file = `${brand.domain.replace(/[^a-z0-9.-]/gi, "_")}-ai-visibility.csv`;
  return new Response(csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${file}"` },
  });
});
