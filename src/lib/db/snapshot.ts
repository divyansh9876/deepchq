import { readDbSnapshot } from "./client";

/** Read-only DB snapshot for server-side analytics (do not mutate). */
export function getDbSnapshot() {
  return readDbSnapshot();
}
