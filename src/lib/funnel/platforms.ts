export const AD_PLATFORMS = ["google", "instagram", "snapchat"] as const;
export type AdPlatform = (typeof AD_PLATFORMS)[number];

export function isAdPlatform(value: string): value is AdPlatform {
  return (AD_PLATFORMS as readonly string[]).includes(value);
}

export type FunnelTitleSegment = { text: string; highlight?: boolean };

export type FunnelStepContent = {
  title: FunnelTitleSegment[];
  subtitle: string;
  illustration: "search-mock" | "radar";
};

export type AdPlatformConfig = {
  label: string;
  defaultUtm: { utm_source: string; utm_medium: string };
  steps: [FunnelStepContent, FunnelStepContent, FunnelStepContent];
};

export const AD_PLATFORM_CONFIG: Record<AdPlatform, AdPlatformConfig> = {
  google: {
    label: "Google Ads",
    defaultUtm: { utm_source: "google", utm_medium: "cpc" },
    steps: [
      {
        title: [
          { text: "Private", highlight: true },
          { text: " & " },
          { text: "Smart", highlight: true },
          { text: " Search" },
        ],
        subtitle:
          "Discover social media profiles, photos, videos, and professional details instantly!",
        illustration: "search-mock",
      },
      {
        title: [
          { text: "Deeper", highlight: true },
          { text: " Insights. " },
          { text: "Powered", highlight: true },
          { text: " by AI." },
        ],
        subtitle:
          "AI scans public web, directories, and social signals in seconds.",
        illustration: "radar",
      },
      {
        title: [{ text: "Make your first search!" }],
        subtitle:
          "Enter a name and email — we'll build your people intelligence report.",
        illustration: "search-mock",
      },
    ],
  },
  instagram: {
    label: "Instagram Ads",
    defaultUtm: { utm_source: "instagram", utm_medium: "paid_social" },
    steps: [
      {
        title: [
          { text: "Their ", highlight: false },
          { text: "Real", highlight: true },
          { text: " Social Footprint" },
        ],
        subtitle:
          "See public Instagram, TikTok, LinkedIn, and more — pulled together by AI.",
        illustration: "search-mock",
      },
      {
        title: [
          { text: "AI", highlight: true },
          { text: " Finds What Profiles Hide" },
        ],
        subtitle:
          "Photos, usernames, locations, and cross-platform links from open sources.",
        illustration: "radar",
      },
      {
        title: [{ text: "Search anyone in 60 seconds" }],
        subtitle:
          "Drop a full name — get a visual report you can share or save.",
        illustration: "search-mock",
      },
    ],
  },
  snapchat: {
    label: "Snapchat Ads",
    defaultUtm: { utm_source: "snapchat", utm_medium: "paid_social" },
    steps: [
      {
        title: [
          { text: "Find Anyone", highlight: true },
          { text: " — Fast" },
        ],
        subtitle:
          "Snap-style speed: AI searches public socials, photos, and web mentions.",
        illustration: "search-mock",
      },
      {
        title: [
          { text: "Swipe-Level", highlight: true },
          { text: " Quick Results" },
        ],
        subtitle:
          "No endless scrolling — one name, one AI report from public data.",
        illustration: "radar",
      },
      {
        title: [{ text: "Start your lookup" }],
        subtitle: "Name + email. Your report unlocks when the scan finishes.",
        illustration: "search-mock",
      },
    ],
  },
};

export function funnelStepPath(
  platform: AdPlatform,
  step: number,
  opts?: { legacy?: boolean },
): string {
  if (opts?.legacy && platform === "google") {
    return `/landing4/step${step}`;
  }
  return `/ads/${platform}/step/${step}`;
}
