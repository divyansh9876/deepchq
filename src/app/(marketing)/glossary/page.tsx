import Link from "next/link";
import { GLOSSARY } from "@/content/glossary";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { absolute, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "GEO & AI Search Glossary",
  description: "Plain-English definitions of generative engine optimization terms: AI visibility, citation rate, share of voice, llms.txt, AI crawlers, grounding, RAG and more.",
  path: "/glossary",
});

export default function GlossaryIndex() {
  const terms = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <JsonLd
        data={{
          "@type": "DefinedTermSet",
          name: "GEO & AI Search Glossary",
          url: absolute("/glossary"),
          hasDefinedTerm: terms.map((t) => ({ "@type": "DefinedTerm", name: t.term, description: t.short, url: absolute(`/glossary/${t.slug}`) })),
        }}
      />
      <Breadcrumbs items={[{ name: "Glossary", path: "/glossary" }]} />
      <h1 className="mt-6 font-display text-4xl font-semibold text-slate-900">GEO &amp; AI search glossary</h1>
      <p className="mt-3 text-lg text-slate-600">{terms.length} terms you&apos;ll meet when optimizing for AI answers.</p>
      <dl className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {terms.map((t) => (
          <div key={t.slug} className="p-5 transition hover:bg-slate-50">
            <dt><Link href={`/glossary/${t.slug}`} className="font-semibold text-slate-900 hover:text-brand-700">{t.term}</Link></dt>
            <dd className="mt-1 text-sm text-slate-600">{t.short}</dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
