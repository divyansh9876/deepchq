import { NextRequest, NextResponse } from "next/server";
import { unlockReport, getReport } from "@/lib/search/store";
import { getSessionUser, hasPaidAccess } from "@/lib/auth/session";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required", requiresAuth: true }, { status: 401 });
  }

  if (!hasPaidAccess(user.planTier)) {
    const mockUnlock = process.env.ALLOW_DEV_UNLOCK === "true";
    if (!mockUnlock) {
      return NextResponse.json(
        { error: "Subscription required", requiresCheckout: true },
        { status: 402 },
      );
    }
  }

  await unlockReport(id);
  const report = await getReport(id, true);
  return NextResponse.json({ unlocked: true, report });
}
