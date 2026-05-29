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

export default function HistoryPage() {
  const [history, setHistory] = useState<SearchRow[]>([]);

  useEffect(() => {
    fetch("/api/search")
      .then((r) => r.json())
      .then((d) => setHistory(d.searches ?? []));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Logo />
          <Link href="/dashboard" className="text-sm text-blue-600">
            Dashboard
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-bold">Search history</h1>
        <ul className="mt-8 space-y-2">
          {history.length === 0 && (
            <li className="text-sm text-gray-500">No searches yet.</li>
          )}
          {history.map((s) => (
            <li key={s.id}>
              <Link
                href={`/search/${s.id}`}
                className="flex justify-between rounded-xl border bg-white px-4 py-3 text-sm hover:border-blue-300"
              >
                <span className="font-medium">{s.queryName}</span>
                <span className="text-gray-500">
                  {s.mode} · {s.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
