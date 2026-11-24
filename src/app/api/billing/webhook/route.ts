import { NextRequest, NextResponse } from "next/server";
import { applySubscription, verifyWebhookSignature } from "@/lib/billing/razorpay";

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature") ?? "";
  if (!verifyWebhookSignature(raw, sig)) return NextResponse.json({ error: "bad signature" }, { status: 400 });
  try {
    const evt = JSON.parse(raw) as {
      event: string;
      payload?: { subscription?: { entity?: Parameters<typeof applySubscription>[0] } };
    };
    const sub = evt.payload?.subscription?.entity;
    if (sub && evt.event.startsWith("subscription.")) await applySubscription(sub);
  } catch (err) {
    console.error("[webhook] failed", err);
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
