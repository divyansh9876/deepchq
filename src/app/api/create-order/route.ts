import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRazorpay, isRazorpayEnabled } from "@/lib/razorpay";

const schema = z.object({
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

  let body: z.infer<typeof schema>;
  try {
    body = schema.parse(await req.json());
  } catch {
    return NextResponse.json(
      { error: "Invalid request. Amount must be at least 100 paise." },
      { status: 400 },
    );
  }

  const razorpay = getRazorpay()!;

  try {
    const order = await razorpay.orders.create({
      amount: body.amount,
      currency: body.currency,
      receipt: body.receipt ?? `rcpt_${Date.now()}`,
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
