import { NextResponse } from "next/server";
import { z } from "zod";
import { requireBrand } from "@/lib/auth/guard";
import { db } from "@/lib/db/client";
import { HttpError, route } from "@/lib/http";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({
  recId: z.string().max(64),
  status: z.enum(["todo", "in_progress", "done"]),
});

export const PATCH = route<Ctx>(async (req, { params }) => {
  const { brand } = await requireBrand((await params).id);
  const body = schema.parse(await req.json());
  if (!db.recommendations.updateStatus(brand.id, body.recId, body.status)) {
    throw new HttpError(404, "Recommendation not found.");
  }
  return NextResponse.json({ ok: true, recommendations: db.recommendations.list(brand.id) });
});
