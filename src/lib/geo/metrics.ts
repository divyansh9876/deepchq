import { AI_ENGINES, type EngineId } from "@/lib/brand";
import type { Brand, BrandMetrics, ScanResult } from "@/lib/types";

export function computeBrandMetrics(
  brand: Brand,
  scans: ScanResult[],
  promptCount: number,
): BrandMetrics {
  const latest = scans;
  const total = latest.length || 1;
  const mentionCount = latest.filter((s) => s.mentioned).length;
  const citationCount = latest.filter((s) => s.cited).length;

  const engineBreakdown = Object.fromEntries(
    AI_ENGINES.map((e) => {
      const rows = latest.filter((s) => s.engine === e.id);
      return [
        e.id,
        {
          total: rows.length,
          mentions: rows.filter((r) => r.mentioned).length,
          citations: rows.filter((r) => r.cited).length,
        },
      ];
    }),
  ) as BrandMetrics["engineBreakdown"];

  const compMap = new Map<string, number>();
  for (const s of latest) {
    for (const c of s.competitorsMentioned) {
      compMap.set(c, (compMap.get(c) ?? 0) + 1);
    }
  }
  if (mentionCount > 0) {
    compMap.set(brand.name, mentionCount);
  }

  const competitorShare = [...compMap.entries()]
    .map(([name, mentions]) => ({ name, mentions }))
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 8);

  return {
    visibilityRate: Math.round((mentionCount / total) * 100),
    citationRate: Math.round((citationCount / total) * 100),
    mentionCount,
    promptCount,
    engineBreakdown,
    competitorShare,
  };
}

export function visibilityLabel(rate: number): string {
  if (rate >= 70) return "Strong";
  if (rate >= 40) return "Moderate";
  if (rate >= 15) return "Emerging";
  return "Low";
}

export function engineName(id: EngineId): string {
  return AI_ENGINES.find((e) => e.id === id)?.name ?? id;
}
