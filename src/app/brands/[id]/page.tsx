"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AI_ENGINES, type EngineId } from "@/lib/brand";
import { visibilityLabel } from "@/lib/geo/metrics";
import { ChipInput, TrendChart, timeAgo, useApi, useToast } from "@/components/app/ui";
import { useMe } from "@/components/app/AppShell";
import { ScoreRing } from "@/components/tools/ScoreRing";
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
  mofu: "bg-violet-50 text-violet-700 ring-violet-100",
  bofu: "bg-amber-50 text-amber-700 ring-amber-100",
};
const engineMeta = (id: EngineId) => AI_ENGINES.find((e) => e.id === id)!;

function LiveBadge({ live }: { live?: boolean }) {
  return live ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700 ring-1 ring-teal-100">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />Live
    </span>
  ) : (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500" title="No public API or key — modelled estimate">Estimated</span>
  );
}

function Kpi({ label, value, sub, delta, suffix = "" }: { label: string; value: string; sub: string; delta?: number | null; suffix?: string }) {
  return (
    <div className="card">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 flex items-baseline gap-2 text-3xl font-bold text-slate-900">
        {value}
        {delta != null && delta !== 0 && (
          <span className={`text-sm font-semibold ${delta > 0 ? "text-teal-600" : "text-rose-600"}`}>
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
    <div className="card mt-6 border-teal-100 bg-gradient-to-br from-teal-50 to-white">
      <p className="font-semibold text-slate-900">Setting up {data.brand.name}…</p>
      <p className="text-sm text-slate-500">This runs automatically and takes about a minute. You can leave this page.</p>
      <ol className="mt-5 grid gap-3 sm:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.t} className="flex items-center gap-2 text-sm">
            {s.done ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-xs text-white">✓</span>
            ) : i === current ? (
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
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

function AnswerDrawer({ scan, prompt, onClose }: { scan: ScanResult; prompt?: Prompt; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  const e = engineMeta(scan.engine);
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/30 backdrop-blur-[1px]" onClick={onClose}>
      <aside role="dialog" aria-modal className="fade-swap h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl" onClick={(ev) => ev.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: e.color }} />
            <span className="font-semibold text-slate-900">{e.name}</span>
            <LiveBadge live={scan.live} />
          </div>
          <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100" aria-label="Close">✕</button>
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Prompt</p>
        <p className="mt-1 text-slate-900">“{prompt?.text}”</p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          {[
            ["Mentioned", scan.mentioned ? "Yes" : "No"],
            ["Cited", scan.cited ? "Yes" : "No"],
            ["Position", scan.position ? `#${scan.position}` : "—"],
            ["Sentiment", scan.sentiment ?? "—"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-400">{k}</p>
              <p className="font-semibold capitalize text-slate-900">{v}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">Answer</p>
        <p className="mt-1 whitespace-pre-wrap rounded-xl border border-slate-200 p-4 text-sm leading-relaxed text-slate-700">{scan.answerSnippet}</p>
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
            <ul className="mt-2 space-y-1 text-sm text-slate-600">{scan.sources.map((s) => <li key={s}>· {s}</li>)}</ul>
          </>
        )}
        <p className="mt-6 text-xs text-slate-400">Scanned {new Date(scan.createdAt).toLocaleString()}</p>
      </aside>
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
  const [open, setOpen] = useState<ScanResult | null>(null);
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
          <Link href="/dashboard" className="text-sm text-teal-700 hover:underline">← All brands</Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{brand.name}</h1>
          <p className="text-sm text-slate-500">
            {brand.domain} · last scan {timeAgo(brand.lastScanAt)} · {brand.autoScan === false ? "auto-scan off" : `auto-scans every ${limits.scanEveryDays === 1 ? "day" : `${limits.scanEveryDays} days`}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => act("scan")} disabled={!!busy} className="btn-primary">
            {busy === "scan" ? <><span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Scanning engines…</> : "Run scan now"}
          </button>
          <button type="button" onClick={() => act("audit")} disabled={!!busy} className="btn-secondary">
            {busy === "audit" ? "Auditing…" : "Re-audit site"}
          </button>
        </div>
      </div>

      {(onboarding || params.get("onboarding")) && !data.scans.length && <Onboarding data={data} />}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Visibility" value={`${metrics.visibilityRate}%`} sub={`${visibilityLabel(metrics.visibilityRate)} · answers naming you`} delta={cur && prev ? cur.visibilityRate - prev.visibilityRate : null} suffix=" pts" />
        <Kpi label="Citation rate" value={`${metrics.citationRate}%`} sub="Answers citing your domain" delta={cur && prev ? cur.citationRate - prev.citationRate : null} suffix=" pts" />
        <Kpi label="Avg. position" value={metrics.avgPosition ? `#${metrics.avgPosition}` : "—"} sub="Rank among brands named" />
        <Kpi label="Share of voice" value={`${ownShare}%`} sub={`vs ${brand.competitors.length} competitor${brand.competitors.length === 1 ? "" : "s"}`} />
      </div>
      {data.scans.length > 0 && (
        <p className="mt-2 text-xs text-slate-400">
          {metrics.liveShare}% of results are live API answers; the rest are labelled Estimated.{" "}
          {metrics.liveShare < 100 && <Link href="/faq" className="underline">Why?</Link>}
        </p>
      )}

      <div className="sticky top-[57px] z-20 -mx-6 mt-6 overflow-x-auto bg-slate-50/95 px-6 backdrop-blur">
        <div className="flex gap-1 border-b border-slate-200">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition ${tab === t.id ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
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
                      <span className={own ? "font-semibold text-teal-700" : "text-slate-700"}>{c.name}{own && " (you)"}</span>
                      <span className="text-slate-500">{c.mentions}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-slate-100">
                      <div className={`bar-fill h-2 rounded-full ${own ? "bg-teal-600" : "bg-amber-400"}`} style={{ width: `${(c.mentions / max) * 100}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="card lg:col-span-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-semibold text-slate-900">By engine</h3>
              {engineFilter && <button type="button" className="text-sm text-teal-700 hover:underline" onClick={() => setEngineFilter(null)}>Show all engines</button>}
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
                    className={`rounded-xl border p-4 text-left transition ${engineFilter === e.id ? "border-teal-400 ring-2 ring-teal-100" : "border-slate-200 hover:border-slate-300"} ${!enabled ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-medium text-slate-800"><span className="h-2.5 w-2.5 rounded-full" style={{ background: e.color }} />{e.name}</span>
                      {enabled ? <LiveBadge live={enabled.live} /> : <Link href="/settings" className="text-xs font-semibold text-violet-700" onClick={(ev) => ev.stopPropagation()}>Upgrade</Link>}
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
            <p className="mt-1 text-xs text-slate-500">Click any cell to read the answer.</p>
            {data.scans.length === 0 ? (
              <p className="mt-6 text-sm text-slate-500">No results yet — the first scan runs automatically, or hit “Run scan now”.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="text-xs text-slate-400">
                      <th className="pb-2 pr-4 text-left font-medium">Prompt</th>
                      {shownEngines.map((e) => <th key={e.id} className="px-1 pb-2 text-center font-medium">{engineMeta(e.id).name.replace("Microsoft ", "").replace("Google AI Overview", "AI Overview")}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {prompts.map((p) => (
                      <tr key={p.id} className="border-t border-slate-100">
                        <td className="max-w-xs py-2 pr-4">
                          <span className="line-clamp-2 text-slate-700">{p.text}</span>
                        </td>
                        {shownEngines.map((e) => {
                          const s = cell.get(`${p.id}:${e.id}`);
                          const cls = !s ? "bg-slate-50 text-slate-300" : s.cited ? "bg-teal-600 text-white" : s.mentioned ? "bg-teal-100 text-teal-800" : s.competitorsMentioned.length ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-400";
                          const label = !s ? "·" : s.cited ? "Cited" : s.mentioned ? `#${s.position ?? "–"}` : s.competitorsMentioned.length ? "Lost" : "—";
                          return (
                            <td key={e.id} className="px-1 py-1.5 text-center">
                              <button type="button" disabled={!s} onClick={() => s && setOpen(s)} className={`w-full rounded-lg px-2 py-1.5 text-xs font-semibold transition hover:scale-105 hover:shadow ${cls} ${s && !s.live ? "opacity-80" : ""}`}>
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
                  <span><span className="mr-1 inline-block h-3 w-3 rounded bg-teal-600 align-middle" />Cited</span>
                  <span><span className="mr-1 inline-block h-3 w-3 rounded bg-teal-100 align-middle" />Mentioned (#position)</span>
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
            <div className="h-1.5 w-40 rounded-full bg-slate-200"><div className="h-1.5 rounded-full bg-teal-600" style={{ width: `${Math.min(100, (prompts.length / limits.prompts) * 100)}%` }} /></div>
          </div>
          <ul className="space-y-2">
            {prompts.map((p) => {
              const rows = data.scans.filter((s) => s.promptId === p.id);
              const hit = rows.filter((s) => s.mentioned).length;
              return (
                <li key={p.id} className="card group flex items-center gap-3 py-3">
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${STAGE_TONE[p.stage]}`}>{STAGE_LABEL[p.stage]}</span>
                  <span className="flex-1 text-sm text-slate-800">{p.text}</span>
                  {rows.length > 0 && <span className="shrink-0 text-xs text-slate-500">{hit}/{rows.length} engines</span>}
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
              <ul className="space-y-2">
                {[...audit.checks].sort((a, b) => ({ fail: 0, warn: 1, pass: 2 })[a.status] - ({ fail: 0, warn: 1, pass: 2 })[b.status]).map((c) => (
                  <li key={c.id} className="card flex gap-4 py-3">
                    <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${c.status === "pass" ? "bg-teal-500" : c.status === "warn" ? "bg-amber-400" : "bg-rose-500"}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{c.label} <span className="ml-1 text-xs font-normal uppercase text-slate-400">{c.impact}</span></p>
                      <p className="text-sm text-slate-500">{c.detail}</p>
                      {c.status !== "pass" && c.fix && <p className="mt-1 text-sm text-slate-700"><b>Fix:</b> {c.fix}</p>}
                      {c.status !== "pass" && c.guide && <Link href={`/learn/${c.guide}`} target="_blank" className="mt-1 inline-block text-sm text-teal-700 hover:underline">Read the guide →</Link>}
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
            <div className="card">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-900">{doneCount} of {recommendations.length} actions done</span>
                <span className="text-slate-500">{Math.round((doneCount / recommendations.length) * 100)}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-violet-500 transition-all" style={{ width: `${(doneCount / recommendations.length) * 100}%` }} /></div>
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
            <div key={r.id} className={`card transition ${r.status === "done" ? "opacity-60" : ""}`}>
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
                    <button key={s} type="button" onClick={() => setRec(r.id, s)} className={`rounded-md px-2.5 py-1 ${r.status === s ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
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
              <input type="checkbox" className="h-5 w-5 accent-teal-600" checked={brand.autoScan !== false} onChange={(e) => patchBrand({ autoScan: e.target.checked }, e.target.checked ? "Auto-scan on" : "Auto-scan off")} />
            </label>
            <div>
              <p className="font-semibold text-slate-900">Export</p>
              {limits.csvExport ? (
                <a href={`/api/brands/${id}/export`} className="btn-secondary mt-2">Download CSV of all results</a>
              ) : (
                <p className="mt-1 text-sm text-slate-500">CSV export is on Growth and Agency. <Link href="/settings" className="font-medium text-teal-700 underline">Upgrade</Link></p>
              )}
            </div>
            <div className="border-t border-slate-100 pt-4">
              <button type="button" onClick={deleteBrand} className="text-sm font-medium text-rose-600 hover:underline">Delete this brand</button>
            </div>
          </div>
        </div>
      )}

      {open && <AnswerDrawer scan={open} prompt={promptById.get(open.promptId)} onClose={() => setOpen(null)} />}
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
