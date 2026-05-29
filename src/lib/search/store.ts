import { dbClient } from "@/lib/db";
import type { PersonReport } from "@/lib/types";

export async function getSearch(searchId: string) {
  return dbClient.searches.get(searchId);
}

export async function getSearchEvents(searchId: string) {
  return dbClient.searchEvents.listBySearch(searchId);
}

export async function getReport(
  searchId: string,
  unlockedOnly = false,
): Promise<PersonReport | null> {
  const rows = dbClient.artifacts.listBySearch(searchId);
  const json = rows.find((r) => r.format === "json");
  if (!json) return null;
  if (unlockedOnly && !json.unlocked) return null;
  return JSON.parse(json.body) as PersonReport;
}

export async function getMarkdownArtifact(searchId: string) {
  const rows = dbClient.artifacts.listBySearch(searchId);
  return rows.find((r) => r.format === "markdown") ?? null;
}

export async function unlockReport(searchId: string) {
  dbClient.artifacts.unlock(searchId);
}

export async function listSearches(userId?: string | null, limit = 20) {
  return dbClient.searches.list(userId, limit);
}

export async function listSources(searchId: string) {
  return dbClient.sources.listBySearch(searchId);
}
