"use client";

import { useState } from "react";
import Link from "next/link";
import { PLANS } from "@/lib/marketing";

const extras = [
  { t: "Annual billing", d: "Save two months on Growth and Agency when you pay yearly.", wash: "bg-amber-50 border-amber-100" },
  { t: "Switch anytime", d: "Upgrade, downgrade, or cancel from the workspace. No lock-in.", wash: "bg-sky-50 border-sky-100" },
  { t: "Human support", d: "Growth gets email support. Agency gets a named onboarding lead.", wash: "bg-violet-50 border-violet-100" },
];

const PLAN_WRAP: Record<string, string> = {
  free: "border-sky-200 bg-gradient-to-b from-sky-50 to-white",
  growth: "relative border-teal-400 bg-gradient-to-b from-teal-50 to-white ring-2 ring-teal-100",
  agency: "border-violet-200 bg-gradient-to-b from-violet-50 to-white",
};

const PLAN_CHECK: Record<string, string> = {
  free: "text-sky-600",
  growth: "text-teal-600",
  agency: "text-violet-600",
};

export function PricingGrid() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <div className="mt-8 flex justify-center">
        <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-slate-200">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${!annual ? "bg-teal-600 text-white" : "text-slate-600"}`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${annual ? "bg-violet-600 text-white" : "text-slate-600"}`}
          >
            Annual · 2 months free
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {PLANS.map((p) => {
          const paid = p.id !== "free";
          const price = !paid ? p.price : annual ? (p.id === "growth" ? "$65" : "$207") : p.price;
          const period = !paid ? p.period : annual ? "/ month, billed yearly" : p.period;
          return (
            <div key={p.id} className={`flex flex-col rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 ${PLAN_WRAP[p.id]}`}>
              {p.featured && (
                <span className="absolute -top-3 left-6 rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <h2 className="text-xl font-semibold text-slate-900">{p.name}</h2>
              <p className="mt-4 text-4xl font-bold text-slate-900">
                {price}
                <span className="text-base font-normal text-slate-500">{period}</span>
              </p>
              <p className="mt-3 text-sm text-slate-600">{p.blurb}</p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm text-slate-700">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className={PLAN_CHECK[p.id]}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={p.href}
                className={`mt-8 w-full ${
                  p.id === "growth"
                    ? "btn-primary"
                    : p.id === "agency"
                      ? "inline-flex items-center justify-center rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
                      : "btn-secondary"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {extras.map((x) => (
          <div key={x.t} className={`rounded-2xl border p-6 shadow-sm ${x.wash}`}>
            <h3 className="font-semibold text-slate-900">{x.t}</h3>
            <p className="mt-2 text-sm text-slate-600">{x.d}</p>
          </div>
        ))}
      </div>
    </>
  );
}
