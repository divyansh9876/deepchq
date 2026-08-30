import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { newId } from "@/lib/id";
import { authCookieOptions } from "@/lib/auth/session";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
});

function hash(pw: string) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

export async function POST(req: NextRequest) {
  const body = schema.parse(await req.json());
  const id = newId("usr");

  try {
    db.users.create({
      id,
      email: body.email.toLowerCase(),
      passwordHash: hash(body.password),
      name: body.name ?? body.email.split("@")[0],
      planTier: "free",
      createdAt: new Date(),
    });
  } catch {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }

  const res = NextResponse.json({ userId: id });
  res.cookies.set("user_id", id, authCookieOptions());
  return res;
}
