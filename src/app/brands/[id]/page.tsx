"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppNav } from "@/components/Logo";
import { AI_ENGINES } from "@/lib/brand";
import { engineName, visibilityLabel } from "@/lib/geo/metrics";
import type {
  Brand,
  BrandMetrics,
  GeoAudit,
  Prompt,
  Recommendation,
  ScanResult,
} from "@/lib/types";

type BrandData = {
  brand: Brand;
  prompts: Prompt[];
  scans: ScanResult[];
  audit: GeoAudit | null;
  recommendations: Recommendation[];
  metrics: BrandMetrics;
};

export default function BrandReportPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<BrandData | null>(null);
  const [tab, setTab] = useState<"overview" | "prompts" | "audit" | "actions">("overview");
  const [loading, setLoading] = useState("");
  const [newPrompt, setNewPrompt] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/brands/${id}`);
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    if (!res.ok) return;
    setData(await res.json());
  }, [id, router]);

  useEffect(() => {
    load();
  }, [load]);

  async function runScan() {
    setLoading("scan");
    await fetch(`/api/brands/${id}/scan`, { method: "POST" });
    setLoading("");
    await load();
  }

  async function runAudit() {
    setLoading("audit");
    await fetch(`/api/brands/${id}/audit`, { method: "POST" });
    setLoading("");
    await load();
    setTab("audit");
  }

  async function addPrompt(e: React.FormEvent) {
    e.preventDefault();
    if (!newPrompt.trim()) return;
    await fetch(`/api/brands/${id}/prompts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newPrompt, stage: "tofu" }),
    });
    setNewPrompt("");
    await load();
  }

  async function suggestPrompts() {
    setLoading("suggest");
    await fetch(`/api/brands/${id}/prompts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "suggest", keywords: [data?.brand.name] }),
    });
    setLoading("");
    await load();
  }

  async function updateRecStatus(recId: string, status: Recommendation["status"]) {
    await fetch(`/api/brands/${id}/recommendations`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recId, status }),
    });
    await load();
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AppNav />
        <p className="p-12 text-center text-slate-500">Loading report…</p>
      </div>
    );
  }

  const { brand, metrics, prompts, scans, audit, recommendations } = data;

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNav />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link href="/dashboard" className="text-sm text-brand-600 hover:underline">
              ← All brands
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">{brand.name}</h1>
            <p className="text-sm text-slate-500">{brand.domain}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={runScan}
              disabled={!!loading}
              className="btn-primary"
            >
              {loading === "scan" ? "Scanning…" : "Run visibility scan"}
            </button>
            <button
              type="button"
              onClick={runAudit}
              disabled={!!loading}
              className="btn-secondary"
            >
              {loading === "audit" ? "Auditing…" : "GEO audit"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Visibility", value: `${metrics.visibilityRate}%`, sub: visibilityLabel(metrics.visibilityRate) },
            { label: "Citation rate", value: `${metrics.citationRate}%`, sub: "Domain cited in answers" },
            { label: "Mentions", value: String(metrics.mentionCount), sub: "Across all engines" },
            { label: "Prompts tracked", value: String(metrics.promptCount), sub: "Active prompts" },
          ].map((m) => (
            <div key={m.label} className="card">
              <p className="text-xs font-medium uppercase text-slate-400">{m.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{m.value}</p>
              <p className="text-xs text-slate-500">{m.sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-2 border-b border-slate-200">
          {(["overview", "prompts", "audit", "actions"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`border-b-2 px-4 py-2 text-sm font-medium capitalize ${
                tab === t
                  ? "border-brand-600 text-brand-600"
                  : "border-transparent text-slate-500"
              }`}
            >
              {t === "actions" ? "Recommendations" : t}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="card">
              <h3 className="font-semibold">Engine breakdown</h3>
              <ul className="mt-4 space-y-3">
                {AI_ENGINES.map((e) => {
                  const row = metrics.engineBreakdown[e.id];
                  const rate = row.total
                    ? Math.round((row.mentions / row.total) * 100)
                    : 0;
                  return (
                    <li key={e.id}>
                      <div className="flex justify-between text-sm">
                        <span>{e.name}</span>
                        <span className="font-medium">{rate}%</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-brand-500"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="card">
              <h3 className="font-semibold">Share of voice</h3>
              <ul className="mt-4 space-y-2">
                {metrics.competitorShare.length === 0 && (
                  <p className="text-sm text-slate-500">Run a scan to see competitor data.</p>
                )}
                {metrics.competitorShare.map((c) => (
                  <li key={c.name} className="flex justify-between text-sm">
                    <span>{c.name}</span>
                    <span className="text-slate-600">{c.mentions} mentions</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card lg:col-span-2">
              <h3 className="font-semibold">Latest scan results</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-xs text-slate-400">
                      <th className="pb-2 pr-4">Engine</th>
                      <th className="pb-2 pr-4">Mentioned</th>
                      <th className="pb-2 pr-4">Cited</th>
                      <th className="pb-2">Snippet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scans.slice(0, 12).map((s) => (
                      <tr key={s.id} className="border-b border-slate-50">
                        <td className="py-2 pr-4">{engineName(s.engine)}</td>
                        <td className="py-2 pr-4">{s.mentioned ? "✓" : "—"}</td>
                        <td className="py-2 pr-4">{s.cited ? "✓" : "—"}</td>
                        <td className="max-w-xs truncate py-2 text-slate-500">
                          {s.answerSnippet}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "prompts" && (
          <div className="mt-6 space-y-4">
            <form onSubmit={addPrompt} className="card flex flex-wrap gap-2">
              <input
                className="input flex-1"
                placeholder="Add a search prompt (e.g. best CRM for startups)"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
              />
              <button type="submit" className="btn-primary">
                Add
              </button>
              <button
                type="button"
                onClick={suggestPrompts}
                className="btn-secondary"
                disabled={loading === "suggest"}
              >
                AI suggest prompts
              </button>
            </form>
            <ul className="space-y-2">
              {prompts.map((p) => (
                <li key={p.id} className="card flex items-center justify-between py-3">
                  <span className="text-sm">{p.text}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs uppercase text-slate-500">
                    {p.stage}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "audit" && (
          <div className="mt-6">
            {!audit ? (
              <div className="card text-center">
                <p className="text-slate-600">No audit yet.</p>
                <button type="button" onClick={runAudit} className="btn-primary mt-4">
                  Run GEO audit on {brand.domain}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Overall", value: audit.overallScore },
                    { label: "Crawlability", value: audit.crawlabilityScore },
                    { label: "Content", value: audit.contentScore },
                  ].map((s) => (
                    <div key={s.label} className="card text-center">
                      <p className="text-xs text-slate-400">{s.label}</p>
                      <p className="text-3xl font-bold text-slate-900">{s.value}</p>
                    </div>
                  ))}
                </div>
                <ul className="space-y-2">
                  {audit.checks.map((c) => (
                    <li key={c.id} className="card flex gap-4 py-3">
                      <span
                        className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                          c.status === "pass"
                            ? "bg-green-500"
                            : c.status === "warn"
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-sm">{c.label}</p>
                        <p className="text-sm text-slate-500">{c.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {tab === "actions" && (
          <div className="mt-6 space-y-3">
            {recommendations.length === 0 && (
              <p className="text-slate-500">Run a scan or audit to generate recommendations.</p>
            )}
            {recommendations.map((r) => (
              <div key={r.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        r.impact === "high"
                          ? "bg-red-100 text-red-700"
                          : r.impact === "medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {r.impact} impact
                    </span>
                    <h4 className="mt-2 font-semibold">{r.title}</h4>
                    <p className="mt-1 text-sm text-slate-600">{r.description}</p>
                  </div>
                  <select
                    value={r.status}
                    onChange={(e) =>
                      updateRecStatus(r.id, e.target.value as Recommendation["status"])
                    }
                    className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                  >
                    <option value="todo">To do</option>
                    <option value="in_progress">In progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
