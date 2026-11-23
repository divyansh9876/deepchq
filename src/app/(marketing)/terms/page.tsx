import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { BRAND_NAME } from "@/lib/brand";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: "Terms of use for the Deepchq product and website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold text-slate-900">Terms of use</h1>
      <p className="mt-2 text-sm text-slate-400">Last updated September 11, 2026</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600">
        <p>
          By creating an account or using deepchq.com you agree to these terms. If you are using Deepchq for a company,
          you represent that you can bind that company.
        </p>
        <h2 className="text-lg font-semibold text-slate-900">The service</h2>
        <p>
          Deepchq provides brand reports, prompt tracking, GEO audits, and recommendations. Engine coverage and scan
          fidelity depend on your plan and available connectors. Results are directional; they are not a guarantee of
          ranking or citation in any AI product.
        </p>
        <h2 className="text-lg font-semibold text-slate-900">Acceptable use</h2>
        <p>
          Do not abuse APIs, scrape other customers’ data, or use the product to infringe third-party rights. We may
          suspend accounts that violate this.
        </p>
        <h2 className="text-lg font-semibold text-slate-900">Billing</h2>
        <p>
          Paid plans renew until canceled. Starter remains free subject to fair-use limits. Fees are non-refundable
          except where required by law.
        </p>
        <h2 className="text-lg font-semibold text-slate-900">Limitation of liability</h2>
        <p>
          The service is provided “as is.” To the extent permitted by law, Deepchq is not liable for lost profits or
          indirect damages arising from use of the reports.
        </p>
      </div>
    </main>
  );
}
