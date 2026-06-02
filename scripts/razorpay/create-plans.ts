/**
 * Create Razorpay subscription plans and print env vars for Render.
 *
 * Usage (from repo root, with .env loaded):
 *   npx tsx scripts/razorpay/create-plans.ts
 *
 * Requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment.
 */
import Razorpay from "razorpay";
import {
  PLAN_AMOUNT_PAISE,
  type PlanInterval,
  type PlanKey,
} from "../../src/lib/razorpay-plans";

const PERIOD: Record<
  PlanInterval,
  { period: "weekly" | "monthly" | "yearly"; interval: number }
> = {
  weekly: { period: "weekly", interval: 1 },
  quarterly: { period: "monthly", interval: 3 },
  yearly: { period: "yearly", interval: 1 },
};

async function main() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    console.error("Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET");
    process.exit(1);
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const plans: PlanKey[] = ["basic", "pro"];
  const intervals: PlanInterval[] = ["weekly", "quarterly", "yearly"];

  console.log("\n# Add these to Render / .env:\n");

  for (const plan of plans) {
    for (const interval of intervals) {
      const amount = PLAN_AMOUNT_PAISE[plan][interval];
      const { period, interval: count } = PERIOD[interval];
      const name = `Deepchq ${plan} ${interval}`;

      const created = await razorpay.plans.create({
        period,
        interval: count,
        item: {
          name,
          amount,
          currency: "INR",
          description: `${name} subscription`,
        },
      });

      const envKey = `RAZORPAY_PLAN_${plan.toUpperCase()}_${interval.toUpperCase()}`;
      console.log(`${envKey}=${created.id}`);
    }
  }

  console.log("\nRAZORPAY_WEBHOOK_SECRET=<from Dashboard → Webhooks>");
  console.log(
    `Webhook URL: ${process.env.NEXT_PUBLIC_APP_URL ?? "https://www.deepchq.com"}/api/webhooks/razorpay\n`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
