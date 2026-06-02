import { getDbSnapshot } from "@/lib/db/snapshot";
import {
  getPlanAmountPaise,
  PLAN_AMOUNT_PAISE,
  type PlanInterval,
  type PlanKey,
} from "@/lib/razorpay-plans";

export type ChannelRow = {
  key: string;
  platform: string;
  campaign: string;
  sessions: number;
  leads: number;
  searches: number;
  paidUsers: number;
  leadRate: number;
  paidRate: number;
};

export type AnalyticsOverview = {
  generatedAt: string;
  totals: {
    users: number;
    paidUsers: number;
    searches: number;
    funnelSessions: number;
    activeSubscriptions: number;
    estimatedMrrInr: number;
    estimatedArrInr: number;
  };
  plans: { plan: string; interval: string; count: number; amountInr: number }[];
  channels: ChannelRow[];
  daily: { date: string; sessions: number; searches: number; signups: number }[];
  notes: string[];
};

function parseUtm(utmJson: string | null): Record<string, string> {
  if (!utmJson) return {};
  try {
    return JSON.parse(utmJson) as Record<string, string>;
  } catch {
    return {};
  }
}

function intervalToMonthlyPaise(plan: PlanKey, interval: PlanInterval): number {
  const amount = getPlanAmountPaise(plan, interval);
  switch (interval) {
    case "weekly":
      return Math.round(amount * 4.33);
    case "quarterly":
      return Math.round(amount / 3);
    case "yearly":
      return Math.round(amount / 12);
  }
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function getAnalyticsOverview(): AnalyticsOverview {
  const db = getDbSnapshot();
  const notes: string[] = [];

  const paidUserIds = new Set(
    db.users.filter((u) => u.planTier === "basic" || u.planTier === "pro").map((u) => u.id),
  );

  const activeSubs = db.subscriptions.filter((s) => s.status === "active");
  let estimatedMrrPaise = 0;
  const planBreakdown: AnalyticsOverview["plans"] = [];

  for (const sub of activeSubs) {
    const plan = sub.plan as PlanKey;
    const interval = sub.interval as PlanInterval;
    if (!PLAN_AMOUNT_PAISE[plan]?.[interval]) continue;
    const monthly = intervalToMonthlyPaise(plan, interval);
    estimatedMrrPaise += monthly;
    planBreakdown.push({
      plan: sub.plan,
      interval: sub.interval,
      count: 1,
      amountInr: monthly / 100,
    });
  }

  // Merge plan breakdown rows
  const mergedPlans = new Map<string, (typeof planBreakdown)[0]>();
  for (const row of planBreakdown) {
    const k = `${row.plan}:${row.interval}`;
    const prev = mergedPlans.get(k);
    if (prev) {
      prev.count += 1;
    } else {
      mergedPlans.set(k, { ...row });
    }
  }

  const funnelSessionIds = new Set(db.funnelSessions.map((f) => f.id));
  const searchesByFunnel = new Map<string, number>();
  for (const s of db.searches) {
    if (s.funnelSessionId) {
      searchesByFunnel.set(
        s.funnelSessionId,
        (searchesByFunnel.get(s.funnelSessionId) ?? 0) + 1,
      );
    }
  }

  const paidByFunnel = new Map<string, number>();
  for (const u of db.users) {
    if (!paidUserIds.has(u.id)) continue;
    const userSearch = db.searches.find(
      (s) => s.userId === u.id && s.funnelSessionId,
    );
    if (userSearch?.funnelSessionId) {
      paidByFunnel.set(
        userSearch.funnelSessionId,
        (paidByFunnel.get(userSearch.funnelSessionId) ?? 0) + 1,
      );
    }
  }

  const channelMap = new Map<string, ChannelRow>();

  for (const f of db.funnelSessions) {
    const utm = parseUtm(f.utmJson);
    const platform = f.platform ?? utm.utm_source ?? "unknown";
    const campaign = utm.utm_campaign ?? "(not set)";
    const key = `${platform}::${campaign}`;

    if (!channelMap.has(key)) {
      channelMap.set(key, {
        key,
        platform,
        campaign,
        sessions: 0,
        leads: 0,
        searches: 0,
        paidUsers: 0,
        leadRate: 0,
        paidRate: 0,
      });
    }
    const row = channelMap.get(key)!;
    row.sessions += 1;
    if (f.email) row.leads += 1;
    row.searches += searchesByFunnel.get(f.id) ?? 0;
    row.paidUsers += paidByFunnel.get(f.id) ?? 0;
  }

  // Direct / chat traffic (searches without funnel)
  const directSearches = db.searches.filter(
    (s) => !s.funnelSessionId || !funnelSessionIds.has(s.funnelSessionId),
  ).length;
  if (directSearches > 0) {
    channelMap.set("direct::(app)", {
      key: "direct::(app)",
      platform: "direct",
      campaign: "(chat / organic)",
      sessions: 0,
      leads: 0,
      searches: directSearches,
      paidUsers: 0,
      leadRate: 0,
      paidRate: 0,
    });
  }

  const channels = [...channelMap.values()]
    .map((r) => ({
      ...r,
      leadRate: r.sessions ? Math.round((r.leads / r.sessions) * 1000) / 10 : 0,
      paidRate: r.sessions ? Math.round((r.paidUsers / r.sessions) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.sessions - a.sessions || b.paidUsers - a.paidUsers);

  const dayMap = new Map<
    string,
    { sessions: number; searches: number; signups: number }
  >();

  for (const f of db.funnelSessions) {
    const k = dayKey(f.createdAt);
    if (!dayMap.has(k)) dayMap.set(k, { sessions: 0, searches: 0, signups: 0 });
    dayMap.get(k)!.sessions += 1;
  }
  for (const s of db.searches) {
    const k = dayKey(s.createdAt);
    if (!dayMap.has(k)) dayMap.set(k, { sessions: 0, searches: 0, signups: 0 });
    dayMap.get(k)!.searches += 1;
  }
  for (const u of db.users) {
    const k = dayKey(u.createdAt);
    if (!dayMap.has(k)) dayMap.set(k, { sessions: 0, searches: 0, signups: 0 });
    dayMap.get(k)!.signups += 1;
  }

  const daily = [...dayMap.entries()]
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30);

  if (!db.funnelSessions.length) {
    notes.push(
      "No ad funnel sessions yet. Traffic from /ads/{google|instagram|snapchat}/step/1 will appear here.",
    );
  }
  notes.push(
    "MRR is estimated from active subscriptions and list prices (not Razorpay settlement).",
  );
  notes.push(
    "For exact revenue and refunds, use Razorpay Dashboard → Reports.",
  );

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      users: db.users.length,
      paidUsers: paidUserIds.size,
      searches: db.searches.length,
      funnelSessions: db.funnelSessions.length,
      activeSubscriptions: activeSubs.length,
      estimatedMrrInr: Math.round(estimatedMrrPaise / 100),
      estimatedArrInr: Math.round((estimatedMrrPaise * 12) / 100),
    },
    plans: [...mergedPlans.values()].sort((a, b) => b.count - a.count),
    channels,
    daily,
    notes,
  };
}
