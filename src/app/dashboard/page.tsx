"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMe } from "@/components/app/AppShell";
import { ChipInput, Sparkline, timeAgo, useApi } from "@/components/app/ui";
import type { Brand, VisibilityPoint } from "@/lib/types";

type BrandRow = Brand & { history: VisibilityPoint[]; visibility: number | null };

export default function DashboardPage() {
  const router = useRouter();
  const api = useApi();
  const { me, reload } = useMe();
  const [brands, setBrands] = useState<BrandRow[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
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
  }, [load]);

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
        <form onSubmit={createBrand} className="fade-swap card mt-6 border-teal-100 shadow-md">
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

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {brands === null &&
          [0, 1].map((i) => <div key={i} className="card h-40 animate-pulse bg-white" />)}
        {brands?.length === 0 && !showForm && (
          <p className="text-slate-500">No brands yet. Create your first brand report.</p>
        )}
        {brands?.map((b) => {
          const vis = b.visibility;
          const prev = b.history.length > 1 ? b.history.at(-2)!.visibilityRate : null;
          const delta = vis != null && prev != null ? vis - prev : null;
          return (
            <Link key={b.id} href={`/brands/${b.id}`} className="group card flex flex-col transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-slate-900 group-hover:text-teal-700">{b.name}</h3>
                  <p className="truncate text-sm text-slate-500">{b.domain}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-900">{vis == null ? "—" : `${vis}%`}</p>
                  <p className="text-xs text-slate-400">
                    visibility
                    {delta != null && delta !== 0 && (
                      <span className={`ml-1 font-semibold ${delta > 0 ? "text-teal-600" : "text-rose-600"}`}>{delta > 0 ? "▲" : "▼"}{Math.abs(delta)}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-end justify-between gap-4">
                <Sparkline values={b.history.map((h) => h.visibilityRate)} width={160} />
                <p className="text-xs text-slate-400">Last scan {timeAgo(b.lastScanAt)}</p>
              </div>
              {b.competitors.length > 0 && <p className="mt-3 truncate text-xs text-slate-400">vs {b.competitors.join(", ")}</p>}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
