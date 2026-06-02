import Razorpay from "razorpay";

export function isRazorpayEnabled() {
  return Boolean(
    process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET,
  );
}

export function getRazorpay(): Razorpay | null {
  if (!isRazorpayEnabled()) return null;
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export function getRazorpayKeyId(): string | undefined {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID;
}
