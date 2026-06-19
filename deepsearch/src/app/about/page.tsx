import { MarketingNav } from "@/components/MarketingNav";
import { BRAND_NAME } from "@/lib/brand";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold">About {BRAND_NAME}</h1>
        <p className="mt-6 text-gray-600 leading-relaxed">
          {BRAND_NAME} helps you discover publicly available digital footprints connected
          to names, emails, or phone numbers. We aggregate signals from open web sources
          and present them in a clear, structured report.
        </p>
        <p className="mt-4 text-gray-600 leading-relaxed">
          Our mission is informational transparency — not surveillance. We do not access
          private databases or non-public accounts.
        </p>
      </main>
    </div>
  );
}
