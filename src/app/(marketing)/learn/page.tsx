import Link from "next/link";
import { GUIDES, readMinutes } from "@/content/guides";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AuditCta } from "@/components/content/AuditCta";
import { absolute, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "GEO Guides: Learn Generative Engine Optimization",
  description:
    "Practical, up-to-date guides to generative engine optimization: ranking in ChatGPT, getting cited by Perplexity, Google AI Overviews, AI crawlers, llms.txt, schema and measurement.",
  path: "/learn",
});

const TONE: Record<string, string> = {
  Fundamentals: "bg-brand-50 text-brand-700 ring-brand-100",
  Engines: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100",
  Technical: "bg-sky-50 text-sky-700 ring-sky-100",
  Measurement: "bg-amber-50 text-amber-700 ring-amber-100",
};

export default function LearnIndex() {
  const cats = [...new Set(GUIDES.map((g) => g.category))];
  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <Breadcrumbs items={[{ name: "Guides", path: "/learn" }]} />
      <JsonLd
        data={{
          "@type": "CollectionPage",
          name: "GEO guides",
          url: absolute("/learn"),
          hasPart: GUIDES.map((g) => ({ "@type": "Article", headline: g.title, url: absolute(`/learn/${g.slug}`) })),
        }}
      />
      <h1 className="mt-6 font-display text-4xl font-semibold text-slate-900 md:text-5xl">Learn generative engine optimization</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        Straight answers on getting your brand mentioned and cited by ChatGPT, Perplexity, Google AI Overviews, Gemini, Claude and Copilot — and how to measure it.
      </p>
      {cats.map((cat) => (
        <section key={cat} className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{cat}</h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {GUIDES.filter((g) => g.category === cat).map((g) => (
              <Link
                key={g.slug}
                href={`/learn/${g.slug}`}
                className="spotlight group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-md"
              >
                <span className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${TONE[g.category]}`}>{g.category}</span>
                <h3 className="mt-3 font-semibold text-slate-900 group-hover:text-brand-700">{g.title}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-600">{g.description}</p>
                <p className="mt-4 text-xs text-slate-400">{readMinutes(g)} min read</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
      <div className="mt-16">
        <AuditCta />
      </div>
    </main>
  );
}
