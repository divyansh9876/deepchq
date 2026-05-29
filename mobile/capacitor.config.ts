import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Points the WebView at your deployed Docker/hosted URL.
 * Set CAPACITOR_SERVER_URL before `cap sync` (see mobile/.env.example).
 */
const serverUrl =
  process.env.CAPACITOR_SERVER_URL ?? "https://your-domain.com";

const config: CapacitorConfig = {
  appId: "com.deepchq.app",
  appName: "Deepchq",
  webDir: "www",
  server: {
    url: serverUrl,
    cleartext: false,
    androidScheme: "https",
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#000000",
    },
  },
};

export default config;
