import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { authCookieOptions } from "@/lib/auth/session";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function hash(pw: string) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

export async function POST(req: NextRequest) {
  const body = schema.parse(await req.json());
  const user = db.users.getByEmail(body.email);

  if (!user?.passwordHash || user.passwordHash !== hash(body.password)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const res = NextResponse.json({ userId: user.id, email: user.email });
  res.cookies.set("user_id", user.id, authCookieOptions());
  return res;
}
