import { newId } from "@/lib/id";
import type { AuditCheck, GeoAudit } from "@/lib/types";

async function fetchText(url: string, timeout = 12000): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeout);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "Deepchq-AuditBot/1.0 (+https://deepchq.app)" },
    });
    clearTimeout(t);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function check(
  label: string,
  status: AuditCheck["status"],
  impact: AuditCheck["impact"],
  detail: string,
): AuditCheck {
  return { id: newId("chk"), label, status, impact, detail };
}

export async function runGeoAudit(brandId: string, url: string): Promise<GeoAudit> {
  const normalized = url.startsWith("http") ? url : `https://${url}`;
  const origin = new URL(normalized).origin;

  const [html, robots, llms] = await Promise.all([
    fetchText(normalized),
    fetchText(`${origin}/robots.txt`),
    fetchText(`${origin}/llms.txt`),
  ]);

  const checks: AuditCheck[] = [];

  if (!html) {
    checks.push(
      check("Page reachable", "fail", "high", "Could not fetch the homepage. AI crawlers may not access your site."),
    );
  } else {
    checks.push(check("Page reachable", "pass", "high", "Homepage returns HTML successfully."));
  }

  if (!robots) {
    checks.push(
      check("robots.txt", "warn", "medium", "No robots.txt found. Consider adding crawl rules for AI bots."),
    );
  } else {
    const blocksAll = /User-agent:\s*\*[\s\S]*Disallow:\s*\/\s*$/im.test(robots);
    const allowsGpt = /GPTBot|ChatGPT-User|Google-Extended|PerplexityBot/i.test(robots);
    if (blocksAll) {
      checks.push(check("robots.txt", "fail", "high", "robots.txt blocks all crawlers on /."));
    } else if (!allowsGpt) {
      checks.push(
        check("AI bot access", "warn", "high", "robots.txt exists but does not mention AI crawlers (GPTBot, Google-Extended, etc.)."),
      );
    } else {
      checks.push(check("AI bot access", "pass", "high", "robots.txt allows or references AI crawlers."));
    }
  }

  if (llms) {
    checks.push(check("llms.txt", "pass", "medium", "llms.txt found — helps LLMs understand your site."));
  } else {
    checks.push(
      check("llms.txt", "warn", "medium", "No llms.txt. Add one to guide AI crawlers to key content."),
    );
  }

  if (html) {
    const hasTitle = /<title[^>]*>[^<]+<\/title>/i.test(html);
    const hasMetaDesc = /<meta[^>]+name=["']description["'][^>]*>/i.test(html);
    const hasH1 = /<h1[^>]*>/i.test(html);
    const hasSchema = /application\/ld\+json/i.test(html);
    const hasOg = /property=["']og:/i.test(html);
    const textLen = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length;

    checks.push(
      hasTitle
        ? check("Title tag", "pass", "medium", "Page has a <title> element.")
        : check("Title tag", "fail", "high", "Missing <title> — AI engines use this for context."),
    );
    checks.push(
      hasMetaDesc
        ? check("Meta description", "pass", "medium", "Meta description present.")
        : check("Meta description", "warn", "medium", "Add a meta description summarizing the page."),
    );
    checks.push(
      hasH1
        ? check("Heading structure", "pass", "medium", "H1 found — clear topic signal for AI.")
        : check("Heading structure", "warn", "medium", "No H1 detected. Use clear headings."),
    );
    checks.push(
      hasSchema
        ? check("Schema markup", "pass", "high", "JSON-LD schema detected — improves AI entity understanding.")
        : check("Schema markup", "warn", "high", "No JSON-LD schema. Add Organization, Product, or FAQ schema."),
    );
    checks.push(
      hasOg
        ? check("Open Graph", "pass", "low", "Open Graph tags present.")
        : check("Open Graph", "warn", "low", "Add og:title and og:description for richer previews."),
    );
    checks.push(
      textLen > 800
        ? check("Content depth", "pass", "high", `~${textLen} chars of text — sufficient for AI citation.`)
        : check("Content depth", "warn", "high", `Only ~${textLen} chars of visible text. Expand authoritative content.`),
    );
  }

  const pass = checks.filter((c) => c.status === "pass").length;
  const total = checks.length || 1;
  const crawlChecks = checks.filter((c) =>
    ["robots.txt", "AI bot access", "llms.txt", "Page reachable"].includes(c.label),
  );
  const contentChecks = checks.filter((c) => !crawlChecks.includes(c));

  const crawlabilityScore = Math.round(
    (crawlChecks.filter((c) => c.status === "pass").length / (crawlChecks.length || 1)) * 100,
  );
  const contentScore = Math.round(
    (contentChecks.filter((c) => c.status === "pass").length / (contentChecks.length || 1)) * 100,
  );
  const overallScore = Math.round((pass / total) * 100);

  return {
    id: newId("audit"),
    brandId,
    url: normalized,
    overallScore,
    crawlabilityScore,
    contentScore,
    checks,
    createdAt: new Date(),
  };
}
