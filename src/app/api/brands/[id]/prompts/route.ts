import { NextResponse } from "next/server";
import { z } from "zod";
import { requireBrand } from "@/lib/auth/guard";
import { db } from "@/lib/db/client";
import { newId } from "@/lib/id";
import { suggestPrompts } from "@/lib/geo/prompt-suggest";
import { HttpError, route } from "@/lib/http";
import { limitsFor } from "@/lib/plans";

type Ctx = { params: Promise<{ id: string }> };

const createSchema = z.object({
  text: z.string().trim().min(5, "Prompts need at least 5 characters").max(300),
  stage: z.enum(["tofu", "mofu", "bofu"]).default("tofu"),
});

const suggestSchema = z.object({
  action: z.literal("suggest"),
  keywords: z.array(z.string().trim().max(80)).default([]),
});

export const GET = route<Ctx>(async (_req, { params }) => {
  const { brand } = await requireBrand((await params).id);
  return NextResponse.json({ prompts: db.prompts.list(brand.id) });
});

export const POST = route<Ctx>(async (req, { params }) => {
  const { user, brand } = await requireBrand((await params).id);
  const limit = limitsFor(user).prompts;
  const existing = db.prompts.list(brand.id).length;
  const body = await req.json();

  if (body?.action === "suggest") {
    const { keywords } = suggestSchema.parse(body);
    const room = limit - existing;
    if (room <= 0) throw new HttpError(402, `Your plan tracks up to ${limit} prompts. Upgrade for more.`, { upgrade: true });
    const kws = keywords.filter(Boolean).length ? keywords : brand.keywords?.length ? brand.keywords : [brand.name];
    db.prompts.createMany(
      suggestPrompts(brand, kws)
        .slice(0, room)
        .map((s) => ({ id: newId("prompt"), brandId: brand.id, text: s.text, stage: s.stage, createdAt: new Date() })),
    );
    return NextResponse.json({ prompts: db.prompts.list(brand.id) });
  }

  if (existing >= limit) throw new HttpError(402, `Your plan tracks up to ${limit} prompts. Upgrade for more.`, { upgrade: true });
  const parsed = createSchema.parse(body);
  const prompt = { id: newId("prompt"), brandId: brand.id, text: parsed.text, stage: parsed.stage, createdAt: new Date() };
  db.prompts.create(prompt);
  return NextResponse.json({ prompt });
});

export const DELETE = route<Ctx>(async (req, { params }) => {
  const { brand } = await requireBrand((await params).id);
  const promptId = req.nextUrl.searchParams.get("promptId") ?? "";
  const prompt = db.prompts.get(promptId);
  if (!prompt || prompt.brandId !== brand.id) throw new HttpError(404, "Prompt not found.");
  db.prompts.delete(promptId);
  return NextResponse.json({ ok: true });
});
