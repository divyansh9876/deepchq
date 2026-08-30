import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";

type Params = { params: Promise<{ id: string }> };

const schema = z.object({
  recId: z.string(),
  status: z.enum(["todo", "in_progress", "done"]),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const brand = db.brands.get(id);
  if (!brand || brand.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = schema.parse(await req.json());
  db.recommendations.updateStatus(body.recId, body.status);
  return NextResponse.json({ ok: true, recommendations: db.recommendations.list(id) });
}
