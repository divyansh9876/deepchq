"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { AdPlatform } from "@/lib/funnel/platforms";
import { AD_PLATFORM_CONFIG } from "@/lib/funnel/platforms";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_id",
  "utm_term",
  "utm_content",
] as const;

export function FunnelAttribution({ platform }: { platform: AdPlatform }) {
  const params = useSearchParams();

  useEffect(() => {
    const utm: Record<string, string> = {};
    UTM_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) utm[k] = v;
    });

    const defaults = AD_PLATFORM_CONFIG[platform].defaultUtm;
    if (!utm.utm_source) utm.utm_source = defaults.utm_source;
    if (!utm.utm_medium) utm.utm_medium = defaults.utm_medium;

    const gclid = params.get("gclid") ?? undefined;
    const fbclid = params.get("fbclid") ?? undefined;
    const scCid = params.get("ScCid") ?? params.get("sc_cid") ?? undefined;

    fetch("/api/funnel/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        utm,
        gclid,
        fbclid,
        scCid,
        platform,
      }),
    }).catch(() => {});
  }, [params, platform]);

  return null;
}
