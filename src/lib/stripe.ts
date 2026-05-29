import Stripe from "stripe";

export const stripe =
  process.env.STRIPE_SECRET_KEY ?
    new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" })
  : null;

export const PRICE_IDS: Record<string, Record<string, string | undefined>> = {
  basic: {
    weekly: process.env.STRIPE_PRICE_BASIC_WEEKLY,
    quarterly: process.env.STRIPE_PRICE_BASIC_QUARTERLY,
    yearly: process.env.STRIPE_PRICE_BASIC_YEARLY,
  },
  pro: {
    weekly: process.env.STRIPE_PRICE_PRO_WEEKLY,
    quarterly: process.env.STRIPE_PRICE_PRO_QUARTERLY,
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY,
  },
};

export function isStripeEnabled() {
  return Boolean(stripe);
}
