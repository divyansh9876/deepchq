import { MarketingNav } from "@/components/MarketingNav";
import { BRAND_NAME } from "@/lib/brand";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-gray-300">
      <MarketingNav dark />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-center text-3xl font-bold text-gray-400">Terms of Use</h1>
        <hr className="my-8 border-gray-700" />
        <section className="space-y-4 text-sm leading-relaxed">
          <p>
            {BRAND_NAME} helps users conduct searches about people using{" "}
            <strong className="text-white">public sources only</strong>. By using this
            service you agree these terms.
          </p>
          <h2 className="text-lg font-semibold text-white">1. In General</h2>
          <p>
            This application is for informational purposes. It is not a consumer
            reporting agency and must not be used for employment, credit, tenant
            screening, or similar regulated decisions.
          </p>
          <h2 className="text-lg font-semibold text-white">2. Search</h2>
          <p>
            Searches are conducted solely from publicly available information. Private
            or non-public data is excluded.
          </p>
          <h2 className="text-lg font-semibold text-white">3. Subscriptions</h2>
          <p>
            Weekly, quarterly, and yearly plans may auto-renew until canceled. Access
            continues through the end of the paid period after cancellation.
          </p>
          <h2 className="text-lg font-semibold text-white">4. Prohibited uses</h2>
          <p>
            Do not use {BRAND_NAME} for employment screening, tenant decisions, credit
            eligibility, stalking, harassment, or any unlawful purpose. You must be 18
            or older.
          </p>
          <h2 className="text-lg font-semibold text-white">5. Accuracy</h2>
          <p>
            Results may be incomplete or refer to a different person with the same name.
            Report issues via the{" "}
            <a href="/account" className="text-blue-400 underline">
              feedback form
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
