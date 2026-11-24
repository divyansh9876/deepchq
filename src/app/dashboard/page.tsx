"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMe } from "@/components/app/AppShell";
import { ChipInput, Sparkline, timeAgo, useApi } from "@/components/app/ui";
import { AnimatedNumber } from "@/components/ui/fx";
import type { Brand, VisibilityPoint } from "@/lib/types";

type BrandRow = Brand & { history: VisibilityPoint[]; visibility: number | null };

export default function DashboardPage() {
  const router = useRouter();
  const api = useApi();
  const { me, reload } = useMe();
  const [brands, setBrands] = useState<BrandRow[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"recent" | "visibility" | "name">("recent");
  const [form, setForm] = useState({ name: "", domain: "", competitors: [] as string[], keywords: [] as string[], country: "US" });

  const load = useCallback(async () => {
    const d = await api<{ brands: BrandRow[] }>("/api/brands");
    if (d) {
      setBrands(d.brands);
      if (!d.brands.length) setShowForm(true);
    }
  }, [api]);

  useEffect(() => {
    void load();
    if (new URLSearchParams(window.location.search).get("new")) setShowForm(true);
  }, [load]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = (brands ?? []).filter((b) => !q || b.name.toLowerCase().includes(q) || b.domain.toLowerCase().includes(q));
    return [...list].sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name) : sort === "visibility" ? (b.visibility ?? -1) - (a.visibility ?? -1) : new Date(b.lastScanAt ?? b.createdAt).getTime() - new Date(a.lastScanAt ?? a.createdAt).getTime(),
    );
  }, [brands, query, sort]);

  const summary = useMemo(() => {
    const scored = (brands ?? []).filter((b) => b.visibility != null);
    if (scored.length < 2) return null;
    const avg = Math.round(scored.reduce((s, b) => s + (b.visibility ?? 0), 0) / scored.length);
    let up = 0;
    let down = 0;
    for (const b of scored) {
      const prev = b.history.at(-2)?.visibilityRate;
      if (prev == null) continue;
      if (b.visibility! > prev) up++;
      else if (b.visibility! < prev) down++;
    }
    const best = [...scored].sort((a, b) => (b.visibility ?? 0) - (a.visibility ?? 0))[0];
    return { avg, up, down, best, n: scored.length };
  }, [brands]);

  async function createBrand(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const d = await api<{ brand: Brand }>("/api/brands", { method: "POST", json: { ...form, autoPrompts: true } });
    setBusy(false);
    if (!d) return;
    void reload();
    router.push(`/brands/${d.brand.id}?onboarding=1`);
  }

  const atLimit = !!me && me.usage.brands >= me.limits.brands;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Brand reports</h1>
          <p className="text-sm text-slate-500">
            {me ? (
              <>
                {me.usage.brands} of {me.limits.brands} brand{me.limits.brands === 1 ? "" : "s"} · scans every {me.limits.scanEveryDays === 1 ? "day" : `${me.limits.scanEveryDays} days`} automatically
              </>
            ) : (
              "Loading…"
            )}
          </p>
        </div>
        {atLimit ? (
          <Link href="/settings" className="btn-primary">Upgrade to add brands</Link>
        ) : (
          <button type="button" onClick={() => setShowForm((s) => !s)} className="btn-primary">
            {showForm ? "Close" : "+ New brand"}
          </button>
        )}
      </div>

      {showForm && !atLimit && (
        <form onSubmit={createBrand} className="pop-in card mt-6 border-brand-100 shadow-md">
          <h2 className="font-semibold text-slate-900">Add a brand</h2>
          <p className="mt-1 text-sm text-slate-500">We&apos;ll generate prompts, audit the site and run the first scan automatically — about a minute.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Brand name
              <input className="input mt-1" placeholder="Acme" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Website
              <input className="input mt-1" placeholder="acme.com" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} required />
            </label>
            <div className="text-sm font-medium text-slate-700">
              Competitors <span className="font-normal text-slate-400">(press Enter after each)</span>
              <div className="mt-1"><ChipInput values={form.competitors} onChange={(v) => setForm({ ...form, competitors: v })} placeholder="Competitor names" /></div>
            </div>
            <div className="text-sm font-medium text-slate-700">
              Category keywords <span className="font-normal text-slate-400">(first = main category)</span>
              <div className="mt-1"><ChipInput values={form.keywords} onChange={(v) => setForm({ ...form, keywords: v })} placeholder="e.g. invoicing software, freelancers" /></div>
            </div>
            <label className="text-sm font-medium text-slate-700">
              Main market
              <select className="input mt-1" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                {["US", "UK", "India", "Canada", "Australia", "Germany", "Global"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>
          <button type="submit" disabled={busy} className="btn-primary mt-6 px-6 py-3">
            {busy ? "Creating…" : "Create & start first scan"}
          </button>
        </form>
      )}

      {summary && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="card spotlight py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Portfolio visibility</p>
            <p className="mt-1 text-2xl font-bold text-slate-900"><AnimatedNumber value={summary.avg} suffix="%" /></p>
            <p className="text-xs text-slate-500">average across {summary.n} brands</p>
          </div>
          <div className="card spotlight py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Since last scan</p>
            <p className="mt-1 text-2xl font-bold">
              <span className="text-emerald-600">▲ {summary.up}</span> <span className="ml-2 text-rose-600">▼ {summary.down}</span>
            </p>
            <p className="text-xs text-slate-500">brands moved up / down</p>
          </div>
          <Link href={`/brands/${summary.best.id}`} className="card spotlight py-4 transition hover:border-brand-300">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Most visible</p>
            <p className="mt-1 truncate text-2xl font-bold text-slate-900">{summary.best.name}</p>
            <p className="text-xs text-slate-500">{summary.best.visibility}% of answers name it →</p>
          </Link>
        </div>
      )}

      {(brands?.length ?? 0) > 2 && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[14rem] flex-1">
            <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter brands" className="input bg-white pl-9" aria-label="Filter brands" />
          </div>
          <div className="flex rounded-xl bg-white p-1 text-sm ring-1 ring-slate-200">
            {(["recent", "visibility", "name"] as const).map((k) => (
              <button key={k} type="button" onClick={() => setSort(k)} className={`rounded-lg px-3 py-1.5 font-medium capitalize transition ${sort === k ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"}`}>
                {k === "recent" ? "Recent" : k}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {brands === null &&
          [0, 1].map((i) => <div key={i} className="card h-40 animate-pulse bg-white" />)}
        {brands?.length === 0 && !showForm && (
          <p className="text-slate-500">No brands yet. Create your first brand report.</p>
        )}
        {brands && brands.length > 0 && shown.length === 0 && <p className="text-sm text-slate-500">No brands match “{query}”.</p>}
        {shown.map((b, i) => {
          const vis = b.visibility;
          const prev = b.history.length > 1 ? b.history.at(-2)!.visibilityRate : null;
          const delta = vis != null && prev != null ? vis - prev : null;
          return (
            <Link key={b.id} href={`/brands/${b.id}`} className="engine-chip group card spotlight flex flex-col transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-slate-900 group-hover:text-brand-700">{b.name}</h3>
                  <p className="truncate text-sm text-slate-500">{b.domain}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-900">{vis == null ? "—" : <AnimatedNumber value={vis} suffix="%" />}</p>
                  <p className="text-xs text-slate-400">
                    visibility
                    {delta != null && delta !== 0 && (
                      <span className={`ml-1 font-semibold ${delta > 0 ? "text-emerald-600" : "text-rose-600"}`}>{delta > 0 ? "▲" : "▼"}{Math.abs(delta)}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-end justify-between gap-4">
                <Sparkline values={b.history.map((h) => h.visibilityRate)} width={160} />
                <p className="flex items-center gap-1 text-xs text-slate-400">
                  Last scan {timeAgo(b.lastScanAt)}
                  <span className="text-brand-600 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100">→</span>
                </p>
              </div>
              {b.competitors.length > 0 && <p className="mt-3 truncate text-xs text-slate-400">vs {b.competitors.join(", ")}</p>}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
