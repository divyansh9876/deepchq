"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function UtmCapture() {
  const params = useSearchParams();

  useEffect(() => {
    const utm: Record<string, string> = {};
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_id",
      "utm_term",
      "utm_content",
    ].forEach((k) => {
      const v = params.get(k);
      if (v) utm[k] = v;
    });
    const gclid = params.get("gclid") ?? undefined;

    fetch("/api/funnel/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ utm: Object.keys(utm).length ? utm : undefined, gclid }),
    }).catch(() => {});
  }, [params]);

  return null;
}
