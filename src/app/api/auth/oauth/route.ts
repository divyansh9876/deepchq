import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  buildGoogleAuthUrl,
  isGoogleOAuthConfigured,
} from "@/lib/auth/google-oauth";
import { authCookieOptions } from "@/lib/auth/cookies";

export const dynamic = "force-dynamic";

function safeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/chat";
  return raw;
}

/** Start OAuth — redirects browser to Google (or returns error JSON). */
export async function GET(req: NextRequest) {
  const provider = req.nextUrl.searchParams.get("provider");

  if (provider === "google") {
    if (!isGoogleOAuthConfigured()) {
      return NextResponse.json(
        {
          error: "OAuth not configured",
          message:
            "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET on the server. See docs/ENV-SETUP.md",
        },
        { status: 501 },
      );
    }

    const state = crypto.randomBytes(16).toString("hex");
    const nextPath = safeNextPath(req.nextUrl.searchParams.get("next"));
    const res = NextResponse.redirect(buildGoogleAuthUrl(state));
    const opts = authCookieOptions(600);
    res.cookies.set("oauth_state", state, opts);
    res.cookies.set("oauth_provider", "google", opts);
    res.cookies.set("oauth_next", nextPath, opts);
    return res;
  }

  if (provider === "apple") {
    return NextResponse.json(
      {
        error: "OAuth not configured",
        message: "Apple Sign In is not enabled yet. Use email or Google.",
      },
      { status: 501 },
    );
  }

  return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
}
