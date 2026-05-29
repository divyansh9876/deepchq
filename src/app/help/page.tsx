import { MarketingNav } from "@/components/MarketingNav";
import { MarketingFooter } from "@/components/MarketingFooter";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { getFaqItems } from "@/lib/marketing/home-content";
import Link from "next/link";

export default function HelpPage() {
  const faqItems = getFaqItems();

  return (
    <div className="min-h-screen bg-black text-white">
      <MarketingNav dark />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold">Help Center</h1>
        <p className="mt-2 text-gray-400">
          Quick answers about searches, privacy, and subscriptions.
        </p>
        <div className="mt-10">
          <FaqAccordion items={faqItems} />
        </div>
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link href="/pricing" className="text-blue-400 hover:underline">
            Pricing
          </Link>
          <Link href="/refund" className="text-blue-400 hover:underline">
            Refund Policy
          </Link>
          <Link href="/contact" className="text-blue-400 hover:underline">
            Contact Us
          </Link>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
