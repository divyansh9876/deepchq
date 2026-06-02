import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import { getRazorpay, isRazorpayEnabled } from "@/lib/razorpay";
import {
  getPlanAmountPaise,
  type PlanInterval,
  type PlanKey,
} from "@/lib/razorpay-plans";

const planSchema = z.object({
  plan: z.enum(["basic", "pro"]),
  interval: z.enum(["weekly", "quarterly", "yearly"]),
  currency: z.string().default("INR"),
  searchId: z.string().optional(),
});

const amountSchema = z.object({
  amount: z.number().int().min(100),
  currency: z.string().default("INR"),
  receipt: z.string().optional(),
});

function razorpayStatusCode(err: unknown): number | undefined {
  if (err && typeof err === "object" && "statusCode" in err) {
    const code = (err as { statusCode: unknown }).statusCode;
    return typeof code === "number" ? code : undefined;
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  if (!isRazorpayEnabled()) {
    return NextResponse.json(
      { error: "Razorpay is not configured" },
      { status: 500 },
    );
  }

  const json = await req.json();
  let amount: number;
  let currency: string;
  let receipt: string;

  const planParsed = planSchema.safeParse(json);
  if (planParsed.success) {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }
    const { plan, interval } = planParsed.data;
    amount = getPlanAmountPaise(plan as PlanKey, interval as PlanInterval);
    currency = planParsed.data.currency;
    receipt = `sub_${user.id}_${plan}_${interval}_${Date.now()}`;
  } else {
    const amountParsed = amountSchema.safeParse(json);
    if (!amountParsed.success) {
      return NextResponse.json(
        {
          error:
            "Invalid request. Provide plan + interval, or amount (min 100 paise).",
        },
        { status: 400 },
      );
    }
    amount = amountParsed.data.amount;
    currency = amountParsed.data.currency;
    receipt = amountParsed.data.receipt ?? `rcpt_${Date.now()}`;
  }

  const razorpay = getRazorpay()!;

  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    const status = razorpayStatusCode(err);
    if (status === 401) {
      return NextResponse.json(
        { error: "Razorpay authentication failed" },
        { status: 401 },
      );
    }
    const message =
      err instanceof Error ? err.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
