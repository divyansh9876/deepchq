import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { activatePlanForUser } from "@/lib/activate-plan";
import { getSessionUser } from "@/lib/auth/session";
import { isRazorpayEnabled } from "@/lib/razorpay";

const schema = z.object({
  plan: z.enum(["basic", "pro"]),
  interval: z.enum(["weekly", "quarterly", "yearly"]),
  searchId: z.string().optional(),
});

/** Local dev only: activate plan without Razorpay when keys are not set. */
export async function POST(req: NextRequest) {
  if (isRazorpayEnabled()) {
    return NextResponse.json(
      { error: "Use Razorpay checkout when payment keys are configured." },
      { status: 400 },
    );
  }

  if (process.env.ALLOW_DEV_UNLOCK !== "true") {
    return NextResponse.json(
      { error: "Dev activation is disabled" },
      { status: 403 },
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
    return NextResponse.json({ error: "Invalid plan or interval" }, { status: 400 });
  }

  await activatePlanForUser({
    userId: user.id,
    plan: body.plan,
    interval: body.interval,
    searchId: body.searchId,
  });

  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const redirectUrl =
    body.searchId
      ? `${base}/search/${body.searchId}?unlocked=1`
      : `${base}/account?subscribed=1`;

  return NextResponse.json({ success: true, redirectUrl, mock: true });
}
