import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import { dbClient } from "@/lib/db";
import { isStripeEnabled, stripe, PRICE_IDS } from "@/lib/stripe";

const schema = z.object({
  plan: z.enum(["basic", "pro"]),
  interval: z.enum(["weekly", "quarterly", "yearly"]),
  searchId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const body = schema.parse(await req.json());

  if (!isStripeEnabled()) {
    dbClient.users.update(user.id, { planTier: body.plan });
    const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const redirect =
      body.searchId ?
        `${base}/search/${body.searchId}?unlocked=1`
      : `${base}/account?subscribed=1`;
    return NextResponse.json({ url: redirect, mock: true });
  }

  const priceId = PRICE_IDS[body.plan]?.[body.interval];
  if (!priceId) {
    return NextResponse.json({ error: "Price not configured" }, { status: 400 });
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe!.customers.create({ email: user.email });
    customerId = customer.id;
    dbClient.users.update(user.id, { stripeCustomerId: customerId });
  }

  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const successUrl =
    body.searchId ?
      `${base}/search/${body.searchId}?checkout=success`
    : `${base}/account?checkout=success`;

  const session = await stripe!.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: `${base}/pricing`,
    metadata: {
      userId: user.id,
      plan: body.plan,
      interval: body.interval,
      searchId: body.searchId ?? "",
    },
  });

  return NextResponse.json({ url: session.url, sessionId: session.id });
}
