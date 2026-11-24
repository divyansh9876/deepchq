"use client";

import { createContext, useCallback, useContext, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

// ---------- Toasts ----------
type Toast = { id: number; msg: string; tone: "ok" | "error"; upgrade?: boolean };
const ToastCtx = createContext<(msg: string, tone?: Toast["tone"], upgrade?: boolean) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((msg: string, tone: Toast["tone"] = "ok", upgrade = false) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, tone, upgrade }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), upgrade ? 9000 : 4500);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`fade-swap pointer-events-auto rounded-xl px-4 py-3 text-sm shadow-lg ring-1 ${
              t.tone === "error" ? "bg-white text-rose-700 ring-rose-200" : "bg-slate-900 text-white ring-slate-800"
            }`}
          >
            {t.msg}
            {t.upgrade && (
              <Link href="/settings" className="ml-2 font-semibold text-teal-700 underline">
                Upgrade
              </Link>
            )}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);

/** fetch wrapper: parses JSON, raises a toast on error, redirects to login on 401. */
export function useApi() {
  const toast = useToast();
  const router = useRouter();
  return useCallback(
    async <T,>(url: string, init?: RequestInit & { json?: unknown; quiet?: boolean }): Promise<T | null> => {
      const res = await fetch(url, {
        ...init,
        headers: init?.json !== undefined ? { "Content-Type": "application/json", ...(init?.headers ?? {}) } : init?.headers,
        body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
      });
      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
        return null;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (!init?.quiet) toast(data.error ?? "Something went wrong", "error", !!data.upgrade);
        return null;
      }
      return data as T;
    },
    [router, toast],
  );
}

// ---------- Charts ----------
export function Sparkline({ values, width = 120, height = 32, color = "#0d9488" }: { values: number[]; width?: number; height?: number; color?: string }) {
  if (values.length < 2) return <div style={{ width, height }} className="flex items-center text-xs text-slate-300">—</div>;
  const max = Math.max(100, ...values);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * width, height - 2 - (v / max) * (height - 4)]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return (
    <svg width={width} height={height} aria-hidden>
      <path d={`${d} L${width},${height} L0,${height} Z`} fill={color} opacity={0.1} />
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts.at(-1)![0]} cy={pts.at(-1)![1]} r={3} fill={color} />
    </svg>
  );
}

export function TrendChart({ points }: { points: { at: string | Date; visibilityRate: number; citationRate: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const H = 180;
  const pad = { l: 32, r: 12, t: 12, b: 24 };
  if (points.length < 2) {
    return <div className="flex h-44 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-400">The trend appears after your second scan. Scheduled scans add points automatically.</div>;
  }
  const x = (i: number) => pad.l + (i / (points.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / 100) * (H - pad.t - pad.b);
  const line = (k: "visibilityRate" | "citationRate") => points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p[k])}`).join(" ");
  const fmt = (d: string | Date) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const h = hover != null ? points[hover] : null;
  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const rel = ((e.clientX - r.left) / r.width) * W;
          const i = Math.round(((rel - pad.l) / (W - pad.l - pad.r)) * (points.length - 1));
          setHover(Math.max(0, Math.min(points.length - 1, i)));
        }}
      >
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="#e2e8f0" strokeDasharray={v ? "3 4" : undefined} />
            <text x={pad.l - 6} y={y(v) + 4} textAnchor="end" fontSize={10} fill="#94a3b8">{v}</text>
          </g>
        ))}
        <path d={`${line("visibilityRate")} L${x(points.length - 1)},${y(0)} L${x(0)},${y(0)} Z`} fill="#0d9488" opacity={0.08} />
        <path d={line("visibilityRate")} fill="none" stroke="#0d9488" strokeWidth={2.5} strokeLinejoin="round" />
        <path d={line("citationRate")} fill="none" stroke="#7c3aed" strokeWidth={2} strokeDasharray="5 4" strokeLinejoin="round" />
        <text x={pad.l} y={H - 6} fontSize={10} fill="#94a3b8">{fmt(points[0].at)}</text>
        <text x={W - pad.r} y={H - 6} fontSize={10} fill="#94a3b8" textAnchor="end">{fmt(points.at(-1)!.at)}</text>
        {h && hover != null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} stroke="#cbd5e1" />
            <circle cx={x(hover)} cy={y(h.visibilityRate)} r={4.5} fill="#0d9488" stroke="#fff" strokeWidth={2} />
            <circle cx={x(hover)} cy={y(h.citationRate)} r={4} fill="#7c3aed" stroke="#fff" strokeWidth={2} />
          </g>
        )}
      </svg>
      {h && hover != null && (
        <div
          className="pointer-events-none absolute top-0 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg"
          style={{ left: `clamp(0px, calc(${(x(hover) / W) * 100}% - 60px), calc(100% - 130px))` }}
        >
          <p className="font-semibold">{fmt(h.at)}</p>
          <p><span className="text-teal-300">●</span> Visibility {h.visibilityRate}%</p>
          <p><span className="text-violet-300">●</span> Citations {h.citationRate}%</p>
        </div>
      )}
      <div className="mt-2 flex gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-teal-600" />Visibility</span>
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 border-t-2 border-dashed border-violet-600" />Citation rate</span>
      </div>
    </div>
  );
}

export function timeAgo(d: string | Date | null | undefined) {
  if (!d) return "never";
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}

// ---------- App chrome ----------
export function AppNav({ plan }: { plan?: string }) {
  const router = useRouter();
  const path = usePathname();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }
  const link = (href: string, label: string) => (
    <Link href={href} className={`rounded-lg px-3 py-1.5 ${(path.startsWith(href) || (href === "/dashboard" && path.startsWith("/brands"))) ? "bg-teal-50 font-medium text-teal-700" : "text-slate-600 hover:text-slate-900"}`}>
      {label}
    </Link>
  );
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3">
        <Logo />
        <nav className="flex items-center gap-1 text-sm">
          {link("/dashboard", "Brands")}
          {link("/settings", "Settings")}
          {plan && (
            <Link href="/settings" className="ml-1 hidden rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold capitalize text-violet-700 ring-1 ring-violet-100 sm:inline">
              {plan}
            </Link>
          )}
          <button type="button" onClick={logout} className="ml-2 text-slate-400 hover:text-slate-700">
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}

// ---------- Inputs ----------
export function ChipInput({ values, onChange, placeholder }: { values: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const parts = draft.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) onChange([...new Set([...values, ...parts])].slice(0, 8));
    setDraft("");
  };
  return (
    <div className="input flex min-h-[46px] flex-wrap items-center gap-1.5 py-1.5">
      {values.map((v) => (
        <span key={v} className="flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-0.5 text-sm text-violet-700 ring-1 ring-violet-100">
          {v}
          <button type="button" aria-label={`Remove ${v}`} className="text-violet-400 hover:text-violet-700" onClick={() => onChange(values.filter((x) => x !== v))}>×</button>
        </span>
      ))}
      <input
        className="min-w-[8rem] flex-1 bg-transparent py-1 outline-none"
        placeholder={values.length ? "" : placeholder}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={add}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          } else if (e.key === "Backspace" && !draft && values.length) onChange(values.slice(0, -1));
        }}
      />
    </div>
  );
}

