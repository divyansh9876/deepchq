import { cookies } from "next/headers";
import { db } from "@/lib/db/client";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  if (!userId) return null;
  return db.users.get(userId);
}

export function authCookieOptions(maxAge = 86400 * 30) {
  return {
    httpOnly: true,
    path: "/",
    maxAge,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}
