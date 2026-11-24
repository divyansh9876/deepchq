import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { getGuide } from "@/content/guides";
import { ScoreRing } from "@/components/tools/ScoreRing";
import { scoreTone } from "@/lib/score";
import { EmailReport, ShareReport } from "@/components/tools/ReportActions";
import { DomainAuditForm } from "@/components/tools/DomainAuditForm";
import { Reveal } from "@/components/marketing/motion";
import { absolute } from "@/lib/seo";
import type { AuditCheck } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  const a = db.publicAudits.get((await params).id);
  if (!a) return { robots: { index: false } };
  return {
    title: `${a.domain} AI search readiness: ${a.overallScore}/100`,
    description: `GEO audit for ${a.domain}: ${a.checks.filter((c) => c.status !== "pass").length} issues found across AI crawler access, schema and content structure.`,
    robots: { index: false, follow: true },
  };
}

const STATUS: Record<AuditCheck["status"], { dot: string; chip: string; label: string }> = {
  fail: { dot: "bg-rose-500", chip: "bg-rose-50 text-rose-700 ring-rose-100", label: "Fix" },
  warn: { dot: "bg-amber-400", chip: "bg-amber-50 text-amber-700 ring-amber-100", label: "Improve" },
  pass: { dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700 ring-emerald-100", label: "Pass" },
};

export default async function ReportPage({ params }: Props) {
  const a = db.publicAudits.get((await params).id);
  if (!a) notFound();
  const order = { fail: 0, warn: 1, pass: 2 } as const;
  const impact = { high: 0, medium: 1, low: 2 } as const;
  const checks = [...a.checks].sort((x, y) => order[x.status] - order[y.status] || impact[x.impact] - impact[y.impact]);
  const counts = { fail: 0, warn: 0, pass: 0 };
  a.checks.forEach((c) => counts[c.status]++);
  const tone = scoreTone(a.overallScore);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid items-center gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:grid-cols-[auto_1fr]">
        <ScoreRing score={a.overallScore} size={176} />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">AI search readiness</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-slate-900">{a.domain}</h1>
          <p className={`mt-1 font-medium ${tone.text}`}>{tone.label}</p>
          <div className="mt-4 flex flex-wrap gap-6 text-sm">
            <div><p className="text-2xl font-semibold text-slate-900">{a.crawlabilityScore}</p><p className="text-slate-500">Crawlability</p></div>
            <div><p className="text-2xl font-semibold text-slate-900">{a.contentScore}</p><p className="text-slate-500">Content &amp; entity</p></div>
            <div><p className="text-2xl font-semibold text-rose-600">{counts.fail}</p><p className="text-slate-500">Critical</p></div>
            <div><p className="text-2xl font-semibold text-amber-500">{counts.warn}</p><p className="text-slate-500">To improve</p></div>
            <div><p className="text-2xl font-semibold text-brand-600">{counts.pass}</p><p className="text-slate-500">Passed</p></div>
          </div>
          <p className="mt-4 text-xs text-slate-400">Checked {a.createdAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })} · {a.url}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="card"><p className="mb-3 text-sm font-semibold text-slate-900">Share this report</p><ShareReport url={absolute(`/report/${a.id}`)} domain={a.domain} score={a.overallScore} /></div>
        <div className="card"><p className="mb-3 text-sm font-semibold text-slate-900">Get it by email + a heads-up when it changes</p><EmailReport id={a.id} /></div>
      </div>

      <h2 className="mt-12 font-display text-2xl font-semibold text-slate-900">Findings and fixes</h2>
      <ul className="mt-5 space-y-3">
        {checks.map((c, i) => {
          const s = STATUS[c.status];
          const guide = c.guide ? getGuide(c.guide) : null;
          return (
            <Reveal key={c.id} delay={Math.min(i, 8) * 40}>
              <li className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
                  <span className="font-semibold text-slate-900">{c.label}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${s.chip}`}>{s.label}</span>
                  <span className="text-xs uppercase text-slate-400">{c.impact} impact</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{c.detail}</p>
                {c.status !== "pass" && c.fix && <p className="mt-2 text-sm text-slate-800"><span className="font-semibold">How to fix:</span> {c.fix}</p>}
                {c.status !== "pass" && guide && <Link href={`/learn/${guide.slug}`} className="mt-2 inline-block text-sm font-medium text-brand-700 hover:underline">Guide: {guide.title} →</Link>}
              </li>
            </Reveal>
          );
        })}
      </ul>

      <section className="gradient-shift mt-14 rounded-3xl bg-gradient-to-br from-brand-800 via-fuchsia-800 to-slate-900 p-10 text-white">
        <h2 className="font-display text-3xl font-semibold">Readiness is step one. Are you actually being recommended?</h2>
        <p className="mt-3 max-w-2xl text-brand-100">
          Track whether ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews and Copilot mention {a.domain} for the questions your buyers ask — with weekly automatic scans.
        </p>
        <Link href="/register" className="btn-primary mt-6 bg-white text-brand-800 hover:bg-amber-50">Track {a.domain} free</Link>
      </section>

      <section className="mt-14">
        <h2 className="text-lg font-semibold text-slate-900">Audit another site</h2>
        <div className="mt-4 max-w-xl"><DomainAuditForm /></div>
      </section>
    </main>
  );
}
