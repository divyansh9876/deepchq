import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Privacy — ${BRAND_NAME}`,
  description: "How Deepchq collects and uses account and scan data.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold text-slate-900">Privacy policy</h1>
      <p className="mt-2 text-sm text-slate-400">Last updated September 11, 2026</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600">
        <p>
          Deepchq (“we”) provides AI search visibility software. This policy explains what we collect when you use the
          product and marketing site.
        </p>
        <h2 className="text-lg font-semibold text-slate-900">Account data</h2>
        <p>
          When you register we store your name, email, and a hashed password. You can request deletion by emailing
          hello@deepchq.com.
        </p>
        <h2 className="text-lg font-semibold text-slate-900">Brand and scan data</h2>
        <p>
          Brand names, domains, competitors, prompts, audit results, and scan outputs live in your workspace so we can
          show reports. We do not sell this data. Simulated or live engine queries may include the prompt text you
          configure.
        </p>
        <h2 className="text-lg font-semibold text-slate-900">Cookies</h2>
        <p>
          We use a session cookie to keep you signed in. The marketing site does not use advertising trackers.
        </p>
        <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
        <p>Privacy questions: hello@deepchq.com</p>
      </div>
    </main>
  );
}
