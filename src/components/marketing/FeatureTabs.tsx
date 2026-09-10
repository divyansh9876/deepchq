"use client";

import { useState } from "react";
import { FEATURES } from "@/lib/marketing";

export function FeatureTabs() {
  const [i, setI] = useState(0);
  const active = FEATURES[i];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col gap-2">
        {FEATURES.map((f, idx) => (
          <button
            key={f.title}
            type="button"
            onClick={() => setI(idx)}
            className={`rounded-2xl px-4 py-3 text-left transition ${
              i === idx
                ? "bg-brand-600 text-white shadow-md"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-brand-50"
            }`}
          >
            <span className="text-sm font-semibold">{f.title}</span>
          </button>
        ))}
      </div>
      <div className="card min-h-56">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">How it helps</p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900">{active.title}</h3>
        <p className="mt-3 leading-relaxed text-slate-600">{active.desc}</p>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-500"
            style={{ width: `${((i + 1) / FEATURES.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
