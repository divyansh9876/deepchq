"use client";

import { useEffect, useRef, useState } from "react";

export type AutomationStep = { t: string; d: string; c: string; detail: string };

/** Five-step pipeline that plays itself once visible; hover or focus a step to take over. */
export function AutomationSteps({ steps }: { steps: AutomationStep[] }) {
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (manual || !visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActive((a) => (a + 1) % steps.length), 2600);
    return () => clearInterval(t);
  }, [manual, visible, steps.length]);

  const take = (i: number) => {
    setManual(true);
    setActive(i);
  };
  const pct = (active / (steps.length - 1)) * 100;

  return (
    <div ref={ref} onPointerLeave={() => setManual(false)} className="mt-10">
      <div className="relative">
        <div className="pointer-events-none absolute left-[10%] right-[10%] top-5 hidden h-1 rounded-full bg-slate-200/70 md:block">
          <div className="h-full rounded-full bg-gradient-to-r from-teal-500 via-violet-500 to-rose-400 transition-[width] duration-700 ease-out" style={{ width: `${pct}%` }} />
        </div>
        <ol className="relative grid gap-4 md:grid-cols-5">
          {steps.map((a, i) => {
            const on = i === active;
            const past = i < active;
            return (
              <li key={a.t} className="list-none">
                <button
                  type="button"
                  onPointerEnter={() => take(i)}
                  onFocus={() => take(i)}
                  onClick={() => take(i)}
                  aria-pressed={on}
                  className={`group w-full rounded-2xl p-3 text-left transition duration-300 ${on ? "bg-white shadow-lg shadow-teal-900/5 ring-1 ring-slate-200" : "hover:bg-white/60"}`}
                >
                  <span
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md transition duration-300 ${a.c} ${on ? "scale-110" : past ? "opacity-90" : "opacity-60"}`}
                  >
                    {past ? "✓" : i + 1}
                    {on && <span className={`pulse-ring absolute inset-0 rounded-full ${a.c}`} />}
                  </span>
                  <h3 className={`mt-4 font-semibold transition ${on ? "text-slate-900" : "text-slate-700"}`}>{a.t}</h3>
                  <p className="mt-1 text-sm text-slate-600">{a.d}</p>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <div key={active} className="fade-swap mx-auto mt-6 max-w-2xl rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-center text-sm text-slate-700 backdrop-blur">
        <span className="font-semibold text-slate-900">Step {active + 1} · {steps[active].t}.</span> {steps[active].detail}
      </div>
    </div>
  );
}
