import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export default function NotFound() {
  return (
    <MarketingShell>
      <main className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-sm font-semibold text-brand-600">404</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">That URL does not exist. Head back to the product or pricing.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-primary">
            Home
          </Link>
          <Link href="/pricing" className="btn-secondary">
            Pricing
          </Link>
        </div>
      </main>
    </MarketingShell>
  );
}
