import dns from "dns/promises";
import net from "net";

/** Blocks requests to loopback, private, link-local, metadata and other non-public ranges. */
function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 192 && b === 0) ||
      (a === 198 && (b === 18 || b === 19)) ||
      a >= 224
    );
  }
  const v6 = ip.toLowerCase();
  if (v6.startsWith("::ffff:")) return isPrivateIp(v6.slice(7));
  return (
    v6 === "::" ||
    v6 === "::1" ||
    v6.startsWith("fc") ||
    v6.startsWith("fd") ||
    v6.startsWith("fe80") ||
    v6.startsWith("ff")
  );
}

export class UnsafeUrlError extends Error {}

export async function assertPublicUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new UnsafeUrlError("That doesn't look like a valid URL.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new UnsafeUrlError("Only http and https URLs can be audited.");
  }
  if (url.username || url.password) throw new UnsafeUrlError("URLs with credentials are not allowed.");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".internal") || host.endsWith(".local")) {
    throw new UnsafeUrlError("Private hosts cannot be audited.");
  }
  if (url.port && !["80", "443", "8080", "8443"].includes(url.port)) {
    throw new UnsafeUrlError("Only standard web ports can be audited.");
  }
  const addrs = net.isIP(host) ? [{ address: host }] : await dns.lookup(host, { all: true }).catch(() => []);
  if (!addrs.length) throw new UnsafeUrlError(`Could not resolve ${host}.`);
  if (addrs.some((a) => isPrivateIp(a.address))) throw new UnsafeUrlError("Private network addresses cannot be audited.");
  return url;
}

export type SafeResponse = { status: number; url: string; text: string; headers: Headers } | null;

/** Fetches a public URL, re-validating every redirect hop, with a timeout and body size cap. */
export async function safeFetchText(
  raw: string,
  { timeoutMs = 10_000, maxBytes = 2_000_000, maxRedirects = 4, userAgent = "DeepchqBot/1.0 (+https://deepchq.app/bot)" } = {},
): Promise<SafeResponse> {
  let current = raw;
  for (let hop = 0; hop <= maxRedirects; hop++) {
    let url: URL;
    try {
      url = await assertPublicUrl(current);
    } catch {
      return null;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        redirect: "manual",
        signal: ctrl.signal,
        headers: { "User-Agent": userAgent, Accept: "text/html,text/plain,*/*;q=0.8" },
      });
      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get("location");
        if (!loc) return null;
        current = new URL(loc, url).toString();
        continue;
      }
      const reader = res.body?.getReader();
      if (!reader) return { status: res.status, url: url.toString(), text: "", headers: res.headers };
      const chunks: Uint8Array[] = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > maxBytes) {
          await reader.cancel();
          break;
        }
        chunks.push(value);
      }
      const text = new TextDecoder().decode(Buffer.concat(chunks));
      return { status: res.status, url: url.toString(), text, headers: res.headers };
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }
  return null;
}
