export const BRAND_NAME = "Deepchq";
export const BRAND_TAGLINE = "AI Search Visibility & GEO Platform";
export const BRAND_DESCRIPTION =
  "Track brand mentions, citations, and visibility across ChatGPT, Perplexity, Google AI, Gemini, and more.";

export const AI_ENGINES = [
  { id: "chatgpt", name: "ChatGPT", color: "#10a37f" },
  { id: "perplexity", name: "Perplexity", color: "#20808d" },
  { id: "google_aio", name: "Google AI Overview", color: "#4285f4" },
  { id: "gemini", name: "Gemini", color: "#8e75b2" },
  { id: "claude", name: "Claude", color: "#d97757" },
  { id: "copilot", name: "Microsoft Copilot", color: "#0078d4" },
] as const;

export type EngineId = (typeof AI_ENGINES)[number]["id"];
