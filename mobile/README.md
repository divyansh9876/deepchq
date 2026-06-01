# Deepchq — Android app (Capacitor)

Native Android shell that loads your **hosted** Deepchq site. Same product as the website; no Next.js server inside the APK.

## Quick start

```bash
cd mobile
cp .env.example .env
# Edit CAPACITOR_SERVER_URL=https://deepchq.onrender.com

npm install
./scripts/sync-android.sh
npm run cap:open    # Android Studio → Run on device/emulator
```

## Play Store upload

**Full step-by-step guide:** [../docs/PLAY-STORE.md](../docs/PLAY-STORE.md)

Summary:

1. Configure `mobile/.env` + Render `NEXT_PUBLIC_APP_URL` (same HTTPS URL)
2. `./scripts/sync-android.sh`
3. Create signing keystore → build **`.aab`** in Android Studio
4. [Google Play Console](https://play.google.com/console) → create app → listing + Data safety + upload bundle

## Scripts

| Command | Purpose |
|---------|---------|
| `./scripts/sync-android.sh` | Load `.env`, `cap add android` (first run), `cap sync` |
| `npm run cap:open` | Open Android Studio |
| `npm run android:bundle` | Build release AAB (requires signing in Gradle) |

## Package

- **App ID:** `com.deepchq.app`
- **App name:** Deepchq

Change `appId` in `capacitor.config.ts` **before** first `cap add android` if you need a different package name.
