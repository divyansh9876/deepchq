import { NextRequest, NextResponse } from "next/server";
import { dbClient } from "@/lib/db";
import { z } from "zod";
import crypto from "crypto";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(req: NextRequest) {
  const body = schema.parse(await req.json());
  const user = dbClient.users.getByEmail(body.email);

  if (!user?.passwordHash || user.passwordHash !== hashPassword(body.password)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const res = NextResponse.json({
    userId: user.id,
    email: user.email,
    planTier: user.planTier,
  });
  res.cookies.set("user_id", user.id, { httpOnly: true, path: "/", maxAge: 86400 * 30 });
  return res;
}
