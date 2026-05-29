"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { POPULAR_SEARCH_CARDS } from "@/lib/popular-searches";

export function ChatSearchPanel() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  async function runSearch(name?: string) {
    const q = (name ?? query).trim();
    if (!q || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queryName: q, mode: "search" }),
      });
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const { searchId } = await res.json();
      router.push(`/search/${searchId}`);
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto">
      {/* Dot map background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(circle, #c4c9d4 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 75%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-12">
        <h1 className="text-center text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
          Who are you looking for?
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch();
          }}
          className="mx-auto mt-10 w-full max-w-2xl"
        >
          <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 shadow-lg shadow-gray-200/60 ring-1 ring-gray-100">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for anyone..."
              className="min-w-0 flex-1 bg-transparent py-3 text-lg text-gray-900 outline-none placeholder:text-gray-400"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="flex shrink-0 items-center gap-1 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
            >
              {loading ? "…" : "Enter"}
              {!loading && <span aria-hidden>↵</span>}
            </button>
          </div>
        </form>
      </div>

      <section className="relative z-10 border-t border-gray-100 bg-white/80 px-6 py-8 backdrop-blur-sm">
        <h2 className="text-center text-sm font-medium text-gray-500">Popular Searches</h2>
        <div className="mx-auto mt-5 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {POPULAR_SEARCH_CARDS.map((person) => (
            <button
              key={person.name}
              type="button"
              onClick={() => runSearch(person.name)}
              disabled={loading}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm transition hover:border-gray-300 hover:shadow-md disabled:opacity-60"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={person.image}
                  alt=""
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="flex items-start justify-between gap-1 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{person.name}</p>
                  <p className="truncate text-xs text-gray-500">{person.role}</p>
                </div>
                <span className="mt-0.5 text-gray-400 group-hover:text-gray-700">↗</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
