"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AppNav, ToastProvider } from "@/components/app/ui";
import type { PlanLimits } from "@/lib/plans";

export type Me = {
  user: {
    id: string;
    email: string;
    name: string;
    plan: "free" | "growth" | "agency";
    trialEndsAt: string | null;
    subscriptionStatus: string | null;
    planRenewsAt: string | null;
    digestEnabled: boolean;
  };
  limits: PlanLimits;
  usage: { brands: number };
  billingEnabled: boolean;
  liveEngines: string[];
};

const MeCtx = createContext<{ me: Me | null; reload: () => Promise<void> }>({ me: null, reload: async () => {} });
export const useMe = () => useContext(MeCtx);

function TrialBanner({ me }: { me: Me }) {
  if (!me.user.trialEndsAt || me.user.subscriptionStatus) return null;
  const days = Math.max(0, Math.ceil((new Date(me.user.trialEndsAt).getTime() - Date.now()) / 86400_000));
  return (
    <div className="bg-gradient-to-r from-violet-600 to-teal-600 px-6 py-2 text-center text-sm text-white">
      {days} day{days === 1 ? "" : "s"} left in your Growth trial.{" "}
      <Link href="/settings" className="font-semibold underline">Choose a plan</Link> to keep all six engines and weekly scans.
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<Me | null>(null);
  const reload = useCallback(async () => {
    const res = await fetch("/api/auth/me");
    if (res.status === 401) {
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    if (res.ok) setMe(await res.json());
  }, []);
  useEffect(() => {
    void reload();
  }, [reload]);
  return (
    <ToastProvider>
      <MeCtx.Provider value={{ me, reload }}>
        <div className="min-h-screen bg-slate-50">
          {me && <TrialBanner me={me} />}
          <AppNav plan={me?.user.plan} />
          {children}
        </div>
      </MeCtx.Provider>
    </ToastProvider>
  );
}
