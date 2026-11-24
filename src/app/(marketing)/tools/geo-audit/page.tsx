import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { DomainAuditForm } from "@/components/tools/DomainAuditForm";
import { FaqList } from "@/components/marketing/FaqList";
import { AI_SEARCH_BOTS, AI_TRAINING_BOTS } from "@/lib/geo/audit";
import { ORG_ID, absolute, faqLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free AI Search Readiness Audit (GEO Checker)",
  description:
    "Check if ChatGPT, Perplexity, Claude and Google can crawl and cite your site. Free instant GEO audit: AI bot rules, llms.txt, schema, content structure and fixes.",
  path: "/tools/geo-audit",
  keywords: ["GEO audit", "AI visibility checker", "check if AI can crawl my site", "GPTBot checker", "AI SEO audit"],
});

const FAQ = [
  { q: "What does the GEO audit check?", a: "It fetches your homepage, robots.txt, llms.txt and sitemap the way a crawler would, then checks per-bot access for AI search and training crawlers, indexability, HTTPS, structured data and Organization schema, headings, content depth, server-side rendering, freshness signals, FAQ content, canonical, Open Graph and language tags." },
  { q: "Is the audit really free?", a: "Yes. No signup is needed. Create a free account if you want to track the score over time and see whether AI engines actually mention your brand." },
  { q: "How is the score calculated?", a: "Each check is weighted by impact (high, medium, low). A pass earns full credit, a warning half, and a fail none. The score is the weighted percentage." },
  { q: "Does a high score mean ChatGPT will recommend me?", a: "No — it means engines can access and understand your site. Whether they recommend you also depends on content and third-party mentions. Deepchq's prompt tracking measures that part." },
];

export default async function GeoAuditTool({ searchParams }: { searchParams: Promise<{ url?: string }> }) {
  const { url } = await searchParams;
  return (
    <main>
      <JsonLd
        data={[
          {
            "@type": "WebApplication",
            name: "AI Search Readiness Audit",
            url: absolute("/tools/geo-audit"),
            applicationCategory: "SEO tool",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            publisher: { "@id": ORG_ID },
          },
          faqLd(FAQ),
        ]}
      />
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-teal-200/50 blur-3xl blob" />
        <div className="pointer-events-none absolute -right-16 top-20 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl blob" style={{ animationDelay: "4s" }} />
        <div className="relative mx-auto max-w-3xl px-6 pb-16 pt-12 text-center">
          <div className="text-left"><Breadcrumbs items={[{ name: "Free tools", path: "/tools" }, { name: "GEO audit", path: "/tools/geo-audit" }]} /></div>
          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">Free tool · no signup</p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-slate-900 md:text-5xl">Can AI engines find and cite your site?</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
            Instant audit of AI crawler access, llms.txt, schema, content structure and 15+ other signals — with a fix for every issue.
          </p>
          <div className="mx-auto mt-8 max-w-xl"><DomainAuditForm autoFocus initial={url ?? ""} /></div>
          <p className="mt-3 text-xs text-slate-400">We fetch only public pages, like a search crawler would.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 md:grid-cols-3">
        {[
          { t: "AI crawler access", d: `Per-bot robots.txt check for ${AI_SEARCH_BOTS.slice(0, 4).join(", ")} and more — plus training bots like ${AI_TRAINING_BOTS.slice(0, 2).join(" and ")}.`, w: "border-teal-100 bg-teal-50" },
          { t: "Entity & structure", d: "Organization schema, JSON-LD validity, single H1, question-led sections, FAQ content and canonical tags.", w: "border-violet-100 bg-violet-50" },
          { t: "Citation readiness", d: "Server-rendered text depth, freshness dates, sitemap, HTTPS and llms.txt — what retrieval engines need to quote you.", w: "border-amber-100 bg-amber-50" },
        ].map((x) => (
          <div key={x.t} className={`rounded-2xl border p-6 ${x.w}`}>
            <h2 className="font-semibold text-slate-900">{x.t}</h2>
            <p className="mt-2 text-sm text-slate-600">{x.d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h2 className="mb-5 font-display text-2xl font-semibold text-slate-900">About the audit</h2>
        <FaqList items={FAQ} />
        <p className="mt-6 text-sm text-slate-500">
          Want the background? Read <Link href="/learn/ai-crawlers-robots-txt" className="font-medium text-teal-700 hover:underline">AI crawlers and robots.txt</Link> and{" "}
          <Link href="/learn/content-structure-for-ai-citations" className="font-medium text-teal-700 hover:underline">how to write content AI engines cite</Link>.
        </p>
      </section>
    </main>
  );
}
