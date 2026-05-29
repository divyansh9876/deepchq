# Deepchq

AI-powered people search from public sources.

## Features

- **Paid ad funnels** — Google, Instagram, Snapchat (`/ads/{platform}/step/1` → 4) with UTM + `gclid` / `fbclid` / Snap click ID capture; legacy Google path `/landing4/step1`
- **Marketing homepage** — dark hero search, use cases, FAQ
- **Registration & login** — email/password (+ OAuth placeholders)
- **People search pipeline** — SSE scan progress, structured report sections
- **Deep Research mode** — extended queries + critique pass
- **Blurred preview + unlock** — subscription gate (Stripe or dev mock)
- **Markdown export**
- **Docker** deployment
- **Android (Capacitor)** wrapper for Google Play

## Quick start (local)

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docker deploy

```bash
cp .env.docker.example .env
# Set NEXT_PUBLIC_APP_URL=https://your-domain.com
docker compose build && docker compose up -d
```

See [docs/DOCKER.md](docs/DOCKER.md) for production and reverse-proxy notes.

## Deploy on Render

1. Push to GitHub (see below).
2. [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint** → select repo.
3. Set `NEXT_PUBLIC_APP_URL` to your Render URL and redeploy.

Details: [docs/RENDER.md](docs/RENDER.md).

Ad campaign URLs, UTMs, and pixel mapping: [docs/MARKETING-ADS.md](docs/MARKETING-ADS.md).

Automated ad generation (manual publish gate): [docs/AD-AUTOMATION-PLAYBOOK.md](docs/AD-AUTOMATION-PLAYBOOK.md) — run `npm run ads:generate`.

## Push to a new GitHub repo

```bash
cd ~/Projects/deepsearch
git add .
git commit -m "Initial Deepchq app"
gh repo create deepchq --public --source=. --remote=origin --push
```

Use `--private` instead of `--public` if you prefer a private repo.

## Google Play (Android)

The `mobile/` folder is a **Capacitor** app that wraps your **hosted** Docker URL in a WebView.

```bash
cd mobile && cp .env.example .env
# CAPACITOR_SERVER_URL=https://your-domain.com
chmod +x scripts/sync-android.sh && ./scripts/sync-android.sh
```

Full Play Console checklist: [mobile/README.md](mobile/README.md).

## Environment

Full setup: **[docs/ENV-SETUP.md](docs/ENV-SETUP.md)** · Where to paste keys: **[docs/WHERE-TO-PUT-KEYS.md](docs/WHERE-TO-PUT-KEYS.md)** · Fill-in file: `cp config/env.values.template config/env.values`

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_APP_URL` | **Required** — public HTTPS URL; redeploy after changing |
| `DATABASE_URL` | JSON store path (default `./data/deepchq.json`) |
| `ALLOW_DEV_UNLOCK` | `true` locally; **`false` in production** |
| `SERPER_API_KEY` | Optional real web search; mock data when unset |
| `STRIPE_SECRET_KEY` + `STRIPE_PRICE_*` + `STRIPE_WEBHOOK_SECRET` | Real paid subscriptions |

## Key routes

| Path | Description |
|------|-------------|
| `/` | Marketing homepage |
| `/ads/google\|instagram\|snapchat/step/1-4` | Platform ad funnels |
| `/landing4/step1-4` | Legacy Google Ads funnel |
| `/landing/register` | Sign up |
| `/dashboard` | Search + history |
| `/search/[id]` | Live scan + report |
| `/pricing` | Plans |

## Legal

Public sources only. Not for FCRA-regulated use (employment, credit, tenant screening).
