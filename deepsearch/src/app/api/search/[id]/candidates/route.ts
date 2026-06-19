import { NextResponse } from "next/server";
import { dbClient } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const rows = dbClient.candidates.listBySearch(id);
  return NextResponse.json({ candidates: rows });
}
