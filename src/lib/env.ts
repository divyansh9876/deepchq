/** Central place for runtime configuration and feature flags. */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://deepchq.app").replace(/\/$/, "");

export const isProd = process.env.NODE_ENV === "production";

export function sessionSecret(): string {
  const s = process.env.SESSION_SECRET?.trim();
  if (s && s.length >= 32) return s;
  if (isProd && process.env.NEXT_PHASE !== "phase-production-build") {
    throw new Error("SESSION_SECRET must be set (32+ chars) in production");
  }
  return "dev-only-insecure-session-secret-change-me-please";
}

export const flags = {
  openai: () => !!process.env.OPENAI_API_KEY?.trim(),
  perplexity: () => !!process.env.PERPLEXITY_API_KEY?.trim(),
  gemini: () => !!process.env.GEMINI_API_KEY?.trim(),
  anthropic: () => !!process.env.ANTHROPIC_API_KEY?.trim(),
  email: () => !!process.env.RESEND_API_KEY?.trim() && !!process.env.EMAIL_FROM?.trim(),
  billing: () =>
    !!process.env.RAZORPAY_KEY_ID?.trim() &&
    !!process.env.RAZORPAY_KEY_SECRET?.trim(),
  internalCron: () => process.env.ENABLE_INTERNAL_CRON !== "false",
};

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim() ?? "";
