import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { AI_ENGINES, BRAND_NAME } from "@/lib/brand";
import { FEATURES, STEPS } from "@/lib/marketing";

export const metadata: Metadata = pageMetadata({
  title: "Features: Prompt Tracking, Multi-Engine Scans & GEO Audits",
  description: "Track AI search visibility end to end: prompt research, live scans of ChatGPT, Perplexity, Gemini and Claude, share of voice, a 20-check GEO audit and automated action plans.",
  path: "/features",
});

export default function FeaturesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Product</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-slate-900">A GEO stack, not another keyword ranker</h1>
        <p className="mt-4 text-lg text-slate-600">
          Track the prompts that matter, scan the engines your buyers use, audit whether models can cite you, and get a
          ranked list of what to do next.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f.title} className={`rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 ${f.card}`}>
            <h2 className={`text-lg font-semibold ${f.kicker}`}>{f.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
          </div>
        ))}
      </div>

      <section className="mt-20">
        <h2 className="text-2xl font-bold text-slate-900">Engine coverage</h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          One report, six surfaces. Starter includes ChatGPT, Perplexity, and Google AI Overviews.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {AI_ENGINES.map((e) => (
            <div
              key={e.id}
              className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderColor: `${e.color}55` }}
            >
              <span className="h-3 w-3 rounded-full" style={{ background: e.color }} />
              <span className="font-medium text-slate-800">{e.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-bold text-slate-900">From first report to a weekly habit</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className={`rounded-2xl border p-6 ${s.wash}`}>
              <p className={`text-sm font-bold ${s.tone}`}>{s.n}</p>
              <h3 className="mt-2 font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-16 flex flex-wrap gap-3">
        <Link href="/register" className="btn-primary">
          Try it free
        </Link>
        <Link href="/pricing" className="btn-secondary">
          View pricing
        </Link>
      </div>
    </main>
  );
}
