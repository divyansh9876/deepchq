import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  buildGoogleAuthUrl,
  isGoogleOAuthConfigured,
} from "@/lib/auth/google-oauth";

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
    const res = NextResponse.redirect(buildGoogleAuthUrl(state));
    res.cookies.set("oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });
    res.cookies.set("oauth_provider", "google", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });
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
