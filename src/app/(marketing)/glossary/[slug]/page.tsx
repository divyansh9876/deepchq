import Link from "next/link";
import { notFound } from "next/navigation";
import { GLOSSARY, getTerm } from "@/content/glossary";
import { getGuide } from "@/content/guides";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AuditCta } from "@/components/content/AuditCta";
import { absolute, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GLOSSARY.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props) {
  const t = getTerm((await params).slug);
  return t ? pageMetadata({ title: `What is ${t.term}? Definition`, description: t.short, path: `/glossary/${t.slug}` }) : {};
}

export default async function TermPage({ params }: Props) {
  const t = getTerm((await params).slug);
  if (!t) notFound();
  const guide = t.guide ? getGuide(t.guide) : null;
  const related = t.related.map(getTerm).filter((x): x is NonNullable<typeof x> => !!x);
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <JsonLd
        data={{
          "@type": "DefinedTerm",
          name: t.term,
          description: t.short,
          url: absolute(`/glossary/${t.slug}`),
          inDefinedTermSet: { "@type": "DefinedTermSet", name: "GEO & AI Search Glossary", url: absolute("/glossary") },
        }}
      />
      <Breadcrumbs items={[{ name: "Glossary", path: "/glossary" }, { name: t.term, path: `/glossary/${t.slug}` }]} />
      <h1 className="mt-6 font-display text-4xl font-semibold text-slate-900">What is {t.term}?</h1>
      <p className="mt-6 rounded-2xl border border-teal-200 bg-teal-50 p-5 text-lg leading-relaxed text-slate-800">{t.short}</p>
      {t.body.map((b) => <p key={b.slice(0, 30)} className="mt-5 leading-relaxed text-slate-700">{b}</p>)}
      {guide && (
        <Link href={`/learn/${guide.slug}`} className="mt-8 block rounded-xl border border-slate-200 bg-white p-5 transition hover:border-teal-300">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Full guide</p>
          <p className="mt-1 font-semibold text-slate-900">{guide.title} →</p>
        </Link>
      )}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Related terms</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((r) => (
              <Link key={r.slug} href={`/glossary/${r.slug}`} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 hover:border-teal-300 hover:text-teal-700">{r.term}</Link>
            ))}
          </div>
        </div>
      )}
      <div className="mt-14"><AuditCta /></div>
    </main>
  );
}
