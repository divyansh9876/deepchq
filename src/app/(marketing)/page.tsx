import Link from "next/link";
import { AI_ENGINES } from "@/lib/brand";
import { FAQS, FEATURES, PLANS, STEPS, USE_CASES } from "@/lib/marketing";
import { FaqList } from "@/components/marketing/FaqList";

export default function HomePage() {
  const featured = PLANS.find((p) => p.featured)!;

  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 text-center md:pt-24">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          Generative Engine Optimization
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
          Know when AI search recommends you — and when it recommends a competitor
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          Deepchq tracks mentions, citations, and share of voice across ChatGPT, Perplexity, Google
          AI, Gemini, Claude, and Copilot. Then it tells you what to fix.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/register" className="btn-primary px-8 py-3 text-base">
            Create a free brand report
          </Link>
          <Link href="/features" className="btn-secondary px-8 py-3 text-base">
            Explore features
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-400">No credit card · Starter is free forever</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="card">
          <p className="text-center text-sm font-medium text-slate-500">Monitored AI engines</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {AI_ENGINES.map((e) => (
              <span
                key={e.id}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
              >
                {e.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold text-slate-900">Everything you need to own AI search</h2>
          <p className="mt-3 text-slate-600">
            Measurement, audits, and a punch list — built for GEO, not recycled from classic SEO tools.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card">
              <h3 className="font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/features" className="text-sm font-semibold text-brand-600 hover:underline">
            See the full product →
          </Link>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="text-sm font-bold text-brand-600">{s.n}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold text-slate-900">Who Deepchq is for</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {USE_CASES.map((u) => (
            <div key={u.title} className="card">
              <h3 className="font-semibold text-slate-900">{u.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Simple pricing</h2>
            <p className="mt-2 text-slate-600">Start free. Upgrade when the channel is worth owning.</p>
          </div>
          <Link href="/pricing" className="text-sm font-semibold text-brand-600 hover:underline">
            Compare plans →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`card flex flex-col ${p.featured ? "border-brand-500 ring-2 ring-brand-100" : ""}`}
            >
              {p.featured && (
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-600">Most popular</p>
              )}
              <h3 className="text-lg font-semibold text-slate-900">{p.name}</h3>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {p.price}
                <span className="text-base font-normal text-slate-500">{p.period}</span>
              </p>
              <p className="mt-2 text-sm text-slate-600">{p.blurb}</p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-600">
                {p.features.slice(0, 4).map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
              <Link href={p.href} className={`mt-6 ${p.featured ? "btn-primary" : "btn-secondary"}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-slate-400">
          Teams on {featured.name} get all six engines and competitor share of voice.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h2 className="mb-6 text-center text-3xl font-bold text-slate-900">Questions</h2>
        <FaqList items={FAQS.slice(0, 4)} />
        <p className="mt-6 text-center text-sm">
          <Link href="/faq" className="font-semibold text-brand-600 hover:underline">
            Read all FAQs →
          </Link>
        </p>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl rounded-3xl bg-brand-900 px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-bold">Ship your first GEO report today</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            Add a brand, generate prompts, and see whether AI search mentions you — in minutes.
          </p>
          <Link href="/register" className="btn-primary mt-8 bg-white text-brand-700 hover:bg-slate-100">
            Start free
          </Link>
        </div>
      </section>
    </main>
  );
}
