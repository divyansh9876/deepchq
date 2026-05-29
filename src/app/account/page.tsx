"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ReportFeedbackForm } from "@/components/ReportFeedbackForm";

function AccountContent() {
  const params = useSearchParams();
  const [plan, setPlan] = useState("free");
  const subscribed = params.get("checkout") === "success" || params.get("subscribed") === "1";

  useEffect(() => {
    fetch("/api/account")
      .then((r) => r.json())
      .then((d) => setPlan(d.planTier ?? "free"))
      .catch(() => {});
  }, [subscribed]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white px-6 py-4">
        <Logo />
      </header>
      <main className="mx-auto max-w-lg px-6 py-10">
        <h1 className="text-2xl font-bold">Account</h1>
        {subscribed && (
          <p className="mt-2 rounded-lg bg-green-50 p-3 text-sm text-green-800">
            Subscription active. Thank you!
          </p>
        )}
        <p className="mt-4 text-gray-600">
          Current plan: <strong className="capitalize">{plan}</strong>
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/pricing"
            className="btn-primary block text-center"
          >
            Manage subscription
          </Link>
          <Link href="/dashboard" className="text-center text-sm text-blue-600">
            Back to dashboard
          </Link>
          <button
            type="button"
            onClick={logout}
            className="text-sm text-gray-500 underline"
          >
            Log out
          </button>
        </div>
        <ReportFeedbackForm className="mt-12" />
      </main>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="p-12">Loading…</div>}>
      <AccountContent />
    </Suspense>
  );
}
