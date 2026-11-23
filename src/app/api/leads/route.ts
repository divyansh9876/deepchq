import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { esc, notifyAdmin } from "@/lib/email";
import { newId } from "@/lib/id";
import { clientIp, rateLimit, route } from "@/lib/http";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(120).default(""),
  plan: z.string().trim().max(40).default(""),
  message: z.string().trim().min(1).max(4000),
  source: z.string().trim().max(60).default("contact"),
  website: z.string().max(500).optional(), // honeypot — bots fill it, humans never see it
});

export const POST = route(async (req) => {
  rateLimit(`lead:${clientIp(req)}`, 5, 60 * 60_000);
  const body = schema.parse(await req.json());
  if (body.website) return NextResponse.json({ ok: true }); // silently drop bot submissions
  const lead = { id: newId("lead"), ...body, email: body.email.toLowerCase(), createdAt: new Date() };
  delete (lead as { website?: string }).website;
  db.leads.create(lead);
  await notifyAdmin(
    `New lead: ${body.company || body.name}${body.plan ? ` (${body.plan})` : ""}`,
    `<p><b>${esc(body.name)}</b> &lt;${esc(body.email)}&gt;<br>${esc(body.company)}<br>Plan: ${esc(body.plan || "—")}</p><p style="white-space:pre-wrap">${esc(body.message)}</p>`,
    body.email,
  );
  return NextResponse.json({ ok: true });
});
