import { MarketingNav } from "@/components/MarketingNav";
import { MarketingFooter } from "@/components/MarketingFooter";
import { SUPPORT_EMAIL } from "@/lib/brand";
import Link from "next/link";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <main className="mx-auto max-w-3xl px-6 py-16 text-sm leading-relaxed text-slate-600">
        <h1 className="text-3xl font-bold text-slate-900">Refund Policy</h1>
        <p className="mt-6">
          Subscriptions are processed through Stripe or your app store account. Refund
          requests for in-app purchases follow Apple App Store or Google Play Store
          policies.
        </p>
        <p className="mt-4">
          For web subscriptions, contact{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-600">
            {SUPPORT_EMAIL}
          </a>{" "}
          within 14 days of purchase with your account email.
        </p>
        <p className="mt-4">
          After cancellation, access continues until the end of the paid billing period.
        </p>
        <Link href="/terms" className="mt-8 inline-block text-blue-600">
          ← Terms of Use
        </Link>
      </main>
      <MarketingFooter />
    </div>
  );
}
