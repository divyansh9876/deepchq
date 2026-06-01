# Deepchq Android app — build & Google Play upload

The Android app is a **Capacitor wrapper**: it opens your **live website** (`https://deepchq.onrender.com`) in a full-screen WebView. Users get the same UI as the web app; you deploy web changes on Render without resubmitting the APK (unless you change native config).

**Package name:** `com.deepchq.app`  
**App name:** Deepchq

---

## What you need before starting

| Requirement | Notes |
|-------------|--------|
| **Deployed web app** | Render URL working over HTTPS, e.g. `https://deepchq.onrender.com` |
| **Render env** | `NEXT_PUBLIC_APP_URL` = same URL as below |
| **Google Play Developer account** | [play.google.com/console](https://play.google.com/console) — **$25 one-time** |
| **Android Studio** | [developer.android.com/studio](https://developer.android.com/studio) — includes SDK 34+ and JDK 17 |
| **Mac or Windows/Linux** | For building the release `.aab` |

---

## Part 1 — Configure the mobile project (one time)

### Step 1: Set your production URL

```bash
cd mobile
cp .env.example .env
```

Edit `mobile/.env`:

```env
CAPACITOR_SERVER_URL=https://deepchq.onrender.com
```

On **Render**, set:

```env
NEXT_PUBLIC_APP_URL=https://deepchq.onrender.com
```

Both must match exactly (same host, HTTPS).

### Step 2: Install dependencies & generate Android project

```bash
cd mobile
npm install
chmod +x scripts/sync-android.sh
./scripts/sync-android.sh
```

This creates the `mobile/android/` folder and syncs Capacitor config.

### Step 3: Open in Android Studio

```bash
cd mobile
npm run cap:open
```

Wait for Gradle sync to finish. Connect a phone (USB debugging) or use an emulator, then click **Run** to test.

**If you see a white screen:** check `CAPACITOR_SERVER_URL`, Render is up, and the phone has internet.

---

## Part 2 — App icon & splash (recommended)

1. Create a **1024×1024** PNG logo (blue circle + magnifying glass style).
2. Install assets tool (optional):

   ```bash
   cd mobile
   npm install @capacitor/assets --save-dev
   npx capacitor-assets generate --android
   ```

3. Or manually replace icons under `android/app/src/main/res/mipmap-*` after opening Android Studio.

Splash background is already **white** in `capacitor.config.ts` to match the site theme.

---

## Part 3 — Release signing key (one time)

Google Play requires an **upload key** (keystore).

### Option A — Android Studio (easiest)

1. **Build → Generate Signed App Bundle / APK**
2. Choose **Android App Bundle**
3. **Create new keystore** → save `deepchq-release.keystore` somewhere safe (not in git)
4. Remember **alias** and **passwords** — you need them for every update

### Option B — Command line

```bash
keytool -genkey -v -keystore deepchq-release.keystore -alias deepchq \
  -keyalg RSA -keysize 2048 -validity 10000
```

Store the file outside the repo. **Back it up** — losing it blocks updates.

---

## Part 4 — Build the release bundle (.aab)

### In Android Studio

1. **Build → Generate Signed App Bundle / APK**
2. **Android App Bundle** → select your keystore
3. **release** variant
4. Output: `mobile/android/app/build/outputs/bundle/release/app-release.aab`

### Or from terminal (after signing is configured in Gradle)

```bash
cd mobile/android
./gradlew bundleRelease
```

Upload file: `app/build/outputs/bundle/release/app-release.aab`

**Bump version** before each upload in `android/app/build.gradle`:

```gradle
versionCode 2        // integer, +1 every release
versionName "1.0.1"  // user-visible version
```

---

## Part 5 — Google Play Console (first upload)

### Step 1: Create the app

1. Go to [Google Play Console](https://play.google.com/console)
2. **Create app**
3. **App name:** Deepchq  
4. **Default language:** English  
5. **App or game:** App  
6. **Free or paid:** Free (subscriptions happen on web via Stripe unless you add Play Billing later)

### Step 2: Store listing (Main store listing)

| Field | Suggested value |
|-------|-----------------|
| **Short description** | Find people by name. AI-powered reports from public sources. |
| **Full description** | Deepchq helps you search public web and social signals for a person by name. Get structured reports with social accounts, bio, and sources. For informational use only — not for employment, credit, or tenant screening. |
| **App icon** | 512×512 PNG |
| **Feature graphic** | 1024×500 PNG |
| **Phone screenshots** | At least 2 (take from emulator or device on `/chat`, `/search/...`, `/pricing`) |
| **Privacy policy URL** | `https://deepchq.onrender.com/privacy` |
| **Contact email** | Your support email (e.g. `support@deepchq.app`) |

### Step 3: App content (required forms)

Complete every section in the left menu:

1. **Privacy policy** — URL above  
2. **App access** — usually “All functionality available without restrictions” (or describe login if required)  
3. **Ads** — Yes if you run Google/Meta ads to the site; declare accordingly  
4. **Content rating** — Start questionnaire (IARC); people-search apps are often **PEGI 12 / Teen** depending on answers  
5. **Target audience** — 18+ recommended for people-search products  
6. **News app** — No  
7. **COVID-19 / Government** — No  
8. **Data safety** — Declare data collected:
   - Email (account)
   - Name / search queries
   - App activity (analytics if any)
   - Data encrypted in transit (HTTPS)
   - Users can request deletion (link privacy policy)

### Step 4: Upload the bundle

1. **Release → Production** (or **Internal testing** first — recommended)
2. **Create new release**
3. **Upload** `app-release.aab`
4. **Release name:** e.g. `1.0.0 (1)`
5. **Release notes:** Initial release of Deepchq Android app.

### Step 5: Countries & pricing

- **Countries:** select all or your target markets  
- **Pricing:** Free

### Step 6: Submit for review

Fix any **Policy status** or **Setup** warnings, then **Send for review**. Review often takes **1–7 days**.

---

## Part 6 — Internal testing first (recommended)

Before production:

1. **Release → Testing → Internal testing**
2. Create release, upload same `.aab`
3. Add testers by email under **Testers**
4. Share the opt-in link; install from Play Store test track

---

## Updating the app later

| Change type | What to do |
|-------------|------------|
| **Website UI/features only** | Deploy to Render — app updates automatically |
| **New native plugins / URL / permissions** | Edit `capacitor.config.ts` → `./scripts/sync-android.sh` → bump `versionCode` → new `.aab` |
| **Play listing text/screenshots** | Edit in Play Console only |

---

## Quick command reference

```bash
# From repo root
cd mobile
cp .env.example .env          # set CAPACITOR_SERVER_URL
./scripts/sync-android.sh     # sync native project
npm run cap:open              # Android Studio
cd android && ./gradlew bundleRelease   # AAB (after signing setup)
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| White screen in app | HTTPS URL correct; Render service running; `NEXT_PUBLIC_APP_URL` matches |
| Login/cookies fail | Same domain in WebView and API; no mixed HTTP |
| “App not available” on Play | Complete all Console checklist items; wait for review |
| Upload rejected (people search) | Emphasize **public sources only**, FCRA disclaimer in description & in-app Terms |

---

## iOS (App Store) — later

The same Capacitor project can add iOS with `npx cap add ios` and an Apple Developer account ($99/year). Not required for Google Play.

See also: `mobile/README.md`
