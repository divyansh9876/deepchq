# Marketing funnels — Google, Instagram, Snapchat

> **Automation:** To auto-generate campaigns, copy, and review checklists from this app (Instagram organic page + funnel as reference), see [AD-AUTOMATION-PLAYBOOK.md](./AD-AUTOMATION-PLAYBOOK.md) and run `npm run ads:generate`.

Deepchq uses a **4-step conversion funnel** for paid traffic:

| Step | Goal | User action |
|------|------|-------------|
| 1 | Hook | Continue |
| 2 | Trust (AI scan visual) | Continue |
| 3 | Lead + first search | Name + email → starts search |
| 4 | Payoff | Live scan → view blurred report → unlock via pricing |

Replace `https://YOUR_DOMAIN.com` with production URL (`NEXT_PUBLIC_APP_URL`).

---

## Funnel URLs (use in ad platforms)

| Platform | Step 1 (final URL) |
|----------|-------------------|
| **Google Ads** | `https://YOUR_DOMAIN.com/ads/google/step/1` |
| **Instagram** (Meta) | `https://YOUR_DOMAIN.com/ads/instagram/step/1` |
| **Snapchat** | `https://YOUR_DOMAIN.com/ads/snapchat/step/1` |

**Legacy Google path** (existing campaigns): `/landing4/step1` — same copy, same tracking.

Attribution is stored on `funnel_session` rows: `platform`, `utm_*` (JSON), `gclid`, `fbclid`, `scCid`.

---

## UTM templates

Append to Step 1 URLs (platforms also set default `utm_source` / `utm_medium` if missing).

### Google Ads

```
https://YOUR_DOMAIN.com/ads/google/step/1?utm_source=google&utm_medium=cpc&utm_campaign={campaign}&utm_content={adgroup}&utm_term={keyword}
```

- Auto-captured: `gclid` (enable auto-tagging in Google Ads).

### Instagram / Meta Ads

```
https://YOUR_DOMAIN.com/ads/instagram/step/1?utm_source=instagram&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}
```

- Auto-captured: `fbclid` when Meta appends it.
- In Ads Manager, use **Website** objective → **Landing page views** or **Leads** depending on optimization.
- Pixel events (configure in Events Manager):
  - `PageView` — all funnel steps
  - `Lead` — step 3 submit (fire on thank-you / step 4 load)
  - `Purchase` or `Subscribe` — Stripe success (post-launch)

### Snapchat Ads

```
https://YOUR_DOMAIN.com/ads/snapchat/step/1?utm_source=snapchat&utm_medium=paid_social&utm_campaign={campaign_name}&utm_content={ad_name}
```

- Auto-captured: `ScCid` / `sc_cid` when Snapchat passes click ID.
- Snap Pixel: `PAGE_VIEW` (step 1), `SIGN_UP` or custom `LEAD` (step 3), `PURCHASE` (subscription).

---

## Campaign structure (recommended)

### Google — Search + Performance Max

| Campaign | Ad groups | Keywords / assets |
|----------|-----------|-------------------|
| Brand | Deepchq | brand terms |
| People search | lookup, find person online, social media search |
| Competitor (optional) | alternates | use carefully |

**Ads:** Headline 1 = “AI People Search” · Headline 2 = “Public Social & Web Data” · Description = step 1 subtitle from funnel config.

### Instagram — Reels + Stories

| Funnel stage | Creative angle |
|--------------|----------------|
| Step 1 | “See their real social footprint” — mock profile cards |
| Step 2 | Radar / scan animation (screen record step 2) |
| Step 3 | CTA: “Search anyone in 60 seconds” |

**Formats:** 9:16 video 15s → swipe up / link to Step 1. Static carousel: 3 cards = steps 1–3 value props.

### Snapchat — Single Image / Video

| Funnel stage | Creative angle |
|--------------|----------------|
| Step 1 | “Find anyone — fast” bold text, phone UI |
| Step 2 | Quick cuts, “one name one report” |
| Step 3 | Email capture reminder |

Keep copy short; audience skews younger — emphasize speed, not “background check” language.

---

## Conversion mapping

| In-app event | Suggested ad conversion |
|--------------|-------------------------|
| Land step 1 | Landing page view |
| Reach step 3 | Initiate checkout (optional micro) |
| Submit name + email | **Lead** (primary for IG/Snap prospecting) |
| View report `/search/[id]` | View content |
| Stripe checkout complete | **Purchase** (primary for Google ROAS) |

Export `funnelSessions` from `./data/deepchq.json` (or your DB) and join on `searches.funnelSessionId` for offline ROAS.

---

## Compliance copy (all platforms)

- Public sources only; not for FCRA use (employment, credit, tenant screening).
- Terms + Privacy linked in funnel footer.
- Avoid implying access to private DMs, Snapchat memories, or hacked data.

---

## Local testing

```bash
npm run dev
```

Open:

- http://localhost:3000/ads/google/step/1?utm_campaign=test
- http://localhost:3000/ads/instagram/step/1?fbclid=test123
- http://localhost:3000/ads/snapchat/step/1?ScCid=test456

Check session: `GET /api/funnel/session` (with `funnel_session` cookie set).
