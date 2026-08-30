import fs from "fs";
import path from "path";
import type {
  Brand,
  GeoAudit,
  Prompt,
  Recommendation,
  ScanResult,
  User,
} from "@/lib/types";

type DbShape = {
  users: User[];
  brands: Brand[];
  prompts: Prompt[];
  scanResults: ScanResult[];
  audits: GeoAudit[];
  recommendations: Recommendation[];
};

const defaultDb: DbShape = {
  users: [],
  brands: [],
  prompts: [],
  scanResults: [],
  audits: [],
  recommendations: [],
};

function dbPath() {
  const raw =
    process.env.DATABASE_URL?.replace(/^file:/, "") ??
    path.join(process.cwd(), "data", "deepchq.json");
  const dir = path.dirname(raw);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return raw;
}

function reviveDates<T extends Record<string, unknown>>(row: T): T {
  const out = { ...row };
  for (const key of Object.keys(out)) {
    const val = out[key];
    if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}T/.test(val) && key.endsWith("At")) {
      (out as Record<string, unknown>)[key] = new Date(val);
    }
  }
  return out;
}

function readDb(): DbShape {
  const file = dbPath();
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(defaultDb, null, 2));
    return structuredClone(defaultDb);
  }
  const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as DbShape;
  return {
    users: parsed.users.map((r) => reviveDates(r)),
    brands: parsed.brands.map((r) => reviveDates(r)),
    prompts: parsed.prompts.map((r) => reviveDates(r)),
    scanResults: parsed.scanResults.map((r) => reviveDates(r)),
    audits: parsed.audits.map((r) => reviveDates(r)),
    recommendations: parsed.recommendations.map((r) => reviveDates(r)),
  };
}

function writeDb(data: DbShape) {
  const file = dbPath();
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, file);
}

function mutate(fn: (data: DbShape) => void) {
  const data = readDb();
  fn(data);
  writeDb(data);
}

export const db = {
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
  },
  brands: {
    create(row: Brand) {
      mutate((d) => d.brands.push(row));
    },
    list(userId: string) {
      return readDb().brands.filter((b) => b.userId === userId);
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
    create(row: ScanResult) {
      mutate((d) => d.scanResults.push(row));
    },
    list(brandId: string) {
      return readDb()
        .scanResults.filter((s) => s.brandId === brandId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    latestPerPromptEngine(brandId: string) {
      const all = readDb().scanResults.filter((s) => s.brandId === brandId);
      const map = new Map<string, ScanResult>();
      for (const row of all) {
        const key = `${row.promptId}:${row.engine}`;
        const existing = map.get(key);
        if (!existing || row.createdAt > existing.createdAt) map.set(key, row);
      }
      return [...map.values()];
    },
  },
  audits: {
    create(row: GeoAudit) {
      mutate((d) => d.audits.push(row));
    },
    latest(brandId: string) {
      return (
        readDb()
          .audits.filter((a) => a.brandId === brandId)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0] ?? null
      );
    },
  },
  recommendations: {
    replaceForBrand(brandId: string, rows: Recommendation[]) {
      mutate((d) => {
        d.recommendations = d.recommendations.filter((r) => r.brandId !== brandId);
        d.recommendations.push(...rows);
      });
    },
    list(brandId: string) {
      return readDb()
        .recommendations.filter((r) => r.brandId === brandId)
        .sort((a, b) => {
          const impact = { high: 0, medium: 1, low: 2 };
          return impact[a.impact] - impact[b.impact];
        });
    },
    updateStatus(id: string, status: Recommendation["status"]) {
      mutate((d) => {
        const i = d.recommendations.findIndex((r) => r.id === id);
        if (i >= 0) d.recommendations[i].status = status;
      });
    },
  },
};
