"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { BRAND_NAME } from "@/lib/brand";

type Account = { email: string; planTier: string } | null;

function NavItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-slate-100 text-slate-900"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const [account, setAccount] = useState<Account>(null);

  useEffect(() => {
    fetch("/api/account")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => (d?.email ? setAccount({ email: d.email, planTier: d.planTier }) : null))
      .catch(() => {});
  }, []);

  const displayName =
    account?.email?.split("@")[0]?.replace(/\./g, " ") ?? "Account";

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white text-slate-900">
      <div className="px-4 py-5">
        <Logo />
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        <NavItem
          href="/chat"
          label="New Search"
          active={pathname === "/chat" || pathname === "/dashboard"}
          icon={
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-lg text-white">
              +
            </span>
          }
        />
        <NavItem
          href="/history"
          label="Saved"
          active={pathname === "/saved"}
          icon={<span className="text-lg text-slate-400">☆</span>}
        />
        <NavItem
          href="/history"
          label="History"
          active={pathname === "/history"}
          icon={<span className="text-lg text-slate-400">🕐</span>}
        />
      </nav>

      <div className="px-3 pb-3">
        <Link href="/pricing" className="btn-primary block w-full text-center !py-3">
          Go Pro
        </Link>
      </div>

      <div className="border-t border-slate-200 p-3">
        <Link
          href="/account"
          className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-xs font-bold uppercase text-white">
            {displayName.slice(0, 2)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium capitalize">{displayName}</p>
            <p className="truncate text-xs text-slate-500">
              {account?.email ?? "Sign in"}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}

export function AppShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col bg-white">{children}</div>
      {footer}
    </div>
  );
}

export function AppDisclaimer() {
  return (
    <p className="border-t border-slate-100 py-3 text-center text-xs text-slate-500">
      {BRAND_NAME} can make mistakes. Results are typically generated within 1 minute.
    </p>
  );
}
