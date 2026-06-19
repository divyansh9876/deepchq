# Deploy Deepchq on Render

## Option A — Blueprint (recommended)

1. Push this repo to GitHub (see README).
2. Open [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**.
3. Connect the `deepchq` repository.
4. Render reads [`render.yaml`](../render.yaml) and creates the web service + disk.
5. After the first deploy, set environment variables in the service **Environment** tab:
   - `NEXT_PUBLIC_APP_URL` = your Render URL, e.g. `https://deepchq.onrender.com`
   - Optional: `SERPER_API_KEY`, `STRIPE_*`, etc.
6. **Redeploy** once `NEXT_PUBLIC_APP_URL` is set (required for auth redirects).

## Option B — Manual Docker web service

1. **New** → **Web Service** → connect GitHub repo.
2. **Runtime**: Docker.
3. **Dockerfile path**: `./Dockerfile`.
4. Add a **Disk**: mount `/app/data` (1 GB) for the JSON database.
5. Set the same env vars as in `render.yaml`.

## Stripe webhooks

Use: `https://YOUR-SERVICE.onrender.com/api/webhooks/stripe`

## Mobile app

Set `CAPACITOR_SERVER_URL` in `mobile/.env` to your Render HTTPS URL.

## Free tier notes

- Service spins down after inactivity (cold starts ~30–60s).
- Disk persists data across deploys.
- Upgrade plan for always-on production traffic.
