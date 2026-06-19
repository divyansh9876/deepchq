import { NextRequest, NextResponse } from "next/server";
import { dbClient } from "@/lib/db";
import { newId } from "@/lib/id";
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
  const id = newId("usr");

  try {
    dbClient.users.create({
      id,
      email: body.email,
      passwordHash: hashPassword(body.password),
      authProvider: "email",
      stripeCustomerId: null,
      planTier: "free",
      createdAt: new Date(),
    });
  } catch {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }

  const res = NextResponse.json({ userId: id, email: body.email });
  res.cookies.set("user_id", id, { httpOnly: true, path: "/", maxAge: 86400 * 30 });
  return res;
}
