# Where to put API keys (Render vs GitHub)

**Never commit real keys to GitHub.** Use the local fill-in file, then copy values into Render / GitHub Secrets.

---

## Step 1 — Fill in one local file

```bash
cp config/env.values.template config/env.values
```

Open **`config/env.values`** in a text editor and paste your real values after each `=`.

That file stays **only on your computer** (gitignored).

---

## Step 2 — Put keys in **Render** (runs the live app)

This is where **almost all** keys go.

1. Open [Render Dashboard](https://dashboard.render.com/)
2. Click your **deepchq** web service
3. Left menu → **Environment**
4. Click **Add Environment Variable** for each line from section **A** in `config/env.values`

| Key | Example value |
|-----|----------------|
| `NEXT_PUBLIC_APP_URL` | `https://deepchq.onrender.com` |
| `DATABASE_URL` | `file:/app/data/deepchq.json` |
| `ALLOW_DEV_UNLOCK` | `false` |
| `SERPER_API_KEY` | your Serper key |
| `GOOGLE_CLIENT_ID` | `....apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | your Google secret |
| `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |
| `STRIPE_PRICE_PRO_WEEKLY` | `price_...` |
| … | (all other `STRIPE_PRICE_*` from Stripe) |

5. Click **Save changes**
6. **Manual Deploy** → Deploy latest commit (required after `NEXT_PUBLIC_APP_URL` changes)

Render does **not** read `config/env.values` from your repo automatically. You paste each key in the dashboard (or use Render CLI — optional).

### Google redirect URI (not an env var)

In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), add:

```
https://YOUR-RENDER-URL.onrender.com/api/auth/oauth/callback
```

---

## Step 3 — Put keys in **GitHub Actions** (optional — ads only)

Only needed if you use the weekly **Generate ad campaigns** workflow.

1. GitHub → your repo **deepchq**
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret**

| Secret name | Value (from section B in `config/env.values`) |
|-------------|-----------------------------------------------|
| `ADS_BASE_URL` | Same as `NEXT_PUBLIC_APP_URL` (your live HTTPS URL) |

**Do not** put Stripe, Google, or Serper keys in GitHub Actions unless you add custom workflows that need them. The live app reads env vars from **Render**, not from GitHub.

---

## Step 4 — Mobile app (optional)

```bash
cp mobile/.env.example mobile/.env
```

Set:

```env
CAPACITOR_SERVER_URL=https://your-render-url.onrender.com
```

(Same as `NEXT_PUBLIC_APP_URL`.)

---

## Quick reference

| Key type | Where it goes |
|----------|----------------|
| App runtime (Stripe, Google, DB, Serper, URL) | **Render** → Environment |
| Weekly ad CSV generator | **GitHub** → Actions secret `ADS_BASE_URL` |
| Local `npm run dev` | **`.env.local`** (copy from `.env.example`) |
| Your master list (private) | **`config/env.values`** (never push to GitHub) |

---

## What NOT to do

| Don’t | Why |
|-------|-----|
| Commit `config/env.values` | Keys would be public on GitHub |
| Upload keys in a PR | Same risk |
| Put app secrets only in GitHub Actions | Production app on Render won’t see them |
| Skip redeploy after changing env on Render | Old build may still use old `NEXT_PUBLIC_APP_URL` |

---

## Checklist after adding keys

- [ ] All section A vars added on Render  
- [ ] Manual Deploy completed  
- [ ] Homepage loads at `NEXT_PUBLIC_APP_URL`  
- [ ] Email register/login works  
- [ ] Google login works (redirect URI set in Google Console)  
- [ ] Search returns results (if `SERPER_API_KEY` set)  
- [ ] Stripe checkout works (if Stripe vars set)  
- [ ] `ADS_BASE_URL` in GitHub if you use Actions workflow  

More detail: [ENV-SETUP.md](./ENV-SETUP.md)
