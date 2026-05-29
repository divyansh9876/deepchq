import { MarketingNav } from "@/components/MarketingNav";
import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold">Help Center</h1>
        <ul className="mt-8 space-y-4 text-sm text-gray-700">
          <li>
            <strong>How does search work?</strong> — We query public web sources and
            synthesize a structured profile report.
          </li>
          <li>
            <strong>Can people know I searched?</strong> — Searches are private to your
            account; subjects are not notified.
          </li>
          <li>
            <strong>What if nothing is found?</strong> — Try alternate spellings or add
            location context in a future update.
          </li>
        </ul>
        <div className="mt-8 flex gap-4 text-sm">
          <Link href="/#faq" className="text-blue-600">
            FAQ
          </Link>
          <Link href="/pricing" className="text-blue-600">
            Pricing
          </Link>
          <Link href="/refund" className="text-blue-600">
            Refund Policy
          </Link>
        </div>
      </main>
    </div>
  );
}
