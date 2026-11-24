import Link from "next/link";
import { ENGINE_PAGES } from "@/content/landing";
import { AI_ENGINES } from "@/lib/brand";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { AuditCta } from "@/components/content/AuditCta";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Visibility Trackers for ChatGPT, Perplexity, Gemini, Claude & More",
  description: "Track how each AI engine talks about your brand. Mention rate, citations, sentiment and share of voice for ChatGPT, Perplexity, Google AI Overviews, Gemini, Claude and Copilot.",
  path: "/ai-visibility",
});

export default function EnginesIndex() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <Breadcrumbs items={[{ name: "AI visibility", path: "/ai-visibility" }]} />
      <h1 className="mt-6 font-display text-4xl font-semibold text-slate-900 md:text-5xl">Track your brand in every AI engine</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">Each engine finds and trusts sources differently. Pick one to see how it works and what Deepchq measures.</p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ENGINE_PAGES.map((e) => {
          const color = AI_ENGINES.find((x) => x.id === e.engine)?.color ?? "#0d7367";
          return (
            <Link key={e.slug} href={`/ai-visibility/${e.slug}`} className="group rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md" style={{ borderColor: `${color}55` }}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: color }}>{e.name[0]}</span>
              <h2 className="mt-4 font-semibold text-slate-900">{e.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{e.description}</p>
              <p className="mt-4 text-sm font-semibold" style={{ color }}>Learn more →</p>
            </Link>
          );
        })}
      </div>
      <div className="mt-16"><AuditCta /></div>
    </main>
  );
}
