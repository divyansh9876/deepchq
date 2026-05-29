"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppDisclaimer, AppShell } from "@/components/app/AppSidebar";

interface SearchRow {
  id: string;
  queryName: string;
  status: string;
  mode: string;
  createdAt: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<SearchRow[]>([]);

  useEffect(() => {
    fetch("/api/account").then((r) => {
      if (r.status === 401) router.replace("/landing/login?next=/history");
    });
    fetch("/api/search")
      .then((r) => r.json())
      .then((d) => setHistory(d.searches ?? []));
  }, [router]);

  return (
    <AppShell>
      <main className="flex-1 overflow-y-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
        <p className="mt-1 text-sm text-gray-500">Your past people searches</p>
        <ul className="mt-8 space-y-2">
          {history.length === 0 && (
            <li className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
              No searches yet.{" "}
              <Link href="/chat" className="text-blue-600 underline">
                Start a new search
              </Link>
            </li>
          )}
          {history.map((s) => (
            <li key={s.id}>
              <Link
                href={`/search/${s.id}`}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm hover:border-blue-300"
              >
                <span className="font-medium text-gray-900">{s.queryName}</span>
                <span className="text-gray-500">
                  {s.mode} · {s.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <AppDisclaimer />
    </AppShell>
  );
}
