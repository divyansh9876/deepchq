# Complete setup — Deepchq (env, database, login, Google, Stripe, search)

## Where to set variables

| Environment | Location |
|-------------|----------|
| **Local** | `.env.local` (copy from `.env.example`) |
| **Render** | Service → **Environment** → add each key → **Save** → **Manual Deploy** |
| **Docker** | `.env` (copy from `.env.docker.example`) |
| **Android app** | `mobile/.env` → `CAPACITOR_SERVER_URL` |

After changing **`NEXT_PUBLIC_APP_URL`** or any build-time value, **redeploy** on Render.

---

## Master checklist (production)

Copy this block into Render and fill in your values:

```env
# ── Core (required) ─────────────────────────────────────────
NEXT_PUBLIC_APP_URL=https://YOUR-SERVICE.onrender.com
DATABASE_URL=file:/app/data/deepchq.json
ALLOW_DEV_UNLOCK=false

# ── Real web search (recommended) ───────────────────────────
SERPER_API_KEY=

# ── Google Sign-In ──────────────────────────────────────────
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ── Stripe payments ─────────────────────────────────────────
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO_WEEKLY=
STRIPE_PRICE_PRO_QUARTERLY=
STRIPE_PRICE_PRO_YEARLY=
STRIPE_PRICE_BASIC_WEEKLY=
STRIPE_PRICE_BASIC_QUARTERLY=
STRIPE_PRICE_BASIC_YEARLY=

# ── Optional / future ───────────────────────────────────────
OPENAI_API_KEY=
APPLE_CLIENT_ID=
INSTAGRAM_HANDLE=@deepchq
```

---

## 1. Database

Deepchq uses a **JSON file database** (not PostgreSQL). One file holds users, searches, reports, funnel attribution, etc.

| Variable | Local | Render / Docker |
|----------|--------|------------------|
| `DATABASE_URL` | `file:./data/deepchq.json` | `file:/app/data/deepchq.json` |

### Render disk (required for production)

- Blueprint mounts a **1 GB disk** at `/app/data`
- Data survives redeploys
- Without the disk, users and searches are **lost** on every deploy

### What is stored

| Collection | Examples |
|------------|----------|
| `users` | email, password hash, `authProvider` (`email` / `google`), plan tier |
| `searches` | query name, status, linked user |
| `artifacts` | report markdown, locked/unlocked |
| `funnelSessions` | UTM, gclid, fbclid, platform |
| `subscriptions` | Stripe subscription ids |

### Local

```bash
mkdir -p data
# File is created automatically on first request
```

---

## 2. Authentication

### A. Email + password (works out of the box)

No extra env vars. Flow:

1. `/landing/register` → creates user in DB → sets `user_id` cookie  
2. `/landing/login` → verifies password → sets cookie  
3. Cookie lasts **30 days** (`httpOnly`)

Passwords are hashed (SHA-256) before storage.

### B. Google Sign-In (needs env + Google Cloud)

| Variable | Where to get it |
|----------|-----------------|
| `GOOGLE_CLIENT_ID` | Google Cloud Console → APIs & Services → Credentials |
| `GOOGLE_CLIENT_SECRET` | Same OAuth client |
| `NEXT_PUBLIC_APP_URL` | Must match your live URL (for redirect) |

#### Google Cloud setup (step by step)

1. Open [Google Cloud Console](https://console.cloud.google.com/)  
2. Create or select a project  
3. **APIs & Services** → **OAuth consent screen**  
   - User type: External (or Internal for workspace)  
   - App name: **Deepchq**  
   - Add scopes: `email`, `profile`, `openid`  
4. **Credentials** → **Create credentials** → **OAuth client ID**  
   - Type: **Web application**  
   - **Authorized redirect URIs** (add both if you test locally):

   ```
   http://localhost:3000/api/auth/oauth/callback
   https://YOUR-SERVICE.onrender.com/api/auth/oauth/callback
   ```

5. Copy **Client ID** → `GOOGLE_CLIENT_ID`  
6. Copy **Client secret** → `GOOGLE_CLIENT_SECRET`  
7. Add both to Render → **Redeploy**

#### Flow in the app

1. User clicks **Continue with Google**  
2. Browser → `/api/auth/oauth?provider=google`  
3. Redirect to Google login  
4. Google → `/api/auth/oauth/callback`  
5. User created or matched by email → `user_id` cookie → `/dashboard`

### C. Apple Sign-In

**Not implemented yet.** Buttons show a message to use email or Google.  
`APPLE_CLIENT_ID` is reserved for a future release.

---

## 3. Search (Serper)

| Variable | Purpose |
|----------|---------|
| `SERPER_API_KEY` | Real Google search results via [serper.dev](https://serper.dev) |

Without it: search still runs with **demo/mock** links (fine for UI testing).

---

## 4. Subscriptions (Stripe)

| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | Server-side Stripe API |
| `STRIPE_WEBHOOK_SECRET` | Verify webhook signatures |
| `STRIPE_PRICE_PRO_WEEKLY` etc. | Price IDs from Stripe Dashboard |
| `ALLOW_DEV_UNLOCK` | **`false`** in production |

### Stripe steps

1. Create products **Pro** (and optional **Basic**) with weekly / quarterly / yearly prices  
2. Copy each `price_...` id into matching `STRIPE_PRICE_*` env var  
3. Webhook URL:

   ```
   https://YOUR-SERVICE.onrender.com/api/webhooks/stripe
   ```

4. Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`  
5. Copy signing secret → `STRIPE_WEBHOOK_SECRET`

Without Stripe: checkout runs in **mock mode** (plan updated in DB, no charge).

---

## 5. Unlock reports

| Mode | Setting |
|------|---------|
| **Dev / testing** | `ALLOW_DEV_UNLOCK=true` — any logged-in user unlocks |
| **Production** | `ALLOW_DEV_UNLOCK=false` + user has `pro` or `basic` plan (via Stripe) |

---

## 6. Ad funnels & attribution

No extra env vars for the live site. Funnel stores UTMs in `funnelSessions` automatically.

Optional for `npm run ads:generate` only:

- `INSTAGRAM_HANDLE`
- `ADS_BASE_URL` (GitHub Actions secret)

---

## 7. Mobile (Capacitor)

`mobile/.env`:

```env
CAPACITOR_SERVER_URL=https://YOUR-SERVICE.onrender.com
```

Rebuild Android after changing: `cd mobile && ./scripts/sync-android.sh`

---

## Local quick start

```bash
cp .env.example .env.local
```

Minimal `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=file:./data/deepchq.json
ALLOW_DEV_UNLOCK=true
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret
SERPER_API_KEY=optional
```

```bash
npm install
npm run dev
```

Test:

| URL | What |
|-----|------|
| http://localhost:3000 | Homepage |
| http://localhost:3000/landing/register | Email signup |
| http://localhost:3000/landing/login | Email + Google login |
| http://localhost:3000/dashboard | After login |

---

## Feature → env matrix

| Feature | Required env |
|---------|----------------|
| Site loads | `NEXT_PUBLIC_APP_URL`, `DATABASE_URL` |
| Data persists on Render | `DATABASE_URL=file:/app/data/deepchq.json` + **disk** |
| Email register/login | *(none extra)* |
| Google login | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_APP_URL` |
| Real search results | `SERPER_API_KEY` |
| Paid unlock | Stripe vars, `ALLOW_DEV_UNLOCK=false` |
| Free unlock testing | `ALLOW_DEV_UNLOCK=true` |
| Stripe checkout | All `STRIPE_*` price IDs + webhook secret |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Google: `redirect_uri_mismatch` | Add exact callback URL in Google Console (see section 2B) |
| Google: `OAuth not configured` | Set `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`, redeploy |
| Login works locally, not on Render | Set all env vars on Render, redeploy |
| Users disappear after deploy | Enable Render **disk** at `/app/data` |
| Stripe goes to localhost | Set `NEXT_PUBLIC_APP_URL` on Render, redeploy |
| “Price not configured” | Add `STRIPE_PRICE_*` for plan + interval used on `/pricing` |
| Google button does nothing | Use full redirect (already fixed); check browser pop-up blockers |

---

## Render deploy order

1. Deploy from GitHub (`main`)  
2. Set env vars (master checklist above)  
3. Confirm **disk** attached  
4. **Manual Deploy**  
5. Test register → search → unlock → pricing → Google login
