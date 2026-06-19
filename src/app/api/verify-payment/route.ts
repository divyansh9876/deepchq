import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { activatePlanForUser } from "@/lib/activate-plan";
import { getSessionUser } from "@/lib/auth/session";
import { isRazorpayEnabled } from "@/lib/razorpay";
import { verifyOrderPaymentSignature } from "@/lib/razorpay-signature";

const schema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  plan: z.enum(["basic", "pro"]),
  interval: z.enum(["weekly", "monthly"]),
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
    return NextResponse.json(
      {
        error:
          "Missing or invalid payment fields (order id, payment id, signature, plan, interval).",
      },
      { status: 400 },
    );
  }

  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const valid = verifyOrderPaymentSignature(
    body.razorpay_order_id,
    body.razorpay_payment_id,
    body.razorpay_signature,
    secret,
  );

  if (!valid) {
    return NextResponse.json(
      { error: "Payment signature verification failed" },
      { status: 400 },
    );
  }

  await activatePlanForUser({
    userId: user.id,
    plan: body.plan,
    interval: body.interval,
    searchId: body.searchId,
    paymentId: body.razorpay_payment_id,
  });

  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const redirectUrl =
    body.searchId
      ? `${base}/search/${body.searchId}?checkout=success`
      : `${base}/account?checkout=success`;

  return NextResponse.json({
    success: true,
    order_id: body.razorpay_order_id,
    payment_id: body.razorpay_payment_id,
    redirectUrl,
  });
}
