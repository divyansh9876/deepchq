import { dbClient } from "@/lib/db";
import { newId } from "@/lib/id";
import type { PlanInterval, PlanKey } from "@/lib/razorpay-plans";
import { unlockReport } from "@/lib/search/store";

export async function activatePlanForUser(opts: {
  userId: string;
  plan: PlanKey;
  interval: PlanInterval;
  searchId?: string;
  paymentId?: string;
}) {
  dbClient.users.update(opts.userId, { planTier: opts.plan });
  dbClient.subscriptions.create({
    id: newId("sub"),
    userId: opts.userId,
    stripeSubscriptionId: opts.paymentId ?? null,
    plan: opts.plan,
    interval: opts.interval,
    status: "active",
    currentPeriodEnd: null,
    createdAt: new Date(),
  });

  if (opts.searchId) {
    await unlockReport(opts.searchId);
  }
}
