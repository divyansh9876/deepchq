import { dbClient } from "@/lib/db";

/** Attach guest/funnel searches to the signed-in user (email match or last_search cookie). */
export function claimSearchesForUser(
  userId: string,
  email: string,
  lastSearchId?: string | null,
): number {
  const emailNorm = email.trim().toLowerCase();
  return dbClient.searches.claimForUser(userId, emailNorm, lastSearchId ?? undefined);
}
