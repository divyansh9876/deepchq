import { NextRequest, NextResponse } from "next/server";
import { dbClient } from "@/lib/db";
import { newId } from "@/lib/id";
import { runPeopleSearch } from "@/lib/search/orchestrator";
import { listSearches } from "@/lib/search/store";
import { getSessionUser } from "@/lib/auth/session";
import { z } from "zod";

const createSchema = z.object({
  queryName: z.string().min(2),
  queryEmail: z.string().email().optional(),
  mode: z.enum(["search", "research"]).default("search"),
  funnelSessionId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = createSchema.parse(await req.json());
  const user = await getSessionUser();
  const id = newId("srch");
  const now = new Date();

  dbClient.searches.create({
    id,
    userId: user?.id ?? null,
    funnelSessionId: body.funnelSessionId ?? null,
    queryName: body.queryName,
    queryEmail: body.queryEmail ?? null,
    mode: body.mode,
    status: "queued",
    createdAt: now,
    completedAt: null,
  });

  void runPeopleSearch(id, body.queryName, body.mode);

  const res = NextResponse.json({ searchId: id, status: "queued" });
  res.cookies.set("last_search", id, { path: "/", maxAge: 86400 });
  return res;
}

export async function GET() {
  const user = await getSessionUser();
  const rows = await listSearches(user?.id);
  return NextResponse.json({ searches: rows });
}
