"use client";

import { useEffect, useState } from "react";
import { AI_ENGINES } from "@/lib/brand";

const PROMPTS = [
  "best GEO platform for B2B brands",
  "tools to track ChatGPT brand mentions",
  "how to get cited in Google AI Overviews",
];

export function HeroDashboard() {
  const [promptI, setPromptI] = useState(0);
  const [engineI, setEngineI] = useState(0);
  const [score, setScore] = useState(18);
  const engine = AI_ENGINES[engineI];

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setScore(74);
      return;
    }
    const p = setInterval(() => setPromptI((i) => (i + 1) % PROMPTS.length), 3200);
    const e = setInterval(() => setEngineI((i) => (i + 1) % AI_ENGINES.length), 1800);
    const s = setInterval(() => setScore((n) => (n >= 78 ? 52 : n + 2)), 220);
    return () => {
      clearInterval(p);
      clearInterval(e);
      clearInterval(s);
    };
  }, []);

  return (
    <div className="relative">
      <p className="absolute -top-8 right-4 rotate-6 font-hand text-2xl text-violet-600">live scan</p>
      <div className="relative overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-xl shadow-violet-900/10">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 text-xs font-medium text-slate-400">deepchq · brand report</span>
        </div>
        <div className="relative p-5">
          <div className="scan-line pointer-events-none absolute left-4 right-4 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Prompt</p>
          <p className="mt-1 text-sm font-medium text-slate-800">{PROMPTS[promptI]}</p>
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400">Visibility score</p>
              <p className="font-display text-5xl font-semibold text-brand-700">{score}</p>
            </div>
            <div
              className="relative flex h-20 w-20 items-center justify-center rounded-full border-4"
              style={{ borderColor: engine.color }}
            >
              <span className="pulse-ring absolute inset-0 rounded-full border-2" style={{ borderColor: engine.color }} />
              <span className="text-[10px] font-bold" style={{ color: engine.color }}>
                {engine.name.split(" ")[0]}
              </span>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {[
              { brand: "Deepchq", hit: true, n: "cited", row: "bg-teal-50", tag: "text-teal-700" },
              { brand: "Competitor A", hit: score > 60, n: "mentioned", row: "bg-amber-50", tag: "text-amber-700" },
              { brand: "Competitor B", hit: false, n: "absent", row: "bg-slate-50", tag: "text-slate-400" },
            ].map((row) => (
              <div
                key={row.brand}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${row.row}`}
              >
                <span className="font-medium text-slate-700">{row.brand}</span>
                <span className={row.hit ? row.tag : "text-slate-400"}>{row.n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
