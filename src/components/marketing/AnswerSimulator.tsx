"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AI_ENGINES } from "@/lib/brand";
import { AnimatedNumber, Tilt } from "@/components/ui/fx";

/**
 * Interactive hero demo. All answers are illustrative (fictional competitors) and the
 * card says so — it shows what a Deepchq scan reads, not a real engine response.
 */
const ENGINES = ["chatgpt", "perplexity", "gemini", "claude"] as const;
type Eng = (typeof ENGINES)[number];
type Outcome = { order: number[]; cited: boolean };

const SCENARIOS: {
  prompt: string;
  topic: string;
  competitors: [string, string];
  reasons: [string, string, string];
  outcomes: Record<Eng, Outcome>;
}[] = [
  {
    prompt: "What's the best CRM for a 10-person agency?",
    topic: "a small agency",
    competitors: ["Northwind", "Globex"],
    reasons: ["is praised for fast setup and client-friendly pipelines", "has the deepest reporting, though pricing climbs quickly", "is a solid budget pick with fewer integrations"],
    outcomes: {
      chatgpt: { order: [1, 0, 2], cited: false },
      perplexity: { order: [0, 1, 2], cited: true },
      gemini: { order: [1, 2], cited: false },
      claude: { order: [0, 2, 1], cited: false },
    },
  },
  {
    prompt: "Which invoicing tool do freelancers recommend?",
    topic: "freelancers",
    competitors: ["Initech", "Umbrella"],
    reasons: ["gets recommended for automatic reminders and multi-currency support", "is well known but users mention a dated interface", "is simple and free for a handful of clients"],
    outcomes: {
      chatgpt: { order: [0, 1], cited: false },
      perplexity: { order: [1, 0, 2], cited: true },
      gemini: { order: [0, 1, 2], cited: true },
      claude: { order: [1, 2], cited: false },
    },
  },
  {
    prompt: "Top analytics platforms for early-stage startups?",
    topic: "early-stage startups",
    competitors: ["Hooli", "Vandelay"],
    reasons: ["stands out for generous free tiers and event tracking that's easy to set up", "is the enterprise default, often considered overkill early on", "is a lightweight, privacy-friendly alternative"],
    outcomes: {
      chatgpt: { order: [1, 0, 2], cited: false },
      perplexity: { order: [1, 2], cited: false },
      gemini: { order: [0, 1], cited: true },
      claude: { order: [0, 1, 2], cited: false },
    },
  },
];

const VOICE: Record<Eng, string> = {
  chatgpt: "the options people most often recommend are",
  perplexity: "sources consistently point to",
  gemini: "popular choices include",
  claude: "I'd look at",
};

type Seg = { text: string; kind: "plain" | "you" | "comp" };

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "") || "acme";
}

function buildAnswer(brand: string, scen: (typeof SCENARIOS)[number], eng: Eng): Seg[] {
  const o = scen.outcomes[eng];
  const names = [brand, ...scen.competitors];
  const kindOf = (i: number): Seg["kind"] => (i === 0 ? "you" : "comp");
  const segs: Seg[] = [{ text: `For ${scen.topic}, ${VOICE[eng]} `, kind: "plain" }];
  o.order.forEach((idx, k) => {
    if (k > 0) segs.push({ text: k === o.order.length - 1 ? " and " : ", ", kind: "plain" });
    segs.push({ text: names[idx], kind: kindOf(idx) });
  });
  segs.push({ text: ". ", kind: "plain" });
  o.order.slice(0, 2).forEach((idx) => {
    segs.push({ text: names[idx], kind: kindOf(idx) });
    segs.push({ text: ` ${scen.reasons[idx]}. `, kind: "plain" });
  });
  return segs;
}

export function AnswerSimulator() {
  const [brand, setBrand] = useState("Acme");
  const [scenI, setScenI] = useState(0);
  const [engI, setEngI] = useState(0);
  const [chars, setChars] = useState(0);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);
  const typer = useRef<ReturnType<typeof setInterval>>(undefined);

  const name = brand.trim() || "Acme";
  const scen = SCENARIOS[scenI];
  const eng = ENGINES[engI];
  const outcome = scen.outcomes[eng];
  const segs = useMemo(() => buildAnswer(name, scen, eng), [name, scen, eng]);
  const total = segs.reduce((n, s) => n + s.text.length, 0);
  const done = chars >= total;

  const position = outcome.order.indexOf(0);
  const mentioned = position >= 0;
  const visibleIn = ENGINES.filter((e) => scen.outcomes[e].order.includes(0)).length;

  // Typewriter
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setChars(Number.MAX_SAFE_INTEGER);
      setAuto(false);
      return;
    }
    setChars(0);
    typer.current = setInterval(() => setChars((c) => c + 3), 16);
    return () => clearInterval(typer.current);
  }, [scenI, engI]);

  useEffect(() => {
    if (done) clearInterval(typer.current);
  }, [done]);

  // Retype instantly when the brand name changes (no re-animation while typing).
  useEffect(() => {
    setChars((c) => (c > 0 ? Number.MAX_SAFE_INTEGER : c));
  }, [name]);

  // Autoplay: engine → engine → next prompt
  useEffect(() => {
    if (!auto || !done || paused) return;
    const t = setTimeout(() => {
      if (engI < ENGINES.length - 1) setEngI(engI + 1);
      else {
        setEngI(0);
        setScenI((scenI + 1) % SCENARIOS.length);
      }
    }, 2600);
    return () => clearTimeout(t);
  }, [auto, done, paused, engI, scenI]);

  let left = chars;
  const rendered = segs.map((s, i) => {
    const take = Math.max(0, Math.min(s.text.length, left));
    left -= take;
    if (!take) return null;
    const t = s.text.slice(0, take);
    if (s.kind === "plain") return <span key={i}>{t}</span>;
    return (
      <mark key={i} className={`rounded px-0.5 font-semibold ${s.kind === "you" ? "bg-teal-100 text-teal-900" : "bg-amber-100 text-amber-900"}`}>
        {t}
      </mark>
    );
  });

  const pick = (fn: () => void) => {
    setAuto(false);
    fn();
  };

  return (
    <Tilt max={4}>
      <div
        className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-teal-900/10"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs font-medium text-slate-400">Example scan · illustrative answers</span>
          <span className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-teal-700">
            <span className="relative flex h-2 w-2">
              <span className="pulse-ring absolute inset-0 rounded-full bg-teal-400" />
              <span className="relative h-2 w-2 rounded-full bg-teal-500" />
            </span>
            {auto ? "Auto-playing" : "Interactive"}
          </span>
        </div>

        <div role="tablist" aria-label="AI engine" className="flex gap-1 overflow-x-auto border-b border-slate-100 px-3 pt-2 [scrollbar-width:none]">
          {ENGINES.map((id, i) => {
            const meta = AI_ENGINES.find((e) => e.id === id)!;
            const hit = scen.outcomes[id].order.includes(0);
            const active = i === engI;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => pick(() => setEngI(i))}
                className={`relative flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-t-lg px-3 py-2 text-xs font-semibold transition ${active ? "text-slate-900" : "text-slate-400 hover:text-slate-700"}`}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: meta.color }} />
                {meta.name}
                <span className={`text-[10px] ${hit ? "text-teal-600" : "text-rose-400"}`} aria-label={hit ? "mentions you" : "misses you"}>
                  {hit ? "●" : "○"}
                </span>
                {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full" style={{ background: meta.color }} />}
              </button>
            );
          })}
        </div>

        <div className="space-y-4 p-5">
          <div className="flex justify-end">
            <p key={scenI} className="fade-swap max-w-[85%] rounded-2xl rounded-br-md bg-slate-900 px-4 py-2 text-sm text-white">{scen.prompt}</p>
          </div>
          <p className={`min-h-[7.5rem] text-sm leading-relaxed text-slate-700 ${done ? "" : "caret"}`} aria-live="off">
            {rendered}
          </p>

          <div className={`grid grid-cols-3 gap-2 transition duration-500 ${done ? "opacity-100" : "translate-y-1 opacity-0"}`}>
            <Verdict label="Mentioned" ok={mentioned} value={mentioned ? "Yes" : "No"} />
            <Verdict label="Position" ok={position === 0} warn={position > 0} value={mentioned ? `#${position + 1}` : "—"} />
            <Verdict label="Cited" ok={outcome.cited} value={outcome.cited ? `${slug(name)}.com` : "No"} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3">
          <label className="flex min-w-0 flex-1 basis-[13rem] items-center gap-2 text-xs text-slate-500">
            <span className="shrink-0">Try your brand:</span>
            <input
              value={brand}
              maxLength={24}
              onChange={(e) => pick(() => setBrand(e.target.value))}
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-sm font-semibold text-teal-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              aria-label="Your brand name"
            />
          </label>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>
              Visible in <b className="text-slate-900"><AnimatedNumber value={visibleIn} duration={500} /></b>/4 engines
            </span>
            <div className="flex gap-1" aria-hidden>
              {SCENARIOS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  tabIndex={-1}
                  onClick={() => pick(() => { setScenI(i); setEngI(0); })}
                  className={`h-1.5 rounded-full transition-all ${i === scenI ? "w-5 bg-teal-600" : "w-1.5 bg-slate-300 hover:bg-slate-400"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Tilt>
  );
}

function Verdict({ label, value, ok, warn }: { label: string; value: string; ok: boolean; warn?: boolean }) {
  const tone = ok ? "bg-teal-50 text-teal-800 ring-teal-100" : warn ? "bg-amber-50 text-amber-800 ring-amber-100" : "bg-rose-50 text-rose-700 ring-rose-100";
  return (
    <div className={`rounded-xl px-3 py-2 ring-1 ${tone}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="truncate text-sm font-bold">{value}</p>
    </div>
  );
}
