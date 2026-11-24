# Deepchq

**AI search visibility & GEO platform.** Deepchq tracks whether ChatGPT, Perplexity, Google AI Overviews, Gemini, Claude and Copilot mention and cite a brand, measures share of voice against competitors, audits sites for AI-crawler readiness, and runs the whole loop automatically.

## What runs automatically

| When | What happens |
| --- | --- |
| User signs up | Welcome email, admin alert, optional 14-day Growth trial (`/register?plan=growth`) |
| Brand is added | Starter prompts generated → site audited → first multi-engine scan → action plan |
| Every 30 min (scheduler) | Brands that are due get re-scanned (Free: 30 days, Growth: 7, Agency: daily); audits refresh weekly; recommendations regenerate (progress kept) |
| After a scheduled scan | Email digest with visibility change and next action |
| Trial ends | Reminder 3 days before, automatic downgrade to Free, email |
| Payment / cancellation | Razorpay webhook upgrades or downgrades the plan and emails the user |
| Contact form / audit email capture | Lead saved and emailed to `ADMIN_EMAIL` |

## Acquisition (SEO / GEO)

- **Free tools**: `/tools/geo-audit` (no-signup audit with a shareable `/report/:id`) and `/tools/llms-txt-generator`
- **Content**: 11 answer-first guides (`/learn`), 6 engine pages (`/ai-visibility`), 5 industry pages (`/for`), 21 glossary terms (`/glossary`), all generated from `src/content/*`
- **Machine-readable**: `sitemap.xml`, `robots.txt` (all AI crawlers welcome), `llms.txt`, `llms-full.txt`, JSON-LD (Organization, WebSite, SoftwareApplication, Article, FAQPage, BreadcrumbList, DefinedTerm), per-page canonical + OG images

Add a guide by appending to `src/content/guides.ts`; sitemap, llms.txt and schema update automatically.

## Data: live vs estimated

ChatGPT (OpenAI), Perplexity (Sonar), Gemini (with Google Search grounding) and Claude (Anthropic) are queried live when their API key is set. Google AI Overviews and Copilot have no public answer API, and any engine without a key falls back to a deterministic estimate. Estimated rows are always labelled **Estimated** in the UI and CSV.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill SESSION_SECRET at minimum
npm run dev
```

Set `ENABLE_INTERNAL_CRON=true` to run the scheduler in dev.

## Deploy (Render)

1. **New → Blueprint** → select this repo. `render.yaml` provisions one Docker web service with a 1 GB disk and generates `SESSION_SECRET` and `CRON_SECRET`.
2. Set `NEXT_PUBLIC_SITE_URL` to your real domain (it is baked into the sitemap and canonical URLs at build time).
3. Add whichever engine keys you have, plus Resend (`RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAIL`).
4. Billing: in Razorpay create four subscription plans (Growth/Agency × monthly/annual, USD), set their IDs and keys, and add a webhook to `https://YOUR_DOMAIN/api/billing/webhook` for `subscription.*` events with `RAZORPAY_WEBHOOK_SECRET`.
5. Verify the domain in Google Search Console and Bing Webmaster Tools (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION`) and submit `/sitemap.xml`.

Keep **one instance**: the JSON database and the in-process scheduler assume a single server. An external scheduler can call `POST /api/cron/run` with `Authorization: Bearer $CRON_SECRET` instead (set `ENABLE_INTERNAL_CRON=false`).

## Security

Signed HMAC session cookies, scrypt password hashing (legacy hashes upgrade on login), per-IP and per-account rate limits, SSRF-safe fetching for audits (private ranges and redirects re-checked), ownership checks on every brand route, CSV formula-injection escaping, honeypot on lead forms, HSTS / frame-deny / nosniff headers.
