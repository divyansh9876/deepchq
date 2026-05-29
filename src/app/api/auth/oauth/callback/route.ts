import { NextRequest, NextResponse } from "next/server";
import { dbClient } from "@/lib/db";
import { newId } from "@/lib/id";
import { appBaseUrl, exchangeGoogleCode } from "@/lib/auth/google-oauth";

export async function GET(req: NextRequest) {
  const base = appBaseUrl();
  const error = req.nextUrl.searchParams.get("error");
  if (error) {
    return NextResponse.redirect(
      `${base}/landing/login?error=${encodeURIComponent(error)}`,
    );
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const savedState = req.cookies.get("oauth_state")?.value;

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(`${base}/landing/login?error=invalid_oauth_state`);
  }

  try {
    const { email } = await exchangeGoogleCode(code);
    let user = dbClient.users.getByEmail(email);

    if (!user) {
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
    }

    if (!user) {
      return NextResponse.redirect(`${base}/landing/login?error=user_create_failed`);
    }

    const res = NextResponse.redirect(`${base}/chat`);
    res.cookies.set("user_id", user.id, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 86400 * 30,
    });
    res.cookies.delete("oauth_state");
    res.cookies.delete("oauth_provider");
    return res;
  } catch {
    return NextResponse.redirect(`${base}/landing/login?error=google_auth_failed`);
  }
}
