import type { EngineId } from "@/lib/brand";

export type User = {
  id: string;
  email: string;
  passwordHash: string | null;
  name: string;
  planTier: "free" | "starter" | "pro";
  createdAt: Date;
};

export type Brand = {
  id: string;
  userId: string;
  name: string;
  domain: string;
  competitors: string[];
  country: string;
  createdAt: Date;
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
  createdAt: Date;
};

export type AuditCheck = {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  impact: "high" | "medium" | "low";
  detail: string;
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
};
