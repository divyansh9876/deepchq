import type { Metadata } from "next";
import { FaqList } from "@/components/marketing/FaqList";
import { PricingGrid } from "@/components/marketing/PricingGrid";
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
        <h1 className="display mt-3 text-4xl font-semibold text-slate-900">Plans that match how you work GEO</h1>
        <p className="mt-4 text-lg text-slate-600">
          Measure one brand for free. Add engines, competitors, and client workspaces when you are ready.
        </p>
      </div>
      <PricingGrid />
      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="mb-6 text-center font-display text-2xl font-semibold text-slate-900">Billing questions</h2>
        <FaqList items={pricingFaqs} />
      </div>
    </main>
  );
}
