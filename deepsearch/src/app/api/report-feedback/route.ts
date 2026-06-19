import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  searchId: z.string().optional(),
  email: z.string().email().optional(),
  message: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  const body = schema.parse(await req.json());
  console.info("[report-feedback]", body);
  return NextResponse.json({
    ok: true,
    message: "Thank you. We review inaccuracy reports regularly.",
  });
}
