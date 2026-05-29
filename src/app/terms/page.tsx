import Link from "next/link";
import { MarketingNav } from "@/components/MarketingNav";
import { MarketingFooter } from "@/components/MarketingFooter";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { BRAND_NAME } from "@/lib/brand";
import { TERMS_LAST_UPDATED, TERMS_SECTIONS } from "@/lib/legal/terms-sections";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <MarketingNav />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-center text-xs uppercase tracking-wide text-slate-500">
          {BRAND_NAME}
        </p>
        <h1 className="mt-2 text-center text-3xl font-bold text-slate-900">
          Terms of Use
        </h1>
        <hr className="my-8 border-slate-200" />

        <p className="mb-10 text-sm text-slate-600">
          <strong className="text-slate-800">In General.</strong> These Terms govern
          your access to {BRAND_NAME}. By using our website or app you agree to these
          Terms and our{" "}
          <Link href="/privacy" className="text-blue-600 underline">
            Privacy Policy
          </Link>
          .
        </p>

        <LegalDocument sections={TERMS_SECTIONS} />

        <p className="mt-12 border-t border-slate-200 pt-8 text-xs text-slate-500">
          Last update: {TERMS_LAST_UPDATED}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/landing/register" className="btn-primary">
            Join now
          </Link>
          <Link href="/ads/google/step/1" className="btn-outline">
            Try Now
          </Link>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
