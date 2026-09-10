import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/brand";
import { FaqList } from "@/components/marketing/FaqList";
import { FAQS } from "@/lib/marketing";
import Link from "next/link";

export const metadata: Metadata = {
  title: `FAQ — ${BRAND_NAME}`,
  description: "Answers about GEO, engines, billing, and how Deepchq scans AI search.",
};

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
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
