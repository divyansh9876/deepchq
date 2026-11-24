import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, getGuide, readMinutes, slugify } from "@/content/guides";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CodeBlock, ReadingProgress, Toc } from "@/components/content/Interactive";
import { AuditCta } from "@/components/content/AuditCta";
import { FaqList } from "@/components/marketing/FaqList";
import { BRAND_NAME } from "@/lib/brand";
import { ORG_ID, absolute, faqLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props) {
  const g = getGuide((await params).slug);
  if (!g) return {};
  return pageMetadata({
    title: g.title,
    description: g.description,
    path: `/learn/${g.slug}`,
    type: "article",
    publishedAt: g.published,
    modifiedAt: g.updated,
    keywords: g.keywords,
  });
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function GuidePage({ params }: Props) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  const toc = [{ id: "answer", label: "Short answer" }, ...g.sections.map((s) => ({ id: slugify(s.h), label: s.h })), { id: "faq", label: "FAQ" }];
  const related = g.related.map(getGuide).filter((x): x is NonNullable<typeof x> => !!x);

  return (
    <>
      <ReadingProgress />
      <JsonLd
        data={[
          {
            "@type": "Article",
            headline: g.title,
            description: g.description,
            datePublished: g.published,
            dateModified: g.updated,
            author: { "@type": "Organization", name: `${BRAND_NAME} Research`, url: absolute("/about") },
            publisher: { "@id": ORG_ID },
            mainEntityOfPage: absolute(`/learn/${g.slug}`),
            keywords: g.keywords.join(", "),
            articleSection: g.category,
          },
          faqLd(g.faqs),
        ]}
      />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <Breadcrumbs items={[{ name: "Guides", path: "/learn" }, { name: g.title, path: `/learn/${g.slug}` }]} />
        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_240px]">
          <article className="min-w-0 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{g.category}</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-slate-900 md:text-[2.75rem]">{g.title}</h1>
            <p className="mt-4 text-sm text-slate-500">
              By {BRAND_NAME} Research · Updated <time dateTime={g.updated}>{fmt(g.updated)}</time> · {readMinutes(g)} min read
            </p>

            <section id="answer" className="mt-8 scroll-mt-24 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Short answer</p>
              <p className="mt-2 text-lg leading-relaxed text-slate-800">{g.answer}</p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {g.keyTakeaways.map((k) => (
                  <li key={k} className="flex gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 text-brand-600">✓</span>
                    {k}
                  </li>
                ))}
              </ul>
            </section>

            {g.sections.map((s) => (
              <section key={s.h} id={slugify(s.h)} className="mt-12 scroll-mt-24">
                <h2 className="font-display text-2xl font-semibold text-slate-900">{s.h}</h2>
                {s.p?.map((para) => (
                  <p key={para.slice(0, 40)} className="mt-4 leading-relaxed text-slate-700">{para}</p>
                ))}
                {s.list && (
                  <ul className="mt-4 space-y-2.5">
                    {s.list.map((li) => {
                      const [head, ...rest] = li.split(" — ");
                      return (
                        <li key={li.slice(0, 40)} className="flex gap-3 leading-relaxed text-slate-700">
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-500" />
                          <span>{rest.length ? (<><strong className="font-semibold text-slate-900">{head}</strong> — {rest.join(" — ")}</>) : li}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {s.code && <CodeBlock code={s.code} />}
              </section>
            ))}

            <section id="faq" className="mt-14 scroll-mt-24">
              <h2 className="mb-5 font-display text-2xl font-semibold text-slate-900">Frequently asked questions</h2>
              <FaqList items={g.faqs} />
            </section>

            <div className="mt-14">
              <AuditCta tone="dark" title="Check how AI-ready your site is" />
            </div>

            {related.length > 0 && (
              <section className="mt-14">
                <h2 className="text-lg font-semibold text-slate-900">Related guides</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {related.map((r) => (
                    <Link key={r.slug} href={`/learn/${r.slug}`} className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm">
                      <p className="font-medium text-slate-900">{r.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">{r.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <Toc items={toc} />
              <div className="rounded-2xl border border-fuchsia-100 bg-fuchsia-50 p-5">
                <p className="font-semibold text-slate-900">Track this automatically</p>
                <p className="mt-1 text-sm text-slate-600">Weekly scans across 6 AI engines with an emailed report.</p>
                <Link href="/register" className="btn-primary mt-4 w-full">Start free</Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
