import fs from "fs";
import path from "path";
import type {
  Brand,
  GeoAudit,
  Lead,
  Prompt,
  PublicAudit,
  Recommendation,
  ScanResult,
  User,
  VisibilityPoint,
} from "@/lib/types";

/**
 * Single-file JSON store. All access is synchronous so a read-modify-write is atomic
 * within one Node process. Run exactly one instance against a given file.
 */

type DbShape = {
  users: User[];
  brands: Brand[];
  prompts: Prompt[];
  scanResults: ScanResult[];
  audits: GeoAudit[];
  recommendations: Recommendation[];
  leads: Lead[];
  publicAudits: PublicAudit[];
  meta: { lastCronAt?: string | null };
};

const COLLECTIONS = [
  "users",
  "brands",
  "prompts",
  "scanResults",
  "audits",
  "recommendations",
  "leads",
  "publicAudits",
] as const;

function emptyDb(): DbShape {
  return {
    users: [],
    brands: [],
    prompts: [],
    scanResults: [],
    audits: [],
    recommendations: [],
    leads: [],
    publicAudits: [],
    meta: {},
  };
}

function dbPath() {
  const raw =
    process.env.DATABASE_URL?.replace(/^file:/, "") ?? path.join(process.cwd(), "data", "deepchq.json");
  const dir = path.dirname(raw);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return raw;
}

function reviveDates<T>(row: T): T {
  const out = { ...(row as Record<string, unknown>) };
  for (const key of Object.keys(out)) {
    const val = out[key];
    if (typeof val === "string" && key.endsWith("At") && /^\d{4}-\d{2}-\d{2}T/.test(val)) {
      out[key] = new Date(val);
    }
  }
  return out as T;
}

type Cache = { file: string; mtimeMs: number; size: number; data: DbShape };
const g = globalThis as unknown as { __deepchqDb?: Cache };

function readDb(): DbShape {
  const file = dbPath();
  if (!fs.existsSync(file)) {
    const data = emptyDb();
    writeDb(data);
    return data;
  }
  const stat = fs.statSync(file);
  const c = g.__deepchqDb;
  if (c && c.file === file && c.mtimeMs === stat.mtimeMs && c.size === stat.size) return c.data;

  const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as Partial<DbShape>;
  const data = emptyDb();
  for (const key of COLLECTIONS) {
    const rows = (parsed[key] ?? []) as unknown[];
    (data[key] as unknown[]) = rows.map((r) => reviveDates(r));
  }
  data.meta = parsed.meta ?? {};
  g.__deepchqDb = { file, mtimeMs: stat.mtimeMs, size: stat.size, data };
  return data;
}

function writeDb(data: DbShape) {
  const file = dbPath();
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data));
  fs.renameSync(tmp, file);
  const stat = fs.statSync(file);
  g.__deepchqDb = { file, mtimeMs: stat.mtimeMs, size: stat.size, data };
}

function mutate<T>(fn: (data: DbShape) => T): T {
  const data = readDb();
  const out = fn(data);
  writeDb(data);
  return out;
}

const byNewest = <T extends { createdAt: Date }>(a: T, b: T) => b.createdAt.getTime() - a.createdAt.getTime();

export const db = {
  health() {
    readDb();
    return true;
  },
  meta: {
    get() {
      return readDb().meta;
    },
    set(patch: DbShape["meta"]) {
      mutate((d) => {
        d.meta = { ...d.meta, ...patch };
      });
    },
  },
  users: {
    create(row: User) {
      mutate((d) => {
        if (d.users.some((u) => u.email === row.email)) throw new Error("duplicate");
        d.users.push(row);
      });
    },
    get(id: string) {
      return readDb().users.find((u) => u.id === id) ?? null;
    },
    getByEmail(email: string) {
      return readDb().users.find((u) => u.email === email.toLowerCase()) ?? null;
    },
    getBySubscription(subscriptionId: string) {
      return readDb().users.find((u) => u.subscriptionId === subscriptionId) ?? null;
    },
    all() {
      return readDb().users;
    },
    update(id: string, patch: Partial<User>) {
      mutate((d) => {
        const i = d.users.findIndex((u) => u.id === id);
        if (i >= 0) d.users[i] = { ...d.users[i], ...patch };
      });
    },
  },
  brands: {
    create(row: Brand) {
      mutate((d) => d.brands.push(row));
    },
    list(userId: string) {
      return readDb().brands.filter((b) => b.userId === userId);
    },
    all() {
      return readDb().brands;
    },
    get(id: string) {
      return readDb().brands.find((b) => b.id === id) ?? null;
    },
    update(id: string, patch: Partial<Brand>) {
      mutate((d) => {
        const i = d.brands.findIndex((b) => b.id === id);
        if (i >= 0) d.brands[i] = { ...d.brands[i], ...patch };
      });
    },
    delete(id: string) {
      mutate((d) => {
        d.brands = d.brands.filter((b) => b.id !== id);
        d.prompts = d.prompts.filter((p) => p.brandId !== id);
        d.scanResults = d.scanResults.filter((s) => s.brandId !== id);
        d.audits = d.audits.filter((a) => a.brandId !== id);
        d.recommendations = d.recommendations.filter((r) => r.brandId !== id);
      });
    },
  },
  prompts: {
    create(row: Prompt) {
      mutate((d) => d.prompts.push(row));
    },
    createMany(rows: Prompt[]) {
      mutate((d) => {
        const existing = new Set(d.prompts.filter((p) => p.brandId === rows[0]?.brandId).map((p) => p.text.toLowerCase()));
        for (const r of rows) {
          if (existing.has(r.text.toLowerCase())) continue;
          existing.add(r.text.toLowerCase());
          d.prompts.push(r);
        }
      });
    },
    list(brandId: string) {
      return readDb().prompts.filter((p) => p.brandId === brandId);
    },
    get(id: string) {
      return readDb().prompts.find((p) => p.id === id) ?? null;
    },
    delete(id: string) {
      mutate((d) => {
        d.prompts = d.prompts.filter((p) => p.id !== id);
        d.scanResults = d.scanResults.filter((s) => s.promptId !== id);
      });
    },
  },
  scanResults: {
    createMany(rows: ScanResult[]) {
      mutate((d) => d.scanResults.push(...rows));
    },
    list(brandId: string) {
      return readDb().scanResults.filter((s) => s.brandId === brandId).sort(byNewest);
    },
    latestPerPromptEngine(brandId: string) {
      const map = new Map<string, ScanResult>();
      for (const row of readDb().scanResults) {
        if (row.brandId !== brandId) continue;
        const key = `${row.promptId}:${row.engine}`;
        const existing = map.get(key);
        if (!existing || row.createdAt > existing.createdAt) map.set(key, row);
      }
      return [...map.values()];
    },
    /** One point per scan run, oldest first. */
    history(brandId: string, limit = 26): VisibilityPoint[] {
      const runs = new Map<string, { at: Date; total: number; mentioned: number; cited: number }>();
      for (const s of readDb().scanResults) {
        if (s.brandId !== brandId) continue;
        const key = s.runId ?? s.createdAt.toISOString();
        const r = runs.get(key) ?? { at: s.createdAt, total: 0, mentioned: 0, cited: 0 };
        r.total += 1;
        if (s.mentioned) r.mentioned += 1;
        if (s.cited) r.cited += 1;
        runs.set(key, r);
      }
      return [...runs.entries()]
        .map(([runId, r]) => ({
          runId,
          at: r.at,
          visibilityRate: Math.round((r.mentioned / r.total) * 100),
          citationRate: Math.round((r.cited / r.total) * 100),
        }))
        .sort((a, b) => a.at.getTime() - b.at.getTime())
        .slice(-limit);
    },
    runsSince(brandIds: string[], since: Date) {
      const ids = new Set(brandIds);
      const runs = new Set<string>();
      for (const s of readDb().scanResults) {
        if (ids.has(s.brandId) && s.createdAt >= since) runs.add(s.runId ?? s.createdAt.toISOString());
      }
      return runs.size;
    },
    prune(olderThan: Date) {
      mutate((d) => {
        d.scanResults = d.scanResults.filter((s) => s.createdAt >= olderThan);
      });
    },
  },
  audits: {
    create(row: GeoAudit) {
      mutate((d) => d.audits.push(row));
    },
    latest(brandId: string) {
      return readDb().audits.filter((a) => a.brandId === brandId).sort(byNewest)[0] ?? null;
    },
  },
  recommendations: {
    replaceForBrand(brandId: string, rows: Recommendation[]) {
      mutate((d) => {
        // Keep progress on recommendations that are regenerated with the same title.
        const prev = new Map(
          d.recommendations.filter((r) => r.brandId === brandId).map((r) => [r.title, r.status]),
        );
        d.recommendations = d.recommendations.filter((r) => r.brandId !== brandId);
        d.recommendations.push(...rows.map((r) => ({ ...r, status: prev.get(r.title) ?? r.status })));
      });
    },
    list(brandId: string) {
      const impact = { high: 0, medium: 1, low: 2 };
      return readDb()
        .recommendations.filter((r) => r.brandId === brandId)
        .sort((a, b) => impact[a.impact] - impact[b.impact]);
    },
    updateStatus(brandId: string, id: string, status: Recommendation["status"]) {
      return mutate((d) => {
        const i = d.recommendations.findIndex((r) => r.id === id && r.brandId === brandId);
        if (i >= 0) d.recommendations[i].status = status;
        return i >= 0;
      });
    },
  },
  leads: {
    create(row: Lead) {
      mutate((d) => d.leads.push(row));
    },
  },
  publicAudits: {
    create(row: PublicAudit) {
      mutate((d) => {
        d.publicAudits.push(row);
        if (d.publicAudits.length > 5000) d.publicAudits = d.publicAudits.slice(-4000);
      });
    },
    get(id: string) {
      return readDb().publicAudits.find((a) => a.id === id) ?? null;
    },
    recentForDomain(domain: string, withinMs: number) {
      const since = Date.now() - withinMs;
      return (
        readDb()
          .publicAudits.filter((a) => a.domain === domain && a.createdAt.getTime() > since)
          .sort(byNewest)[0] ?? null
      );
    },
    attachEmail(id: string, email: string) {
      mutate((d) => {
        const a = d.publicAudits.find((x) => x.id === id);
        if (a) a.email = email;
      });
    },
  },
};
