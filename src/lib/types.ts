import type { EngineId } from "@/lib/brand";

export type User = {
  id: string;
  email: string;
  passwordHash: string | null;
  name: string;
  planTier: PlanId;
  createdAt: Date;
  trialEndsAt?: Date | null;
  subscriptionId?: string | null;
  subscriptionStatus?: string | null;
  pendingPlan?: PlanId | null;
  planRenewsAt?: Date | null;
  digestEnabled?: boolean;
  lastDigestAt?: Date | null;
};

export type PlanId = "free" | "growth" | "agency";

export type Brand = {
  id: string;
  userId: string;
  name: string;
  domain: string;
  competitors: string[];
  country: string;
  createdAt: Date;
  keywords?: string[];
  autoScan?: boolean;
  lastScanAt?: Date | null;
  lastAuditAt?: Date | null;
};

export type PromptStage = "tofu" | "mofu" | "bofu";

export type Prompt = {
  id: string;
  brandId: string;
  text: string;
  stage: PromptStage;
  createdAt: Date;
};

export type ScanResult = {
  id: string;
  brandId: string;
  promptId: string;
  engine: EngineId;
  mentioned: boolean;
  cited: boolean;
  position: number | null;
  sentiment: "positive" | "neutral" | "negative" | null;
  competitorsMentioned: string[];
  sources: string[];
  answerSnippet: string;
  /** true when the answer came from the engine's real API, false when estimated */
  live?: boolean;
  runId?: string;
  createdAt: Date;
};

export type AuditCheck = {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  impact: "high" | "medium" | "low";
  detail: string;
  fix?: string;
  guide?: string;
};

export type GeoAudit = {
  id: string;
  brandId: string;
  url: string;
  overallScore: number;
  crawlabilityScore: number;
  contentScore: number;
  checks: AuditCheck[];
  createdAt: Date;
};

export type RecommendationStatus = "todo" | "in_progress" | "done";

export type Recommendation = {
  id: string;
  brandId: string;
  type: string;
  area: "on-page" | "off-page" | "general";
  impact: "high" | "medium" | "low";
  engine: EngineId | "all";
  title: string;
  description: string;
  status: RecommendationStatus;
  createdAt: Date;
};

export type BrandMetrics = {
  visibilityRate: number;
  citationRate: number;
  mentionCount: number;
  promptCount: number;
  engineBreakdown: Record<
    EngineId,
    { mentions: number; citations: number; total: number }
  >;
  competitorShare: { name: string; mentions: number }[];
  /** % of result rows that came from a live engine API (rest are estimates) */
  liveShare: number;
  avgPosition: number | null;
  sentiment: { positive: number; neutral: number; negative: number };
};

export type Lead = {
  id: string;
  email: string;
  name: string;
  company: string;
  plan: string;
  message: string;
  source: string;
  createdAt: Date;
};

export type PublicAudit = GeoAudit & {
  domain: string;
  email?: string | null;
};

export type VisibilityPoint = {
  runId: string;
  at: Date;
  visibilityRate: number;
  citationRate: number;
};
