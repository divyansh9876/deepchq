import { AI_ENGINES, type EngineId } from "@/lib/brand";
import { newId } from "@/lib/id";
import type { Brand, Prompt, ScanResult } from "@/lib/types";
import { analyzeAnswer, askEngine, bareDomain } from "@/lib/geo/engines";

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function seeded(seed: string) {
  let n = hash(seed);
  return () => {
    n = (n * 1664525 + 1013904223) >>> 0;
    return n / 0xffffffff;
  };
}

/**
 * Deterministic estimate used when an engine has no live connector or API key.
 * Rows produced here are flagged live=false and labelled "Estimated" in the UI.
 */
function estimate(brand: Brand, prompt: Prompt, engine: EngineId, liveSignal: number | null) {
  const week = Math.floor(Date.now() / (7 * 86400_000));
  const rand = seeded(`${brand.id}:${prompt.id}:${engine}:${week}`);
  const branded = prompt.text.toLowerCase().includes(brand.name.toLowerCase());
  // Lean on what the live engines saw for this prompt, when we have it.
  const base = liveSignal ?? 0.35;
  const chance = branded ? 0.85 : Math.min(0.9, base * 0.7 + rand() * 0.3);
  const mentioned = rand() < chance;
  const cited = mentioned && (branded || rand() < 0.5);
  const competitorsMentioned = brand.competitors.filter(() => rand() > 0.55);
  const domain = bareDomain(brand.domain);
  const engineName = AI_ENGINES.find((e) => e.id === engine)?.name ?? engine;

  return {
    mentioned,
    cited,
    position: mentioned ? 1 + Math.floor(rand() * Math.min(3, competitorsMentioned.length + 1)) : null,
    sentiment: mentioned ? (rand() > 0.35 ? "positive" : "neutral") : null,
    competitorsMentioned,
    sources: cited ? [domain] : [],
    answerSnippet: mentioned
      ? `Estimated: ${brand.name} is likely to appear in ${engineName} answers for this prompt. Connect a live API key for the exact answer.`
      : `Estimated: ${engineName} likely favors ${competitorsMentioned[0] ?? "other brands"} here. Connect a live API key for the exact answer.`,
    live: false,
  } satisfies Partial<ScanResult>;
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    }),
  );
  return out;
}

export async function runVisibilityScan(brand: Brand, prompts: Prompt[], engines: EngineId[]): Promise<ScanResult[]> {
  const runId = newId("run");
  const now = new Date();

  const perPrompt = await mapLimit(prompts, 3, async (prompt) => {
    const live = await Promise.all(
      engines.map(async (engine) => ({ engine, answer: await askEngine(engine, prompt.text) })),
    );
    const liveRows = live
      .filter((l) => l.answer)
      .map((l) => ({ engine: l.engine, ...analyzeAnswer(l.answer!, brand), answerSnippet: l.answer!.text.slice(0, 600), live: true }));
    const liveSignal = liveRows.length ? liveRows.filter((r) => r.mentioned).length / liveRows.length : null;

    return engines.map((engine): ScanResult => {
      const row = liveRows.find((r) => r.engine === engine) ?? { engine, ...estimate(brand, prompt, engine, liveSignal) };
      return {
        id: newId("scan"),
        runId,
        brandId: brand.id,
        promptId: prompt.id,
        engine,
        mentioned: row.mentioned,
        cited: row.cited,
        position: row.position,
        sentiment: row.sentiment as ScanResult["sentiment"],
        competitorsMentioned: row.competitorsMentioned,
        sources: row.sources,
        answerSnippet: row.answerSnippet,
        live: row.live,
        createdAt: now,
      };
    });
  });

  return perPrompt.flat();
}
