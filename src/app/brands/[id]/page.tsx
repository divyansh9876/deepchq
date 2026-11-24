"use client";

import { Fragment, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AI_ENGINES, type EngineId } from "@/lib/brand";
import { visibilityLabel } from "@/lib/geo/metrics";
import { ChipInput, TrendChart, timeAgo, useApi, useToast } from "@/components/app/ui";
import { useMe } from "@/components/app/AppShell";
import { ScoreRing } from "@/components/tools/ScoreRing";
import { AnimatedNumber, Confetti, isTyping } from "@/components/ui/fx";
import { BRAND_COMMAND_EVENT, type BrandCommand } from "@/components/app/CommandPalette";
import type { PlanLimits } from "@/lib/plans";
import type { Brand, BrandMetrics, GeoAudit, Prompt, PromptStage, Recommendation, ScanResult, VisibilityPoint } from "@/lib/types";

type Data = {
  brand: Brand;
  prompts: Prompt[];
  scans: ScanResult[];
  audit: GeoAudit | null;
  recommendations: Recommendation[];
  metrics: BrandMetrics;
  history: VisibilityPoint[];
  limits: PlanLimits;
  engines: { id: EngineId; live: boolean }[];
};

type Tab = "overview" | "prompts" | "audit" | "actions" | "settings";
const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "prompts", label: "Prompts" },
  { id: "audit", label: "GEO audit" },
  { id: "actions", label: "Action plan" },
  { id: "settings", label: "Settings" },
];

const STAGE_LABEL: Record<PromptStage, string> = { tofu: "Awareness", mofu: "Consideration", bofu: "Decision" };
const STAGE_TONE: Record<PromptStage, string> = {
  tofu: "bg-sky-50 text-sky-700 ring-sky-100",
  mofu: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100",
  bofu: "bg-amber-50 text-amber-700 ring-amber-100",
};
const engineMeta = (id: EngineId) => AI_ENGINES.find((e) => e.id === id)!;

function LiveBadge({ live }: { live?: boolean }) {
  return live ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 ring-1 ring-brand-100">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />Live
    </span>
  ) : (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500" title="No public API or key — modelled estimate">Estimated</span>
  );
}

function Kpi({ label, value, unit = "", prefix = "", sub, delta, suffix = "", accent }: { label: string; value: number | null; unit?: string; prefix?: string; sub: string; delta?: number | null; suffix?: string; accent: string }) {
  return (
    <div className="card spotlight overflow-hidden">
      <span className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 flex items-baseline gap-2 text-3xl font-bold text-slate-900">
        {value == null ? "—" : <AnimatedNumber value={value} prefix={prefix} suffix={unit} />}
        {delta != null && delta !== 0 && (
          <span className={`text-sm font-semibold ${delta > 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {delta > 0 ? "▲" : "▼"} {Math.abs(delta)}{suffix}
          </span>
        )}
      </p>
      <p className="text-xs text-slate-500">{sub}</p>
    </div>
  );
}

function Onboarding({ data }: { data: Data }) {
  const steps = [
    { t: "Prompts generated", done: data.prompts.length > 0 },
    { t: "Site audited", done: !!data.audit },
    { t: "AI engines scanned", done: data.scans.length > 0 },
    { t: "Action plan ready", done: data.recommendations.length > 0 && data.scans.length > 0 },
  ];
  const current = steps.findIndex((s) => !s.done);
  return (
    <div className="card mt-6 border-brand-100 bg-gradient-to-br from-brand-50 to-white">
      <p className="font-semibold text-slate-900">Setting up {data.brand.name}…</p>
      <p className="text-sm text-slate-500">This runs automatically and takes about a minute. You can leave this page.</p>
      <ol className="mt-5 grid gap-3 sm:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.t} className="flex items-center gap-2 text-sm">
            {s.done ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs text-white">✓</span>
            ) : i === current ? (
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
            ) : (
              <span className="h-6 w-6 rounded-full border-2 border-slate-200" />
            )}
            <span className={s.done ? "text-slate-900" : "text-slate-500"}>{s.t}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Highlighted({ text, brand, competitors }: { text: string; brand: Brand; competitors: string[] }) {
  const parts = useMemo(() => {
    const names = [
      ...[brand.name, brand.domain.replace(/^www\./, "")].filter((n) => n.length > 1).map((n) => ({ n, you: true })),
      ...competitors.filter((n) => n.length > 1).map((n) => ({ n, you: false })),
    ];
    if (!names.length) return [{ t: text, k: null as null | boolean }];
    const re = new RegExp(`(${names.map((x) => x.n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
    return text.split(re).map((t) => {
      const hit = names.find((x) => x.n.toLowerCase() === t.toLowerCase());
      return { t, k: hit ? hit.you : null };
    });
  }, [text, brand, competitors]);
  return (
    <>
      {parts.map((p, i) =>
        p.k == null ? (
          <Fragment key={i}>{p.t}</Fragment>
        ) : (
          <mark key={i} className={`rounded px-0.5 font-semibold ${p.k ? "bg-brand-100 text-brand-900" : "bg-amber-100 text-amber-900"}`}>{p.t}</mark>
        ),
      )}
    </>
  );
}

function AnswerDrawer({ scans, index, onIndex, promptById, brand, onClose }: { scans: ScanResult[]; index: number; onIndex: (i: number) => void; promptById: Map<string, Prompt>; brand: Brand; onClose: () => void }) {
  const scan = scans[index];
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if ((e.key === "ArrowRight" || e.key === "j") && index < scans.length - 1) onIndex(index + 1);
      else if ((e.key === "ArrowLeft" || e.key === "k") && index > 0) onIndex(index - 1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose, onIndex, index, scans.length]);
  if (!scan) return null;
  const e = engineMeta(scan.engine);
  const prompt = promptById.get(scan.promptId);
  return (
    <div className="overlay-in fixed inset-0 z-40 flex justify-end bg-slate-900/30 backdrop-blur-[2px]" onClick={onClose}>
      <aside role="dialog" aria-modal aria-label="AI answer" className="drawer-in flex h-full w-full max-w-lg flex-col bg-white shadow-2xl" onClick={(ev) => ev.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: e.color }} />
            <span className="font-semibold text-slate-900">{e.name}</span>
            <LiveBadge live={scan.live} />
          </div>
          <div className="flex items-center gap-1">
            <span className="mr-2 text-xs tabular-nums text-slate-400">{index + 1} / {scans.length}</span>
            <button type="button" disabled={index === 0} onClick={() => onIndex(index - 1)} className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label="Previous answer">←</button>
            <button type="button" disabled={index === scans.length - 1} onClick={() => onIndex(index + 1)} className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label="Next answer">→</button>
            <button type="button" onClick={onClose} className="ml-1 rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100" aria-label="Close">✕</button>
          </div>
        </div>
        <div key={scan.id} className="fade-swap flex-1 overflow-y-auto p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Prompt</p>
          <p className="mt-1 text-slate-900">“{prompt?.text}”</p>
          <div className="mt-5 grid grid-cols-4 gap-2 text-sm">
            {[
              ["Mentioned", scan.mentioned ? "Yes" : "No", scan.mentioned],
              ["Cited", scan.cited ? "Yes" : "No", scan.cited],
              ["Position", scan.position ? `#${scan.position}` : "—", scan.position === 1],
              ["Sentiment", scan.sentiment ?? "—", scan.sentiment === "positive"],
            ].map(([k, v, good]) => (
              <div key={k as string} className={`rounded-xl p-3 ${good ? "bg-emerald-50" : "bg-slate-50"}`}>
                <p className="text-[11px] text-slate-400">{k}</p>
                <p className={`font-semibold capitalize ${good ? "text-emerald-800" : "text-slate-900"}`}>{v}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">Answer</p>
          <p className="mt-1 whitespace-pre-wrap rounded-xl border border-slate-200 p-4 text-sm leading-relaxed text-slate-700">
            <Highlighted text={scan.answerSnippet} brand={brand} competitors={brand.competitors} />
          </p>
          <p className="mt-2 flex gap-3 text-[11px] text-slate-400">
            <span><mark className="rounded bg-brand-100 px-1 text-brand-900">You</mark></span>
            <span><mark className="rounded bg-amber-100 px-1 text-amber-900">Competitor</mark></span>
          </p>
          {scan.competitorsMentioned.length > 0 && (
            <>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">Competitors named</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {scan.competitorsMentioned.map((c) => <span key={c} className="rounded-full bg-amber-50 px-2.5 py-0.5 text-sm text-amber-700 ring-1 ring-amber-100">{c}</span>)}
              </div>
            </>
          )}
          {scan.sources.length > 0 && (
            <>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">Sources</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {scan.sources.map((src) => {
                  const own = src === brand.domain.replace(/^www\./, "") || src.endsWith(`.${brand.domain.replace(/^www\./, "")}`);
                  return <span key={src} className={`rounded-lg px-2 py-1 text-xs ring-1 ${own ? "bg-brand-50 font-semibold text-brand-800 ring-brand-200" : "bg-white text-slate-600 ring-slate-200"}`}>{src}</span>;
                })}
              </div>
            </>
          )}
          <p className="mt-6 text-xs text-slate-400">Scanned {new Date(scan.createdAt).toLocaleString()}</p>
        </div>
        <p className="border-t border-slate-100 px-6 py-2.5 text-[11px] text-slate-400">
          <kbd className="kbd">←</kbd> <kbd className="kbd">→</kbd> browse answers · <kbd className="kbd">Esc</kbd> close
        </p>
      </aside>
    </div>
  );
}

function ScanProgress({ engines }: { engines: { id: EngineId; live: boolean }[] }) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="pop-in card mt-6 overflow-hidden border-brand-100 p-0">
      <div className="relative h-1 overflow-hidden bg-brand-50">
        <span className="progress-indeterminate absolute inset-y-0 w-1/2 rounded-full bg-gradient-to-r from-brand-400 to-fuchsia-500" />
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4">
        <div>
          <p className="font-semibold text-slate-900">Asking {engines.length} AI engine{engines.length === 1 ? "" : "s"}…</p>
          <p className="text-xs text-slate-500">{secs}s elapsed · usually under a minute</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {engines.map((e, i) => {
            const m = engineMeta(e.id);
            return (
              <span key={e.id} className="engine-wait inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200" style={{ animationDelay: `${i * 0.18}s` }}>
                <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
                {m.name}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BrandReport() {
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const router = useRouter();
  const api = useApi();
  const toast = useToast();
  const { reload: reloadMe } = useMe();
  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [busy, setBusy] = useState("");
  const [newPrompt, setNewPrompt] = useState({ text: "", stage: "mofu" as PromptStage });
  const [engineFilter, setEngineFilter] = useState<EngineId | null>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [hover, setHover] = useState<{ p: string; e: EngineId } | null>(null);
  const [auditFilter, setAuditFilter] = useState<"all" | "fail" | "warn" | "pass">("all");
  const [celebrate, setCelebrate] = useState(0);
  const commandRef = useRef<(c: BrandCommand) => void>(() => {});
  const tabRefs = useRef<Partial<Record<Tab, HTMLButtonElement | null>>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [recFilter, setRecFilter] = useState<"all" | Recommendation["status"]>("all");
  const [competitors, setCompetitors] = useState<string[] | null>(null);

  const load = useCallback(async () => {
    const d = await api<Data>(`/api/brands/${id}`);
    if (d) setData(d);
    return d;
  }, [api, id]);

  useEffect(() => {
    void load();
  }, [load]);

  const onboarding = !!data && (!data.scans.length || !data.audit) && Date.now() - new Date(data.brand.createdAt).getTime() < 10 * 60_000;
  useEffect(() => {
    if (!onboarding) return;
    const t = setInterval(() => void load(), 4000);
    return () => clearInterval(t);
  }, [onboarding, load]);

  useEffect(() => {
    const onCmd = (e: Event) => commandRef.current((e as CustomEvent<BrandCommand>).detail);
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e) || e.metaKey || e.ctrlKey || e.altKey || document.querySelector('[role="dialog"]')) return;
      const map: Record<string, BrandCommand> = { "1": "tab:overview", "2": "tab:prompts", "3": "tab:audit", "4": "tab:actions", "5": "tab:settings", s: "scan", a: "audit" };
      const c = map[e.key.toLowerCase()];
      if (c) {
        e.preventDefault();
        commandRef.current(c);
      }
    };
    window.addEventListener(BRAND_COMMAND_EVENT, onCmd);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(BRAND_COMMAND_EVENT, onCmd);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useLayoutEffect(() => {
    const el = tabRefs.current[tab];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [tab, data]);

  const doneTotal = data ? data.recommendations.filter((r) => r.status === "done").length : 0;
  const prevDone = useRef<number | null>(null);
  useEffect(() => {
    if (!data) return;
    const all = data.recommendations.length;
    if (prevDone.current != null && all > 0 && doneTotal === all && prevDone.current < all) setCelebrate((c) => c + 1);
    prevDone.current = doneTotal;
  }, [doneTotal, data]);

  const gridScans = useMemo(() => {
    if (!data) return [] as ScanResult[];
    const m = new Map(data.scans.map((s) => [`${s.promptId}:${s.engine}`, s]));
    return data.prompts.flatMap((p) => data.engines.map((e) => m.get(`${p.id}:${e.id}`)).filter((x): x is ScanResult => !!x));
  }, [data]);
  const openScan = useCallback((s: ScanResult) => {
    const i = gridScans.findIndex((x) => x.id === s.id);
    setOpenIdx(i >= 0 ? i : null);
  }, [gridScans]);

  const promptById = useMemo(() => new Map(data?.prompts.map((p) => [p.id, p]) ?? []), [data]);
  const cell = useMemo(() => {
    const m = new Map<string, ScanResult>();
    data?.scans.forEach((s) => m.set(`${s.promptId}:${s.engine}`, s));
    return m;
  }, [data]);

  if (!data) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-6 grid gap-4 sm:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="card h-28 animate-pulse" />)}</div>
      </main>
    );
  }

  const { brand, metrics, prompts, audit, recommendations, history, limits, engines } = data;
  const prev = history.length > 1 ? history.at(-2)! : null;
  const cur = history.at(-1) ?? null;
  const ownShare = (() => {
    const total = metrics.competitorShare.reduce((s, c) => s + c.mentions, 0);
    const own = metrics.competitorShare.find((c) => c.name === brand.name)?.mentions ?? 0;
    return total ? Math.round((own / total) * 100) : 0;
  })();
  const shownEngines = engineFilter ? engines.filter((e) => e.id === engineFilter) : engines;
  const doneCount = recommendations.filter((r) => r.status === "done").length;

  async function act(kind: "scan" | "audit") {
    setBusy(kind);
    const r = await api(`/api/brands/${id}/${kind}`, { method: "POST" });
    setBusy("");
    if (r) {
      toast(kind === "scan" ? "Scan complete — report updated" : "Audit complete");
      await load();
      if (kind === "audit") setTab("audit");
    }
  }

  commandRef.current = (c) => {
    if (c === "scan" || c === "audit") {
      if (!busy) void act(c);
    } else setTab(c.slice(4) as Tab);
  };

  async function addPrompt(e: React.FormEvent) {
    e.preventDefault();
    if (!newPrompt.text.trim()) return;
    const r = await api(`/api/brands/${id}/prompts`, { method: "POST", json: newPrompt });
    if (r) {
      setNewPrompt({ ...newPrompt, text: "" });
      await load();
    }
  }

  async function suggest() {
    setBusy("suggest");
    const r = await api(`/api/brands/${id}/prompts`, { method: "POST", json: { action: "suggest", keywords: brand.keywords ?? [] } });
    setBusy("");
    if (r) {
      toast("Suggested prompts added");
      await load();
    }
  }

  async function deletePrompt(pid: string) {
    setData({ ...data!, prompts: prompts.filter((p) => p.id !== pid) });
    await api(`/api/brands/${id}/prompts?promptId=${pid}`, { method: "DELETE" });
    await load();
  }

  async function setRec(recId: string, status: Recommendation["status"]) {
    setData({ ...data!, recommendations: recommendations.map((r) => (r.id === recId ? { ...r, status } : r)) });
    await api(`/api/brands/${id}/recommendations`, { method: "PATCH", json: { recId, status } });
  }

  async function patchBrand(patch: Partial<Brand>, msg: string) {
    const r = await api(`/api/brands/${id}`, { method: "PATCH", json: patch });
    if (r) {
      toast(msg);
      await load();
    }
  }

  async function deleteBrand() {
    if (!confirm(`Delete ${brand.name} and all its scan history? This cannot be undone.`)) return;
    const r = await api(`/api/brands/${id}`, { method: "DELETE" });
    if (r) {
      void reloadMe();
      router.push("/dashboard");
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/dashboard" className="text-sm text-brand-700 hover:underline">← All brands</Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{brand.name}</h1>
          <p className="text-sm text-slate-500">
            {brand.domain} · last scan {timeAgo(brand.lastScanAt)} · {brand.autoScan === false ? "auto-scan off" : `auto-scans every ${limits.scanEveryDays === 1 ? "day" : `${limits.scanEveryDays} days`}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => act("scan")} disabled={!!busy} className="btn-primary">
            {busy === "scan" ? <><span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Scanning engines…</> : <>Run scan now<kbd className="ml-2 rounded bg-white/20 px-1.5 text-[10px] font-semibold">S</kbd></>}
          </button>
          <button type="button" onClick={() => act("audit")} disabled={!!busy} className="btn-secondary">
            {busy === "audit" ? "Auditing…" : <>Re-audit site<kbd className="ml-2 rounded bg-slate-100 px-1.5 text-[10px] font-semibold text-slate-500">A</kbd></>}
          </button>
        </div>
      </div>

      {busy === "scan" && <ScanProgress engines={engines} />}
      {busy !== "scan" && (onboarding || params.get("onboarding")) && !data.scans.length && <Onboarding data={data} />}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi accent="#6e4dff" label="Visibility" value={metrics.visibilityRate} unit="%" sub={`${visibilityLabel(metrics.visibilityRate)} · answers naming you`} delta={cur && prev ? cur.visibilityRate - prev.visibilityRate : null} suffix=" pts" />
        <Kpi accent="#d946ef" label="Citation rate" value={metrics.citationRate} unit="%" sub="Answers citing your domain" delta={cur && prev ? cur.citationRate - prev.citationRate : null} suffix=" pts" />
        <Kpi accent="#f59e0b" label="Avg. position" value={metrics.avgPosition || null} prefix="#" sub="Rank among brands named" />
        <Kpi accent="#0ea5e9" label="Share of voice" value={ownShare} unit="%" sub={`vs ${brand.competitors.length} competitor${brand.competitors.length === 1 ? "" : "s"}`} />
      </div>
      {data.scans.length > 0 && (
        <p className="mt-2 text-xs text-slate-400">
          {metrics.liveShare}% of results are live API answers; the rest are labelled Estimated.{" "}
          {metrics.liveShare < 100 && <Link href="/faq" className="underline">Why?</Link>}
        </p>
      )}

      <div className="sticky top-[57px] z-20 -mx-6 mt-6 overflow-x-auto bg-slate-50/95 px-6 backdrop-blur">
        <div role="tablist" className="relative flex gap-1 border-b border-slate-200">
          <span className="absolute -bottom-px h-0.5 rounded-full bg-brand-600 transition-all duration-300 ease-out" style={{ left: indicator.left, width: indicator.width }} />
          {TABS.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[t.id] = el;
              }}
              role="tab"
              aria-selected={tab === t.id}
              type="button"
              onClick={() => setTab(t.id)}
              title={`Shortcut: ${i + 1}`}
              className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium transition ${tab === t.id ? "text-brand-700" : "text-slate-500 hover:text-slate-800"}`}
            >
              {t.label}
              {t.id === "actions" && recommendations.length > 0 && <span className="ml-1.5 rounded-full bg-slate-200 px-1.5 text-xs text-slate-600">{recommendations.length - doneCount}</span>}
            </button>
          ))}
        </div>
      </div>

      {tab === "overview" && (
        <div className="fade-swap mt-6 grid gap-6 lg:grid-cols-3">
          <div className="card lg:col-span-2">
            <h3 className="font-semibold text-slate-900">Visibility over time</h3>
            <div className="mt-4"><TrendChart points={history} /></div>
          </div>
          <div className="card">
            <h3 className="font-semibold text-slate-900">Share of voice</h3>
            <ul className="mt-4 space-y-3">
              {metrics.competitorShare.length === 0 && <p className="text-sm text-slate-500">Appears after your first scan.</p>}
              {metrics.competitorShare.map((c) => {
                const max = metrics.competitorShare[0]?.mentions || 1;
                const own = c.name === brand.name;
                return (
                  <li key={c.name}>
                    <div className="flex justify-between text-sm">
                      <span className={own ? "font-semibold text-brand-700" : "text-slate-700"}>{c.name}{own && " (you)"}</span>
                      <span className="text-slate-500">{c.mentions}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-slate-100">
                      <div className={`bar-fill h-2 rounded-full ${own ? "bg-brand-600" : "bg-amber-400"}`} style={{ width: `${(c.mentions / max) * 100}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="card lg:col-span-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-semibold text-slate-900">By engine</h3>
              {engineFilter && <button type="button" className="text-sm text-brand-700 hover:underline" onClick={() => setEngineFilter(null)}>Show all engines</button>}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {AI_ENGINES.map((e) => {
                const row = metrics.engineBreakdown[e.id];
                const rate = row.total ? Math.round((row.mentions / row.total) * 100) : 0;
                const enabled = engines.find((x) => x.id === e.id);
                return (
                  <button
                    key={e.id}
                    type="button"
                    disabled={!enabled}
                    onClick={() => setEngineFilter(engineFilter === e.id ? null : e.id)}
                    className={`rounded-xl border p-4 text-left transition ${engineFilter === e.id ? "border-brand-400 ring-2 ring-brand-100" : "border-slate-200 hover:border-slate-300"} ${!enabled ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-medium text-slate-800"><span className="h-2.5 w-2.5 rounded-full" style={{ background: e.color }} />{e.name}</span>
                      {enabled ? <LiveBadge live={enabled.live} /> : <Link href="/settings" className="text-xs font-semibold text-fuchsia-700" onClick={(ev) => ev.stopPropagation()}>Upgrade</Link>}
                    </div>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{enabled ? `${rate}%` : "—"}</p>
                    <div className="mt-2 h-1.5 rounded-full bg-slate-100"><div className="bar-fill h-1.5 rounded-full" style={{ width: `${rate}%`, background: e.color }} /></div>
                    <p className="mt-1.5 text-xs text-slate-400">{row.mentions}/{row.total} mentioned · {row.citations} cited</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card lg:col-span-3">
            <h3 className="font-semibold text-slate-900">Prompt × engine results</h3>
            <p className="mt-1 text-xs text-slate-500">Click any cell to read the full answer, then use <kbd className="kbd">←</kbd> <kbd className="kbd">→</kbd> to browse.</p>
            {data.scans.length === 0 ? (
              <p className="mt-6 text-sm text-slate-500">No results yet — the first scan runs automatically, or hit “Run scan now”.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="text-xs text-slate-400">
                      <th className="pb-2 pr-4 text-left font-medium">Prompt</th>
                      {shownEngines.map((e) => <th key={e.id} className={`px-1 pb-2 text-center font-medium transition-colors ${hover?.e === e.id ? "text-slate-900" : ""}`}>{engineMeta(e.id).name.replace("Microsoft ", "").replace("Google AI Overview", "AI Overview")}</th>)}
                    </tr>
                  </thead>
                  <tbody onMouseLeave={() => setHover(null)}>
                    {prompts.map((p) => (
                      <tr key={p.id} className={`border-t border-slate-100 transition-colors ${hover?.p === p.id ? "bg-slate-50" : ""}`}>
                        <td className="max-w-xs py-2 pl-2 pr-4">
                          <span className={`line-clamp-2 transition-colors ${hover?.p === p.id ? "text-slate-900" : "text-slate-700"}`}>{p.text}</span>
                        </td>
                        {shownEngines.map((e) => {
                          const s = cell.get(`${p.id}:${e.id}`);
                          const cls = !s ? "bg-slate-50 text-slate-300" : s.cited ? "bg-brand-600 text-white" : s.mentioned ? "bg-brand-100 text-brand-800" : s.competitorsMentioned.length ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-400";
                          const label = !s ? "·" : s.cited ? "Cited" : s.mentioned ? `#${s.position ?? "–"}` : s.competitorsMentioned.length ? "Lost" : "—";
                          return (
                            <td key={e.id} className={`px-1 py-1.5 text-center transition-colors ${hover?.e === e.id ? "bg-slate-50" : ""}`}>
                              <button
                                type="button"
                                disabled={!s}
                                onClick={() => s && openScan(s)}
                                onMouseEnter={() => setHover({ p: p.id, e: e.id })}
                                onFocus={() => setHover({ p: p.id, e: e.id })}
                                title={s ? `${engineMeta(e.id).name}: ${s.cited ? "cited" : s.mentioned ? `mentioned at #${s.position ?? "?"}` : s.competitorsMentioned.length ? `lost to ${s.competitorsMentioned.join(", ")}` : "not mentioned"}${s.live ? "" : " (estimated)"}` : undefined}
                                className={`w-full rounded-lg px-2 py-1.5 text-xs font-semibold transition hover:scale-105 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${cls} ${s && !s.live ? "opacity-80" : ""}`}
                              >
                                {label}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                  <span><span className="mr-1 inline-block h-3 w-3 rounded bg-brand-600 align-middle" />Cited</span>
                  <span><span className="mr-1 inline-block h-3 w-3 rounded bg-brand-100 align-middle" />Mentioned (#position)</span>
                  <span><span className="mr-1 inline-block h-3 w-3 rounded bg-rose-50 ring-1 ring-rose-100 align-middle" />Competitor won</span>
                  <span><span className="mr-1 inline-block h-3 w-3 rounded bg-slate-100 align-middle" />Not mentioned</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "prompts" && (
        <div className="fade-swap mt-6 space-y-4">
          <form onSubmit={addPrompt} className="card flex flex-col gap-2 md:flex-row">
            <input className="input flex-1" placeholder="Add a question buyers ask AI, e.g. best invoicing app for freelancers in India" value={newPrompt.text} onChange={(e) => setNewPrompt({ ...newPrompt, text: e.target.value })} />
            <select className="input md:w-44" value={newPrompt.stage} onChange={(e) => setNewPrompt({ ...newPrompt, stage: e.target.value as PromptStage })}>
              {(Object.keys(STAGE_LABEL) as PromptStage[]).map((s) => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
            </select>
            <button type="submit" className="btn-primary">Add</button>
            <button type="button" onClick={suggest} className="btn-secondary" disabled={busy === "suggest"}>{busy === "suggest" ? "Adding…" : "Suggest prompts"}</button>
          </form>
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>{prompts.length} of {limits.prompts} prompts</span>
            <div className="h-1.5 w-40 rounded-full bg-slate-200"><div className="h-1.5 rounded-full bg-brand-600" style={{ width: `${Math.min(100, (prompts.length / limits.prompts) * 100)}%` }} /></div>
          </div>
          <ul className="space-y-2">
            {prompts.map((p) => {
              const rows = data.scans.filter((s) => s.promptId === p.id);
              const hit = rows.filter((s) => s.mentioned).length;
              return (
                <li key={p.id} className="card group flex items-center gap-3 py-3">
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${STAGE_TONE[p.stage]}`}>{STAGE_LABEL[p.stage]}</span>
                  <span className="flex-1 text-sm text-slate-800">{p.text}</span>
                  {rows.length > 0 && (
                    <span className="flex shrink-0 items-center gap-1" aria-label={`${hit} of ${rows.length} engines mention you`}>
                      {engines.map((en) => {
                        const r = rows.find((x) => x.engine === en.id);
                        if (!r) return null;
                        return (
                          <button
                            key={en.id}
                            type="button"
                            onClick={() => openScan(r)}
                            title={`${engineMeta(en.id).name}: ${r.cited ? "cited" : r.mentioned ? "mentioned" : "not mentioned"}`}
                            className={`h-3 w-3 rounded-full ring-2 ring-white transition hover:scale-125 ${r.mentioned ? "" : "opacity-25"}`}
                            style={{ background: engineMeta(en.id).color }}
                          />
                        );
                      })}
                      <span className="ml-1.5 text-xs tabular-nums text-slate-500">{hit}/{rows.length}</span>
                    </span>
                  )}
                  <button type="button" onClick={() => deletePrompt(p.id)} className="shrink-0 rounded-lg px-2 py-1 text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100" aria-label="Delete prompt">✕</button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {tab === "audit" && (
        <div className="fade-swap mt-6">
          {!audit ? (
            <div className="card text-center">
              <p className="text-slate-600">No audit yet.</p>
              <button type="button" onClick={() => act("audit")} className="btn-primary mt-4">Audit {brand.domain}</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="card flex flex-wrap items-center gap-8">
                <ScoreRing score={audit.overallScore} size={140} />
                <div className="flex gap-8">
                  <div><p className="text-3xl font-bold text-slate-900">{audit.crawlabilityScore}</p><p className="text-sm text-slate-500">Crawlability</p></div>
                  <div><p className="text-3xl font-bold text-slate-900">{audit.contentScore}</p><p className="text-sm text-slate-500">Content &amp; entity</p></div>
                </div>
                <p className="text-xs text-slate-400">Audited {timeAgo(audit.createdAt)} · re-audits weekly automatically</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["all", "fail", "warn", "pass"] as const).map((f) => {
                  const n = f === "all" ? audit.checks.length : audit.checks.filter((c) => c.status === f).length;
                  const label = { all: "All checks", fail: "Failing", warn: "Warnings", pass: "Passing" }[f];
                  const dot = { all: "bg-slate-400", fail: "bg-rose-500", warn: "bg-amber-400", pass: "bg-emerald-500" }[f];
                  return (
                    <button key={f} type="button" onClick={() => setAuditFilter(f)} className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${auditFilter === f ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                      {label}
                      <span className="tabular-nums opacity-60">{n}</span>
                    </button>
                  );
                })}
              </div>
              <ul className="space-y-2">
                {[...audit.checks].filter((c) => auditFilter === "all" || c.status === auditFilter).sort((a, b) => ({ fail: 0, warn: 1, pass: 2 })[a.status] - ({ fail: 0, warn: 1, pass: 2 })[b.status]).map((c) => (
                  <li key={c.id} className="card fade-swap flex gap-4 py-3">
                    <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${c.status === "pass" ? "bg-emerald-500" : c.status === "warn" ? "bg-amber-400" : "bg-rose-500"}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{c.label} <span className="ml-1 text-xs font-normal uppercase text-slate-400">{c.impact}</span></p>
                      <p className="text-sm text-slate-500">{c.detail}</p>
                      {c.status !== "pass" && c.fix && <p className="mt-1 text-sm text-slate-700"><b>Fix:</b> {c.fix}</p>}
                      {c.status !== "pass" && c.guide && <Link href={`/learn/${c.guide}`} target="_blank" className="mt-1 inline-block text-sm text-brand-700 hover:underline">Read the guide →</Link>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {tab === "actions" && (
        <div className="fade-swap mt-6 space-y-4">
          {recommendations.length > 0 && (
            <div className="card relative">
              {celebrate > 0 && doneCount === recommendations.length && <Confetti key={celebrate} count={26} />}
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-900">
                  {doneCount === recommendations.length ? "Every action done — the next scan will show the impact." : `${doneCount} of ${recommendations.length} actions done`}
                </span>
                <span className="text-slate-500">{Math.round((doneCount / recommendations.length) * 100)}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 transition-all duration-500 ease-out" style={{ width: `${(doneCount / recommendations.length) * 100}%` }} /></div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(["all", "todo", "in_progress", "done"] as const).map((f) => (
                  <button key={f} type="button" onClick={() => setRecFilter(f)} className={`rounded-full px-3 py-1 text-xs font-medium ${recFilter === f ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                    {f === "all" ? "All" : f === "todo" ? "To do" : f === "in_progress" ? "In progress" : "Done"}
                  </button>
                ))}
              </div>
            </div>
          )}
          {recommendations.length === 0 && <p className="text-slate-500">Your action plan appears after the first scan or audit.</p>}
          {recommendations.filter((r) => recFilter === "all" || r.status === recFilter).map((r) => (
            <div key={r.id} className={`card spotlight transition duration-300 ${r.status === "done" ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${r.impact === "high" ? "bg-rose-50 text-rose-700" : r.impact === "medium" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{r.impact} impact</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{r.area}</span>
                  </div>
                  <h4 className={`mt-2 font-semibold text-slate-900 ${r.status === "done" ? "line-through" : ""}`}>{r.title}</h4>
                  <p className="mt-1 text-sm text-slate-600">{r.description}</p>
                </div>
                <div className="flex shrink-0 rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
                  {(["todo", "in_progress", "done"] as const).map((s) => (
                    <button key={s} type="button" onClick={() => setRec(r.id, s)} className={`rounded-md px-2.5 py-1 transition ${r.status === s ? (s === "done" ? "bg-brand-600 text-white shadow-sm" : "bg-white text-slate-900 shadow-sm") : "text-slate-500 hover:text-slate-800"}`}>
                      {s === "todo" ? "To do" : s === "in_progress" ? "Doing" : "Done"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "settings" && (
        <div className="fade-swap mt-6 grid gap-6 lg:grid-cols-2">
          <div className="card">
            <h3 className="font-semibold text-slate-900">Competitors</h3>
            <p className="mt-1 text-sm text-slate-500">Used for share of voice and competitor-gap detection. Up to 8.</p>
            <div className="mt-3"><ChipInput values={competitors ?? brand.competitors} onChange={setCompetitors} placeholder="Add competitor" /></div>
            <button type="button" className="btn-primary mt-3" disabled={!competitors} onClick={() => competitors && patchBrand({ competitors }, "Competitors saved").then(() => setCompetitors(null))}>Save competitors</button>
          </div>
          <div className="card space-y-5">
            <label className="flex items-center justify-between gap-4">
              <span>
                <span className="block font-semibold text-slate-900">Automatic scans</span>
                <span className="text-sm text-slate-500">Every {limits.scanEveryDays === 1 ? "day" : `${limits.scanEveryDays} days`} on your plan, with an email digest.</span>
              </span>
              <input type="checkbox" className="h-5 w-5 accent-brand-600" checked={brand.autoScan !== false} onChange={(e) => patchBrand({ autoScan: e.target.checked }, e.target.checked ? "Auto-scan on" : "Auto-scan off")} />
            </label>
            <div>
              <p className="font-semibold text-slate-900">Export</p>
              {limits.csvExport ? (
                <a href={`/api/brands/${id}/export`} className="btn-secondary mt-2">Download CSV of all results</a>
              ) : (
                <p className="mt-1 text-sm text-slate-500">CSV export is on Growth and Agency. <Link href="/settings" className="font-medium text-brand-700 underline">Upgrade</Link></p>
              )}
            </div>
            <div className="border-t border-slate-100 pt-4">
              <button type="button" onClick={deleteBrand} className="text-sm font-medium text-rose-600 hover:underline">Delete this brand</button>
            </div>
          </div>
        </div>
      )}

      {openIdx != null && <AnswerDrawer scans={gridScans} index={openIdx} onIndex={setOpenIdx} promptById={promptById} brand={brand} onClose={() => setOpenIdx(null)} />}
    </main>
  );
}

export default function Page() {
  return (
    <Suspense>
      <BrandReport />
    </Suspense>
  );
}
