# Deepchq

AI-powered people search from public sources.

## Features

- **Google Ads funnel** (`/landing4/step1` → step4) with UTM/`gclid` capture
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

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | JSON store path (default `./data/deepchq.json`) |
| `SERPER_API_KEY` | Optional real web search; mock data when unset |
| `ALLOW_DEV_UNLOCK=true` | Unlock reports without Stripe in development |
| `STRIPE_SECRET_KEY` | Enable real checkout |

## Key routes

| Path | Description |
|------|-------------|
| `/` | Marketing homepage |
| `/landing4/step1-4` | Ad conversion funnel |
| `/landing/register` | Sign up |
| `/dashboard` | Search + history |
| `/search/[id]` | Live scan + report |
| `/pricing` | Plans |

## Legal

Public sources only. Not for FCRA-regulated use (employment, credit, tenant screening).
