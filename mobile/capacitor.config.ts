import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor loads your live Deepchq website inside a native Android shell.
 * Set CAPACITOR_SERVER_URL in mobile/.env before `npm run android:sync`.
 */
const serverUrl =
  process.env.CAPACITOR_SERVER_URL ?? "https://deepchq.onrender.com";

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
      launchShowDuration: 1500,
      backgroundColor: "#ffffff",
      showSpinner: true,
      spinnerColor: "#0f172a",
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#ffffff",
    },
  },
};

export default config;
