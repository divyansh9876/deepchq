import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isRazorpayEnabled } from "@/lib/razorpay";

const schema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string,
): boolean {
  const expected = createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(signature, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
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
      {
        error:
          "Missing or invalid fields: razorpay_order_id, razorpay_payment_id, razorpay_signature",
      },
      { status: 400 },
    );
  }

  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const valid = verifySignature(
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

  return NextResponse.json({
    success: true,
    order_id: body.razorpay_order_id,
    payment_id: body.razorpay_payment_id,
  });
}
