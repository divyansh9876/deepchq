import { BRAND_NAME } from "@/lib/brand";
import { ADMIN_EMAIL, SITE_URL, flags } from "@/lib/env";

type Mail = { to: string; subject: string; html: string; replyTo?: string };

/** Sends through Resend when configured; otherwise logs so local dev and previews never fail. */
export async function sendEmail(mail: Mail): Promise<boolean> {
  if (!flags.email()) {
    console.info(`[email:disabled] to=${mail.to} subject="${mail.subject}"`);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [mail.to],
        subject: mail.subject,
        html: mail.html,
        reply_to: mail.replyTo,
      }),
    });
    if (!res.ok) console.warn("[email] send failed", res.status, (await res.text()).slice(0, 200));
    return res.ok;
  } catch (err) {
    console.warn("[email] send error", (err as Error).message);
    return false;
  }
}

export async function notifyAdmin(subject: string, html: string, replyTo?: string) {
  if (!ADMIN_EMAIL) return false;
  return sendEmail({ to: ADMIN_EMAIL, subject: `[${BRAND_NAME}] ${subject}`, html, replyTo });
}

export function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function layout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:Inter,Segoe UI,Arial,sans-serif;color:#0f172a">
<div style="max-width:560px;margin:0 auto;padding:32px 20px">
  <p style="font-weight:700;font-size:18px;margin:0 0 24px"><span style="display:inline-block;background:#5a36f0;color:#fff;border-radius:8px;width:28px;height:28px;text-align:center;line-height:28px;margin-right:8px">D</span>${BRAND_NAME}</p>
  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:28px">
    <h1 style="font-size:20px;margin:0 0 16px">${title}</h1>
    ${body}
  </div>
  <p style="font-size:12px;color:#94a3b8;margin-top:20px">You get this because you have a ${BRAND_NAME} account. Manage emails in <a href="${SITE_URL}/settings" style="color:#5a36f0">settings</a>.</p>
</div></body></html>`;
}

export function button(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;background:#5a36f0;color:#fff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:10px;margin-top:16px">${esc(label)}</a>`;
}
