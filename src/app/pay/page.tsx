"use client";

import { MarketingFooter } from "@/components/MarketingFooter";
import { MarketingNav } from "@/components/MarketingNav";
import { RazorpayCheckout } from "@/components/RazorpayCheckout";

const DEFAULT_AMOUNT_PAISE = 10000;

export default function PayPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <main className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Pay with Razorpay</h1>
        <p className="mt-4 text-slate-600">
          Test checkout for ₹{(DEFAULT_AMOUNT_PAISE / 100).toFixed(2)} (
          {DEFAULT_AMOUNT_PAISE} paise). Use Razorpay test cards in the dashboard.
        </p>
        <div className="mt-10">
          <RazorpayCheckout
            amountPaise={DEFAULT_AMOUNT_PAISE}
            label={`Pay ₹${(DEFAULT_AMOUNT_PAISE / 100).toFixed(2)}`}
            description="Deepchq — test payment"
          />
        </div>
        <p className="mt-8 text-xs text-slate-500">
          Payments are verified on the server before success is shown.
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}
