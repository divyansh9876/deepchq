import { NextRequest, NextResponse } from "next/server";
import { dbClient } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { newId } from "@/lib/id";
import { unlockReport } from "@/lib/search/store";

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: "Webhook secret missing" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan ?? "pro";
    const interval = session.metadata?.interval ?? "weekly";
    const searchId = session.metadata?.searchId;

    if (userId) {
      dbClient.users.update(userId, { planTier: plan });
      dbClient.subscriptions.create({
        id: newId("sub"),
        userId,
        stripeSubscriptionId:
          typeof session.subscription === "string" ? session.subscription : null,
        plan,
        interval,
        status: "active",
        currentPeriodEnd: null,
        createdAt: new Date(),
      });
    }

    if (searchId) {
      await unlockReport(searchId);
    }
  }

  return NextResponse.json({ received: true });
}
