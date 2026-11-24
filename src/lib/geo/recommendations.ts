import { newId } from "@/lib/id";
import { engineName } from "@/lib/geo/metrics";
import type { Brand, BrandMetrics, GeoAudit, Prompt, Recommendation, ScanResult } from "@/lib/types";

export function generateRecommendations(
  brand: Brand,
  metrics: BrandMetrics,
  prompts: Prompt[],
  scans: ScanResult[],
  audit: GeoAudit | null,
): Recommendation[] {
  const recs: Recommendation[] = [];
  const now = new Date();

  const add = (
    partial: Omit<Recommendation, "id" | "brandId" | "createdAt" | "status">,
  ) => {
    recs.push({
      ...partial,
      id: newId("rec"),
      brandId: brand.id,
      status: "todo",
      createdAt: now,
    });
  };

  if (prompts.length < 10) {
    add({
      type: "prompts",
      area: "general",
      impact: "high",
      engine: "all",
      title: "Add more tracking prompts",
      description: `You have ${prompts.length} prompts. Aim for 15+ per market to cover TOFU, MOFU, and BOFU queries.`,
    });
  }

  const brandedCount = prompts.filter((p) =>
    p.text.toLowerCase().includes(brand.name.toLowerCase()),
  ).length;
  if (brandedCount > prompts.length * 0.3) {
    add({
      type: "prompts",
      area: "general",
      impact: "medium",
      engine: "all",
      title: "Balance branded vs unbranded prompts",
      description:
        "Over 30% of prompts are branded. Add more category queries (e.g. 'best X for Y') to measure true discovery.",
    });
  }

  if (metrics.visibilityRate < 30) {
    add({
      type: "content",
      area: "on-page",
      impact: "high",
      engine: "all",
      title: "Create authoritative comparison content",
      description: `Visibility is ${metrics.visibilityRate}%. Publish in-depth guides that answer top prompts and cite ${brand.domain}.`,
    });
  }

  const topCompetitor = metrics.competitorShare.find((c) => c.name !== brand.name);
  if (topCompetitor && topCompetitor.mentions > metrics.mentionCount) {
    add({
      type: "content",
      area: "off-page",
      impact: "high",
      engine: "chatgpt",
      title: `Close gap vs ${topCompetitor.name}`,
      description: `${topCompetitor.name} appears in more AI answers. Create content targeting the same prompts with stronger E-E-A-T signals.`,
    });
  }

  const promptText = new Map(prompts.map((p) => [p.id, p.text]));
  const lost = scans
    .filter((s) => !s.mentioned && s.competitorsMentioned.length > 0)
    .sort((a, b) => Number(b.live ?? false) - Number(a.live ?? false));
  const seenPrompts = new Set<string>();
  for (const scan of lost) {
    if (seenPrompts.has(scan.promptId) || seenPrompts.size >= 3) continue;
    seenPrompts.add(scan.promptId);
    const q = promptText.get(scan.promptId) ?? "a tracked prompt";
    add({
      type: "content",
      area: "on-page",
      impact: "medium",
      engine: scan.engine,
      title: `Win "${q.length > 60 ? `${q.slice(0, 57)}…` : q}" on ${engineName(scan.engine)}`,
      description: `${engineName(scan.engine)} names ${scan.competitorsMentioned.join(", ")} but not ${brand.name}. Publish a page that answers this question directly, compares options honestly, and is linked from your homepage.`,
    });
  }

  if (audit) {
    for (const c of audit.checks.filter((x) => x.status !== "pass" && x.impact === "high").slice(0, 4)) {
      add({
        type: "crawlability",
        area: "on-page",
        impact: "high",
        engine: "all",
        title: `Fix: ${c.label}`,
        description: c.fix ? `${c.detail} ${c.fix}` : c.detail,
      });
    }
    if (audit.overallScore < 60) {
      add({
        type: "crawlability",
        area: "on-page",
        impact: "high",
        engine: "all",
        title: "Improve GEO audit score",
        description: `Site scores ${audit.overallScore}/100. Fix crawlability and schema issues before scaling content.`,
      });
    }
  } else {
    add({
      type: "crawlability",
      area: "on-page",
      impact: "high",
      engine: "all",
      title: "Run a GEO audit",
      description: `Audit ${brand.domain} to verify AI crawlers can read and cite your content.`,
    });
  }

  if (metrics.citationRate < metrics.visibilityRate - 10) {
    add({
      type: "content",
      area: "on-page",
      impact: "medium",
      engine: "perplexity",
      title: "Convert mentions into citations",
      description:
        "Brand is mentioned but not cited. Add clear source-worthy pages with stats, definitions, and structured data.",
    });
  }

  return recs.slice(0, 15);
}
