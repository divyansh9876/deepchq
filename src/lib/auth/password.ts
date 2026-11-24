import crypto from "crypto";

const KEYLEN = 64;
const COST = 16384;

export function hashPassword(pw: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(pw, salt, KEYLEN, { N: COST }).toString("hex");
  return `scrypt$${COST}$${salt}$${hash}`;
}

/** Returns { ok, needsRehash } — legacy unsalted sha256 hashes are accepted once and upgraded. */
export function verifyPassword(pw: string, stored: string | null): { ok: boolean; needsRehash: boolean } {
  if (!stored) return { ok: false, needsRehash: false };

  if (stored.startsWith("scrypt$")) {
    const [, cost, salt, hash] = stored.split("$");
    const expected = Buffer.from(hash, "hex");
    const actual = crypto.scryptSync(pw, salt, expected.length, { N: Number(cost) });
    const ok = expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
    return { ok, needsRehash: false };
  }

  const legacy = crypto.createHash("sha256").update(pw).digest();
  const expected = Buffer.from(stored, "hex");
  const ok = expected.length === legacy.length && crypto.timingSafeEqual(expected, legacy);
  return { ok, needsRehash: ok };
}
