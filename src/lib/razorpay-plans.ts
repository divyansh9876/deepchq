export type PlanKey = "basic" | "pro";
export type PlanInterval = "weekly" | "quarterly" | "yearly";

export const PLAN_AMOUNT_PAISE: Record<
  PlanKey,
  Record<PlanInterval, number>
> = {
  basic: { weekly: 49900, quarterly: 129900, yearly: 399900 },
  pro: { weekly: 99900, quarterly: 249900, yearly: 799900 },
};

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

export function formatInr(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
