"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const presetQuery = params.get("q") ?? "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Registration failed");
      return;
    }
    if (presetQuery) {
      const searchRes = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queryName: presetQuery, mode: "search" }),
      });
      const { searchId } = await searchRes.json();
      router.push(`/search/${searchId}`);
      return;
    }
    router.push("/chat");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      <div className="mx-auto grid min-h-screen max-w-5xl grid-cols-1 lg:grid-cols-2">
        <div className="hidden flex-col justify-center p-12 lg:flex">
          <h1 className="text-4xl font-bold">
            Find the <span className="text-purple-600">signal</span>
            <br />
            in the digital world.
          </h1>
        </div>
        <div className="flex flex-col justify-center p-8">
          <Logo className="mb-8 lg:hidden" />
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="text-xl font-bold">Create Your Account</h2>
            {presetQuery && (
              <p className="mt-2 text-sm text-gray-500">
                Continue search for: <strong>{presetQuery}</strong>
              </p>
            )}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="email"
                required
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border px-4 py-3"
              />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border px-4 py-3"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                className="w-full rounded-full bg-gray-900 py-3 font-medium text-white"
              >
                Continue
              </button>
            </form>
            <div className="my-6 text-center text-sm text-gray-400">or</div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/api/auth/oauth?provider=google";
                }}
                className="w-full rounded-full border py-3 text-sm font-medium"
              >
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => setError("Apple Sign In is not enabled yet. Use email or Google.")}
                className="w-full rounded-full border py-3 text-sm font-medium"
              >
                Continue with Apple
              </button>
            </div>
            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/landing/login" className="text-blue-600">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-12">Loading…</div>}>
      <RegisterForm />
    </Suspense>
  );
}
