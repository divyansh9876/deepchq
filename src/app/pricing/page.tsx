"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MarketingNav } from "@/components/MarketingNav";
import { MarketingFooter } from "@/components/MarketingFooter";
import { RazorpayCheckout } from "@/components/RazorpayCheckout";
import {
  formatInr,
  PLAN_AMOUNT_PAISE,
  type PlanInterval,
  type PlanKey,
} from "@/lib/razorpay-plans";

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
    features: [
      "Unlimited Advanced Search",
      "AI-Powered Deep Reports",
      "Access Photos & Online Sources",
    ],
  },
];

function PricingContent() {
  const router = useRouter();
  const params = useSearchParams();
  const searchId = params.get("searchId") ?? undefined;
  const [interval, setInterval] = useState<PlanInterval>("weekly");
  const [devLoading, setDevLoading] = useState<PlanKey | null>(null);
  const [razorpayKeyId, setRazorpayKeyId] = useState<string | null>(null);
  const [subscriptionsEnabled, setSubscriptionsEnabled] = useState(false);
  const [configReady, setConfigReady] = useState(false);

  useEffect(() => {
    fetch("/api/config/public")
      .then((r) => r.json())
      .then(
        (d: {
          razorpayKeyId?: string | null;
          subscriptionsEnabled?: boolean;
        }) => {
          setRazorpayKeyId(d.razorpayKeyId ?? null);
          setSubscriptionsEnabled(Boolean(d.subscriptionsEnabled));
        },
      )
      .catch(() => setRazorpayKeyId(null))
      .finally(() => setConfigReady(true));
  }, []);

  const razorpayConfigured = Boolean(razorpayKeyId);

  function goSignIn() {
    const next = searchId ? `/pricing?searchId=${searchId}` : "/pricing";
    router.push(`/landing/register?next=${encodeURIComponent(next)}`);
  }

  function onPaid(redirectUrl?: string) {
    if (redirectUrl) window.location.href = redirectUrl;
  }

  async function devActivate(plan: PlanKey) {
    setDevLoading(plan);
    const res = await fetch("/api/razorpay/dev-activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, interval, searchId }),
    });
    const data = await res.json();
    setDevLoading(null);
    if (res.status === 401) {
      goSignIn();
      return;
    }
    if (data.redirectUrl) window.location.href = data.redirectUrl;
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
          {PLANS.map((p) => {
            const amount = PLAN_AMOUNT_PAISE[p.key][interval];
            return (
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
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {formatInr(amount)}
                  <span className="text-sm font-normal text-slate-500">
                    {" "}
                    / {interval}
                  </span>
                </p>
                <ul className="mt-6 space-y-2 text-sm text-slate-600">
                  {p.features.map((f) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
                {!configReady ? (
                  <button
                    type="button"
                    disabled
                    className="btn-primary mt-8 block w-full opacity-50"
                  >
                    Loading…
                  </button>
                ) : razorpayConfigured ? (
                  <div className="mt-8">
                    <RazorpayCheckout
                      plan={p.key}
                      interval={interval}
                      searchId={searchId}
                      razorpayKeyId={razorpayKeyId!}
                      useSubscriptions={subscriptionsEnabled}
                      label={
                        p.name === "Basic" ? "Get Started" : "Subscribe"
                      }
                      description={`Deepchq ${p.name} — ${interval} (auto-renew)`}
                      className="btn-primary block w-full"
                      onSuccess={onPaid}
                      onAuthRequired={goSignIn}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={devLoading === p.key}
                    onClick={() => devActivate(p.key)}
                    className="btn-primary mt-8 block w-full disabled:opacity-50"
                  >
                    {devLoading === p.key
                      ? "Loading…"
                      : p.name === "Basic"
                        ? "Get Started"
                        : "Subscribe"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-8 text-xs text-slate-500">
          {!configReady
            ? ""
            : razorpayConfigured
              ? subscriptionsEnabled
                ? "Recurring subscription via Razorpay. Renews each billing period until you cancel."
                : "Secure checkout via Razorpay. Add RAZORPAY_PLAN_* env vars for auto-renew subscriptions (see docs/RAZORPAY-SUBSCRIPTIONS.md)."
              : "Payments are not configured on the server. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET, then redeploy."}
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
