/** Cookie options for auth flows (HTTPS on Render requires Secure). */
export function authCookieOptions(maxAgeSeconds: number) {
  const secure =
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_APP_URL?.startsWith("https://");

  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: Boolean(secure),
    maxAge: maxAgeSeconds,
  };
}
