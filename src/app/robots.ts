import type { MetadataRoute } from "next";
import { absolute } from "@/lib/seo";

const PRIVATE = ["/api/", "/dashboard", "/brands/", "/settings", "/report/"];

/** We practise what we preach: every AI search, user-fetch and training crawler is explicitly welcome. */
export default function robots(): MetadataRoute.Robots {
  const aiBots = [
    "OAI-SearchBot",
    "ChatGPT-User",
    "GPTBot",
    "PerplexityBot",
    "Perplexity-User",
    "Claude-SearchBot",
    "Claude-User",
    "ClaudeBot",
    "Google-Extended",
    "Applebot-Extended",
    "Bingbot",
    "CCBot",
  ];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: aiBots, allow: "/", disallow: PRIVATE },
    ],
    sitemap: absolute("/sitemap.xml"),
    host: absolute("/"),
  };
}
