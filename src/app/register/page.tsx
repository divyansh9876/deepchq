"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const plan = params.get("plan");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? "Registration failed");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="card">
      <h1 className="text-xl font-bold">Start free</h1>
      <p className="mt-1 text-sm text-slate-500">
        Track AI visibility for your brand
        {plan === "growth" ? " · Growth trial after you create a workspace" : ""}
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          className="input"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="input"
          type="email"
          placeholder="Work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password (6+ chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn-primary w-full">
          Create account
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        Have an account?{" "}
        <Link href="/login" className="text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <MarketingShell>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Suspense fallback={<div className="card h-80 animate-pulse bg-slate-50" />}>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </MarketingShell>
  );
}
