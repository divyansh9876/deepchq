import { newId } from "@/lib/id";
import { safeFetchText } from "@/lib/net/safe-fetch";
import type { AuditCheck, GeoAudit } from "@/lib/types";

/** Crawlers that fetch pages to answer a live question or build an AI search index. */
export const AI_SEARCH_BOTS = ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Claude-SearchBot", "Googlebot", "Bingbot"];
/** Crawlers that collect training data. Blocking them is a policy choice, not a visibility bug. */
export const AI_TRAINING_BOTS = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot"];

type RobotsGroup = { agents: string[]; rules: { allow: boolean; path: string }[] };

export function parseRobots(txt: string): { groups: RobotsGroup[]; sitemaps: string[] } {
  const groups: RobotsGroup[] = [];
  const sitemaps: string[] = [];
  let cur: RobotsGroup | null = null;
  let lastWasAgent = false;
  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const val = line.slice(idx + 1).trim();
    if (key === "user-agent") {
      if (!cur || !lastWasAgent) {
        cur = { agents: [], rules: [] };
        groups.push(cur);
      }
      cur.agents.push(val.toLowerCase());
      lastWasAgent = true;
    } else if (key === "allow" || key === "disallow") {
      lastWasAgent = false;
      if (cur && (val || key === "allow")) cur.rules.push({ allow: key === "allow", path: val });
    } else if (key === "sitemap") {
      sitemaps.push(val);
    }
  }
  return { groups, sitemaps };
}

/** Is the site root blocked for this user agent? Uses the most specific matching group, then `*`. */
export function rootBlocked(robots: ReturnType<typeof parseRobots>, bot: string): boolean {
  const b = bot.toLowerCase();
  const specific = robots.groups.filter((g) => g.agents.some((a) => a !== "*" && b.includes(a)));
  const group = specific[0] ?? robots.groups.find((g) => g.agents.includes("*"));
  if (!group) return false;
  let best: { allow: boolean; len: number } | null = null;
  for (const r of group.rules) {
    if (r.path === "" || !"/".startsWith(r.path.replace(/\*$/, "").replace(/\$$/, "")) ) continue;
    const len = r.path.length;
    if (!best || len > best.len || (len === best.len && r.allow)) best = { allow: r.allow, len };
  }
  return !!best && !best.allow;
}

function check(
  label: string,
  status: AuditCheck["status"],
  impact: AuditCheck["impact"],
  detail: string,
  fix?: string,
  guide?: string,
): AuditCheck {
  return { id: newId("chk"), label, status, impact, detail, fix, guide };
}

function visibleText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function jsonLdTypes(html: string): string[] {
  const types: string[] = [];
  const re = /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    try {
      const walk = (node: unknown) => {
        if (Array.isArray(node)) return node.forEach(walk);
        if (node && typeof node === "object") {
          const o = node as Record<string, unknown>;
          const t = o["@type"];
          if (typeof t === "string") types.push(t);
          if (Array.isArray(t)) types.push(...t.filter((x): x is string => typeof x === "string"));
          if (o["@graph"]) walk(o["@graph"]);
          if (o.mainEntity) walk(o.mainEntity);
        }
      };
      walk(JSON.parse(m[1].trim()));
    } catch {
      types.push("(invalid JSON-LD)");
    }
  }
  return types;
}

const WEIGHT = { high: 3, medium: 2, low: 1 } as const;
const CREDIT = { pass: 1, warn: 0.5, fail: 0 } as const;

function score(checks: AuditCheck[]) {
  if (!checks.length) return 0;
  const max = checks.reduce((s, c) => s + WEIGHT[c.impact], 0);
  const got = checks.reduce((s, c) => s + WEIGHT[c.impact] * CREDIT[c.status], 0);
  return Math.round((got / max) * 100);
}

export function normalizeUrl(input: string) {
  const trimmed = input.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export async function runGeoAudit(brandId: string, url: string): Promise<GeoAudit> {
  const normalized = normalizeUrl(url);
  const origin = new URL(normalized).origin;

  const [page, robotsRes, llmsRes] = await Promise.all([
    safeFetchText(normalized),
    safeFetchText(`${origin}/robots.txt`, { maxBytes: 500_000 }),
    safeFetchText(`${origin}/llms.txt`, { maxBytes: 500_000 }),
  ]);

  const html = page && page.status < 400 ? page.text : null;
  const robotsTxt = robotsRes && robotsRes.status < 400 && !/<html/i.test(robotsRes.text) ? robotsRes.text : null;
  const llmsTxt = llmsRes && llmsRes.status < 400 && !/<html/i.test(llmsRes.text.slice(0, 500)) ? llmsRes.text : null;

  const crawl: AuditCheck[] = [];
  const content: AuditCheck[] = [];

  // ---- Crawlability ----
  if (!html) {
    crawl.push(
      check(
        "Page reachable",
        "fail",
        "high",
        page ? `Homepage returned HTTP ${page.status}.` : "We could not fetch the homepage (timeout, DNS, or blocked bot).",
        "Make sure the URL loads without login and does not block unknown user agents with a firewall rule.",
      ),
    );
  } else {
    crawl.push(check("Page reachable", "pass", "high", `Homepage loads (HTTP ${page!.status}).`));
  }

  const finalUrl = page?.url ?? normalized;
  crawl.push(
    finalUrl.startsWith("https://")
      ? check("HTTPS", "pass", "medium", "Served over HTTPS.")
      : check("HTTPS", "fail", "medium", "Page is not served over HTTPS.", "Redirect all HTTP traffic to HTTPS."),
  );

  let sitemapListed = false;
  if (!robotsTxt) {
    crawl.push(
      check(
        "robots.txt",
        "warn",
        "medium",
        "No robots.txt found. Crawlers will assume everything is allowed, but you lose control and a sitemap hint.",
        "Add /robots.txt with explicit rules for AI crawlers and a Sitemap: line.",
        "ai-crawlers-robots-txt",
      ),
    );
  } else {
    const robots = parseRobots(robotsTxt);
    sitemapListed = robots.sitemaps.length > 0;
    crawl.push(check("robots.txt", "pass", "medium", "robots.txt found."));

    const blockedSearch = AI_SEARCH_BOTS.filter((b) => rootBlocked(robots, b));
    crawl.push(
      blockedSearch.length === 0
        ? check("AI search crawlers allowed", "pass", "high", `Allowed: ${AI_SEARCH_BOTS.join(", ")}.`)
        : check(
            "AI search crawlers allowed",
            blockedSearch.length >= 3 ? "fail" : "warn",
            "high",
            `Blocked at the site root: ${blockedSearch.join(", ")}. These bots fetch pages to answer live questions, so blocking them removes you from those answers.`,
            `Add "User-agent: ${blockedSearch[0]}" followed by "Allow: /" to robots.txt (repeat for each).`,
            "ai-crawlers-robots-txt",
          ),
    );

    const blockedTraining = AI_TRAINING_BOTS.filter((b) => rootBlocked(robots, b));
    crawl.push(
      blockedTraining.length === 0
        ? check("AI training crawlers", "pass", "low", "Training crawlers (GPTBot, ClaudeBot, Google-Extended…) are allowed.")
        : check(
            "AI training crawlers",
            "warn",
            "low",
            `Blocked: ${blockedTraining.join(", ")}. That is a valid policy choice, but models trained without your pages know less about your brand.`,
            "Decide deliberately. If brand awareness in model memory matters, allow GPTBot and ClaudeBot on marketing pages.",
            "ai-crawlers-robots-txt",
          ),
    );
  }

  if (html && /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) {
    crawl.push(
      check(
        "Indexable",
        "fail",
        "high",
        "The page has a meta robots noindex tag, so search and AI engines are told to drop it.",
        "Remove noindex from pages you want cited.",
      ),
    );
  } else if (html) {
    crawl.push(check("Indexable", "pass", "high", "No noindex directive on the page."));
  }

  if (!sitemapListed) {
    const sm = await safeFetchText(`${origin}/sitemap.xml`, { maxBytes: 300_000 });
    sitemapListed = !!sm && sm.status < 400 && /<(urlset|sitemapindex)/i.test(sm.text);
  }
  crawl.push(
    sitemapListed
      ? check("XML sitemap", "pass", "medium", "Sitemap found — crawlers can discover every page.")
      : check(
          "XML sitemap",
          "warn",
          "medium",
          "No sitemap at /sitemap.xml or in robots.txt.",
          "Publish /sitemap.xml with lastmod dates and reference it from robots.txt.",
        ),
  );

  crawl.push(
    llmsTxt
      ? check("llms.txt", "pass", "low", "llms.txt found — a curated map of your key pages for LLM tools.")
      : check(
          "llms.txt",
          "warn",
          "low",
          "No /llms.txt. It is an emerging convention (not yet a ranking factor for major engines) that helps agents and IDE assistants find your best content.",
          "Generate one with our free llms.txt generator and host it at the site root.",
          "llms-txt-guide",
        ),
  );

  // ---- Content & entity signals ----
  if (html) {
    const text = visibleText(html);
    const words = text ? text.split(" ").length : 0;
    const scriptBytes = (html.match(/<script[\s\S]*?<\/script>/gi) ?? []).join("").length;
    const types = jsonLdTypes(html);
    const h1s = (html.match(/<h1[\s>]/gi) ?? []).length;
    const subheads = (html.match(/<h[23][\s>]/gi) ?? []).length;

    content.push(
      /<title[^>]*>[^<]{5,}<\/title>/i.test(html)
        ? check("Title tag", "pass", "medium", "Page has a descriptive <title>.")
        : check("Title tag", "fail", "high", "Missing or empty <title>.", "Write a title that names the brand and what it does."),
    );
    content.push(
      /<meta[^>]+name=["']description["'][^>]+content=["'][^"']{50,}/i.test(html)
        ? check("Meta description", "pass", "medium", "Meta description present.")
        : check(
            "Meta description",
            "warn",
            "medium",
            "Meta description missing or very short.",
            "Write a 140–160 character summary that states plainly what you are and who it is for.",
          ),
    );
    content.push(
      h1s === 1
        ? check("Single H1", "pass", "medium", "Exactly one H1 — a clear topic signal.")
        : check(
            "Single H1",
            "warn",
            "medium",
            h1s === 0 ? "No H1 found." : `${h1s} H1 tags found.`,
            "Use one H1 that states the page topic, then H2s for each question you answer.",
            "content-structure-for-ai-citations",
          ),
    );
    content.push(
      subheads >= 3
        ? check("Question-led structure", "pass", "medium", `${subheads} H2/H3 subheadings break content into answerable chunks.`)
        : check(
            "Question-led structure",
            "warn",
            "medium",
            `Only ${subheads} H2/H3 subheadings. Engines lift passages, so content needs clear sections.`,
            "Add H2s phrased the way buyers ask (\"How much does X cost?\") with a direct answer underneath.",
            "content-structure-for-ai-citations",
          ),
    );
    content.push(
      types.length && !types.includes("(invalid JSON-LD)")
        ? check("Structured data", "pass", "high", `JSON-LD found: ${[...new Set(types)].slice(0, 6).join(", ")}.`)
        : check(
            "Structured data",
            types.includes("(invalid JSON-LD)") ? "fail" : "warn",
            "high",
            types.includes("(invalid JSON-LD)") ? "A JSON-LD block failed to parse." : "No JSON-LD structured data.",
            "Add Organization (with sameAs links) plus Product/SoftwareApplication, Article or FAQPage where they fit.",
            "schema-markup-for-ai-search",
          ),
    );
    content.push(
      types.some((t) => /Organization|LocalBusiness|Corporation/i.test(t))
        ? check("Organization entity", "pass", "high", "Organization schema defines who you are.")
        : check(
            "Organization entity",
            "warn",
            "high",
            "No Organization schema. Models rely on consistent entity data to connect your name, site and profiles.",
            "Add Organization JSON-LD with name, url, logo and sameAs (LinkedIn, Crunchbase, G2, Wikipedia…).",
            "schema-markup-for-ai-search",
          ),
    );
    content.push(
      /<link[^>]+rel=["']canonical["']/i.test(html)
        ? check("Canonical URL", "pass", "low", "Canonical link present.")
        : check("Canonical URL", "warn", "low", "No canonical link.", "Add <link rel=\"canonical\"> to avoid duplicate-URL confusion."),
    );
    content.push(
      /property=["']og:title["']/i.test(html)
        ? check("Open Graph", "pass", "low", "Open Graph tags present.")
        : check("Open Graph", "warn", "low", "No og:title / og:description.", "Add Open Graph tags for rich previews when answers link to you."),
    );
    content.push(
      /<html[^>]+lang=/i.test(html)
        ? check("Language declared", "pass", "low", "html lang attribute set.")
        : check("Language declared", "warn", "low", "No lang attribute on <html>.", "Add lang=\"en\" (or your locale)."),
    );
    content.push(
      words >= 600
        ? check("Content depth", "pass", "high", `~${words} words of server-rendered text.`)
        : check(
            "Content depth",
            words < 150 && scriptBytes > 50_000 ? "fail" : "warn",
            "high",
            words < 150 && scriptBytes > 50_000
              ? `Only ~${words} words in the HTML but ${Math.round(scriptBytes / 1024)} KB of script. The page likely renders in the browser, and many AI crawlers do not run JavaScript.`
              : `Only ~${words} words of visible text.`,
            words < 150 && scriptBytes > 50_000
              ? "Server-render or pre-render key pages so the text exists in the HTML response."
              : "Expand with specifics: who it is for, pricing, comparisons, stats and FAQs.",
            "content-structure-for-ai-citations",
          ),
    );
    content.push(
      /dateModified|article:modified_time|<time[\s>]/i.test(html)
        ? check("Freshness signal", "pass", "medium", "Page exposes a modified/published date.")
        : check(
            "Freshness signal",
            "warn",
            "medium",
            "No visible or structured last-updated date.",
            "Show \"Updated <date>\" and set dateModified in schema; answer engines favor fresh sources.",
          ),
    );
    content.push(
      /<(details|dl)[\s>]|FAQPage|frequently asked/i.test(html)
        ? check("FAQ / Q&A content", "pass", "medium", "Q&A-style content detected.")
        : check(
            "FAQ / Q&A content",
            "warn",
            "medium",
            "No FAQ section detected.",
            "Add 5–8 real buyer questions with 2–3 sentence answers and FAQPage schema.",
            "content-structure-for-ai-citations",
          ),
    );
  }

  const checks = [...crawl, ...content];
  return {
    id: newId("audit"),
    brandId,
    url: normalized,
    overallScore: score(checks),
    crawlabilityScore: score(crawl),
    contentScore: content.length ? score(content) : 0,
    checks,
    createdAt: new Date(),
  };
}
