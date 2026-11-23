import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { BRAND_NAME } from "@/lib/brand";
import { FaqList } from "@/components/marketing/FaqList";
import { FAQS } from "@/lib/marketing";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description: "Answers about generative engine optimization, which AI engines Deepchq tracks, live vs estimated data, automation, billing and cancellation.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <JsonLd data={faqLd(FAQS)} />
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">FAQ</p>
      <h1 className="mt-3 text-4xl font-bold text-slate-900">Frequently asked questions</h1>
      <p className="mt-4 text-slate-600">
        Still stuck?{" "}
        <Link href="/contact" className="font-semibold text-brand-600 hover:underline">
          Contact the team
        </Link>
        .
      </p>
      <div className="mt-10">
        <FaqList items={FAQS} />
      </div>
    </main>
  );
}
