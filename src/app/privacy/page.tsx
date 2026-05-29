import { MarketingNav } from "@/components/MarketingNav";
import { MarketingFooter } from "@/components/MarketingFooter";
import { BRAND_NAME, SUPPORT_EMAIL } from "@/lib/brand";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <main className="mx-auto max-w-3xl px-6 py-16 text-sm leading-relaxed text-slate-600">
        <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="mt-6">
          {BRAND_NAME} collects account email, search queries, and usage analytics to
          operate the service. We do not sell personal information.
        </p>
        <h2 className="mt-8 text-lg font-semibold text-slate-900">Data we store</h2>
        <ul className="mt-2 list-disc pl-6 space-y-1">
          <li>Account credentials (hashed passwords)</li>
          <li>Search history tied to your account</li>
          <li>UTM attribution for ad funnel sessions</li>
        </ul>
        <h2 className="mt-8 text-lg font-semibold text-slate-900">Your rights</h2>
        <p className="mt-2">
          Request access or deletion by emailing{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-600">
            {SUPPORT_EMAIL}
          </a>
          . We respond within a reasonable timeframe.
        </p>
        <h2 className="mt-8 text-lg font-semibold text-slate-900">Children</h2>
        <p className="mt-2">
          {BRAND_NAME} is not intended for users under 18 years of age.
        </p>
        <Link href="/" className="mt-8 inline-block text-blue-600">
          ← Home
        </Link>
      </main>
      <MarketingFooter />
    </div>
  );
}
