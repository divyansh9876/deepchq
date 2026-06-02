"use client";

import Script from "next/script";
import { useCallback, useState } from "react";
import type { PlanInterval, PlanKey } from "@/lib/razorpay-plans";

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayFailedResponse = {
  error: {
    code: string;
    description: string;
    reason?: string;
    metadata?: { order_id?: string; payment_id?: string };
  };
};

type RazorpayConstructor = new (options: Record<string, unknown>) => {
  open: () => void;
  on: (event: string, handler: (response: RazorpayFailedResponse) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
};

type SubscriptionProps = {
  plan: PlanKey;
  interval: PlanInterval;
  searchId?: string;
  amountPaise?: never;
};

type AmountProps = {
  amountPaise: number;
  plan?: never;
  interval?: never;
  searchId?: never;
};

type Props = (SubscriptionProps | AmountProps) & {
  currency?: string;
  label?: string;
  description?: string;
  className?: string;
  onSuccess?: (redirectUrl?: string) => void;
  onAuthRequired?: () => void;
};

export function RazorpayCheckout({
  amountPaise,
  plan,
  interval,
  searchId,
  currency = "INR",
  label = "Pay now",
  description = "Complete your payment",
  className = "btn-primary",
  onSuccess,
  onAuthRequired,
}: Props) {
  const [scriptReady, setScriptReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const isSubscription = Boolean(plan && interval);

  const verifyPayment = useCallback(
    async (response: RazorpaySuccessResponse) => {
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          plan,
          interval,
          searchId,
        }),
      });
      const data = await res.json();
      if (res.status === 401) {
        onAuthRequired?.();
        throw new Error("Sign in required");
      }
      if (!res.ok) {
        throw new Error(data.error ?? "Payment verification failed");
      }
      return data as { redirectUrl?: string };
    },
    [plan, interval, searchId, onAuthRequired],
  );

  const startCheckout = useCallback(async () => {
    setMessage(null);

    if (!keyId) {
      setMessage({
        type: "error",
        text: "Payment is not configured (missing Razorpay key).",
      });
      return;
    }

    if (!scriptReady || !window.Razorpay) {
      setMessage({
        type: "info",
        text: "Payment form is still loading. Please try again.",
      });
      return;
    }

    if (!isSubscription && amountPaise < 100) {
      setMessage({
        type: "error",
        text: "Minimum payment amount is ₹1 (100 paise).",
      });
      return;
    }

    setLoading(true);

    try {
      const orderBody =
        isSubscription
          ? { plan, interval, currency, searchId }
          : { amount: amountPaise, currency, receipt: `web_${Date.now()}` };

      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderBody),
      });
      const orderData = await orderRes.json();

      if (orderRes.status === 401) {
        onAuthRequired?.();
        throw new Error("Sign in required");
      }
      if (!orderRes.ok) {
        throw new Error(orderData.error ?? "Could not create order");
      }

      const rzp = new window.Razorpay({
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Deepchq",
        description,
        order_id: orderData.order_id,
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            if (isSubscription) {
              const data = await verifyPayment(response);
              if (onSuccess) {
                onSuccess(data.redirectUrl);
              } else {
                setMessage({
                  type: "success",
                  text: "Payment successful. Your plan is now active.",
                });
              }
            } else {
              const res = await fetch("/api/verify-signature", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error ?? "Verification failed");
              }
              setMessage({
                type: "success",
                text: `Payment successful. ID: ${response.razorpay_payment_id}`,
              });
            }
          } catch (err) {
            setMessage({
              type: "error",
              text:
                err instanceof Error
                  ? err.message
                  : "Payment verification failed",
            });
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setMessage({ type: "info", text: "Payment cancelled." });
          },
        },
      });

      rzp.on("payment.failed", (response: RazorpayFailedResponse) => {
        setLoading(false);
        setMessage({
          type: "error",
          text:
            response.error?.description ??
            "Payment failed. Please try again.",
        });
      });

      rzp.open();
    } catch (err) {
      setLoading(false);
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  }, [
    amountPaise,
    currency,
    description,
    interval,
    isSubscription,
    keyId,
    onAuthRequired,
    onSuccess,
    plan,
    scriptReady,
    searchId,
    verifyPayment,
  ]);

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
      />
      <button
        type="button"
        className={className}
        disabled={loading}
        onClick={startCheckout}
      >
        {loading ? "Processing…" : label}
      </button>
      {message && !onSuccess && (
        <p
          role="alert"
          className={`mt-3 text-sm ${
            message.type === "success"
              ? "text-green-700"
              : message.type === "error"
                ? "text-red-600"
                : "text-slate-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </>
  );
}
