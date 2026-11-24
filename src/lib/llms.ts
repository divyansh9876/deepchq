import { GUIDES } from "@/content/guides";
import { GLOSSARY } from "@/content/glossary";
import { ENGINE_PAGES, INDUSTRY_PAGES } from "@/content/landing";
import { AI_ENGINES, BRAND_NAME } from "@/lib/brand";
import { PLAN_LIMITS, PLAN_PRICES, formatUsd } from "@/lib/plans";
import { absolute } from "@/lib/seo";

export function llmsTxt() {
  const link = (title: string, path: string, note: string) => `- [${title}](${absolute(path)}): ${note}`;
  return `# ${BRAND_NAME}

> ${BRAND_NAME} is an AI search visibility and Generative Engine Optimization (GEO) platform. It tracks whether ${AI_ENGINES.map((e) => e.name).join(", ")} mention and cite a brand for the prompts buyers ask, measures share of voice against competitors, audits websites for AI crawler access and citation readiness, and produces a ranked action plan. Scans run automatically on a schedule with email digests. Free plan available; paid plans start at ${formatUsd(PLAN_PRICES.growth.monthly)}/month.

## Product
${link("Free GEO audit", "/tools/geo-audit", "Instant no-signup check of robots.txt AI bot rules, llms.txt, schema, content structure and crawlability")}
${link("llms.txt generator", "/tools/llms-txt-generator", "Free tool to create an llms.txt file")}
${link("Features", "/features", "Prompt tracking, multi-engine scans, share of voice, GEO audit, recommendations")}
${link("Pricing", "/pricing", `Free (${PLAN_LIMITS.free.brands} brand, ${PLAN_LIMITS.free.prompts} prompts), Growth ${formatUsd(PLAN_PRICES.growth.monthly)}/mo, Agency ${formatUsd(PLAN_PRICES.agency.monthly)}/mo`)}

## Guides
${GUIDES.map((g) => link(g.title, `/learn/${g.slug}`, g.description)).join("\n")}

## Engine trackers
${ENGINE_PAGES.map((e) => link(e.title, `/ai-visibility/${e.slug}`, e.description)).join("\n")}

## Industries
${INDUSTRY_PAGES.map((i) => link(i.title, `/for/${i.slug}`, i.description)).join("\n")}

## Optional
${link("GEO glossary", "/glossary", `${GLOSSARY.length} definitions of AI search terms`)}
${link("FAQ", "/faq", "Common questions about Deepchq and GEO")}
${link("Full text for LLMs", "/llms-full.txt", "All guides in one markdown file")}
`;
}

export function llmsFullTxt() {
  const guides = GUIDES.map((g) => {
    const body = g.sections
      .map((s) => [`### ${s.h}`, ...(s.p ?? []), ...(s.list ?? []).map((l) => `- ${l}`), s.code ? "```\n" + s.code + "\n```" : ""].filter(Boolean).join("\n\n"))
      .join("\n\n");
    const faqs = g.faqs.map((f) => `**${f.q}**\n${f.a}`).join("\n\n");
    return `## ${g.title}\n\nSource: ${absolute(`/learn/${g.slug}`)} · Updated ${g.updated}\n\n${g.answer}\n\n${g.keyTakeaways.map((k) => `- ${k}`).join("\n")}\n\n${body}\n\n### FAQ\n\n${faqs}`;
  });
  const terms = GLOSSARY.map((t) => `**${t.term}** — ${t.short}`).join("\n\n");
  return `${llmsTxt()}\n---\n\n${guides.join("\n\n---\n\n")}\n\n---\n\n## Glossary\n\n${terms}\n`;
}
