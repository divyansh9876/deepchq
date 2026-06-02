import { dbClient } from "@/lib/db";
import { newId } from "@/lib/id";
import type { PlanInterval, PlanKey } from "@/lib/razorpay-plans";
import { unlockReport } from "@/lib/search/store";

export async function activatePlanForUser(opts: {
  userId: string;
  plan: PlanKey;
  interval: PlanInterval;
  searchId?: string;
  razorpaySubscriptionId?: string;
  paymentId?: string;
  currentPeriodEnd?: Date | null;
}) {
  dbClient.subscriptions.markReplacedForUser(opts.userId);

  const externalId =
    opts.razorpaySubscriptionId ?? opts.paymentId ?? null;

  dbClient.users.update(opts.userId, { planTier: opts.plan });
  dbClient.subscriptions.create({
    id: newId("sub"),
    userId: opts.userId,
    stripeSubscriptionId: externalId,
    plan: opts.plan,
    interval: opts.interval,
    status: "active",
    currentPeriodEnd: opts.currentPeriodEnd ?? null,
    createdAt: new Date(),
  });

  if (opts.searchId) {
    await unlockReport(opts.searchId);
  }
}

export async function deactivatePlanForUser(userId: string) {
  dbClient.users.update(userId, { planTier: "free" });
  dbClient.subscriptions.markCancelledForUser(userId);
}

export async function syncSubscriptionPeriod(
  razorpaySubscriptionId: string,
  currentPeriodEnd: Date | null,
) {
  const row = dbClient.subscriptions.getByRazorpayId(razorpaySubscriptionId);
  if (!row) return;
  dbClient.subscriptions.update(row.id, {
    status: "active",
    currentPeriodEnd,
  });
}
