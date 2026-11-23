import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/guard";
import { createSubscription } from "@/lib/billing/razorpay";
import { rateLimit, route } from "@/lib/http";

const schema = z.object({ plan: z.enum(["growth", "agency"]), interval: z.enum(["monthly", "annual"]).default("monthly") });

export const POST = route(async (req) => {
  const user = await requireUser();
  rateLimit(`checkout:${user.id}`, 5, 10 * 60_000);
  const { plan, interval } = schema.parse(await req.json());
  const sub = await createSubscription(user.id, user.email, plan, interval);
  return NextResponse.json({ ...sub, email: user.email, name: user.name });
});
