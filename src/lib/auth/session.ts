import { cookies } from "next/headers";
import { dbClient } from "@/lib/db";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  if (!userId) return null;
  return dbClient.users.get(userId);
}

export function hasPaidAccess(planTier: string) {
  return planTier === "basic" || planTier === "pro";
}
