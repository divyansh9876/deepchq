import { NextRequest, NextResponse } from "next/server";
import { dbClient } from "@/lib/db";
import { getReport, getSearch, listSources } from "@/lib/search/store";
import { getSessionUser, hasPaidAccess } from "@/lib/auth/session";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const search = await getSearch(id);
  if (!search) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const artifact = dbClient.artifacts.getFirst(id);
  const user = await getSessionUser();
  const forceUnlock =
    req.nextUrl.searchParams.get("unlocked") === "true" ||
    req.nextUrl.searchParams.get("checkout") === "success";
  const unlocked =
    Boolean(artifact?.unlocked) ||
    forceUnlock ||
    Boolean(user && hasPaidAccess(user.planTier));

  const report = await getReport(id, false);
  const sourceRows = await listSources(id);

  const preview = report
    ? {
        ...report,
        sections: report.sections.map((s) => ({
          ...s,
          items: s.items.map((item) => ({
            ...item,
            text: unlocked ? item.text : blurText(item.text),
          })),
        })),
        aiSummary: unlocked ? report.aiSummary : blurText(report.aiSummary ?? ""),
      }
    : null;

  return NextResponse.json({
    search,
    report: preview,
    sources: unlocked
      ? sourceRows
      : sourceRows.map((s) => ({ ...s, snippet: blurText(s.snippet ?? "") })),
    locked: !unlocked,
  });
}

function blurText(text: string): string {
  if (text.length <= 4) return "••••";
  return text.slice(0, 3) + "•".repeat(Math.min(12, text.length - 3));
}
