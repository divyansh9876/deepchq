"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BRAND_NAME } from "@/lib/brand";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 font-bold text-slate-900 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">
        D
      </span>
      {BRAND_NAME}
    </Link>
  );
}

export function AppNav() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">
            Dashboard
          </Link>
          <button type="button" onClick={logout} className="text-slate-500 hover:text-slate-800">
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}
