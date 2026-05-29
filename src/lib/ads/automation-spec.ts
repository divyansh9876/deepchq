/**
 * Single source for automated ad generation.
 * Synced with: brand.ts, homepage copy, funnel platforms (Instagram = organic IG reference).
 */
import { BRAND_NAME, SUPPORT_EMAIL } from "@/lib/brand";
import { AD_PLATFORM_CONFIG, type AdPlatform } from "@/lib/funnel/platforms";

export const BRAND_VISUAL = {
  background: "#000000",
  surface: "#111827",
  card: "#f3f4f6",
  accent: "#3b82f6",
  accentClass: "text-blue-500",
  textPrimary: "#ffffff",
  textMuted: "#9ca3af",
  font: "system-ui, Inter, sans-serif",
} as const;

/** Organic Instagram page spec — paid ads must match this look & voice. */
export const INSTAGRAM_ORGANIC_REFERENCE = {
  handle: process.env.INSTAGRAM_HANDLE ?? "@deepchq",
  profileUrl: process.env.INSTAGRAM_PROFILE_URL ?? "https://www.instagram.com/deepchq",
  bioLines: [
    `${BRAND_NAME} · AI people search`,
    "Find public socials, emails & web mentions",
    "🔒 Public sources only · Not for hiring/credit",
    "👇 Try free",
  ],
  linkInBio: "/ads/instagram/step/1",
  postTemplates: [
    {
      type: "carousel",
      slides: [
        "Slide 1: Dark hero — “Find people by name” (match homepage `/`)",
        "Slide 2: Use case grid — Social / Email / Location (homepage `#use-cases`)",
        "Slide 3: Funnel hook — “Their Real Social Footprint” (`/ads/instagram/step/1`)",
        "Slide 4: CTA — “Search anyone in 60 seconds” + link sticker",
      ],
    },
    {
      type: "reel",
      script:
        "Screen-record `/ads/instagram/step/2` radar animation (15s) + text overlay: AI finds public profiles",
    },
    {
      type: "story",
      frames: [
        "Poll: Ever tried to find someone online?",
        "Quiz sticker → funnel step 1 URL",
        "Countdown → “Report in 60 sec”",
      ],
    },
  ],
  hashtags: [
    "#peoplesearch",
    "#socialmedia",
    "#osint",
    "#ai",
    "#deepchq",
  ],
  screenshotPaths: [
    "/",
    "/ads/instagram/step/1",
    "/ads/instagram/step/2",
    "/ads/instagram/step/3",
  ],
} as const;

export const HOMEPAGE_REFERENCE = {
  heroHeadline: `Welcome to ${BRAND_NAME}`,
  heroSubline: "Find people by name. Access their social profiles in seconds.",
  cta: "Search Now",
  popularSearches: ["Elon Musk", "Taylor Swift", "Kim Kardashian", "Playboi Carti"],
  useCases: [
    { title: "Full Name", desc: "Discover the name(s) linked to the number." },
    { title: "Social Accounts", desc: "Reveal associated profiles across major platforms." },
    { title: "Email Address", desc: "Find public emails associated with the contact." },
    { title: "City & Region", desc: "See the most likely location data." },
    { title: "Connections", desc: "Get insights into related individuals." },
    { title: "Web Mentions", desc: "Explore where the person appears online." },
  ],
  complianceShort:
    "Public sources only. Not for employment, credit, or tenant screening.",
} as const;

export type AdsAutomationConfig = {
  baseUrl: string;
  instagramHandle?: string;
  dailyBudgetUsd: number;
  geoTargets: string[];
  languages: string[];
  publishMode: "draft_only" | "paused_upload";
};

export const DEFAULT_ADS_CONFIG: AdsAutomationConfig = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL ?? "https://deepchq.app",
  dailyBudgetUsd: 50,
  geoTargets: ["US"],
  languages: ["en"],
  publishMode: "draft_only",
};

function titleToPlain(segments: { text: string; highlight?: boolean }[]): string {
  return segments.map((s) => s.text).join("");
}

function buildLandingUrl(
  baseUrl: string,
  platform: AdPlatform,
  campaign: string,
  content: string,
): string {
  const u = new URL(`${baseUrl.replace(/\/$/, "")}/ads/${platform}/step/1`);
  u.searchParams.set("utm_source", AD_PLATFORM_CONFIG[platform].defaultUtm.utm_source);
  u.searchParams.set("utm_medium", AD_PLATFORM_CONFIG[platform].defaultUtm.utm_medium);
  u.searchParams.set("utm_campaign", campaign);
  u.searchParams.set("utm_content", content);
  return u.toString();
}

export type GeneratedCampaignBundle = {
  generatedAt: string;
  brand: { name: string; supportEmail: string; visual: typeof BRAND_VISUAL };
  instagramOrganic: typeof INSTAGRAM_ORGANIC_REFERENCE;
  config: AdsAutomationConfig;
  platforms: Record<
    AdPlatform,
    {
      landingUrl: string;
      funnelCopy: ReturnType<typeof getFunnelCopy>;
      campaigns: unknown[];
    }
  >;
  reviewQueue: {
    id: string;
    platform: AdPlatform;
    name: string;
    status: "pending_human_approval";
    landingUrl: string;
    notes: string[];
  }[];
};

function getFunnelCopy(platform: AdPlatform) {
  const steps = AD_PLATFORM_CONFIG[platform].steps;
  return steps.map((s, i) => ({
    step: i + 1,
    headline: titleToPlain(s.title),
    body: s.subtitle,
    illustration: s.illustration,
  }));
}

function googleCampaigns(baseUrl: string, config: AdsAutomationConfig) {
  const ig = AD_PLATFORM_CONFIG.google;
  const landing = buildLandingUrl(baseUrl, "google", "search-people", "rsa-main");
  return [
    {
      name: `${BRAND_NAME} | Search | People Lookup`,
      status: "PAUSED",
      type: "SEARCH",
      dailyBudgetUsd: config.dailyBudgetUsd,
      geoTargets: config.geoTargets,
      finalUrl: landing,
      adGroups: [
        {
          name: "People Search - Generic",
          keywords: [
            { text: "find person online", match: "PHRASE" },
            { text: "people search", match: "PHRASE" },
            { text: "social media lookup", match: "PHRASE" },
            { text: "find social media profiles", match: "PHRASE" },
            { text: "reverse name search", match: "PHRASE" },
          ],
          responsiveSearchAd: {
            headlines: [
              titleToPlain(ig.steps[0].title),
              "AI People Search",
              `${BRAND_NAME} — Public Data`,
              titleToPlain(ig.steps[1].title),
              "Find Social Profiles",
            ],
            descriptions: [
              ig.steps[0].subtitle.slice(0, 90),
              ig.steps[1].subtitle.slice(0, 90),
              HOMEPAGE_REFERENCE.complianceShort,
            ],
            path1: "search",
            path2: "people",
          },
        },
        {
          name: "Brand",
          keywords: [
            { text: "deepchq", match: "EXACT" },
            { text: "deep chq", match: "PHRASE" },
          ],
          responsiveSearchAd: {
            headlines: [BRAND_NAME, `Official ${BRAND_NAME} Site`, "AI People Search"],
            descriptions: [HOMEPAGE_REFERENCE.heroSubline, HOMEPAGE_REFERENCE.complianceShort],
            path1: BRAND_NAME.toLowerCase(),
            path2: "app",
          },
        },
      ],
    },
  ];
}

function metaCampaigns(baseUrl: string, config: AdsAutomationConfig) {
  const ig = AD_PLATFORM_CONFIG.instagram;
  const landing = buildLandingUrl(baseUrl, "instagram", "ig-prospecting", "reels-v1");
  const stepCopy = getFunnelCopy("instagram");
  return [
    {
      name: `${BRAND_NAME} | IG | Prospecting`,
      status: "PAUSED",
      objective: "OUTCOME_LEADS",
      dailyBudgetUsd: config.dailyBudgetUsd,
      geoTargets: config.geoTargets,
      optimizationGoal: "LEAD",
      promotedObject: { pixel_event: "Lead" },
      finalUrl: landing,
      adSets: [
        {
          name: "US | 18-44 | Reels+Stories",
          placements: ["instagram_reels", "instagram_story", "instagram_feed"],
          targeting: {
            geo_locations: { countries: config.geoTargets },
            age_min: 18,
            age_max: 44,
          },
          ads: [
            {
              name: "Reel | Social Footprint",
              format: "VIDEO",
              primaryText: `${stepCopy[0].headline}\n\n${stepCopy[0].body}`,
              headline: stepCopy[0].headline,
              description: stepCopy[2].body,
              cta: "LEARN_MORE",
              videoBrief: {
                durationSec: 15,
                aspect: "9:16",
                source: "Screen record /ads/instagram/step/2 (radar)",
                overlayText: stepCopy[1].headline,
              },
              staticFallback: {
                aspect: "1:1",
                headline: stepCopy[0].headline,
                body: stepCopy[0].body,
                colors: BRAND_VISUAL,
              },
            },
            {
              name: "Carousel | 3-step value",
              format: "CAROUSEL",
              cards: stepCopy.map((s) => ({
                headline: s.headline,
                description: s.body,
                link: landing,
              })),
            },
            {
              name: "Story | 60 sec search",
              format: "STORY",
              primaryText: stepCopy[2].headline,
              sticker: "link",
              link: landing,
            },
          ],
        },
      ],
      organicAlignment: {
        reference: INSTAGRAM_ORGANIC_REFERENCE,
        rule: "Paid creative must use same colors, bio claims, and funnel headlines as organic profile.",
      },
    },
  ];
}

function snapCampaigns(baseUrl: string, config: AdsAutomationConfig) {
  const snap = AD_PLATFORM_CONFIG.snapchat;
  const landing = buildLandingUrl(baseUrl, "snapchat", "snap-prospecting", "story-v1");
  const stepCopy = getFunnelCopy("snapchat");
  return [
    {
      name: `${BRAND_NAME} | Snap | Prospecting`,
      status: "PAUSED",
      objective: "LEAD_GENERATION",
      dailyBudgetUsd: config.dailyBudgetUsd,
      geoTargets: config.geoTargets,
      finalUrl: landing,
      ads: stepCopy.map((s, i) => ({
        name: `Snap Ad | Step ${i + 1}`,
        type: i === 1 ? "VIDEO" : "IMAGE",
        headline: s.headline,
        brandName: BRAND_NAME,
        callToAction: "SIGN_UP",
        topSnap: {
          headline: s.headline,
          body: s.body,
          aspect: "9:16",
        },
      })),
    },
  ];
}

export function buildAutomationBundle(
  userConfig: Partial<AdsAutomationConfig> = {},
): GeneratedCampaignBundle {
  const config: AdsAutomationConfig = { ...DEFAULT_ADS_CONFIG, ...userConfig };
  const instagramOrganic = {
    ...INSTAGRAM_ORGANIC_REFERENCE,
    ...(userConfig.instagramHandle
      ? {
          handle: userConfig.instagramHandle,
          profileUrl: `https://www.instagram.com/${userConfig.instagramHandle.replace(/^@/, "")}`,
        }
      : {}),
  };

  const platforms = {
    google: {
      landingUrl: buildLandingUrl(config.baseUrl, "google", "search-people", "main"),
      funnelCopy: getFunnelCopy("google"),
      campaigns: googleCampaigns(config.baseUrl, config),
    },
    instagram: {
      landingUrl: buildLandingUrl(config.baseUrl, "instagram", "ig-prospecting", "main"),
      funnelCopy: getFunnelCopy("instagram"),
      campaigns: metaCampaigns(config.baseUrl, config),
    },
    snapchat: {
      landingUrl: buildLandingUrl(config.baseUrl, "snapchat", "snap-prospecting", "main"),
      funnelCopy: getFunnelCopy("snapchat"),
      campaigns: snapCampaigns(config.baseUrl, config),
    },
  } satisfies GeneratedCampaignBundle["platforms"];

  const reviewQueue: GeneratedCampaignBundle["reviewQueue"] = [];
  for (const platform of ["google", "instagram", "snapchat"] as AdPlatform[]) {
    const camps = platforms[platform].campaigns as { name: string; finalUrl: string }[];
    for (const c of camps) {
      reviewQueue.push({
        id: `${platform}-${c.name.replace(/\s+/g, "-").toLowerCase()}`,
        platform,
        name: c.name,
        status: "pending_human_approval",
        landingUrl: c.finalUrl,
        notes: [
          "Auto-generated as PAUSED — do not enable spend until approved.",
          config.publishMode === "draft_only"
            ? "Import manually or run API upload with PAUSED."
            : "API upload may create PAUSED entities only.",
          platform === "instagram"
            ? "Verify creative matches organic IG reference in brand-reference.json"
            : "",
        ].filter(Boolean),
      });
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    brand: {
      name: BRAND_NAME,
      supportEmail: SUPPORT_EMAIL,
      visual: BRAND_VISUAL,
    },
    instagramOrganic,
    config,
    platforms,
    reviewQueue,
  };
}
