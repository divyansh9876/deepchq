import { NextResponse } from "next/server";
import { isRazorpayEnabled } from "@/lib/razorpay";
import { isRazorpaySubscriptionsEnabled } from "@/lib/razorpay-plans";

/** Runtime public config (NEXT_PUBLIC_* may be missing if not set at Docker build time). */
export async function GET() {
  const razorpayKeyId =
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID ?? null;

  const subscriptionsEnabled = isRazorpaySubscriptionsEnabled();

  return NextResponse.json({
    razorpayKeyId,
    paymentsEnabled: isRazorpayEnabled(),
    subscriptionsEnabled,
    paymentMode: subscriptionsEnabled ? "subscription" : "one_time",
  });
}
