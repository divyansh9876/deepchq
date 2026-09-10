import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";
import { TEAM } from "@/lib/marketing";

export const metadata: Metadata = {
  title: `About — ${BRAND_NAME}`,
  description: "Why we built Deepchq and who is behind the GEO platform.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">About</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">AI search is already a channel. Most brands cannot see it.</h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-600">
          Buyers ask ChatGPT and Perplexity before they click a blue link. If those answers name a
          competitor — or nobody — you lose the consideration set without ever showing up in Search Console.
        </p>
        <p className="mt-4 leading-relaxed text-slate-600">
          {BRAND_NAME} exists to make generative engine visibility measurable. We started as an internal
          dashboard for a few brands that kept hearing “ChatGPT recommended you” with no way to track it.
          That dashboard is now a product for marketers, SEO leads, and agencies.
        </p>
      </div>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          { n: "6", l: "AI engines monitored" },
          { n: "GEO", l: "Built for citations, not just rankings" },
          { n: "Action", l: "Audits that turn into a punch list" },
        ].map((s) => (
          <div key={s.l} className="card text-center">
            <p className="text-3xl font-bold text-brand-600">{s.n}</p>
            <p className="mt-2 text-sm text-slate-600">{s.l}</p>
          </div>
        ))}
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-bold text-slate-900">What we believe</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="card">
            <h3 className="font-semibold text-slate-900">If you cannot measure it, you cannot own it</h3>
            <p className="mt-2 text-sm text-slate-600">
              Anecdotes from sales calls are not a strategy. Prompt-level mention and citation data is.
            </p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-slate-900">GEO is not a renamed SEO audit</h3>
            <p className="mt-2 text-sm text-slate-600">
              Crawlability still matters. So do entities, llms.txt, and how models describe your category versus competitors.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-bold text-slate-900">Team</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {TEAM.map((m) => (
            <div key={m.name} className="card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">
                {m.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
              </div>
              <h3 className="font-semibold text-slate-900">{m.name}</h3>
              <p className="text-sm text-brand-600">{m.role}</p>
              <p className="mt-2 text-sm text-slate-600">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-3xl bg-white p-10 ring-1 ring-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">Want to work together?</h2>
        <p className="mt-3 max-w-xl text-slate-600">
          We are hiring slowly and talking to agencies that want GEO as a retainer product.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/contact" className="btn-primary">
            Contact us
          </Link>
          <Link href="/careers" className="btn-secondary">
            Open roles
          </Link>
        </div>
      </section>
    </main>
  );
}
