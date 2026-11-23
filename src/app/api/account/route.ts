import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/guard";
import { db } from "@/lib/db/client";
import { route } from "@/lib/http";

const schema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  digestEnabled: z.boolean().optional(),
});

export const PATCH = route(async (req) => {
  const user = await requireUser();
  const body = schema.parse(await req.json());
  db.users.update(user.id, body);
  return NextResponse.json({ ok: true });
});
