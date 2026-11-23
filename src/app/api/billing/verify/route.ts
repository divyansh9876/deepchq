import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/guard";
import { applySubscription, fetchSubscription, verifyCheckoutSignature } from "@/lib/billing/razorpay";
import { HttpError, route } from "@/lib/http";

const schema = z.object({
  razorpay_payment_id: z.string().max(100),
  razorpay_subscription_id: z.string().max(100),
  razorpay_signature: z.string().max(200),
});

export const POST = route(async (req) => {
  const user = await requireUser();
  const body = schema.parse(await req.json());
  if (!verifyCheckoutSignature(body.razorpay_payment_id, body.razorpay_subscription_id, body.razorpay_signature)) {
    throw new HttpError(400, "Payment signature could not be verified.");
  }
  const sub = await fetchSubscription(body.razorpay_subscription_id);
  if (sub.notes?.userId !== user.id) throw new HttpError(403, "This subscription belongs to another account.");
  // Payment is authorised at this point even if Razorpay hasn't flipped the status yet.
  await applySubscription({ ...sub, status: sub.status === "created" ? "authenticated" : sub.status });
  return NextResponse.json({ ok: true });
});
