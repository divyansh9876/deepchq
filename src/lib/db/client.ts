import fs from "fs";
import path from "path";

export type FunnelSession = {
  id: string;
  step: number;
  fullName: string | null;
  email: string | null;
  utmJson: string | null;
  gclid: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  email: string;
  passwordHash: string | null;
  authProvider: string | null;
  stripeCustomerId: string | null;
  planTier: string;
  createdAt: Date;
};

export type Subscription = {
  id: string;
  userId: string;
  stripeSubscriptionId: string | null;
  plan: string;
  interval: string;
  status: string;
  currentPeriodEnd: Date | null;
  createdAt: Date;
};

export type Candidate = {
  id: string;
  searchId: string;
  displayName: string;
  avatarUrl: string | null;
  location: string | null;
  confidence: number | null;
};

export type Search = {
  id: string;
  userId: string | null;
  funnelSessionId: string | null;
  queryName: string;
  queryEmail: string | null;
  mode: string;
  status: string;
  createdAt: Date;
  completedAt: Date | null;
};

export type SearchEvent = {
  id: string;
  searchId: string;
  seq: number;
  type: string;
  payloadJson: string;
  createdAt: Date;
};

export type Source = {
  id: string;
  searchId: string;
  url: string;
  title: string | null;
  domain: string | null;
  snippet: string | null;
  fetchedAt: Date;
};

export type Claim = {
  id: string;
  searchId: string;
  sourceId: string | null;
  section: string;
  text: string;
  confidence: number | null;
};

export type Artifact = {
  id: string;
  searchId: string;
  format: string;
  body: string;
  unlocked: boolean;
  createdAt: Date;
};

type DbShape = {
  funnelSessions: FunnelSession[];
  users: User[];
  subscriptions: Subscription[];
  candidates: Candidate[];
  searches: Search[];
  searchEvents: SearchEvent[];
  sources: Source[];
  claims: Claim[];
  artifacts: Artifact[];
};

const defaultDb: DbShape = {
  funnelSessions: [],
  users: [],
  subscriptions: [],
  candidates: [],
  searches: [],
  searchEvents: [],
  sources: [],
  claims: [],
  artifacts: [],
};

function dbPath() {
  const raw =
    process.env.DATABASE_URL?.replace(/^file:/, "") ??
    path.join(process.cwd(), "data", "deepchq.json");
  const legacy = path.join(process.cwd(), "data", "deepsearch.json");
  if (!fs.existsSync(raw) && fs.existsSync(legacy)) {
    fs.copyFileSync(legacy, raw);
  }
  const dir = path.dirname(raw);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return raw;
}

function reviveDates<T extends Record<string, unknown>>(row: T): T {
  const out = { ...row };
  for (const key of Object.keys(out)) {
    const val = out[key];
    if (
      typeof val === "string" &&
      /^\d{4}-\d{2}-\d{2}T/.test(val) &&
      (key.endsWith("At") || key === "currentPeriodEnd")
    ) {
      (out as Record<string, unknown>)[key] = new Date(val);
    }
  }
  return out;
}

function readDb(): DbShape {
  const file = dbPath();
  if (!fs.existsSync(file)) {
    writeDb(defaultDb);
    return structuredClone(defaultDb);
  }
  const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as DbShape;
  return {
    funnelSessions: parsed.funnelSessions.map((r) => reviveDates(r)),
    users: parsed.users.map((r) => reviveDates(r)),
    subscriptions: parsed.subscriptions.map((r) => reviveDates(r)),
    candidates: parsed.candidates.map((r) => reviveDates(r)),
    searches: parsed.searches.map((r) => reviveDates(r)),
    searchEvents: parsed.searchEvents.map((r) => reviveDates(r)),
    sources: parsed.sources.map((r) => reviveDates(r)),
    claims: parsed.claims.map((r) => reviveDates(r)),
    artifacts: parsed.artifacts.map((r) => reviveDates(r)),
  };
}

function writeDb(data: DbShape) {
  fs.writeFileSync(dbPath(), JSON.stringify(data, null, 2));
}

function mutate(fn: (data: DbShape) => void) {
  const data = readDb();
  fn(data);
  writeDb(data);
}

export const dbClient = {
  funnel: {
    create(row: FunnelSession) {
      mutate((d) => {
        d.funnelSessions.push(row);
      });
    },
    update(id: string, patch: Partial<FunnelSession>) {
      mutate((d) => {
        const i = d.funnelSessions.findIndex((s) => s.id === id);
        if (i >= 0) d.funnelSessions[i] = { ...d.funnelSessions[i], ...patch };
      });
    },
    get(id: string) {
      return readDb().funnelSessions.find((s) => s.id === id) ?? null;
    },
  },
  users: {
    create(row: User) {
      mutate((d) => {
        if (d.users.some((u) => u.email === row.email)) {
          throw new Error("duplicate email");
        }
        d.users.push(row);
      });
    },
    get(id: string) {
      return readDb().users.find((u) => u.id === id) ?? null;
    },
    getByEmail(email: string) {
      return readDb().users.find((u) => u.email === email) ?? null;
    },
    update(id: string, patch: Partial<User>) {
      mutate((d) => {
        const i = d.users.findIndex((u) => u.id === id);
        if (i >= 0) d.users[i] = { ...d.users[i], ...patch };
      });
    },
  },
  subscriptions: {
    create(row: Subscription) {
      mutate((d) => {
        d.subscriptions.push(row);
      });
    },
  },
  candidates: {
    listBySearch(searchId: string) {
      return readDb().candidates.filter((c) => c.searchId === searchId);
    },
    create(row: Candidate) {
      mutate((d) => {
        d.candidates.push(row);
      });
    },
  },
  searches: {
    create(row: Search) {
      mutate((d) => {
        d.searches.push(row);
      });
    },
    update(id: string, patch: Partial<Search>) {
      mutate((d) => {
        const i = d.searches.findIndex((s) => s.id === id);
        if (i >= 0) d.searches[i] = { ...d.searches[i], ...patch };
      });
    },
    get(id: string) {
      return readDb().searches.find((s) => s.id === id) ?? null;
    },
    list(userId?: string | null, limit = 20) {
      const rows = readDb().searches;
      const filtered = userId ? rows.filter((s) => s.userId === userId) : rows;
      return filtered
        .slice()
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limit);
    },
  },
  searchEvents: {
    create(row: SearchEvent) {
      mutate((d) => {
        d.searchEvents.push(row);
      });
    },
    listBySearch(searchId: string) {
      return readDb()
        .searchEvents.filter((e) => e.searchId === searchId)
        .sort((a, b) => a.seq - b.seq);
    },
  },
  sources: {
    create(row: Source) {
      mutate((d) => {
        d.sources.push(row);
      });
    },
    listBySearch(searchId: string) {
      return readDb().sources.filter((s) => s.searchId === searchId);
    },
  },
  claims: {
    create(row: Claim) {
      mutate((d) => {
        d.claims.push(row);
      });
    },
  },
  artifacts: {
    create(row: Artifact) {
      mutate((d) => {
        d.artifacts.push(row);
      });
    },
    listBySearch(searchId: string) {
      return readDb()
        .artifacts.filter((a) => a.searchId === searchId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    getFirst(searchId: string) {
      return dbClient.artifacts.listBySearch(searchId)[0] ?? null;
    },
    unlock(searchId: string) {
      mutate((d) => {
        d.artifacts.forEach((a, i) => {
          if (a.searchId === searchId) d.artifacts[i] = { ...a, unlocked: true };
        });
      });
    },
  },
};
