export type PlanKey = "basic" | "pro";
export type PlanInterval = "weekly" | "monthly";

export const PLAN_AMOUNT_PAISE: Record<
  PlanKey,
  Record<PlanInterval, number>
> = {
  basic: { weekly: 12900, monthly: 29900 },
  pro: { weekly: 14900, monthly: 39900 },
};

/** India list prices (INR) for marketing copy */
export const PLAN_PRICE_INR: Record<PlanKey, Record<PlanInterval, number>> = {
  basic: { weekly: 129, monthly: 299 },
  pro: { weekly: 149, monthly: 399 },
};

const PLAN_KEYS: PlanKey[] = ["basic", "pro"];
const INTERVALS: PlanInterval[] = ["weekly", "monthly"];

function envAmount(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 100 ? n : fallback;
}

export function getPlanAmountPaise(
  plan: PlanKey,
  interval: PlanInterval,
): number {
  const defaults = PLAN_AMOUNT_PAISE[plan][interval];
  const prefix =
    plan === "basic" ? "RAZORPAY_AMOUNT_BASIC" : "RAZORPAY_AMOUNT_PRO";
  const suffix = interval.toUpperCase();
  return envAmount(`${prefix}_${suffix}`, defaults);
}

/** Razorpay Dashboard plan_id for plan + billing interval */
export function getRazorpayPlanId(
  plan: PlanKey,
  interval: PlanInterval,
): string | undefined {
  const key = `RAZORPAY_PLAN_${plan.toUpperCase()}_${interval.toUpperCase()}`;
  const id = process.env[key]?.trim();
  return id || undefined;
}

export function hasRazorpayPlan(
  plan: PlanKey,
  interval: PlanInterval,
): boolean {
  return Boolean(getRazorpayPlanId(plan, interval));
}

export function allSubscriptionPlansConfigured(): boolean {
  return PLAN_KEYS.every((p) =>
    INTERVALS.every((i) => hasRazorpayPlan(p, i)),
  );
}

/** Billing cycles for auto-renew (max ~10 years per Razorpay limits) */
export function getSubscriptionTotalCount(interval: PlanInterval): number {
  switch (interval) {
    case "weekly":
      return 520;
    case "monthly":
      return 120;
  }
}

export function isRazorpaySubscriptionsEnabled(): boolean {
  if (process.env.RAZORPAY_USE_SUBSCRIPTIONS === "false") return false;
  return allSubscriptionPlansConfigured();
}

export function formatInr(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function planLabel(plan: PlanKey, interval: PlanInterval): string {
  return `Deepchq ${plan.charAt(0).toUpperCase() + plan.slice(1)} (${interval})`;
}
