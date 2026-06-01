/** Public site URL — must match Google OAuth redirect URI host exactly. */
export function appBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return raw.replace(/\/$/, "");
}
