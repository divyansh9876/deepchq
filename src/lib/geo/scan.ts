import { AI_ENGINES, type EngineId } from "@/lib/brand";
import { newId } from "@/lib/id";
import type { Brand, Prompt, ScanResult } from "@/lib/types";

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

async function queryOpenAI(
  prompt: string,
  brand: Brand,
): Promise<{ answer: string; mentioned: boolean; cited: boolean; competitors: string[] } | null> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are simulating an AI search engine answer. Be concise (3-5 sentences). Mention real brands when relevant. If you cite a website, include the domain.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const answer = data.choices?.[0]?.message?.content ?? "";
  const lower = answer.toLowerCase();
  const brandLower = brand.name.toLowerCase();
  const domainLower = brand.domain.replace(/^https?:\/\//, "").toLowerCase();

  const mentioned =
    lower.includes(brandLower) ||
    (domainLower.length > 3 && lower.includes(domainLower.split("/")[0]));

  const cited =
    mentioned &&
    (lower.includes(domainLower) || lower.includes(domainLower.split("/")[0]));

  const competitors = brand.competitors.filter((c) =>
    lower.includes(c.toLowerCase()),
  );

  return { answer, mentioned, cited, competitors };
}

function simulateEngine(
  brand: Brand,
  prompt: Prompt,
  engine: EngineId,
  openAiAnswer?: string,
): Omit<ScanResult, "id" | "createdAt"> {
  const rand = seeded(`${brand.id}:${prompt.id}:${engine}:${prompt.text}`);
  const baseMention = rand() > 0.55 ? 1 : 0;
  const domainBoost = brand.domain ? 0.15 : 0;
  const brandedPrompt = prompt.text.toLowerCase().includes(brand.name.toLowerCase());
  const mentionChance = brandedPrompt ? 0.85 : baseMention + domainBoost;
  const mentioned = openAiAnswer
    ? openAiAnswer.toLowerCase().includes(brand.name.toLowerCase())
    : rand() < mentionChance;

  const cited = mentioned && (rand() < 0.6 || brandedPrompt);
  const competitorsMentioned = brand.competitors.filter(() => rand() > 0.6);

  const sentiments: ScanResult["sentiment"][] = ["positive", "neutral", "negative"];
  const sentiment = mentioned ? sentiments[Math.floor(rand() * 2)] : null;

  const snippet = openAiAnswer
    ? openAiAnswer.slice(0, 280)
    : mentioned
      ? `${brand.name} is often recommended for this query on ${engine}. Users cite ${brand.domain} as a trusted source.`
      : `Top results highlight ${competitorsMentioned[0] ?? "industry leaders"}. ${brand.name} was not prominently featured in this ${engine} answer.`;

  const sources = cited
    ? [brand.domain, ...competitorsMentioned.map((c) => `${c.toLowerCase()}.com`)].slice(0, 3)
    : competitorsMentioned.map((c) => `${c.toLowerCase()}.com`).slice(0, 2);

  return {
    brandId: brand.id,
    promptId: prompt.id,
    engine,
    mentioned,
    cited,
    position: mentioned ? Math.max(1, Math.ceil(rand() * 5)) : null,
    sentiment,
    competitorsMentioned,
    sources,
    answerSnippet: snippet,
  };
}

export async function runVisibilityScan(
  brand: Brand,
  prompts: Prompt[],
): Promise<ScanResult[]> {
  const results: ScanResult[] = [];
  const now = new Date();

  for (const prompt of prompts) {
    let openAi: Awaited<ReturnType<typeof queryOpenAI>> = null;
    if (process.env.OPENAI_API_KEY) {
      openAi = await queryOpenAI(prompt.text, brand);
    }

    for (const engine of AI_ENGINES) {
      const row = simulateEngine(
        brand,
        prompt,
        engine.id,
        engine.id === "chatgpt" ? openAi?.answer : undefined,
      );

      if (engine.id === "chatgpt" && openAi) {
        row.mentioned = openAi.mentioned;
        row.cited = openAi.cited;
        row.competitorsMentioned = openAi.competitors;
        row.answerSnippet = openAi.answer.slice(0, 280);
      }

      results.push({
        ...row,
        id: newId("scan"),
        createdAt: now,
      });
    }
  }

  return results;
}
