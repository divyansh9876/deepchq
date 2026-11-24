import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free GEO Tools: AI Visibility Audit & llms.txt Generator",
  description: "Free tools for generative engine optimization: audit your site's AI search readiness and generate an llms.txt file in seconds. No signup.",
  path: "/tools",
});

const TOOLS = [
  { href: "/tools/geo-audit", title: "AI Search Readiness Audit", desc: "Checks AI crawler access per bot, llms.txt, sitemap, schema, content structure, freshness and more. Instant score with fixes.", tone: "from-brand-50 border-brand-100", tag: "Most popular" },
  { href: "/tools/llms-txt-generator", title: "llms.txt Generator", desc: "Build a valid llms.txt file from your site name, summary and key links. Copy or download.", tone: "from-fuchsia-50 border-fuchsia-100", tag: "Free" },
];

export default function ToolsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <Breadcrumbs items={[{ name: "Free tools", path: "/tools" }]} />
      <h1 className="mt-6 font-display text-4xl font-semibold text-slate-900">Free GEO tools</h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-600">No signup, no credit card. Built on the same engine as the Deepchq platform.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {TOOLS.map((t) => (
          <Link key={t.href} href={t.href} className={`group rounded-2xl border bg-gradient-to-br ${t.tone} to-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}>
            <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">{t.tag}</span>
            <h2 className="mt-4 text-xl font-semibold text-slate-900 group-hover:text-brand-700">{t.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{t.desc}</p>
            <p className="mt-5 text-sm font-semibold text-brand-700">Open tool →</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
