import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Careers — ${BRAND_NAME}`,
  description: "Open roles at Deepchq.",
};

const ROLES = [
  {
    title: "Full-stack engineer",
    loc: "Remote · India-friendly hours",
    desc: "Own product surfaces from Next.js UI to scan pipelines. Comfortable with TypeScript.",
  },
  {
    title: "GEO analyst",
    loc: "Remote",
    desc: "Turn scan data into playbooks. Write the recommendations customers actually ship.",
  },
  {
    title: "Customer success (Agency)",
    loc: "Bengaluru / remote",
    desc: "Onboard agencies, help them productize GEO retainers, and feed product gaps back to engineering.",
  },
];

export default function CareersPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Careers</p>
      <h1 className="mt-3 text-4xl font-bold text-slate-900">Build the measurement layer for AI search</h1>
      <p className="mt-4 text-slate-600">
        Small team, high ownership. We care more about shipped taste than pedigree.
      </p>
      <div className="mt-10 space-y-4">
        {ROLES.map((r) => (
          <div key={r.title} className="card">
            <h2 className="font-semibold text-slate-900">{r.title}</h2>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">{r.loc}</p>
            <p className="mt-3 text-sm text-slate-600">{r.desc}</p>
            <Link href="/contact?plan=other" className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:underline">
              Apply via contact →
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
