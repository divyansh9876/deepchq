import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { FaqList } from "@/components/marketing/FaqList";
import { PricingGrid } from "@/components/marketing/PricingGrid";
import { BRAND_NAME } from "@/lib/brand";
import { JsonLd } from "@/components/seo/JsonLd";
import { ORG_ID, absolute, faqLd } from "@/lib/seo";
import { PLAN_PRICES } from "@/lib/plans";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description: "Deepchq is free for one brand. Growth ($79/mo) adds all six AI engines, weekly automated scans and CSV export; Agency ($249/mo) adds daily scans and unlimited brands.",
  path: "/pricing",
});

const pricingFaqs = [
  {
    q: "What happens after the Growth trial?",
    a: "We email you three days before it ends. Subscribe from Settings to keep Growth; otherwise your account moves to the free plan automatically and your data is kept.",
  },
  {
    q: "Do unused scans roll over?",
    a: "No. Scan cadence is included in the plan (monthly, weekly, or daily). Unused capacity does not accrue.",
  },
  {
    q: "How do I pay?",
    a: "Checkout is handled by Razorpay and supports international cards. Subscriptions renew automatically and can be cancelled from Settings at any time.",
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <JsonLd
        data={[
          {
            "@type": "SoftwareApplication",
            name: BRAND_NAME,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url: absolute("/"),
            publisher: { "@id": ORG_ID },
            offers: [
              { "@type": "Offer", name: "Starter", price: "0", priceCurrency: "USD" },
              { "@type": "Offer", name: "Growth", price: String(PLAN_PRICES.growth.monthly / 100), priceCurrency: "USD", url: absolute("/pricing") },
              { "@type": "Offer", name: "Agency", price: String(PLAN_PRICES.agency.monthly / 100), priceCurrency: "USD", url: absolute("/pricing") },
            ],
          },
          faqLd(pricingFaqs),
        ]}
      />
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
