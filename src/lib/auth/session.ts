import crypto from "crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { isProd, sessionSecret } from "@/lib/env";

export const SESSION_COOKIE = "dq_session";
const MAX_AGE = 60 * 60 * 24 * 30;

function sign(payload: string) {
  return crypto.createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function createSessionToken(userId: string, ttlSeconds = MAX_AGE) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${userId}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, expRaw, sig] = parts;
  const expected = sign(`${userId}.${expRaw}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  if (Number(expRaw) < Math.floor(Date.now() / 1000)) return null;
  return userId;
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const userId = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!userId) return null;
  return db.users.get(userId);
}

export function setSessionCookie(res: NextResponse, userId: string) {
  res.cookies.set(SESSION_COOKIE, createSessionToken(userId), {
    httpOnly: true,
    path: "/",
    maxAge: MAX_AGE,
    sameSite: "lax",
    secure: isProd,
  });
  // Clear the old unsigned cookie from earlier versions.
  res.cookies.set("user_id", "", { path: "/", maxAge: 0 });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set("user_id", "", { path: "/", maxAge: 0 });
}
