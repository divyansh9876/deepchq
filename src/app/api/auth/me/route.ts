import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guard";
import { db } from "@/lib/db/client";
import { flags } from "@/lib/env";
import { isLiveEngine } from "@/lib/geo/engines";
import { AI_ENGINES } from "@/lib/brand";
import { effectivePlan, limitsFor } from "@/lib/plans";
import { route } from "@/lib/http";

export const GET = route(async () => {
  const user = await requireUser();
  const plan = effectivePlan(user);
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan,
      trialEndsAt: user.trialEndsAt ?? null,
      subscriptionStatus: user.subscriptionStatus ?? null,
      planRenewsAt: user.planRenewsAt ?? null,
      digestEnabled: user.digestEnabled !== false,
    },
    limits: limitsFor(user),
    usage: { brands: db.brands.list(user.id).length },
    billingEnabled: flags.billing(),
    liveEngines: AI_ENGINES.filter((e) => isLiveEngine(e.id)).map((e) => e.id),
  });
});
