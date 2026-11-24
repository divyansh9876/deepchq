"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TRIAL_DAYS } from "@/lib/plans";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const params = useSearchParams();
  const plan = params.get("plan");
  const next = params.get("next");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mode === "register" ? { ...form, plan: plan === "growth" || plan === "agency" ? plan : undefined } : { email: form.email, password: form.password }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Something went wrong");
      setBusy(false);
      return;
    }
    const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
    router.push(mode === "register" && plan === "agency" ? "/settings?upgrade=agency" : (safeNext ?? "/dashboard"));
    router.refresh();
  }

  const reg = mode === "register";
  return (
    <div className="card shadow-lg shadow-brand-100/50">
      <h1 className="text-2xl font-bold text-slate-900">{reg ? "Create your free account" : "Welcome back"}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {reg
          ? plan === "growth"
            ? `Includes a ${TRIAL_DAYS}-day Growth trial — all 6 engines, no card needed.`
            : "Add your brand and we'll run your first AI visibility scan automatically."
          : "Log in to your brand reports."}
      </p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        {reg && (
          <label className="block text-sm font-medium text-slate-700">
            Name
            <input className="input mt-1" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
        )}
        <label className="block text-sm font-medium text-slate-700">
          {reg ? "Work email" : "Email"}
          <input className="input mt-1" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <div className="relative mt-1">
            <input
              className="input pr-16"
              type={show ? "text" : "password"}
              autoComplete={reg ? "new-password" : "current-password"}
              minLength={reg ? 8 : 1}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute inset-y-0 right-2 my-auto h-7 rounded-md px-2 text-xs font-medium text-slate-500 hover:bg-slate-100">
              {show ? "Hide" : "Show"}
            </button>
          </div>
          {reg && <span className="mt-1 block text-xs font-normal text-slate-400">At least 8 characters</span>}
        </label>
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full py-3">
          {busy ? "Please wait…" : reg ? "Create account" : "Log in"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        {reg ? (
          <>Already have an account? <Link href="/login" className="font-semibold text-brand-700 hover:underline">Log in</Link></>
        ) : (
          <>No account? <Link href="/register" className="font-semibold text-brand-700 hover:underline">Start free</Link></>
        )}
      </p>
      {reg && (
        <p className="mt-3 text-center text-xs text-slate-400">
          By signing up you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      )}
    </div>
  );
}
