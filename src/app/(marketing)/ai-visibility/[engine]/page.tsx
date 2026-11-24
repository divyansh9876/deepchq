import Link from "next/link";
import { notFound } from "next/navigation";
import { ENGINE_PAGES, getEnginePage } from "@/content/landing";
import { getGuide } from "@/content/guides";
import { AI_ENGINES, BRAND_NAME } from "@/lib/brand";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { AuditCta } from "@/components/content/AuditCta";
import { FaqList } from "@/components/marketing/FaqList";
import { ORG_ID, absolute, faqLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ engine: string }> };

export function generateStaticParams() {
  return ENGINE_PAGES.map((e) => ({ engine: e.slug }));
}

export async function generateMetadata({ params }: Props) {
  const e = getEnginePage((await params).engine);
  return e ? pageMetadata({ title: e.title, description: e.description, path: `/ai-visibility/${e.slug}` }) : {};
}

export default async function EnginePage({ params }: Props) {
  const e = getEnginePage((await params).engine);
  if (!e) notFound();
  const color = AI_ENGINES.find((x) => x.id === e.engine)?.color ?? "#5a36f0";
  const guide = getGuide(e.guide);
  const others = ENGINE_PAGES.filter((x) => x.slug !== e.slug);

  return (
    <main>
      <JsonLd
        data={[
          {
            "@type": "WebPage",
            name: e.title,
            description: e.description,
            url: absolute(`/ai-visibility/${e.slug}`),
            about: { "@type": "SoftwareApplication", name: e.name },
            publisher: { "@id": ORG_ID },
          },
          faqLd(e.faqs),
        ]}
      />
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-10 h-80 w-80 rounded-full blur-3xl blob" style={{ background: `${color}33` }} />
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-12">
          <Breadcrumbs items={[{ name: "AI visibility", path: "/ai-visibility" }, { name: e.name, path: `/ai-visibility/${e.slug}` }]} />
          <p className="mt-8 text-sm font-semibold uppercase tracking-wide" style={{ color }}>{e.name} tracking</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold text-slate-900 md:text-5xl">{e.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-700">{e.answer}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register" className="btn-primary px-7 py-3">Track {e.name} free</Link>
            <Link href="/tools/geo-audit" className="btn-secondary px-7 py-3">Run a free audit</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 md:grid-cols-3">
        <div className="card md:col-span-2">
          <h2 className="text-xl font-semibold text-slate-900">How {e.name} chooses what to say</h2>
          <ul className="mt-4 space-y-3">
            {e.howItWorks.map((h) => (
              <li key={h} className="flex gap-3 text-slate-700"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />{h}</li>
            ))}
          </ul>
          {guide && (
            <Link href={`/learn/${guide.slug}`} className="mt-6 inline-block text-sm font-semibold text-brand-700 hover:underline">Read the guide: {guide.title} →</Link>
          )}
        </div>
        <div className="card">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Crawlers to allow</h2>
          <ul className="mt-3 space-y-2">
            {e.crawlers.map((c) => <li key={c}><code className="rounded bg-slate-100 px-2 py-0.5 text-sm text-slate-800">{c}</code></li>)}
          </ul>
          <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-400">What {BRAND_NAME} tracks</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
            {e.tracks.map((t) => <li key={t}>✓ {t}</li>)}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <h2 className="mb-5 font-display text-2xl font-semibold text-slate-900">{e.name} visibility FAQ</h2>
        <FaqList items={e.faqs} />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <AuditCta tone="dark" />
        <p className="mt-10 text-sm text-slate-500">Other engines:{" "}
          {others.map((o, i) => (
            <span key={o.slug}>{i > 0 && " · "}<Link href={`/ai-visibility/${o.slug}`} className="font-medium text-slate-700 hover:text-brand-700">{o.name}</Link></span>
          ))}
        </p>
      </section>
    </main>
  );
}
