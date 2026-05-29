"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      setError(
        oauthError === "google_auth_failed"
          ? "Google sign-in failed. Check OAuth env vars and redirect URI."
          : oauthError.replace(/_/g, " "),
      );
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Login failed");
      return;
    }
    const next = searchParams.get("next") ?? "/chat";
    router.push(next);
  }

  function oauth(provider: "google" | "apple") {
    if (provider === "google") {
      window.location.href = `/api/auth/oauth?provider=google`;
      return;
    }
    setError("Apple Sign In is not enabled yet. Use email or Google.");
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-8">
        <Logo className="mb-8" />
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="text-xl font-bold">Log in</h2>
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="btn-primary w-full !py-3"
            >
              Continue
            </button>
          </form>
          <div className="my-6 text-center text-sm text-gray-400">or</div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => oauth("google")}
              className="w-full rounded-full border py-3 text-sm font-medium"
            >
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => oauth("apple")}
              className="w-full rounded-full border py-3 text-sm font-medium"
            >
              Continue with Apple
            </button>
          </div>
          <p className="mt-6 text-center text-sm text-gray-500">
            No account?{" "}
            <Link href="/landing/register" className="text-blue-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
