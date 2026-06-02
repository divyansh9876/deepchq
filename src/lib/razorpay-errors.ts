import { nanoid } from "nanoid";

/** Razorpay Node SDK rejects receipts longer than 40 characters. */
export function razorpayReceipt(prefix = "dc"): string {
  return `${prefix}_${nanoid(12)}`.slice(0, 40);
}

type RazorpayApiError = {
  statusCode?: number;
  error?: {
    code?: string;
    description?: string;
    reason?: string;
    field?: string;
  };
};

export function parseRazorpayError(err: unknown): {
  status: number;
  message: string;
} {
  const r = err as RazorpayApiError;
  const description = r?.error?.description;
  if (description) {
    const status = r.statusCode ?? 500;
    return { status, message: description };
  }
  if (err instanceof Error && err.message) {
    return { status: r.statusCode ?? 500, message: err.message };
  }
  return { status: 500, message: "Failed to create order" };
}
