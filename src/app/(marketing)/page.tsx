"use client";

import Link from "next/link";
import { FAQS, PLANS, STATS, STAT_TONES, STEPS, USE_CASES } from "@/lib/marketing";
import { FaqList } from "@/components/marketing/FaqList";
import { EngineMarquee } from "@/components/marketing/EngineMarquee";
import { EngineCycle } from "@/components/marketing/EngineCycle";
import { FeatureTabs } from "@/components/marketing/FeatureTabs";
import { HeroDashboard } from "@/components/marketing/HeroDashboard";
import { Testimonials } from "@/components/marketing/Testimonials";
import { CountUp, Reveal } from "@/components/marketing/motion";

export default function HomePage() {
  const featured = PLANS.find((p) => p.featured)!;

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-teal-200/50 blur-3xl blob" />
        <div className="pointer-events-none absolute -right-16 top-32 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl blob" style={{ animationDelay: "4s" }} />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-amber-200/40 blur-3xl blob" style={{ animationDelay: "8s" }} />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-14 md:grid-cols-2 md:pt-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">
              Track · optimize · execute
            </p>
            <h1 className="display mt-4 text-4xl font-semibold text-slate-900 md:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
              The AI visibility platform for the era of{" "}
              <EngineCycle />
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-600">
              Track mentions, citations, and competitor share of voice. Audit why models skip you. Ship the next GEO
              action — not another SEO checklist.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="btn-primary px-8 py-3 text-base">
                Get my visibility score
              </Link>
              <Link href="/features" className="btn-secondary px-8 py-3 text-base">
                See how it works
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-400">Free Starter · no credit card</p>
          </div>
          <div className="float-slow">
            <HeroDashboard />
          </div>
        </div>
      </section>

      <EngineMarquee />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 80} className={`card text-center ${STAT_TONES[idx].wrap}`}>
              <p className={`font-display text-4xl font-semibold ${STAT_TONES[idx].num}`}>
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm text-slate-500">{s.label}</p>
            </Reveal>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-slate-400">*Illustrative lift from teams that ship weekly GEO actions.</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <Reveal>
          <h2 className="display text-3xl font-semibold text-slate-900">One platform to see if AI recommends you</h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Click a capability. This is the same loop marketers use on Otterly-style GEO stacks — research, monitor,
            audit, act.
          </p>
        </Reveal>
        <div className="mt-10">
          <FeatureTabs />
        </div>
        <p className="mt-8 text-center">
          <Link href="/features" className="text-sm font-semibold text-brand-600 hover:underline">
            Full product tour →
          </Link>
        </p>
      </section>

      <section className="border-y border-violet-100 bg-gradient-to-b from-violet-50/80 to-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="display text-3xl font-semibold text-slate-900">Three steps. Then a weekly habit.</h2>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map((s, idx) => (
              <Reveal key={s.n} delay={idx * 100} className={`rounded-2xl border p-6 ${s.wash}`}>
                <p className={`font-hand text-3xl ${s.tone}`}>{s.n}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <h2 className="display text-3xl font-semibold text-slate-900">Built for teams who own the channel</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {USE_CASES.map((u, idx) => (
            <Reveal key={u.title} delay={idx * 80} className={`rounded-2xl border p-6 shadow-sm transition duration-300 hover:-translate-y-1 ${u.wash}`}>
              <span className={`mb-4 inline-block h-2 w-10 rounded-full ${u.chip}`} />
              <h3 className="font-semibold text-slate-900">{u.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{u.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-transparent px-6 pb-20">
        <Reveal>
          <h2 className="mb-8 text-center font-display text-3xl font-semibold text-slate-900">
            What marketing leads say after the first scans
          </h2>
        </Reveal>
        <Testimonials />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="display text-3xl font-semibold text-slate-900">Simple pricing</h2>
            <p className="mt-2 text-slate-600">Start free. Upgrade when AI search is a real channel.</p>
          </div>
          <Link href="/pricing" className="text-sm font-semibold text-brand-600 hover:underline">
            Compare plans →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`card-hover flex flex-col ${
                p.id === "growth"
                  ? "border-teal-400 ring-2 ring-teal-100"
                  : p.id === "agency"
                    ? "border-violet-200"
                    : "border-sky-100"
              }`}
            >
              {p.featured && (
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-700">Most popular</p>
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
          {featured.name} includes all six engines and competitor share of voice.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h2 className="mb-6 text-center font-display text-3xl font-semibold text-slate-900">Questions</h2>
        <FaqList items={FAQS.slice(0, 4)} />
        <p className="mt-6 text-center text-sm">
          <Link href="/faq" className="font-semibold text-brand-600 hover:underline">
            Read all FAQs →
          </Link>
        </p>
      </section>

      <section className="px-6 pb-20">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-violet-800 to-slate-900 px-8 py-14 text-center text-white">
          <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-amber-400/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-8 bottom-0 h-40 w-40 rounded-full bg-sky-400/30 blur-3xl" />
          <h2 className="relative font-display text-3xl font-semibold">See if AI search already cites you</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-teal-100">
            Create a brand, generate prompts, and watch a live-style scan like the demo above.
          </p>
          <Link href="/register" className="btn-primary relative mt-8 bg-white text-teal-800 hover:bg-amber-50">
            Start free
          </Link>
        </div>
      </section>
    </main>
  );
}
