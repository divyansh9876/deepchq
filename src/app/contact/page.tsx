import { MarketingNav } from "@/components/MarketingNav";
import { MarketingFooter } from "@/components/MarketingFooter";
import { SUPPORT_EMAIL } from "@/lib/brand";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>
        <p className="mt-6 text-slate-600">
          Email:{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-600">
            {SUPPORT_EMAIL}
          </a>
        </p>
        <p className="mt-4 text-slate-600">
          For inaccuracy reports, use the feedback form on your{" "}
          <a href="/account" className="text-blue-600">
            account page
          </a>
          .
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}
