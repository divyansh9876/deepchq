import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { newId } from "@/lib/id";
import { suggestPrompts } from "@/lib/geo/prompt-suggest";

type Params = { params: Promise<{ id: string }> };

const createSchema = z.object({
  text: z.string().min(5),
  stage: z.enum(["tofu", "mofu", "bofu"]).default("tofu"),
});

export async function GET(_req: NextRequest, { params }: Params) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const brand = db.brands.get(id);
  if (!brand || brand.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ prompts: db.prompts.list(id) });
}

export async function POST(req: NextRequest, { params }: Params) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const brand = db.brands.get(id);
  if (!brand || brand.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();

  if (body.action === "suggest") {
    const keywords = z.array(z.string()).parse(body.keywords ?? []);
    const suggestions = suggestPrompts(brand, keywords);
    for (const s of suggestions) {
      db.prompts.create({
        id: newId("prompt"),
        brandId: id,
        text: s.text,
        stage: s.stage,
        createdAt: new Date(),
      });
    }
    return NextResponse.json({ prompts: db.prompts.list(id) });
  }

  const parsed = createSchema.parse(body);
  const prompt = {
    id: newId("prompt"),
    brandId: id,
    text: parsed.text,
    stage: parsed.stage,
    createdAt: new Date(),
  };
  db.prompts.create(prompt);
  return NextResponse.json({ prompt });
}
