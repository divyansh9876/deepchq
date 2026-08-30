import Link from "next/link";
import { Logo } from "@/components/Logo";
import { AI_ENGINES, BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-brand-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex gap-3">
          <Link href="/login" className="btn-secondary">
            Log in
          </Link>
          <Link href="/register" className="btn-primary">
            Start free
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Generative Engine Optimization
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Track your brand in AI search answers
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            {BRAND_TAGLINE}. Monitor mentions, citations, and competitor share of voice across
            ChatGPT, Perplexity, Google AI, Gemini, Claude, and Copilot.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="btn-primary px-8 py-3 text-base">
              Create brand report — free
            </Link>
            <Link href="/login" className="btn-secondary px-8 py-3 text-base">
              View demo dashboard
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Prompt tracking",
              desc: "Define the questions your customers ask AI engines. Track visibility daily.",
            },
            {
              title: "GEO audit",
              desc: "Check crawlability, schema, llms.txt, and content depth for AI citation readiness.",
            },
            {
              title: "Smart recommendations",
              desc: "Prioritized actions to close visibility gaps vs competitors — on-page and off-page.",
            },
          ].map((f) => (
            <div key={f.title} className="card">
              <h3 className="font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 card">
          <h2 className="text-center text-lg font-semibold text-slate-900">
            Monitored AI engines
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
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

        <p className="mt-12 text-center text-xs text-slate-400">
          {BRAND_NAME} — built for marketers investing in GEO.
        </p>
      </main>
    </div>
  );
}
