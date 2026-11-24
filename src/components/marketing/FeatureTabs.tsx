"use client";

import { useEffect, useRef, useState } from "react";
import { AI_ENGINES } from "@/lib/brand";
import { FEATURES } from "@/lib/marketing";

const CYCLE_MS = 6000;

/** Capability explorer: auto-advances with a visible timer until the visitor takes over. */
export function FeatureTabs() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = FEATURES[i];

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAuto(false);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !inView) return;
    const t = setTimeout(() => setI((x) => (x + 1) % FEATURES.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [auto, inView, i]);

  const choose = (idx: number, focus = false) => {
    setAuto(false);
    setI(idx);
    if (focus) tabs.current[idx]?.focus();
  };

  const onKey = (e: React.KeyboardEvent) => {
    const n = FEATURES.length;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") choose((i + 1) % n, true);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") choose((i - 1 + n) % n, true);
    else return;
    e.preventDefault();
  };

  return (
    <div ref={wrap} className="grid gap-8 lg:grid-cols-[1fr_1.25fr]">
      <div role="tablist" aria-orientation="vertical" aria-label="Capabilities" className="flex min-w-0 flex-col gap-2" onKeyDown={onKey}>
        {FEATURES.map((f, idx) => {
          const on = i === idx;
          return (
            <button
              key={f.title}
              ref={(el) => {
                tabs.current[idx] = el;
              }}
              role="tab"
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              type="button"
              onClick={() => choose(idx)}
              className={`relative overflow-hidden rounded-2xl px-4 py-3 text-left transition duration-300 ${on ? f.active : `bg-white text-slate-700 ring-1 ring-slate-200 ${f.idle}`}`}
            >
              <span className="text-sm font-semibold">{f.title}</span>
              {on && (
                <p className="fade-swap mt-1 text-xs leading-relaxed text-white/85 lg:hidden">{f.desc}</p>
              )}
              {on && auto && inView && (
                <span key={i} className="toast-timer absolute inset-x-0 bottom-0 h-0.5 bg-white/60" style={{ animationDuration: `${CYCLE_MS}ms`, animationDirection: "reverse" }} />
              )}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" key={active.title} className={`spotlight fade-swap min-w-0 rounded-2xl border p-6 shadow-sm ${active.card}`}>
        <p className={`text-xs font-semibold uppercase tracking-wide ${active.kicker}`}>How it helps</p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900">{active.title}</h3>
        <p className="mt-3 leading-relaxed text-slate-600">{active.desc}</p>
        <div className="mt-6 rounded-xl border border-white bg-white/80 p-4 shadow-sm">
          <Visual idx={i} bar={active.bar} />
        </div>
        <p className="mt-2 text-right text-[11px] text-slate-400">Illustrative example</p>
      </div>
    </div>
  );
}

function Pill({ tone, children }: { tone: "ok" | "mid" | "bad"; children: React.ReactNode }) {
  const c = tone === "ok" ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : tone === "mid" ? "bg-amber-50 text-amber-700 ring-amber-100" : "bg-rose-50 text-rose-700 ring-rose-100";
  return <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${c}`}>{children}</span>;
}

function Visual({ idx, bar }: { idx: number; bar: string }) {
  const [done, setDone] = useState<Record<number, boolean>>({});
  switch (idx) {
    case 0:
      return (
        <ul className="space-y-2 text-sm">
          {[
            ["best payroll app for startups", "ok", "Cited"],
            ["payroll software with India compliance", "mid", "Mentioned #3"],
            ["cheapest payroll for 5 employees", "bad", "Lost to rival"],
          ].map(([q, t, l], k) => (
            <li key={q} className="engine-chip flex items-center justify-between gap-3" style={{ animationDelay: `${k * 90}ms` }}>
              <span className="min-w-0 truncate text-slate-700">“{q}”</span>
              <Pill tone={t as "ok"}>{l}</Pill>
            </li>
          ))}
        </ul>
      );
    case 1:
      return (
        <ul className="space-y-2">
          {AI_ENGINES.map((e, k) => {
            const v = [68, 74, 41, 55, 62, 33][k];
            return (
              <li key={e.id} className="grid grid-cols-[7.5rem_1fr_2.5rem] items-center gap-2 text-xs">
                <span className="flex min-w-0 items-center gap-1.5 truncate text-slate-600"><span className="h-2 w-2 rounded-full" style={{ background: e.color }} />{e.name}</span>
                <span className="h-2 rounded-full bg-slate-100"><span className="bar-fill block h-2 rounded-full" style={{ width: `${v}%`, background: e.color, animationDelay: `${k * 70}ms` }} /></span>
                <span className="text-right font-semibold text-slate-700">{v}%</span>
              </li>
            );
          })}
        </ul>
      );
    case 2:
      return (
        <div>
          <div className="flex h-4 overflow-hidden rounded-full">
            <span className="bar-fill bg-brand-600" style={{ width: "46%" }} />
            <span className="bar-fill bg-amber-400" style={{ width: "34%", animationDelay: "120ms" }} />
            <span className="bar-fill bg-slate-300" style={{ width: "20%", animationDelay: "240ms" }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
            <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-brand-600" />You 46%</span>
            <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400" />Competitor A 34%</span>
            <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-slate-300" />Competitor B 20%</span>
          </div>
        </div>
      );
    case 3:
      return (
        <ul className="space-y-2 text-sm">
          {[
            ["AI crawlers allowed in robots.txt", "ok", "Pass"],
            ["llms.txt published", "bad", "Missing"],
            ["Organization schema", "ok", "Pass"],
            ["Answer-first headings", "mid", "Partial"],
          ].map(([q, t, l], k) => (
            <li key={q} className="engine-chip flex items-center justify-between gap-3" style={{ animationDelay: `${k * 80}ms` }}>
              <span className="text-slate-700">{q}</span>
              <Pill tone={t as "ok"}>{l}</Pill>
            </li>
          ))}
        </ul>
      );
    case 4:
      return (
        <ul className="space-y-2 text-sm">
          {["Publish an llms.txt file", "Add a comparison page vs Competitor A", "Get listed on two category review sites"].map((t, k) => (
            <li key={t}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-0.5 hover:bg-slate-50">
                <input type="checkbox" className="h-4 w-4 accent-rose-500" checked={!!done[k]} onChange={(e) => setDone({ ...done, [k]: e.target.checked })} />
                <span className={`flex-1 transition ${done[k] ? "text-slate-400 line-through" : "text-slate-700"}`}>{t}</span>
                <Pill tone={k === 2 ? "mid" : "bad"}>{k === 2 ? "Medium" : "High"}</Pill>
              </label>
            </li>
          ))}
          <li className="pt-1 text-xs text-slate-400">Tick one — that&apos;s how the action plan works.</li>
        </ul>
      );
    default:
      return (
        <div className="text-sm">
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-white ${bar}`}>keyword: payroll software</span>
          <ul className="mt-3 space-y-1.5">
            {[
              ["Awareness", "how does payroll software work?"],
              ["Consideration", "best payroll software for startups"],
              ["Decision", "Acme payroll vs Competitor A pricing"],
            ].map(([s, q], k) => (
              <li key={q} className="engine-chip flex items-center gap-2" style={{ animationDelay: `${k * 90}ms` }}>
                <span className="w-24 shrink-0 text-xs font-semibold text-slate-400">{s}</span>
                <span className="text-slate-700">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      );
  }
}
