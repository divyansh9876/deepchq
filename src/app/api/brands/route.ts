import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/guard";
import { db } from "@/lib/db/client";
import { newId } from "@/lib/id";
import { suggestPrompts } from "@/lib/geo/prompt-suggest";
import { HttpError, route } from "@/lib/http";
import { limitsFor } from "@/lib/plans";
import { runBrandCycle } from "@/lib/automation/cycle";
import { bareDomain } from "@/lib/geo/engines";

const createSchema = z.object({
  name: z.string().trim().min(1).max(80),
  domain: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .refine((d) => /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(bareDomain(d)), "Enter a domain like acme.com"),
  competitors: z.array(z.string().trim().max(80)).default([]),
  country: z.string().trim().max(40).default("US"),
  keywords: z.array(z.string().trim().max(80)).optional(),
  autoPrompts: z.boolean().default(true),
});

export const GET = route(async () => {
  const user = await requireUser();
  const brands = db.brands.list(user.id).map((b) => {
    const hist = db.scanResults.history(b.id, 8);
    return { ...b, history: hist, visibility: hist.at(-1)?.visibilityRate ?? null };
  });
  return NextResponse.json({ brands });
});

export const POST = route(async (req) => {
  const user = await requireUser();
  const limits = limitsFor(user);
  if (db.brands.list(user.id).length >= limits.brands) {
    throw new HttpError(402, `Your plan includes ${limits.brands} brand${limits.brands === 1 ? "" : "s"}. Upgrade to track more.`, {
      upgrade: true,
    });
  }

  const body = createSchema.parse(await req.json());
  const id = newId("brand");
  const keywords = (body.keywords ?? []).filter(Boolean);
  const brand = {
    id,
    userId: user.id,
    name: body.name,
    domain: bareDomain(body.domain),
    competitors: [...new Set(body.competitors.filter(Boolean))].slice(0, 8),
    country: body.country,
    keywords,
    autoScan: true,
    createdAt: new Date(),
  };
  db.brands.create(brand);

  if (body.autoPrompts) {
    const suggestions = suggestPrompts(brand, keywords.length ? keywords : [body.name]);
    db.prompts.createMany(
      suggestions.slice(0, limits.prompts).map((s) => ({
        id: newId("prompt"),
        brandId: id,
        text: s.text,
        stage: s.stage,
        createdAt: new Date(),
      })),
    );
  }

  // Onboarding automation: audit + first scan start immediately in the background.
  void runBrandCycle(brand, user).catch((e) => console.warn("[onboarding] first cycle failed", id, e));

  return NextResponse.json({ brand });
});
