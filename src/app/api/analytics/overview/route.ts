import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsOverview } from "@/lib/analytics/overview";
import { isAnalyticsAuthorized } from "@/lib/analytics/auth";

export async function GET(req: NextRequest) {
  if (!isAnalyticsAuthorized(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Set ANALYTICS_SECRET and pass x-analytics-secret header." },
      { status: 401 },
    );
  }

  return NextResponse.json(getAnalyticsOverview());
}
