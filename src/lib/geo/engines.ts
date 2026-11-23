import type { EngineId } from "@/lib/brand";

export type EngineAnswer = { text: string; citations: string[] };

const SYSTEM =
  "Answer the user's question the way an AI search assistant would: concise (4-6 sentences), recommend specific named brands or products where relevant, and name the websites you rely on.";

async function postJson(url: string, headers: Record<string, string>, body: unknown, timeoutMs = 45_000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      console.warn(`[engine] ${url} → HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
      return null;
    }
    return (await res.json()) as Record<string, unknown>;
  } catch (err) {
    console.warn(`[engine] ${url} failed`, (err as Error).message);
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function chatgpt(prompt: string): Promise<EngineAnswer | null> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  const data = await postJson(
    "https://api.openai.com/v1/chat/completions",
    { Authorization: `Bearer ${key}` },
    {
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: prompt },
      ],
    },
  );
  const text = (data?.choices as { message?: { content?: string } }[] | undefined)?.[0]?.message?.content;
  return text ? { text, citations: [] } : null;
}

async function perplexity(prompt: string): Promise<EngineAnswer | null> {
  const key = process.env.PERPLEXITY_API_KEY?.trim();
  if (!key) return null;
  const data = await postJson(
    "https://api.perplexity.ai/chat/completions",
    { Authorization: `Bearer ${key}` },
    {
      model: process.env.PERPLEXITY_MODEL ?? "sonar",
      messages: [{ role: "user", content: prompt }],
    },
  );
  const text = (data?.choices as { message?: { content?: string } }[] | undefined)?.[0]?.message?.content;
  const citations =
    (data?.citations as string[] | undefined) ??
    ((data?.search_results as { url?: string }[] | undefined)?.map((r) => r.url).filter(Boolean) as string[]) ??
    [];
  return text ? { text, citations } : null;
}

async function gemini(prompt: string): Promise<EngineAnswer | null> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return null;
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const data = await postJson(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    { "x-goog-api-key": key },
    {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      tools: [{ google_search: {} }],
    },
  );
  type Cand = {
    content?: { parts?: { text?: string }[] };
    groundingMetadata?: { groundingChunks?: { web?: { uri?: string; title?: string } }[] };
  };
  const cand = (data?.candidates as Cand[] | undefined)?.[0];
  const text = cand?.content?.parts?.map((p) => p.text ?? "").join("").trim();
  // Grounding URIs are redirect links; the title carries the source domain.
  const citations =
    cand?.groundingMetadata?.groundingChunks
      ?.map((c) => c.web?.title || c.web?.uri)
      .filter((x): x is string => !!x) ?? [];
  return text ? { text, citations } : null;
}

async function claude(prompt: string): Promise<EngineAnswer | null> {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) return null;
  const data = await postJson(
    "https://api.anthropic.com/v1/messages",
    { "x-api-key": key, "anthropic-version": "2023-06-01" },
    {
      model: process.env.ANTHROPIC_MODEL ?? "claude-haiku-5-5",
      max_tokens: 700,
      system: SYSTEM,
      messages: [{ role: "user", content: prompt }],
    },
  );
  const text = (data?.content as { type: string; text?: string }[] | undefined)
    ?.filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
  return text ? { text, citations: [] } : null;
}

/** Engines with a real connector. Engines missing here (or without a key) fall back to estimates. */
const CONNECTORS: Partial<Record<EngineId, (prompt: string) => Promise<EngineAnswer | null>>> = {
  chatgpt,
  perplexity,
  gemini,
  claude,
};

const KEY_ENV: Partial<Record<EngineId, string>> = {
  chatgpt: "OPENAI_API_KEY",
  perplexity: "PERPLEXITY_API_KEY",
  gemini: "GEMINI_API_KEY",
  claude: "ANTHROPIC_API_KEY",
};

export function isLiveEngine(engine: EngineId) {
  const env = KEY_ENV[engine];
  return !!env && !!process.env[env]?.trim();
}

export async function askEngine(engine: EngineId, prompt: string) {
  const fn = CONNECTORS[engine];
  if (!fn || !isLiveEngine(engine)) return null;
  return fn(prompt);
}

// ---------- Answer analysis ----------

const POSITIVE = /\b(best|top|leading|excellent|great|popular|recommended|trusted|reliable|powerful|standout|ideal|strong)\b/i;
const NEGATIVE = /\b(expensive|limited|lacks|lacking|poor|worse|complaints?|issues?|downside|drawback|outdated|not recommended|avoid)\b/i;

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function bareDomain(d: string) {
  return d.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
}

function firstIndex(text: string, needles: string[]) {
  let best = -1;
  for (const n of needles) {
    if (!n || n.length < 2) continue;
    const m = new RegExp(`(^|[^a-z0-9])${escapeRe(n.toLowerCase())}([^a-z0-9]|$)`, "i").exec(text);
    if (m && (best < 0 || m.index < best)) best = m.index;
  }
  return best;
}

export function analyzeAnswer(
  answer: EngineAnswer,
  brand: { name: string; domain: string; competitors: string[] },
) {
  const text = answer.text;
  const lower = text.toLowerCase();
  const domain = bareDomain(brand.domain);
  const domainRoot = domain.split(".")[0];
  const brandIdx = firstIndex(lower, [brand.name, domain, domainRoot.length > 3 ? domainRoot : ""]);

  const urlDomains = [...text.matchAll(/https?:\/\/([^\s/)\]>"']+)/gi)].map((m) => bareDomain(m[1]));
  const looseDomains = [...lower.matchAll(/\b([a-z0-9-]+\.(?:com|io|ai|co|org|net|app|dev|in|so))\b/g)].map((m) => m[1]);
  const citationDomains = answer.citations.map((c) => bareDomain(c));
  const sources = [...new Set([...citationDomains, ...urlDomains, ...looseDomains])].filter(Boolean).slice(0, 8);
  const cited = sources.some((s) => s === domain || s.endsWith(`.${domain}`));
  // Being used as a source counts as visibility even when the answer text doesn't name the brand.
  const mentioned = brandIdx >= 0 || cited;

  const compHits = brand.competitors
    .map((c) => ({ name: c, idx: firstIndex(lower, [c]) }))
    .filter((c) => c.idx >= 0);
  const position = brandIdx >= 0 ? 1 + compHits.filter((c) => c.idx < brandIdx).length : null;

  let sentiment: "positive" | "neutral" | "negative" | null = null;
  if (brandIdx >= 0) {
    const window = text.slice(Math.max(0, brandIdx - 160), brandIdx + 240);
    const pos = POSITIVE.test(window);
    const neg = NEGATIVE.test(window);
    sentiment = neg && !pos ? "negative" : pos && !neg ? "positive" : "neutral";
  }

  return {
    mentioned,
    cited,
    position,
    sentiment,
    competitorsMentioned: compHits.map((c) => c.name),
    sources,
  };
}
