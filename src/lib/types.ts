export type SearchMode = "search" | "research";

export type SearchStatus =
  | "queued"
  | "planning"
  | "searching"
  | "extracting"
  | "synthesizing"
  | "completed"
  | "failed";

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
}

export interface SearchEventPayload {
  message?: string;
  sourcesScanned?: number;
  step?: string;
  plan?: string[];
  error?: string;
}
