import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import { parseRazorpayError, razorpayReceipt } from "@/lib/razorpay-errors";
import { getRazorpay, isRazorpayEnabled } from "@/lib/razorpay";
import {
  getPlanAmountPaise,
  type PlanInterval,
  type PlanKey,
} from "@/lib/razorpay-plans";

const planSchema = z.object({
  plan: z.enum(["basic", "pro"]),
  interval: z.enum(["weekly", "monthly"]),
  currency: z.string().default("INR"),
  searchId: z.string().optional(),
});

const amountSchema = z.object({
  amount: z.number().int().min(100),
  currency: z.string().default("INR"),
  receipt: z.string().max(40).optional(),
});

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
  let notes: Record<string, string> | undefined;

  const planParsed = planSchema.safeParse(json);
  if (planParsed.success) {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }
    const { plan, interval, searchId } = planParsed.data;
    amount = getPlanAmountPaise(plan as PlanKey, interval as PlanInterval);
    currency = planParsed.data.currency;
    receipt = razorpayReceipt("sub");
    notes = {
      userId: user.id,
      plan,
      interval,
      ...(searchId ? { searchId } : {}),
    };
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
    receipt =
      amountParsed.data.receipt?.slice(0, 40) ?? razorpayReceipt("pay");
  }

  const razorpay = getRazorpay()!;

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt,
      ...(notes ? { notes } : {}),
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    const { status, message } = parseRazorpayError(err);
    if (status === 401) {
      return NextResponse.json(
        { error: "Razorpay authentication failed. Check KEY_ID and KEY_SECRET match (both test or both live)." },
        { status: 401 },
      );
    }
    return NextResponse.json({ error: message }, { status: status >= 400 && status < 600 ? status : 500 });
  }
}
