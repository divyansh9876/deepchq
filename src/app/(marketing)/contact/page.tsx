import type { Metadata } from "next";
import { Suspense } from "react";
import { BRAND_NAME } from "@/lib/brand";
import { ContactForm } from "@/components/marketing/ContactForm";

export const metadata: Metadata = {
  title: `Contact — ${BRAND_NAME}`,
  description: "Talk to Deepchq about demos, Agency plans, and partnerships.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Contact</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">Let’s talk GEO</h1>
          <p className="mt-4 text-slate-600">
            Demos, Agency onboarding, and partnership questions. We reply within one business day.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <p>
              <span className="font-semibold text-slate-900">Email</span>
              <br />
              <a href="mailto:hello@deepchq.com" className="text-brand-600 hover:underline">
                hello@deepchq.com
              </a>
            </p>
            <p>
              <span className="font-semibold text-slate-900">Hours</span>
              <br />
              <span className="text-slate-600">Monday–Friday, 9:00–18:00 IST</span>
            </p>
            <p>
              <span className="font-semibold text-slate-900">HQ</span>
              <br />
              <span className="text-slate-600">Bengaluru, India · remote-first</span>
            </p>
          </div>
        </div>
        <Suspense fallback={<div className="card h-80 animate-pulse bg-slate-50" />}>
          <ContactForm />
        </Suspense>
      </div>
    </main>
  );
}
