import Link from "next/link";
import { FAQS, PLANS, STATS, STAT_TONES, STEPS, USE_CASES } from "@/lib/marketing";
import { FaqList } from "@/components/marketing/FaqList";
import { EngineMarquee } from "@/components/marketing/EngineMarquee";
import { EnginePills } from "@/components/marketing/EnginePills";
import { FeatureTabs } from "@/components/marketing/FeatureTabs";
import { AnswerSimulator } from "@/components/marketing/AnswerSimulator";
import { AutomationSteps } from "@/components/marketing/AutomationSteps";
import { CountUp, Reveal } from "@/components/marketing/motion";
import { DomainAuditForm } from "@/components/tools/DomainAuditForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { GUIDES } from "@/content/guides";
import { ENGINE_PAGES } from "@/content/landing";
import { AI_ENGINES, BRAND_DESCRIPTION, BRAND_NAME } from "@/lib/brand";
import { PLAN_PRICES } from "@/lib/plans";
import { ORG_ID, absolute, faqLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `${BRAND_NAME} — Track & Grow Your Brand in ChatGPT, Perplexity and Google AI`,
  description:
    "Deepchq is the AI search visibility platform: see if ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews and Copilot recommend your brand, audit your site for GEO, and get an automated action plan. Free to start.",
  path: "/",
});

const AUTOMATION = [
  {
    t: "Prompts generated",
    d: "Starter prompts from your keywords across TOFU, MOFU and BOFU.",
    c: "bg-brand-600",
    detail: "Your category keywords become the questions buyers actually type into AI assistants, grouped by funnel stage.",
  },
  {
    t: "Site audited",
    d: "20 GEO checks run the moment you add a brand.",
    c: "bg-fuchsia-600",
    detail: "robots.txt, llms.txt, schema, answer-ready content and AI crawler access are checked and scored by impact.",
  },
  {
    t: "Engines scanned",
    d: "Live answers from ChatGPT, Perplexity, Gemini and Claude.",
    c: "bg-amber-500",
    detail: "Every prompt is asked on every engine; we record mentions, rank, sentiment, citations and which competitors won.",
  },
  {
    t: "Actions ranked",
    d: "A prioritised fix list, refreshed after every scan.",
    c: "bg-sky-600",
    detail: "Lost prompts and failed audit checks turn into specific tasks, ordered by how much visibility they can move.",
  },
  {
    t: "Digest emailed",
    d: "Visibility changes land in your inbox on schedule.",
    c: "bg-rose-500",
    detail: "After each scheduled scan you get what moved, what was lost to competitors and the next action to take.",
  },
];

export default function HomePage() {
  const featured = PLANS.find((p) => p.featured)!;
  const topGuides = GUIDES.slice(0, 6);

  return (
    <main>
      <JsonLd
        data={[
          {
            "@type": "SoftwareApplication",
            name: BRAND_NAME,
            description: BRAND_DESCRIPTION,
            applicationCategory: "BusinessApplication",
            applicationSubCategory: "Generative Engine Optimization (GEO)",
            operatingSystem: "Web",
            url: absolute("/"),
            publisher: { "@id": ORG_ID },
            featureList: [
              "AI search visibility tracking",
              `Live scans of ${AI_ENGINES.map((e) => e.name).join(", ")}`,
              "Competitor share of voice",
              "GEO site audit",
              "Automated recommendations and email digests",
            ],
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "USD",
              lowPrice: "0",
              highPrice: String(PLAN_PRICES.agency.monthly / 100),
              offerCount: 3,
            },
          },
          faqLd(FAQS),
        ]}
      />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-brand-300/45 blur-3xl blob" />
        <div className="pointer-events-none absolute -right-16 top-32 h-96 w-96 rounded-full bg-fuchsia-300/35 blur-3xl blob" style={{ animationDelay: "4s" }} />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-amber-200/50 blur-3xl blob" style={{ animationDelay: "8s" }} />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-14 md:grid-cols-2 md:pt-20">
          <div className="min-w-0">
            <p className="hero-in inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-700 shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-prism" />
              Generative engine optimization
            </p>
            <h1 className="hero-in-2 display mt-4 text-4xl font-semibold text-slate-900 md:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
              Find out if AI <span className="text-prism">recommends your brand</span> — then make it happen
            </h1>
            <p className="hero-in-3 mt-5 max-w-lg text-lg text-slate-600">
              {BRAND_NAME} tracks mentions, citations and competitor share of voice across ChatGPT, Perplexity, Google AI Overviews, Gemini, Claude and Copilot — and runs the
              scans, audits and action plans for you, automatically.
            </p>
            <div className="hero-in-4 mt-8">
              <p className="mb-2 text-sm font-medium text-slate-700">Free instant check — enter your site:</p>
              <DomainAuditForm />
            </div>
            <p className="hero-in-4 mt-4 text-sm text-slate-500">
              or{" "}
              <Link href="/register" className="font-semibold text-brand-700 hover:underline">
                create a free brand report
              </Link>{" "}
              · no credit card
            </p>
            <EnginePills />
          </div>
          <div className="hero-in-3 min-w-0">
            <AnswerSimulator />
          </div>
        </div>
      </section>

      <EngineMarquee />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 80} className={`card spotlight text-center ${STAT_TONES[idx].wrap}`}>
              <p className={`font-display text-4xl font-semibold ${STAT_TONES[idx].num}`}>
                <CountUp value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm text-slate-500">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <Reveal>
          <h2 className="display text-3xl font-semibold text-slate-900">One platform to see if AI recommends you</h2>
          <p className="mt-3 max-w-2xl text-slate-600">Click a capability. Research prompts, monitor engines, audit pages, and act — in one report.</p>
        </Reveal>
        <div className="mt-10">
          <FeatureTabs />
        </div>
      </section>

      <section className="border-y border-brand-100 bg-gradient-to-b from-brand-50/70 to-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Runs on autopilot</p>
            <h2 className="display mt-2 text-3xl font-semibold text-slate-900">Add a brand once. Everything else happens on its own.</h2>
          </Reveal>
          <AutomationSteps steps={AUTOMATION} />
        </div>
      </section>

      <section className="border-b border-fuchsia-100 bg-gradient-to-b from-fuchsia-50/80 to-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="display text-3xl font-semibold text-slate-900">Three steps. Then a weekly habit.</h2>
          </Reveal>
          <div className="relative mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map((s, idx) => (
              <Reveal key={s.n} delay={idx * 100} className={`relative rounded-2xl border p-6 ${s.wash}`}>
                <p className={`font-display text-2xl font-semibold ${s.tone}`}>{s.n}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <h2 className="display text-3xl font-semibold text-slate-900">Every engine, tracked its own way</h2>
          <p className="mt-3 max-w-2xl text-slate-600">Each AI engine finds and trusts sources differently. See how each works and what we measure.</p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ENGINE_PAGES.map((e, i) => {
            const color = AI_ENGINES.find((x) => x.id === e.engine)?.color ?? "#5a36f0";
            return (
              <Reveal key={e.slug} delay={i * 60}>
                <Link href={`/ai-visibility/${e.slug}`} className="spotlight group flex items-center gap-4 rounded-2xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md" style={{ borderColor: `${color}44` }}>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold text-white" style={{ background: color }}>{e.name[0]}</span>
                  <span>
                    <span className="block font-semibold text-slate-900">{e.name}</span>
                    <span className="text-sm text-slate-500 group-hover:text-slate-700">{e.title.replace(e.name, "").trim()} <span className="inline-block transition-transform group-hover:translate-x-1">→</span></span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <Reveal>
          <h2 className="display text-3xl font-semibold text-slate-900">Built for teams who own the channel</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {USE_CASES.map((u, idx) => (
            <Reveal key={u.title} delay={idx * 80} className={`spotlight rounded-2xl border p-6 shadow-sm transition duration-300 hover:-translate-y-1 ${u.wash}`}>
              <span className={`mb-4 inline-block h-2 w-10 rounded-full ${u.chip}`} />
              <h3 className="font-semibold text-slate-900">{u.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{u.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-transparent px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal>
              <h2 className="display text-3xl font-semibold text-slate-900">Learn GEO from the people who measure it</h2>
              <p className="mt-2 text-slate-600">Short, practical, updated guides.</p>
            </Reveal>
            <Link href="/learn" className="text-sm font-semibold text-brand-700 hover:underline">All guides →</Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {topGuides.map((g, i) => (
              <Reveal key={g.slug} delay={i * 60}>
                <Link href={`/learn/${g.slug}`} className="spotlight group block h-full rounded-2xl border border-amber-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{g.category}</p>
                  <h3 className="mt-2 font-semibold text-slate-900 group-hover:text-brand-700">{g.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{g.description}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
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
              className={`card-hover spotlight flex flex-col ${p.id === "growth" ? "border-brand-400 ring-2 ring-brand-100" : p.id === "agency" ? "border-fuchsia-200" : "border-sky-100"}`}
            >
              {p.featured && <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-700">Most popular</p>}
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
        <p className="mt-4 text-center text-sm text-slate-400">{featured.name} includes all six engines and a 14-day free trial.</p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h2 className="mb-6 text-center font-display text-3xl font-semibold text-slate-900">Questions</h2>
        <FaqList items={FAQS} />
      </section>

      <section className="px-6 pb-20">
        <div className="gradient-shift relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-prism-dark px-8 py-14 text-center text-white shadow-2xl shadow-fuchsia-900/20">
          <div className="cta-orb pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-amber-400/30 blur-3xl" />
          <div className="cta-orb pointer-events-none absolute -right-8 bottom-0 h-40 w-40 rounded-full bg-sky-400/30 blur-3xl" style={{ animationDelay: "2s" }} />
          <h2 className="relative font-display text-3xl font-semibold">See if AI search already cites you</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-brand-100">Run the free audit now, or create a brand and let the first live scan run automatically.</p>
          <div className="relative mx-auto mt-8 max-w-xl">
            <DomainAuditForm dark />
          </div>
        </div>
      </section>
    </main>
  );
}
