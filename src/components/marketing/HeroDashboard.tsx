"use client";

import { useEffect, useState } from "react";
import { AI_ENGINES } from "@/lib/brand";

const PROMPTS = [
  "best GEO platform for B2B brands",
  "tools to track ChatGPT brand mentions",
  "how to get cited in Google AI Overviews",
];

const SHARE = [
  { name: "Your brand", width: "72%", fill: "bg-teal-600", delay: "0ms" },
  { name: "Competitor A", width: "44%", fill: "bg-amber-500", delay: "120ms" },
  { name: "Competitor B", width: "19%", fill: "bg-slate-400", delay: "240ms" },
];

export function HeroDashboard() {
  const [promptI, setPromptI] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setScore(74);
      return;
    }
    const p = setInterval(() => setPromptI((i) => (i + 1) % PROMPTS.length), 4200);
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / 1400);
      setScore(Math.round(74 * (1 - (1 - t) ** 3)));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => clearInterval(p);
  }, []);

  return (
    <div className="relative">
      <div className="absolute -top-3 right-4 z-10 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-teal-800">
        Product preview
      </div>
      <div className="shine relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/8">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 text-xs font-medium text-slate-400">Brand report · visibility</span>
        </div>
        <div className="relative p-5">
          <div className="scan-line pointer-events-none absolute left-4 right-4 h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tracked prompt</p>
          <p key={promptI} className="fade-swap mt-1 text-sm font-medium text-slate-800">
            {PROMPTS[promptI]}
          </p>
          <div className="mt-5 grid grid-cols-[1fr_auto] items-end gap-4">
            <div>
              <p className="text-xs text-slate-400">Visibility score</p>
              <p className="font-display text-5xl font-semibold text-teal-800">{score}</p>
            </div>
            <div className="flex max-w-[11rem] flex-wrap justify-end gap-1.5">
              {AI_ENGINES.map((e) => (
                <span
                  key={e.id}
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                  style={{ background: e.color }}
                >
                  {e.name.split(" ")[0]}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {SHARE.map((row) => (
              <div key={row.name}>
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>{row.name}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`bar-fill h-full rounded-full ${row.fill}`}
                    style={{ width: row.width, animationDelay: row.delay }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
