import { MarketingNav } from "@/components/MarketingNav";
import { MarketingFooter } from "@/components/MarketingFooter";
import { BRAND_NAME } from "@/lib/brand";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900">About {BRAND_NAME}</h1>
        <p className="mt-6 leading-relaxed text-slate-600">
          {BRAND_NAME} helps you discover publicly available digital footprints connected
          to names, emails, or phone numbers. We aggregate signals from open web sources
          and present them in a clear, structured report.
        </p>
        <p className="mt-4 leading-relaxed text-slate-600">
          Our mission is informational transparency — not surveillance. We do not access
          private databases or non-public accounts.
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}
