"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MarketingNav } from "@/components/MarketingNav";
import { MarketingFooter } from "@/components/MarketingFooter";

const PLANS = [
  {
    key: "basic" as const,
    name: "Basic",
    features: [
      "Unlimited Advanced Search",
      "AI-Powered Deep Reports",
      "Access Photos & Online Sources",
    ],
  },
  {
    key: "pro" as const,
    name: "Pro",
    badge: "Special Offer",
    price: "$0.71 per day",
    features: [
      "Unlimited Advanced Search",
      "AI-Powered Deep Reports",
      "Access Photos & Online Sources",
    ],
  },
];

function PricingContent() {
  const params = useSearchParams();
  const searchId = params.get("searchId") ?? undefined;
  const [interval, setInterval] = useState<"weekly" | "quarterly" | "yearly">(
    "weekly",
  );
  const [loading, setLoading] = useState<string | null>(null);

  async function subscribe(plan: "basic" | "pro") {
    setLoading(plan);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, interval, searchId }),
    });
    const data = await res.json();
    setLoading(null);
    if (res.status === 401) {
      window.location.href = `/landing/register?next=/pricing`;
      return;
    }
    if (data.url) window.location.href = data.url;
  }

  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <main className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Pricing</h1>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {(["weekly", "quarterly", "yearly"] as const).map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInterval(i)}
              className={`rounded-full px-4 py-2 text-sm capitalize transition ${
                interval === i
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {i === "quarterly"
                ? "Quarterly -33%"
                : i === "yearly"
                  ? "Yearly -75%"
                  : "Weekly"}
            </button>
          ))}
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm"
            >
              <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
              {p.badge && (
                <span className="mt-2 inline-block text-sm font-medium text-blue-600">
                  {p.badge}
                </span>
              )}
              {p.price && (
                <p className="mt-2 text-2xl font-bold text-slate-900">{p.price}</p>
              )}
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                {p.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <button
                type="button"
                disabled={loading === p.key}
                onClick={() => subscribe(p.key)}
                className="btn-primary mt-8 block w-full disabled:opacity-50"
              >
                {loading === p.key
                  ? "Loading…"
                  : p.name === "Basic"
                    ? "Get Started"
                    : "Subscribe"}
              </button>
            </div>
          ))}
        </div>
        <p className="mt-8 text-xs text-slate-500">
          Without Stripe keys, checkout activates your plan locally for development.
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white p-12 text-center text-slate-600">
          Loading…
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
