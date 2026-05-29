import { NextRequest, NextResponse } from "next/server";
import { dbClient } from "@/lib/db";
import { newId } from "@/lib/id";
import { z } from "zod";

const createSchema = z.object({
  utm: z.record(z.string()).optional(),
  gclid: z.string().optional(),
});

const patchSchema = z.object({
  sessionId: z.string(),
  step: z.number().int().min(1).max(10).optional(),
  fullName: z.string().optional(),
  email: z.string().email().optional(),
});

export async function POST(req: NextRequest) {
  const body = createSchema.parse(await req.json().catch(() => ({})));
  const id = newId("fs");
  const now = new Date();

  dbClient.funnel.create({
    id,
    step: 1,
    fullName: null,
    email: null,
    utmJson: body.utm ? JSON.stringify(body.utm) : null,
    gclid: body.gclid ?? null,
    createdAt: now,
    updatedAt: now,
  });

  const res = NextResponse.json({ sessionId: id, step: 1 });
  res.cookies.set("funnel_session", id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function PATCH(req: NextRequest) {
  const body = patchSchema.parse(await req.json());
  const patch: Parameters<typeof dbClient.funnel.update>[1] = {
    updatedAt: new Date(),
  };
  if (body.step != null) patch.step = body.step;
  if (body.fullName != null) patch.fullName = body.fullName;
  if (body.email != null) patch.email = body.email;

  dbClient.funnel.update(body.sessionId, patch);
  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const id =
    req.nextUrl.searchParams.get("sessionId") ??
    req.cookies.get("funnel_session")?.value;
  if (!id) return NextResponse.json({ session: null });
  const session = dbClient.funnel.get(id);
  return NextResponse.json({ session: session ?? null });
}
