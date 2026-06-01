import { NextResponse } from "next/server";

/**
 * Redirect via 302 + HTML fallback so WebViews and strict browsers leave the callback URL.
 */
export function redirectWithHtml(url: string) {
  const safe = url.replace(/"/g, "&quot;");
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0;url=${safe}" />
  <title>Redirecting…</title>
</head>
<body>
  <p>Signing you in… <a href="${safe}">Continue</a></p>
  <script>location.replace(${JSON.stringify(url)});</script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
