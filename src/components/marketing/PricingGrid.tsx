"use client";

import { useState } from "react";
import Link from "next/link";
import { PLANS } from "@/lib/marketing";

const extras = [
  { t: "Annual billing", d: "Save two months on Growth and Agency when you pay yearly." },
  { t: "Switch anytime", d: "Upgrade, downgrade, or cancel from the workspace. No lock-in." },
  { t: "Human support", d: "Growth gets email support. Agency gets a named onboarding lead." },
];

export function PricingGrid() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <div className="mt-8 flex justify-center">
        <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-slate-200">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${!annual ? "bg-brand-600 text-white" : "text-slate-600"}`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${annual ? "bg-brand-600 text-white" : "text-slate-600"}`}
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
            <div
              key={p.id}
              className={`card-hover flex flex-col ${p.featured ? "relative border-brand-500 ring-2 ring-brand-100" : ""}`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
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
                    <span className="text-brand-600">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={p.href} className={`mt-8 w-full ${p.featured ? "btn-primary" : "btn-secondary"}`}>
                {p.cta}
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {extras.map((x) => (
          <div key={x.t} className="card-hover">
            <h3 className="font-semibold text-slate-900">{x.t}</h3>
            <p className="mt-2 text-sm text-slate-600">{x.d}</p>
          </div>
        ))}
      </div>
    </>
  );
}
