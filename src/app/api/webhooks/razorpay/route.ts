import { NextRequest, NextResponse } from "next/server";
import {
  activatePlanForUser,
  deactivatePlanForUser,
  syncSubscriptionPeriod,
} from "@/lib/activate-plan";
import { dbClient } from "@/lib/db";
import type { PlanInterval, PlanKey } from "@/lib/razorpay-plans";
import { verifyWebhookSignature } from "@/lib/razorpay-signature";

type RazorpaySubscriptionEntity = {
  id: string;
  status: string;
  current_end?: number | null;
  notes?: Record<string, string>;
};

type WebhookPayload = {
  event: string;
  payload?: {
    subscription?: { entity: RazorpaySubscriptionEntity };
    payment?: { entity: { id: string } };
  };
};

function periodEndFromEntity(entity: RazorpaySubscriptionEntity): Date | null {
  if (entity.current_end && entity.current_end > 0) {
    return new Date(entity.current_end * 1000);
  }
  return null;
}

function notesFromEntity(entity: RazorpaySubscriptionEntity) {
  const notes = entity.notes ?? {};
  const plan = notes.plan as PlanKey | undefined;
  const interval = notes.interval as PlanInterval | undefined;
  const userId = notes.userId;
  const searchId = notes.searchId || undefined;
  return { userId, plan, interval, searchId };
}

async function handleSubscriptionActive(entity: RazorpaySubscriptionEntity) {
  const { userId, plan, interval, searchId } = notesFromEntity(entity);
  if (!userId || !plan || !interval) return;

  const existing = dbClient.subscriptions.getByRazorpayId(entity.id);

  if (existing?.status === "active") {
    await syncSubscriptionPeriod(entity.id, periodEndFromEntity(entity));
    return;
  }

  await activatePlanForUser({
    userId,
    plan,
    interval,
    searchId,
    razorpaySubscriptionId: entity.id,
    currentPeriodEnd: periodEndFromEntity(entity),
  });
}

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 400 },
    );
  }

  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  if (!signature || !verifyWebhookSignature(body, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: WebhookPayload;
  try {
    event = JSON.parse(body) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const entity = event.payload?.subscription?.entity;
  if (!entity) {
    return NextResponse.json({ received: true });
  }

  switch (event.event) {
    case "subscription.activated":
    case "subscription.charged":
    case "subscription.authenticated":
      await handleSubscriptionActive(entity);
      break;
    case "subscription.cancelled":
    case "subscription.completed":
    case "subscription.expired": {
      const { userId } = notesFromEntity(entity);
      if (userId) await deactivatePlanForUser(userId);
      break;
    }
    case "subscription.halted": {
      const { userId } = notesFromEntity(entity);
      if (userId) {
        dbClient.users.update(userId, { planTier: "free" });
        const row = dbClient.subscriptions.getByRazorpayId(entity.id);
        if (row) {
          dbClient.subscriptions.update(row.id, { status: "halted" });
        }
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
