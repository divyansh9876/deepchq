import type { EngineId } from "@/lib/brand";
import type { PlanId, User } from "@/lib/types";

export type PlanLimits = {
  brands: number;
  prompts: number;
  engines: EngineId[] | "all";
  /** days between automatic scans */
  scanEveryDays: number;
  manualScansPerDay: number;
  auditsEveryDays: number;
  csvExport: boolean;
};

export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  free: {
    brands: 1,
    prompts: 5,
    engines: ["chatgpt", "perplexity", "google_aio"],
    scanEveryDays: 30,
    manualScansPerDay: 2,
    auditsEveryDays: 30,
    csvExport: false,
  },
  growth: {
    brands: 5,
    prompts: 50,
    engines: "all",
    scanEveryDays: 7,
    manualScansPerDay: 20,
    auditsEveryDays: 0,
    csvExport: true,
  },
  agency: {
    brands: 100,
    prompts: 1000,
    engines: "all",
    scanEveryDays: 1,
    manualScansPerDay: 100,
    auditsEveryDays: 0,
    csvExport: true,
  },
};

/** USD prices in cents. Annual is billed yearly at the discounted monthly rate. */
export const PLAN_PRICES: Record<Exclude<PlanId, "free">, { monthly: number; annualPerMonth: number }> = {
  growth: { monthly: 7900, annualPerMonth: 6500 },
  agency: { monthly: 24900, annualPerMonth: 20700 },
};

export const TRIAL_DAYS = 14;

/** The plan a user is effectively on right now (trials expire automatically). */
export function effectivePlan(user: Pick<User, "planTier" | "trialEndsAt" | "subscriptionStatus">): PlanId {
  if (user.planTier === "free") return "free";
  const onTrial = !!user.trialEndsAt && !user.subscriptionStatus;
  if (onTrial && user.trialEndsAt!.getTime() < Date.now()) return "free";
  return user.planTier;
}

export function limitsFor(user: Pick<User, "planTier" | "trialEndsAt" | "subscriptionStatus">): PlanLimits {
  return PLAN_LIMITS[effectivePlan(user)];
}

export function engineAllowed(limits: PlanLimits, engine: EngineId) {
  return limits.engines === "all" || limits.engines.includes(engine);
}

export function formatUsd(cents: number) {
  return `$${Math.round(cents / 100)}`;
}
