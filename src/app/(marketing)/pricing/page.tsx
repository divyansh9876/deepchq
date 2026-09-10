import type { Metadata } from "next";
import Link from "next/link";
import { PLANS } from "@/lib/marketing";
import { FaqList } from "@/components/marketing/FaqList";
import { BRAND_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Pricing — ${BRAND_NAME}`,
  description: "Starter is free. Growth and Agency plans for teams that need full AI engine coverage.",
};

const pricingFaqs = [
  {
    q: "What happens after the Growth trial?",
    a: "You can stay on Growth, downgrade to Starter (limits apply), or talk to us about Agency. We email you before the trial ends.",
  },
  {
    q: "Do unused scans roll over?",
    a: "No. Scan cadence is included in the plan (monthly, weekly, or daily). Unused capacity does not accrue.",
  },
  {
    q: "Can agencies white-label reports?",
    a: "Agency includes client-ready PDFs and shared workspaces. Custom logos and domains are available on request.",
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Pricing</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Plans that match how you work GEO</h1>
        <p className="mt-4 text-lg text-slate-600">
          Measure one brand for free. Add engines, competitors, and client workspaces when you are ready.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.id}
            className={`card flex flex-col ${p.featured ? "relative border-brand-500 ring-2 ring-brand-100" : ""}`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                Most popular
              </span>
            )}
            <h2 className="text-xl font-semibold text-slate-900">{p.name}</h2>
            <p className="mt-4 text-4xl font-bold text-slate-900">
              {p.price}
              <span className="text-base font-normal text-slate-500">{p.period}</span>
            </p>
            <p className="mt-3 text-sm text-slate-600">{p.blurb}</p>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm text-slate-700">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-brand-600">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href={p.href} className={`mt-8 w-full ${p.featured ? "btn-primary" : "btn-secondary"}`}>
              {p.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          { t: "Annual billing", d: "Save two months on Growth and Agency when you pay yearly." },
          { t: "Switch anytime", d: "Upgrade, downgrade, or cancel from the workspace. No lock-in." },
          { t: "Human support", d: "Growth gets email support. Agency gets a named onboarding lead." },
        ].map((x) => (
          <div key={x.t} className="card">
            <h3 className="font-semibold text-slate-900">{x.t}</h3>
            <p className="mt-2 text-sm text-slate-600">{x.d}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="mb-6 text-center text-2xl font-bold text-slate-900">Billing questions</h2>
        <FaqList items={pricingFaqs} />
      </div>
    </main>
  );
}
