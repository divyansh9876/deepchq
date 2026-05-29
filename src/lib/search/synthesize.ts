import type { WebResult } from "./web-search";
import type { PersonReport, ReportSection, SocialProfile } from "@/lib/types";

const PLATFORM_META: { test: RegExp; platform: string; label: string }[] = [
  { test: /facebook/i, platform: "facebook", label: "Facebook" },
  { test: /instagram/i, platform: "instagram", label: "Instagram" },
  { test: /twitter|x\.com/i, platform: "x", label: "X" },
  { test: /tiktok/i, platform: "tiktok", label: "TikTok" },
  { test: /linkedin/i, platform: "linkedin", label: "LinkedIn" },
  { test: /youtube/i, platform: "youtube", label: "YouTube" },
];

/** Sections shown in DeepSearch-style report (excluding header + social list). */
export const REPORT_INSIGHT_IDS = [
  "email",
  "location",
  "connections",
  "web_mentions",
] as const;

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

    const handleFromTitle =
      r.title.match(/@([\w.]+)/)?.[1] ??
      r.title.match(/\((@[\w.]+)\)/)?.[1]?.replace("@", "") ??
      r.url.match(/@([\w.]+)/)?.[1];

    const slug = queryName.replace(/\s+/g, "").toLowerCase();
    const handle = handleFromTitle ?? slug;

    profiles.push({
      platform: meta.platform,
      label: meta.label,
      handle:
        meta.platform === "facebook"
          ? queryName
          : `@${handle.replace(/^@/, "")}`,
      url: r.url,
    });
  }

  const order = ["linkedin", "instagram", "facebook", "x", "tiktok", "youtube"];
  profiles.sort(
    (a, b) => order.indexOf(a.platform) - order.indexOf(b.platform),
  );

  return profiles.slice(0, 8);
}

export function extractSourceDomains(results: WebResult[]): string[] {
  const domains = new Set<string>();
  for (const r of results) {
    domains.add(domainFromUrl(r.url));
  }
  return [...domains].slice(0, 14);
}

export function buildPeopleAlsoAsk(
  queryName: string,
  subtitle?: string,
): string[] {
  const role =
    subtitle?.split("·")[0]?.trim().toLowerCase() ?? "public figure";
  return [
    `Who is ${queryName} and what is their public background?`,
    `What is ${queryName} known for as a ${role}?`,
    `Which social platforms is ${queryName} most active on?`,
    `Where is ${queryName} based or most frequently mentioned?`,
    `What public records or news mention ${queryName}?`,
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
  else if (/influencer|creator/i.test(text)) parts.push("Influencer");

  if (/united states|american|u\.s\./i.test(text)) parts.push("United States");
  else if (/canada|canadian/i.test(text)) parts.push("Canada");
  else if (/india|indian/i.test(text)) parts.push("India");
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
    return `${queryName} is a public figure with multiple listings across social platforms, directories, and news indexes. ${snippets[0]} ${snippets[1]} ${socialCount > 0 ? `This scan surfaced ${socialCount} social or directory signals that may correspond to this name.` : "Verify the sources below, as common names can match different people."}`;
  }

  return `${queryName} appears in public web directories and social search results. This report summarizes publicly available signals only — including possible social accounts, location hints, and web mentions — so you can confirm whether this is the person you intended to find.`;
}

export function enrichReportSections(
  queryName: string,
  sections: ReportSection[],
  results: WebResult[],
  subtitle?: string,
): ReportSection[] {
  const locationHint = subtitle?.includes("·")
    ? subtitle.split("·").pop()?.trim()
    : null;

  return sections.map((section) => {
    if (section.id === "location" && locationHint) {
      const hasReal = section.items.some((i) => !i.text.includes("not found"));
      if (!hasReal) {
        return {
          ...section,
          items: [
            {
              text: `Likely region: ${locationHint} (inferred from public profile signals).`,
            },
            ...section.items,
          ],
        };
      }
    }

    if (section.id === "email") {
      const hasReal = section.items.some((i) => i.text.includes("@"));
      if (!hasReal && results.length > 0) {
        return {
          ...section,
          items: [
            {
              text: `No verified public email found for ${queryName}. Unlock may surface pattern hints from directory listings.`,
            },
          ],
        };
      }
    }

    if (section.id === "connections" && results.length >= 3) {
      return {
        ...section,
        items: [
          {
            text: `Public mentions and co-tags associated with ${queryName} in news and social results.`,
          },
          {
            text: `Cross-links from ${domainFromUrl(results[0]?.url ?? "")} and related directory pages.`,
            sourceUrl: results[0]?.url,
          },
        ],
      };
    }

    return section;
  });
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

export function socialSecondaryLine(profile: SocialProfile): string {
  try {
    const host = new URL(profile.url).hostname.replace(/^www\./, "");
    return `${profile.handle} · ${host}`;
  } catch {
    return profile.handle;
  }
}

export function insightSectionsForReport(
  report: PersonReport,
): ReportSection[] {
  return report.sections.filter((s) =>
    (REPORT_INSIGHT_IDS as readonly string[]).includes(s.id),
  );
}
