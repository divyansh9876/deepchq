import { NextRequest, NextResponse } from "next/server";

/** Placeholder for Google/Apple OAuth — wire NextAuth or provider SDK when keys are set. */
export async function GET(req: NextRequest) {
  const provider = req.nextUrl.searchParams.get("provider");
  if (!process.env.GOOGLE_CLIENT_ID && !process.env.APPLE_CLIENT_ID) {
    return NextResponse.json(
      {
        error: "OAuth not configured",
        message: `Set ${provider === "apple" ? "APPLE_CLIENT_ID" : "GOOGLE_CLIENT_ID"} to enable ${provider} sign-in.`,
      },
      { status: 501 },
    );
  }
  return NextResponse.json({ error: "OAuth handler not implemented" }, { status: 501 });
}
