"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { AnalyticsOverview } from "@/lib/analytics/overview";

const STORAGE_KEY = "deepchq_analytics_secret";

export default function AdminAnalyticsPage() {
  const [secret, setSecret] = useState("");
  const [input, setInput] = useState("");
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analytics/overview", {
        headers: { "x-analytics-secret": token },
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to load analytics");
        setData(null);
        return;
      }
      setData(json as AnalyticsOverview);
    } catch {
      setError("Network error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSecret(saved);
      setInput(saved);
      void load(saved);
    }
  }, [load]);

  function saveAndLoad(e: React.FormEvent) {
    e.preventDefault();
    const t = input.trim();
    if (!t) return;
    sessionStorage.setItem(STORAGE_KEY, t);
    setSecret(t);
    void load(t);
  }

  function clearSecret() {
    sessionStorage.removeItem(STORAGE_KEY);
    setSecret("");
    setInput("");
    setData(null);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Deepchq Analytics</h1>
            <p className="text-sm text-slate-500">
              Traction by channel · estimated revenue · funnel conversion
            </p>
          </div>
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {!secret && (
          <form
            onSubmit={saveAndLoad}
            className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <label className="block text-sm font-medium text-slate-700">
              Analytics secret
            </label>
            <p className="mt-1 text-xs text-slate-500">
              Set <code className="rounded bg-slate-100 px-1">ANALYTICS_SECRET</code> on
              Render (same value you enter here).
            </p>
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Your ANALYTICS_SECRET"
            />
            <button type="submit" className="btn-primary mt-4 w-full">
              View dashboard
            </button>
          </form>
        )}

        {secret && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => load(secret)}
              disabled={loading}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {loading ? "Refreshing…" : "Refresh"}
            </button>
            <button
              type="button"
              onClick={clearSecret}
              className="text-sm text-slate-500 underline"
            >
              Lock dashboard
            </button>
          </div>
        )}

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {data && (
          <div className="space-y-8">
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Est. MRR", value: `₹${data.totals.estimatedMrrInr.toLocaleString("en-IN")}` },
                { label: "Paid users", value: String(data.totals.paidUsers) },
                { label: "Funnel sessions", value: String(data.totals.funnelSessions) },
                { label: "Searches", value: String(data.totals.searches) },
              ].map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {c.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{c.value}</p>
                </div>
              ))}
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Where traction is coming from
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Sorted by funnel sessions. Compare lead % and paid % to see best channels.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                      <th className="py-2 pr-4">Platform</th>
                      <th className="py-2 pr-4">Campaign</th>
                      <th className="py-2 pr-4 text-right">Sessions</th>
                      <th className="py-2 pr-4 text-right">Leads</th>
                      <th className="py-2 pr-4 text-right">Searches</th>
                      <th className="py-2 pr-4 text-right">Paid</th>
                      <th className="py-2 text-right">Lead %</th>
                      <th className="py-2 text-right">Paid %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.channels.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-slate-500">
                          No channel data yet.
                        </td>
                      </tr>
                    )}
                    {data.channels.map((r) => (
                      <tr key={r.key} className="border-b border-slate-100">
                        <td className="py-3 pr-4 font-medium capitalize">{r.platform}</td>
                        <td className="max-w-[200px] truncate py-3 pr-4 text-slate-600">
                          {r.campaign}
                        </td>
                        <td className="py-3 pr-4 text-right">{r.sessions}</td>
                        <td className="py-3 pr-4 text-right">{r.leads}</td>
                        <td className="py-3 pr-4 text-right">{r.searches}</td>
                        <td className="py-3 pr-4 text-right">{r.paidUsers}</td>
                        <td className="py-3 pr-4 text-right">{r.leadRate}%</td>
                        <td className="py-3 text-right font-medium text-green-700">
                          {r.paidRate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {data.plans.length > 0 && (
              <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Active plans</h2>
                <ul className="mt-4 space-y-2 text-sm">
                  {data.plans.map((p) => (
                    <li key={`${p.plan}-${p.interval}`} className="flex justify-between">
                      <span className="capitalize">
                        {p.plan} · {p.interval} × {p.count}
                      </span>
                      <span className="text-slate-600">~₹{p.amountInr}/mo each</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-slate-500">
                  Est. ARR: ₹{data.totals.estimatedArrInr.toLocaleString("en-IN")}
                </p>
              </section>
            )}

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Last 30 days</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                      <th className="py-2 text-left">Date</th>
                      <th className="py-2 text-right">Funnel sessions</th>
                      <th className="py-2 text-right">Searches</th>
                      <th className="py-2 text-right">Signups</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.daily.map((d) => (
                      <tr key={d.date} className="border-b border-slate-100">
                        <td className="py-2">{d.date}</td>
                        <td className="py-2 text-right">{d.sessions}</td>
                        <td className="py-2 text-right">{d.searches}</td>
                        <td className="py-2 text-right">{d.signups}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <ul className="list-disc space-y-1 pl-5 text-xs text-slate-500">
              {data.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
