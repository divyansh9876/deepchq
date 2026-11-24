import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { cancelSubscription } from "@/lib/billing/razorpay";
import { db } from "@/lib/db/client";
import { HttpError, route } from "@/lib/http";

export const POST = route(async () => {
  const user = await requireUser();
  if (!user.subscriptionId || user.subscriptionStatus !== "active") throw new HttpError(400, "No active subscription.");
  await cancelSubscription(user.subscriptionId);
  db.users.update(user.id, { subscriptionStatus: "cancelling" });
  return NextResponse.json({ ok: true, until: user.planRenewsAt ?? null });
});
