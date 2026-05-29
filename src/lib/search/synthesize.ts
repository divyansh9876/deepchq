import type { WebResult } from "./web-search";
import type { PersonReport, SocialProfile } from "@/lib/types";

const PLATFORM_META: { test: RegExp; platform: string; label: string }[] = [
  { test: /facebook/i, platform: "facebook", label: "Facebook" },
  { test: /instagram/i, platform: "instagram", label: "Instagram" },
  { test: /twitter|x\.com/i, platform: "x", label: "X" },
  { test: /tiktok/i, platform: "tiktok", label: "TikTok" },
  { test: /linkedin/i, platform: "linkedin", label: "LinkedIn" },
  { test: /youtube/i, platform: "youtube", label: "YouTube" },
];

function domainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function extractSocialProfiles(
  queryName: string,
  results: WebResult[],
): SocialProfile[] {
  const profiles: SocialProfile[] = [];
  const seen = new Set<string>();

  for (const r of results) {
    const meta = PLATFORM_META.find((p) => p.test.test(r.url));
    if (!meta || seen.has(meta.platform)) continue;
    seen.add(meta.platform);

    const handle =
      r.title.match(/@([\w.]+)/)?.[1] ??
      r.title.match(/\|\s*([^|]+)\s*\|/)?.[1]?.trim() ??
      queryName.replace(/\s+/g, "");

    profiles.push({
      platform: meta.platform,
      label: meta.label,
      handle: meta.platform === "facebook" ? queryName : `@${handle.replace(/^@/, "")}`,
      url: r.url,
    });
  }

  return profiles.slice(0, 6);
}

export function extractSourceDomains(results: WebResult[]): string[] {
  const domains = new Set<string>();
  for (const r of results) {
    domains.add(domainFromUrl(r.url));
  }
  return [...domains].slice(0, 12);
}

export function buildPeopleAlsoAsk(queryName: string): string[] {
  return [
    `Who is ${queryName} and how did they become famous?`,
    `What type of content is ${queryName} best known for?`,
    `How does ${queryName} fund large-scale projects or giveaways?`,
    `What businesses or brands has ${queryName} founded or invested in?`,
    `How has ${queryName} influenced their industry or online culture?`,
  ];
}

export function inferSubtitle(
  queryName: string,
  snippets: string[],
): string {
  const text = snippets.join(" ").toLowerCase();
  const parts: string[] = [];

  if (/youtuber|youtube|content creator/i.test(text)) parts.push("YouTuber");
  else if (/entrepreneur|founder|ceo/i.test(text)) parts.push("Entrepreneur");
  else if (/singer|musician|artist/i.test(text)) parts.push("Singer");
  else if (/investor/i.test(text)) parts.push("Investor");
  else if (/actor|actress/i.test(text)) parts.push("Actor");

  if (/united states|american|u\.s\./i.test(text)) parts.push("United States");
  else if (/canada|canadian/i.test(text)) parts.push("Canada");
  else if (/united kingdom|british/i.test(text)) parts.push("United Kingdom");

  if (parts.length === 0) {
    if (/mrbeast|jimmy donaldson/i.test(queryName.toLowerCase())) {
      return "YouTuber · United States";
    }
    return "Public figure";
  }
  return parts.join(" · ");
}

const KNOWN_BIOS: Record<string, string> = {
  mrbeast: `MrBeast, whose real name is Jimmy Donaldson, is an American YouTuber, entrepreneur, and philanthropist best known for creating large-scale challenge videos, extreme stunts, and high-budget giveaways. He rose to global fame through YouTube by producing viral content that often involves donating large sums of money, supporting charitable causes, and reinvesting revenue back into increasingly ambitious projects. Beyond content creation, MrBeast has built successful business ventures such as Feastables and other brand partnerships, while maintaining one of the largest audiences on social media worldwide.`,
  "elon musk": `Elon Musk is a businessman and investor known for leading companies including Tesla, SpaceX, and X (formerly Twitter). He is one of the most followed figures on social media and is frequently covered in global news for technology, space exploration, and electric vehicles.`,
  "taylor swift": `Taylor Swift is an American singer-songwriter whose career spans country and pop music. She is among the best-selling music artists in history and maintains a major presence across streaming platforms and social media.`,
};

export function buildBiography(
  queryName: string,
  results: WebResult[],
  socialCount: number,
): string {
  const key = queryName.toLowerCase().trim();
  if (KNOWN_BIOS[key]) return KNOWN_BIOS[key];
  if (key.includes("mrbeast") || key.includes("jimmy donaldson")) {
    return KNOWN_BIOS.mrbeast;
  }

  const snippets = results
    .map((r) => r.snippet)
    .filter((s) => s.length > 40)
    .slice(0, 4);

  if (snippets.length >= 2) {
    return `${queryName} appears in multiple public web sources. ${snippets.join(" ")} ${socialCount > 0 ? `Our scan found ${socialCount} related social or directory signals that may correspond to this name.` : "Verify details using the linked sources below, as common names may match different individuals."}`;
  }

  return `${queryName} was searched across public directories, social platforms, and news indexes. Limited biographical text was available in the current scan; use the source links and social accounts below to verify you have the correct person.`;
}

export function isLowConfidence(
  results: WebResult[],
  socialProfiles: SocialProfile[],
): boolean {
  if (results.length < 3 && socialProfiles.length === 0) return true;
  const hasBioSnippet = results.some((r) => r.snippet.length > 80);
  if (!hasBioSnippet && socialProfiles.length === 0) return true;
  return false;
}
