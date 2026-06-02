import { NextResponse } from "next/server";
import { isRazorpayEnabled } from "@/lib/razorpay";

/** Runtime public config (NEXT_PUBLIC_* may be missing if not set at Docker build time). */
export async function GET() {
  const razorpayKeyId =
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID ?? null;

  return NextResponse.json({
    razorpayKeyId,
    paymentsEnabled: isRazorpayEnabled(),
  });
}
