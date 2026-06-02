import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import { parseRazorpayError } from "@/lib/razorpay-errors";
import { getRazorpay, isRazorpayEnabled } from "@/lib/razorpay";
import {
  getRazorpayPlanId,
  getSubscriptionTotalCount,
  hasRazorpayPlan,
  type PlanInterval,
  type PlanKey,
} from "@/lib/razorpay-plans";

const schema = z.object({
  plan: z.enum(["basic", "pro"]),
  interval: z.enum(["weekly", "quarterly", "yearly"]),
  searchId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  if (!isRazorpayEnabled()) {
    return NextResponse.json(
      { error: "Razorpay is not configured" },
      { status: 500 },
    );
  }

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  let body: z.infer<typeof schema>;
  try {
    body = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid plan or interval" }, { status: 400 });
  }

  const planId = getRazorpayPlanId(
    body.plan as PlanKey,
    body.interval as PlanInterval,
  );
  if (!planId) {
    return NextResponse.json(
      {
        error: `Subscription plan not configured. Set RAZORPAY_PLAN_${body.plan.toUpperCase()}_${body.interval.toUpperCase()} in environment. See docs/RAZORPAY-SUBSCRIPTIONS.md`,
      },
      { status: 400 },
    );
  }

  if (!hasRazorpayPlan(body.plan, body.interval)) {
    return NextResponse.json(
      { error: "Plan not available for subscriptions" },
      { status: 400 },
    );
  }

  const razorpay = getRazorpay()!;
  const notes: Record<string, string> = {
    userId: user.id,
    plan: body.plan,
    interval: body.interval,
  };
  if (body.searchId) notes.searchId = body.searchId;

  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: getSubscriptionTotalCount(body.interval),
      quantity: 1,
      customer_notify: true,
      notes,
    });

    return NextResponse.json({
      subscription_id: subscription.id,
      plan_id: planId,
      customer_email: user.email,
    });
  } catch (err) {
    const { status, message } = parseRazorpayError(err);
    if (message.includes("Subscriptions feature is not enabled")) {
      return NextResponse.json(
        {
          error:
            "Enable Subscriptions in Razorpay Dashboard (Settings → Subscriptions), then create plans.",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: message },
      { status: status >= 400 && status < 600 ? status : 500 },
    );
  }
}
