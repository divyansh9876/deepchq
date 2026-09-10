"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MarketingShell } from "@/components/marketing/MarketingShell";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      setError("Invalid email or password");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <MarketingShell>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="card">
            <h1 className="text-xl font-bold">Log in</h1>
            <p className="mt-1 text-sm text-slate-500">Continue to your brand reports</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <input
                className="input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" className="btn-primary w-full">
                Continue
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-500">
              No account?{" "}
              <Link href="/register" className="text-brand-600 hover:underline">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
