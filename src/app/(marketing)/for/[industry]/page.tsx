import Link from "next/link";
import { notFound } from "next/navigation";
import { INDUSTRY_PAGES, getIndustryPage } from "@/content/landing";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AuditCta } from "@/components/content/AuditCta";
import { FaqList } from "@/components/marketing/FaqList";
import { Reveal } from "@/components/marketing/motion";
import { ORG_ID, absolute, faqLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ industry: string }> };

export function generateStaticParams() {
  return INDUSTRY_PAGES.map((i) => ({ industry: i.slug }));
}

export async function generateMetadata({ params }: Props) {
  const p = getIndustryPage((await params).industry);
  return p ? pageMetadata({ title: p.title, description: p.description, path: `/for/${p.slug}` }) : {};
}

export default async function IndustryPage({ params }: Props) {
  const p = getIndustryPage((await params).industry);
  if (!p) notFound();
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <JsonLd data={[{ "@type": "WebPage", name: p.title, description: p.description, url: absolute(`/for/${p.slug}`), publisher: { "@id": ORG_ID } }, faqLd(p.faqs)]} />
      <Breadcrumbs items={[{ name: "Industries", path: `/for/${p.slug}` }, { name: p.name, path: `/for/${p.slug}` }]} />
      <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-violet-700">GEO for {p.name}</p>
      <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold text-slate-900 md:text-5xl">{p.title}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-700">{p.answer}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/register" className="btn-primary px-7 py-3">Start tracking free</Link>
        <Link href="/tools/geo-audit" className="btn-secondary px-7 py-3">Audit my site</Link>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <Reveal className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Prompts {p.name.toLowerCase()} buyers ask AI</h2>
          <ul className="mt-4 space-y-2.5">
            {p.prompts.map((q) => (
              <li key={q} className="rounded-xl bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm ring-1 ring-violet-100">“{q}”</li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={100} className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">What to prioritise</h2>
          <ol className="mt-4 space-y-3">
            {p.priorities.map((x, i) => (
              <li key={x} className="flex gap-3 text-sm text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-semibold text-white">{i + 1}</span>
                {x}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>

      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="mb-5 font-display text-2xl font-semibold text-slate-900">FAQ</h2>
        <FaqList items={p.faqs} />
      </section>
      <div className="mt-16"><AuditCta tone="dark" /></div>
      <p className="mt-10 text-sm text-slate-500">More industries:{" "}
        {INDUSTRY_PAGES.filter((x) => x.slug !== p.slug).map((x, i) => (
          <span key={x.slug}>{i > 0 && " · "}<Link href={`/for/${x.slug}`} className="font-medium text-slate-700 hover:text-teal-700">{x.name}</Link></span>
        ))}
      </p>
    </main>
  );
}
