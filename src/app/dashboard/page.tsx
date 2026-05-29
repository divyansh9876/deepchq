"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

interface SearchRow {
  id: string;
  queryName: string;
  status: string;
  mode: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"search" | "research">("search");
  const [history, setHistory] = useState<SearchRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/search")
      .then((r) => r.json())
      .then((d) => setHistory(d.searches ?? []));
  }, []);

  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queryName: query, mode }),
    });
    const { searchId } = await res.json();
    window.location.href = `/search/${searchId}`;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Logo />
          <div className="flex gap-4 text-sm">
            <Link href="/history" className="text-gray-600">
              History
            </Link>
            <Link href="/account" className="text-gray-600">
              Account
            </Link>
            <Link href="/pricing" className="text-blue-600">
              Upgrade
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-bold">Good afternoon</h1>
        <p className="text-gray-600">Enter a full name to start a new search.</p>

        <form onSubmit={runSearch} className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => setMode("search")}
              className={`rounded-full px-4 py-1 text-sm ${mode === "search" ? "bg-gray-900 text-white" : "bg-gray-100"}`}
            >
              Deep Search
            </button>
            <button
              type="button"
              onClick={() => setMode("research")}
              className={`rounded-full px-4 py-1 text-sm ${mode === "research" ? "bg-gray-900 text-white" : "bg-gray-100"}`}
            >
              Deep Research
            </button>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter full name to search..."
            className="w-full rounded-xl border px-4 py-3"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-full bg-gray-900 py-3 font-medium text-white disabled:opacity-50"
          >
            {loading ? "Starting…" : "Search Now"}
          </button>
        </form>

        <section className="mt-12">
          <h2 className="font-semibold">Search history</h2>
          <ul className="mt-4 space-y-2">
            {history.length === 0 && (
              <li className="text-sm text-gray-500">No searches yet.</li>
            )}
            {history.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/search/${s.id}`}
                  className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 text-sm hover:border-blue-300"
                >
                  <span className="font-medium">{s.queryName}</span>
                  <span className="text-gray-500">
                    {s.mode} · {s.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
