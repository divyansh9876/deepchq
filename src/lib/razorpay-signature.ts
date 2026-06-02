import { createHmac, timingSafeEqual } from "crypto";

function safeEqual(expected: string, actual: string): boolean {
  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(actual, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Order checkout: order_id|payment_id */
export function verifyOrderPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string,
): boolean {
  const expected = createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return safeEqual(expected, signature);
}

/** Subscription checkout: payment_id|subscription_id */
export function verifySubscriptionPaymentSignature(
  paymentId: string,
  subscriptionId: string,
  signature: string,
  secret: string,
): boolean {
  const expected = createHmac("sha256", secret)
    .update(`${paymentId}|${subscriptionId}`)
    .digest("hex");
  return safeEqual(expected, signature);
}

/** Razorpay webhook: HMAC of raw body */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string,
): boolean {
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  return safeEqual(expected, signature);
}
