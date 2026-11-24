"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";

export function DomainAuditForm({ dark = false, autoFocus = false, initial = "" }: { dark?: boolean; autoFocus?: boolean; initial?: string }) {
  const router = useRouter();
  const inputId = useId();
  const [url, setUrl] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/public/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Audit failed");
      router.push(`/report/${data.id}`);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className={`flex flex-col gap-2 rounded-2xl p-1.5 sm:flex-row ${dark ? "bg-white/10 ring-1 ring-white/20" : "bg-white shadow-lg shadow-brand-100/60 ring-1 ring-slate-200"}`}>
        <label htmlFor={inputId} className="sr-only">Website URL</label>
        <input
          id={inputId}
          autoFocus={autoFocus}
          inputMode="url"
          autoComplete="url"
          placeholder="yourwebsite.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={`min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-base outline-none ${dark ? "text-white placeholder:text-brand-100/60" : "text-slate-900 placeholder:text-slate-400"}`}
        />
        <button
          type="submit"
          disabled={busy}
          className={`relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition disabled:opacity-80 ${
            dark ? "bg-white text-brand-800 hover:bg-amber-50" : "bg-brand-600 text-white hover:bg-brand-700"
          }`}
        >
          {busy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
          {busy ? "Auditing… (~15s)" : "Check AI visibility"}
        </button>
      </div>
      {error && <p className={`mt-2 text-sm ${dark ? "text-amber-200" : "text-red-600"}`}>{error}</p>}
    </form>
  );
}
