# Analytics — Deepchq

## Built-in dashboard (traction + estimated revenue)

Your app already stores **UTM / platform attribution** on every ad funnel visit (`funnelSessions` in the JSON DB).

### Setup

1. On Render, add:
   ```env
   ANALYTICS_SECRET=choose-a-long-random-string
   ```
2. Redeploy.
3. Open: **https://www.deepchq.com/admin/analytics**
4. Enter the same secret → **View dashboard**.

### What you see

| Section | Meaning |
|---------|---------|
| **Est. MRR** | Active subs × list price (weekly/quarterly/yearly normalized to monthly) |
| **Where traction is coming from** | Platform + `utm_campaign` from ad links |
| **Lead %** | Funnel sessions that entered name + email (step 3) |
| **Paid %** | Funnel sessions that led to a paying user |
| **Last 30 days** | Daily funnel sessions, searches, signups |

**Best channel:** high sessions + high **Paid %** (not just clicks).

Direct traffic (`/chat` without ads) appears as **direct / (chat / organic)**.

---

## Exact money (Razorpay)

The in-app dashboard is an **estimate**. For real collections, fees, and refunds:

1. [Razorpay Dashboard](https://dashboard.razorpay.com/) → **Reports** / **Payments**
2. Filter Test vs Live mode
3. Export CSV for accounting

---

## Ad platforms (where you’re getting traction)

| Platform | Where to look |
|----------|----------------|
| **Google Ads** | Campaigns → use final URL `/ads/google/step/1` + UTMs from [MARKETING-ADS.md](./MARKETING-ADS.md) |
| **Meta / Instagram** | Ads Manager → results by campaign; URL `/ads/instagram/step/1` |
| **Snapchat** | Ads Manager → `/ads/snapchat/step/1` |

Enable **auto-tagging** (Google `gclid`, Meta `fbclid`) — the app captures these on step 1.

---

## Optional: Google Analytics 4

Not installed by default. To add sitewide traffic:

1. Create a GA4 property → copy **Measurement ID** (`G-XXXXXXXX`)
2. Add to Render:
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX
   ```
3. (If you add the snippet to `layout.tsx` later) use GA4 for page views; keep **Deepchq admin analytics** for funnel → paid conversion tied to your DB.

---

## API (optional)

```bash
curl -s -H "x-analytics-secret: YOUR_SECRET" \
  https://www.deepchq.com/api/analytics/overview | jq
```

---

## Data limits

- Analytics reads the same **JSON file** as the app (`DATABASE_URL` on Render disk).
- If the disk was reset on deploy, historical funnel rows are lost — keep the Render **persistent disk** mounted at `/app/data`.
