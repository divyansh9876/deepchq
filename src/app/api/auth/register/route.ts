import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { newId } from "@/lib/id";
import { hashPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { clientIp, HttpError, rateLimit, route } from "@/lib/http";
import { button, esc, layout, notifyAdmin, sendEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/env";
import { TRIAL_DAYS } from "@/lib/plans";

const schema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(8, "Use at least 8 characters").max(200),
  name: z.string().trim().max(100).optional(),
  plan: z.enum(["free", "growth", "agency"]).optional(),
});

export const POST = route(async (req) => {
  rateLimit(`register:${clientIp(req)}`, 5, 60 * 60_000);
  const body = schema.parse(await req.json());
  const email = body.email.toLowerCase();
  const id = newId("usr");
  const trial = body.plan === "growth";

  try {
    db.users.create({
      id,
      email,
      passwordHash: hashPassword(body.password),
      name: body.name || email.split("@")[0],
      planTier: trial ? "growth" : "free",
      trialEndsAt: trial ? new Date(Date.now() + TRIAL_DAYS * 86400_000) : null,
      digestEnabled: true,
      createdAt: new Date(),
    });
  } catch {
    throw new HttpError(400, "That email is already registered. Try logging in.");
  }

  void sendEmail({
    to: email,
    subject: "Welcome to Deepchq — your first AI visibility report",
    html: layout(
      "Welcome to Deepchq",
      `<p style="color:#475569">Add your brand and we'll generate starter prompts, audit your site for AI crawlers, and run your first scan automatically.${
        trial ? ` Your ${TRIAL_DAYS}-day Growth trial is active — all six engines included.` : ""
      }</p>${button(`${SITE_URL}/dashboard`, "Add your brand")}`,
    ),
  });
  void notifyAdmin("New signup", `<p>${esc(email)} signed up (${trial ? "Growth trial" : "free"}).</p>`);

  const res = NextResponse.json({ userId: id });
  setSessionCookie(res, id);
  return res;
});
