import crypto from "crypto";
import { db } from "@/lib/db/client";
import { button, layout, notifyAdmin, sendEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/env";
import { HttpError } from "@/lib/http";
import type { PlanId } from "@/lib/types";

export type Interval = "monthly" | "annual";
type PaidPlan = Exclude<PlanId, "free">;

const API = "https://api.razorpay.com/v1";

function auth() {
  const id = process.env.RAZORPAY_KEY_ID?.trim();
  const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!id || !secret) throw new HttpError(503, "Online checkout isn't configured yet. Contact us to upgrade.");
  return { id, secret, header: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}` };
}

export function razorpayPlanId(plan: PaidPlan, interval: Interval) {
  return process.env[`RAZORPAY_PLAN_${plan.toUpperCase()}_${interval.toUpperCase()}`]?.trim() || null;
}

async function rzp<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { header } = auth();
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: header, "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: { description?: string } };
  if (!res.ok) {
    console.warn("[razorpay]", path, res.status, data.error);
    throw new HttpError(502, data.error?.description ?? "Payment provider error. Please try again.");
  }
  return data;
}

type Subscription = {
  id: string;
  status: string;
  current_end?: number | null;
  notes?: { userId?: string; plan?: string; interval?: string };
};

export async function createSubscription(userId: string, email: string, plan: PaidPlan, interval: Interval) {
  const planId = razorpayPlanId(plan, interval);
  if (!planId) throw new HttpError(503, `The ${plan} ${interval} plan isn't set up for online checkout yet.`);
  const sub = await rzp<Subscription>("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      plan_id: planId,
      total_count: interval === "annual" ? 10 : 120,
      customer_notify: 1,
      notes: { userId, plan, interval, email },
    }),
  });
  return { subscriptionId: sub.id, keyId: auth().id };
}

export function fetchSubscription(id: string) {
  return rzp<Subscription>(`/subscriptions/${encodeURIComponent(id)}`);
}

export function cancelSubscription(id: string) {
  return rzp<Subscription>(`/subscriptions/${encodeURIComponent(id)}/cancel`, {
    method: "POST",
    body: JSON.stringify({ cancel_at_cycle_end: 1 }),
  });
}

function safeEqualHex(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export function verifyCheckoutSignature(paymentId: string, subscriptionId: string, signature: string) {
  const expected = crypto.createHmac("sha256", auth().secret).update(`${paymentId}|${subscriptionId}`).digest("hex");
  return safeEqualHex(expected, signature);
}

export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqualHex(expected, signature);
}

/** Idempotently applies a subscription's state to the user it belongs to. */
export async function applySubscription(sub: Subscription) {
  const userId = sub.notes?.userId;
  const user = userId ? db.users.get(userId) : db.users.getBySubscription(sub.id);
  if (!user) return null;
  const plan = (sub.notes?.plan === "agency" ? "agency" : "growth") as PaidPlan;
  const renews = sub.current_end ? new Date(sub.current_end * 1000) : null;

  if (["active", "authenticated"].includes(sub.status)) {
    const wasPaid = user.subscriptionStatus === "active" && user.subscriptionId === sub.id;
    db.users.update(user.id, {
      planTier: plan,
      subscriptionId: sub.id,
      subscriptionStatus: "active",
      trialEndsAt: null,
      pendingPlan: null,
      planRenewsAt: renews,
    });
    if (!wasPaid) {
      void sendEmail({
        to: user.email,
        subject: `You're on Deepchq ${plan === "agency" ? "Agency" : "Growth"}`,
        html: layout(
          "Payment received — thank you",
          `<p style="color:#475569">Your ${plan} plan is active. Scheduled scans now run ${plan === "agency" ? "daily" : "weekly"} across all six engines.</p>${button(`${SITE_URL}/dashboard`, "Go to dashboard")}`,
        ),
      });
      void notifyAdmin("New paid subscription", `<p>${user.email} → ${plan} (${sub.notes?.interval ?? "monthly"})</p>`);
    }
  } else if (["cancelled", "completed", "expired", "halted"].includes(sub.status)) {
    if (user.subscriptionId && user.subscriptionId !== sub.id) return user; // stale event for an old subscription
    db.users.update(user.id, { planTier: "free", subscriptionStatus: null, planRenewsAt: null });
    void sendEmail({
      to: user.email,
      subject: "Your Deepchq subscription has ended",
      html: layout(
        "You're back on the free plan",
        `<p style="color:#475569">Your data is kept. Re-subscribe any time to restore scheduled scans and all engines.</p>${button(`${SITE_URL}/settings`, "Manage plan")}`,
      ),
    });
  }
  return db.users.get(user.id);
}
