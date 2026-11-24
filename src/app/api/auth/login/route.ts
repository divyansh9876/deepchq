import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { clientIp, rateLimit, route } from "@/lib/http";

const schema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(1).max(200),
});

export const POST = route(async (req) => {
  rateLimit(`login:${clientIp(req)}`, 10, 15 * 60_000);
  const body = schema.parse(await req.json());
  rateLimit(`login-email:${body.email.toLowerCase()}`, 8, 15 * 60_000);
  const user = db.users.getByEmail(body.email);
  const { ok, needsRehash } = verifyPassword(body.password, user?.passwordHash ?? null);
  if (!user || !ok) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  if (needsRehash) db.users.update(user.id, { passwordHash: hashPassword(body.password) });

  const res = NextResponse.json({ userId: user.id, email: user.email });
  setSessionCookie(res, user.id);
  return res;
});
