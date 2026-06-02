# Razorpay recurring subscriptions (Deepchq)

Pricing uses **Razorpay Subscriptions** (auto-renew) when all six plan IDs are configured. Otherwise it falls back to **one-time orders** per checkout.

## 1. Enable Subscriptions in Razorpay

1. [Razorpay Dashboard](https://dashboard.razorpay.com/) → **Account & Settings** → enable **Subscriptions**.
2. Use **Test mode** until you go live.

## 2. Create plans (choose one)

### Option A — Script (recommended)

```bash
# From repo root, with keys in .env
npx tsx scripts/razorpay/create-plans.ts
```

Copy the printed `RAZORPAY_PLAN_*` lines into Render.

### Option B — Dashboard

Create 6 plans (**Subscriptions → Plans**) matching `src/lib/razorpay-plans.ts` amounts:

| Env variable | Plan | Interval | Amount (INR) |
|--------------|------|----------|----------------|
| `RAZORPAY_PLAN_BASIC_WEEKLY` | Basic | Weekly | ₹499 |
| `RAZORPAY_PLAN_BASIC_QUARTERLY` | Basic | Every 3 months | ₹1,299 |
| `RAZORPAY_PLAN_BASIC_YEARLY` | Basic | Yearly | ₹3,999 |
| `RAZORPAY_PLAN_PRO_WEEKLY` | Pro | Weekly | ₹999 |
| `RAZORPAY_PLAN_PRO_QUARTERLY` | Pro | Every 3 months | ₹2,499 |
| `RAZORPAY_PLAN_PRO_YEARLY` | Pro | Yearly | ₹7,999 |

Use plan IDs like `plan_xxxxxxxxxxxxxx` (19 characters).

## 3. Render environment variables

```env
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...

RAZORPAY_PLAN_BASIC_WEEKLY=plan_...
RAZORPAY_PLAN_BASIC_QUARTERLY=plan_...
RAZORPAY_PLAN_BASIC_YEARLY=plan_...
RAZORPAY_PLAN_PRO_WEEKLY=plan_...
RAZORPAY_PLAN_PRO_QUARTERLY=plan_...
RAZORPAY_PLAN_PRO_YEARLY=plan_...

RAZORPAY_WEBHOOK_SECRET=whsec_...
ALLOW_DEV_UNLOCK=false
NEXT_PUBLIC_APP_URL=https://www.deepchq.com
```

Redeploy after saving.

## 4. Webhook

**Dashboard → Webhooks → Add endpoint**

- **URL:** `https://www.deepchq.com/api/webhooks/razorpay`
- **Secret:** copy to `RAZORPAY_WEBHOOK_SECRET`
- **Events:**
  - `subscription.activated`
  - `subscription.charged`
  - `subscription.cancelled`
  - `subscription.halted`
  - `subscription.completed`

## 5. Flow (same idea as Stripe)

1. User signs in → `/pricing` → **Subscribe**
2. Server creates Razorpay **subscription** → Checkout opens with `subscription_id`
3. User pays (mandate + first charge)
4. Server verifies `payment_id|subscription_id` signature → activates `basic` / `pro`, unlocks report if `searchId` present
5. Razorpay **renews** each period; webhooks keep access in sync
6. **Cancel** in Razorpay Dashboard → `subscription.cancelled` → user returns to `free`

## 6. Verify

- `GET /api/config/public` → `"subscriptionsEnabled": true`
- `/pricing` footer: *"Recurring subscription via Razorpay…"*
- Test card: [Razorpay test docs](https://razorpay.com/docs/payments/payments/test-card-upi-details/)

## Disable subscriptions (one-time only)

Set `RAZORPAY_USE_SUBSCRIPTIONS=false` or omit any `RAZORPAY_PLAN_*` variable.
