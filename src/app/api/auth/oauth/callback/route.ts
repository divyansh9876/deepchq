import { NextRequest } from "next/server";
import { dbClient } from "@/lib/db";
import { newId } from "@/lib/id";
import { appBaseUrl } from "@/lib/auth/app-url";
import { authCookieOptions } from "@/lib/auth/cookies";
import { exchangeGoogleCode } from "@/lib/auth/google-oauth";
import { redirectWithHtml } from "@/lib/auth/redirect";
import { claimSearchesForUser } from "@/lib/search/claim-searches";

export const dynamic = "force-dynamic";

function safeNextPath(raw: string | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/chat";
  return raw;
}

export async function GET(req: NextRequest) {
  const base = appBaseUrl();
  const error = req.nextUrl.searchParams.get("error");
  if (error) {
    return redirectWithHtml(
      `${base}/landing/login?error=${encodeURIComponent(error)}`,
    );
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const savedState = req.cookies.get("oauth_state")?.value;
  const nextPath = safeNextPath(req.cookies.get("oauth_next")?.value);

  if (!code || !state || !savedState || state !== savedState) {
    console.error("[oauth/callback] invalid state", {
      hasCode: Boolean(code),
      hasState: Boolean(state),
      hasCookie: Boolean(savedState),
      match: state === savedState,
    });
    return redirectWithHtml(`${base}/landing/login?error=invalid_oauth_state`);
  }

  try {
    const { email } = await exchangeGoogleCode(code);
    let user = dbClient.users.getByEmail(email);

    if (!user) {
      try {
        const id = newId("usr");
        dbClient.users.create({
          id,
          email,
          passwordHash: null,
          authProvider: "google",
          stripeCustomerId: null,
          planTier: "free",
          createdAt: new Date(),
        });
        user = dbClient.users.get(id);
      } catch (e) {
        // Race or existing email — use existing account
        user = dbClient.users.getByEmail(email);
        if (!user) throw e;
      }
    }

    if (!user) {
      return redirectWithHtml(`${base}/landing/login?error=user_create_failed`);
    }

    claimSearchesForUser(
      user.id,
      user.email,
      req.cookies.get("last_search")?.value,
    );

    const destination = `${base}${nextPath}`;
    const res = redirectWithHtml(destination);
    res.cookies.set("user_id", user.id, authCookieOptions(86400 * 30));
    res.cookies.delete("oauth_state");
    res.cookies.delete("oauth_provider");
    res.cookies.delete("oauth_next");
    return res;
  } catch (err) {
    const code =
      err instanceof Error ? err.message : "google_auth_failed";
    console.error("[oauth/callback] failed:", err);
    return redirectWithHtml(
      `${base}/landing/login?error=${encodeURIComponent(code)}`,
    );
  }
}
