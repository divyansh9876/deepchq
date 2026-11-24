"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMe } from "@/components/app/AppShell";
import { useApi, useToast } from "@/components/app/ui";
import { PLANS } from "@/lib/marketing";
import { PLAN_PRICES, formatUsd } from "@/lib/plans";

type RzpOptions = Record<string, unknown> & { handler: (r: Record<string, string>) => void };
declare global {
  interface Window {
    Razorpay?: new (o: RzpOptions) => { open: () => void; on: (e: string, cb: () => void) => void };
  }
}

function loadRazorpay() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function Settings() {
  const { me, reload } = useMe();
  const api = useApi();
  const toast = useToast();
  const params = useSearchParams();
  const [annual, setAnnual] = useState(false);
  const [busy, setBusy] = useState("");
  const highlight = params.get("upgrade");

  useEffect(() => {
    if (highlight) document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" });
  }, [highlight]);

  if (!me) return <main className="mx-auto max-w-4xl px-6 py-10"><div className="card h-40 animate-pulse" /></main>;
  const { user, limits, usage } = me;

  async function checkout(plan: "growth" | "agency") {
    setBusy(plan);
    const d = await api<{ subscriptionId: string; keyId: string; email: string; name: string }>("/api/billing/checkout", {
      method: "POST",
      json: { plan, interval: annual ? "annual" : "monthly" },
    });
    if (!d) return setBusy("");
    if (!(await loadRazorpay()) || !window.Razorpay) {
      toast("Couldn't load the payment window. Check your connection or ad blocker.", "error");
      return setBusy("");
    }
    const rzp = new window.Razorpay({
      key: d.keyId,
      subscription_id: d.subscriptionId,
      name: "Deepchq",
      description: `${plan === "agency" ? "Agency" : "Growth"} plan · ${annual ? "annual" : "monthly"}`,
      prefill: { email: d.email, name: d.name },
      theme: { color: "#5a36f0" },
      handler: async (r) => {
        const ok = await api("/api/billing/verify", { method: "POST", json: r });
        if (ok) {
          toast("Payment received — welcome aboard!");
          await reload();
        }
        setBusy("");
      },
    });
    rzp.on("payment.failed", () => {
      toast("Payment failed. You haven't been charged.", "error");
      setBusy("");
    });
    rzp.open();
    setBusy("");
  }

  async function cancel() {
    if (!confirm("Cancel your subscription? You keep paid features until the end of the current billing period.")) return;
    const r = await api("/api/billing/cancel", { method: "POST" });
    if (r) {
      toast("Subscription will end at the close of this billing period");
      await reload();
    }
  }

  async function toggleDigest(on: boolean) {
    const r = await api("/api/account", { method: "PATCH", json: { digestEnabled: on } });
    if (r) {
      toast(on ? "Email digests on" : "Email digests off");
      await reload();
    }
  }

  const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "");

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Current plan</p>
          <p className="mt-1 text-2xl font-bold capitalize text-slate-900">{user.plan === "free" ? "Starter (free)" : user.plan}</p>
          <p className="mt-1 text-sm text-slate-500">
            {user.subscriptionStatus === "active" && user.planRenewsAt && `Renews ${fmtDate(user.planRenewsAt)}`}
            {user.subscriptionStatus === "cancelling" && `Cancelled — active until ${fmtDate(user.planRenewsAt) || "the end of the period"}`}
            {!user.subscriptionStatus && user.trialEndsAt && `Trial ends ${fmtDate(user.trialEndsAt)}`}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li className="flex justify-between"><span>Brands</span><span className="font-medium text-slate-900">{usage.brands} / {limits.brands}</span></li>
            <li className="flex justify-between"><span>Prompts per brand</span><span className="font-medium text-slate-900">{limits.prompts}</span></li>
            <li className="flex justify-between"><span>Engines</span><span className="font-medium text-slate-900">{limits.engines === "all" ? "All 6" : limits.engines.length}</span></li>
            <li className="flex justify-between"><span>Automatic scans</span><span className="font-medium text-slate-900">every {limits.scanEveryDays === 1 ? "day" : `${limits.scanEveryDays} days`}</span></li>
            <li className="flex justify-between"><span>Manual scans / day</span><span className="font-medium text-slate-900">{limits.manualScansPerDay}</span></li>
          </ul>
          {user.subscriptionStatus === "active" && (
            <button type="button" onClick={cancel} className="mt-5 text-sm font-medium text-rose-600 hover:underline">Cancel subscription</button>
          )}
        </div>
        <div className="card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Account</p>
          <p className="mt-1 font-semibold text-slate-900">{user.name}</p>
          <p className="text-sm text-slate-500">{user.email}</p>
          <label className="mt-6 flex items-center justify-between gap-4">
            <span>
              <span className="block font-medium text-slate-900">Email digests</span>
              <span className="text-sm text-slate-500">A summary after each automatic scan, plus trial and billing notices.</span>
            </span>
            <input type="checkbox" className="h-5 w-5 accent-brand-600" checked={user.digestEnabled} onChange={(e) => toggleDigest(e.target.checked)} />
          </label>
          <p className="mt-6 text-xs text-slate-400">
            Live engines on this workspace: {me.liveEngines.length ? me.liveEngines.join(", ") : "none configured — results are estimated"}.
          </p>
        </div>
      </section>

      <section id="plans" className="mt-12 scroll-mt-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">Plans</h2>
          <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-slate-200">
            <button type="button" onClick={() => setAnnual(false)} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${!annual ? "bg-brand-600 text-white" : "text-slate-600"}`}>Monthly</button>
            <button type="button" onClick={() => setAnnual(true)} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${annual ? "bg-fuchsia-600 text-white" : "text-slate-600"}`}>Annual · save ~18%</button>
          </div>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {PLANS.map((p) => {
            const paid = p.id !== "free";
            const price = paid ? formatUsd(annual ? PLAN_PRICES[p.id].annualPerMonth : PLAN_PRICES[p.id].monthly) : "$0";
            const current = user.plan === p.id && (p.id === "free" || user.subscriptionStatus === "active");
            return (
              <div key={p.id} className={`card spotlight flex flex-col ${highlight === p.id ? "ring-2 ring-fuchsia-300" : ""} ${p.featured ? "border-brand-300" : ""}`}>
                <h3 className="font-semibold text-slate-900">{p.name}</h3>
                <p className="mt-2 text-3xl font-bold text-slate-900">{price}<span className="text-sm font-normal text-slate-500">{paid ? (annual ? "/mo, billed yearly" : "/mo") : ""}</span></p>
                <ul className="mt-4 flex-1 space-y-1.5 text-sm text-slate-600">{p.features.map((f) => <li key={f}>✓ {f}</li>)}</ul>
                {current ? (
                  <span className="mt-5 rounded-xl bg-slate-100 py-2.5 text-center text-sm font-semibold text-slate-500">Current plan</span>
                ) : !paid ? (
                  <span className="mt-5 py-2.5 text-center text-xs text-slate-400">Cancel a paid plan to return here</span>
                ) : me.billingEnabled ? (
                  <button type="button" disabled={!!busy || user.subscriptionStatus === "active"} onClick={() => checkout(p.id as "growth" | "agency")} className={`mt-5 ${p.featured ? "btn-primary" : "btn-secondary"}`}>
                    {busy === p.id ? "Opening checkout…" : user.subscriptionStatus === "active" ? "Contact us to switch" : `Upgrade to ${p.name}`}
                  </button>
                ) : (
                  <Link href={`/contact?plan=${p.id}`} className={`mt-5 ${p.featured ? "btn-primary" : "btn-secondary"}`}>Contact us to upgrade</Link>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">Payments are processed securely by Razorpay. Prices in USD.</p>
      </section>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Settings />
    </Suspense>
  );
}
