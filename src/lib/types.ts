export type SearchMode = "search" | "research";

export type SearchStatus =
  | "queued"
  | "planning"
  | "searching"
  | "extracting"
  | "synthesizing"
  | "completed"
  | "failed";

export interface SocialProfile {
  platform: string;
  label: string;
  handle: string;
  url: string;
}

export interface ReportSection {
  id: string;
  title: string;
  items: { text: string; sourceUrl?: string }[];
}

export interface PersonReport {
  queryName: string;
  sourcesScanned: number;
  sections: ReportSection[];
  aiSummary?: string;
  generatedAt: string;
  /** e.g. "Youtuber · United States" */
  subtitle?: string;
  /** Long-form bio paragraph */
  biography?: string;
  /** Unique domains for source chips */
  sourceDomains?: string[];
  peopleAlsoAsk?: string[];
  socialProfiles?: SocialProfile[];
  /** Show "Find with AI" clarifying questions */
  lowConfidence?: boolean;
}

export interface SearchEventPayload {
  message?: string;
  sourcesScanned?: number;
  step?: string;
  plan?: string[];
  error?: string;
}
