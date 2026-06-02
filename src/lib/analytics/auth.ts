import { NextRequest } from "next/server";

export function isAnalyticsAuthorized(req: NextRequest): boolean {
  const secret = process.env.ANALYTICS_SECRET?.trim();
  if (!secret) return false;

  const header = req.headers.get("x-analytics-secret");
  if (header === secret) return true;

  const auth = req.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  const q = req.nextUrl.searchParams.get("secret");
  return q === secret;
}
