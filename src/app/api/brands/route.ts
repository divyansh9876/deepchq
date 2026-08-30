import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { newId } from "@/lib/id";
import { suggestPrompts } from "@/lib/geo/prompt-suggest";

const createSchema = z.object({
  name: z.string().min(1),
  domain: z.string().min(3),
  competitors: z.array(z.string()).default([]),
  country: z.string().default("IN"),
  keywords: z.array(z.string()).optional(),
  autoPrompts: z.boolean().default(true),
});

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ brands: db.brands.list(user.id) });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = createSchema.parse(await req.json());
  const id = newId("brand");
  const brand = {
    id,
    userId: user.id,
    name: body.name,
    domain: body.domain.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    competitors: body.competitors.filter(Boolean).slice(0, 5),
    country: body.country,
    createdAt: new Date(),
  };

  db.brands.create(brand);

  if (body.autoPrompts) {
    const suggestions = suggestPrompts(brand, body.keywords ?? [body.name]);
    for (const s of suggestions.slice(0, 8)) {
      db.prompts.create({
        id: newId("prompt"),
        brandId: id,
        text: s.text,
        stage: s.stage,
        createdAt: new Date(),
      });
    }
  }

  return NextResponse.json({ brand });
}
