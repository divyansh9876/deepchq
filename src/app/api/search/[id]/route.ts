import { NextRequest, NextResponse } from "next/server";
import { dbClient } from "@/lib/db";
import { getReport, getSearch, listSources } from "@/lib/search/store";
import { getSessionUser, hasPaidAccess } from "@/lib/auth/session";
import type { SocialProfile } from "@/lib/types";

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

  const allSocial = report?.socialProfiles ?? [];
  const allPaa = report?.peopleAlsoAsk ?? [];

  const preview = report
    ? {
        ...report,
        biography: unlocked
          ? report.biography
          : teaserText(report.biography ?? report.aiSummary ?? "", 420),
        socialProfiles: unlocked
          ? report.socialProfiles
          : allSocial.slice(0, 3).map((s, i) => previewSocialProfile(s, i)),
        peopleAlsoAsk: unlocked ? report.peopleAlsoAsk : allPaa.slice(0, 1),
        sections: report.sections.map((s) => ({
          ...s,
          items: s.items.map((item, idx) => ({
            ...item,
            text:
              unlocked
                ? item.text
                : idx === 0
                  ? item.text
                  : blurText(item.text),
          })),
        })),
        aiSummary: unlocked ? report.aiSummary : undefined,
      }
    : null;

  return NextResponse.json({
    search,
    report: preview,
    sources: unlocked
      ? sourceRows
      : sourceRows.map((s) => ({ ...s, snippet: blurText(s.snippet ?? "") })),
    locked: !unlocked,
    previewMeta:
      !unlocked && report
        ? {
            hiddenSocialCount: Math.max(0, allSocial.length - 3),
            hiddenPaaCount: Math.max(0, allPaa.length - 1),
            totalSocialCount: allSocial.length,
            totalPaaCount: allPaa.length,
          }
        : null,
  });
}

function blurText(text: string): string {
  if (text.length <= 4) return "••••";
  return text.slice(0, 3) + "•".repeat(Math.min(12, text.length - 3));
}

function teaserText(text: string, max: number): string {
  if (!text || text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = lastSpace > 180 ? cut.slice(0, lastSpace) : cut;
  return `${trimmed}…`;
}

function previewSocialProfile(s: SocialProfile, index: number): SocialProfile {
  if (index === 0) return s;
  if (index === 1) {
    const handle = s.handle ?? "";
    const visible = Math.min(4, handle.length);
    const masked =
      handle.length <= visible
        ? handle
        : handle.slice(0, visible) +
          "•".repeat(Math.min(8, Math.max(2, handle.length - visible)));
    return { ...s, handle: masked, url: "#" };
  }
  return { ...s, handle: "••••••", url: "#" };
}
