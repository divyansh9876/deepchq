# Deepchq — Google Play (Android)

The Android app is a **Capacitor** shell that loads your **hosted** Deepchq site (the Docker deployment). You do not ship the Next.js server inside the APK.

## Prerequisites

- [Android Studio](https://developer.android.com/studio) (SDK 34+, JDK 17)
- Deployed HTTPS backend (see root `README.md` Docker section)
- Google Play Developer account ($25 one-time)

## 1. Point the app at your server

```bash
cd mobile
cp .env.example .env
# Edit .env — must be HTTPS for production:
# CAPACITOR_SERVER_URL=https://api.yourdomain.com
```

## 2. Generate the Android project

```bash
cd mobile
npm install
export $(grep -v '^#' .env | xargs)   # loads CAPACITOR_SERVER_URL
npx cap add android    # first time only
npx cap sync android
npx cap open android   # opens Android Studio
```

## 3. Configure signing (release)

In Android Studio: **Build → Generate Signed Bundle / APK** → **Android App Bundle (.aab)**.

Or create `android/keystore.properties` (do not commit):

```properties
storeFile=../release.keystore
storePassword=***
keyAlias=deepchq
keyPassword=***
```

## 4. Build release bundle for Play Console

```bash
cd mobile/android
./gradlew bundleRelease
```

Upload `app/build/outputs/bundle/release/app-release.aab` to [Google Play Console](https://play.google.com/console).

## 5. Play Store listing checklist

| Item | Notes |
|------|--------|
| App name | Deepchq |
| Package | `com.deepchq.app` (change in `capacitor.config.ts` before first `cap add`) |
| Privacy policy URL | e.g. `https://your-domain.com/privacy` |
| Data safety form | Declare email, search queries, public web data |
| Content rating | IARC questionnaire |
| Subscriptions | If using Stripe on web, declare in-app purchases or “subscriptions managed on website” per your flow |
| Screenshots | Phone + 7" tablet from emulator or device |

## 6. Deep links (optional)

To open `/landing4/step1` from ads inside the app, your hosted site already supports UTM query params; no native change required if using `server.url`.

## 7. Updates

After deploying a new web version to Docker:

```bash
# Users get updates automatically (WebView loads live URL).
# For native plugin/config changes only:
cd mobile && npx cap sync android
# Bump versionCode in android/app/build.gradle, upload new AAB.
```

## Troubleshooting

- **White screen**: `CAPACITOR_SERVER_URL` must be HTTPS and reachable from the device.
- **Cleartext HTTP**: Only for local dev; use `10.0.2.2:3000` in emulator with `cleartext: true` temporarily in `capacitor.config.ts`.
- **CORS / cookies**: Session cookies work when `NEXT_PUBLIC_APP_URL` matches the URL loaded in the WebView.
