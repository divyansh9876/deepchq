"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isTyping } from "@/components/ui/fx";

type Cmd = { id: string; group: string; label: string; hint?: string; keys?: string; run: () => void };
type BrandLite = { id: string; name: string; domain: string; visibility: number | null };

/** Brand-page actions are delivered as a window event the report listens for. */
export type BrandCommand = "scan" | "audit" | "tab:overview" | "tab:prompts" | "tab:audit" | "tab:actions" | "tab:settings";
export const BRAND_COMMAND_EVENT = "dq:brand-command";
const brandCmd = (c: BrandCommand) => window.dispatchEvent(new CustomEvent<BrandCommand>(BRAND_COMMAND_EVENT, { detail: c }));

/** Subsequence match with a bonus for word starts; returns -1 for no match. */
function score(q: string, text: string) {
  if (!q) return 0;
  const t = text.toLowerCase();
  let ti = 0;
  let s = 0;
  for (const ch of q.toLowerCase()) {
    const at = t.indexOf(ch, ti);
    if (at < 0) return -1;
    s += at === ti ? 3 : 1;
    if (at === 0 || t[at - 1] === " ") s += 2;
    ti = at + 1;
  }
  return s - t.length * 0.01;
}

export function CommandPalette() {
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [brands, setBrands] = useState<BrandLite[] | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const onBrand = /^\/brands\/[^/]+/.test(path);

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    setSel(0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !isTyping(e) && !open) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("dq:palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("dq:palette", onOpen);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    fetch("/api/brands")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setBrands(d.brands.map((b: BrandLite) => ({ id: b.id, name: b.name, domain: b.domain, visibility: b.visibility }))))
      .catch(() => {});
  }, [open]);

  const commands = useMemo<Cmd[]>(() => {
    const go = (href: string) => () => router.push(href);
    const cmds: Cmd[] = [];
    if (onBrand) {
      cmds.push(
        { id: "scan", group: "This brand", label: "Run scan now", hint: "Ask every engine again", keys: "S", run: () => brandCmd("scan") },
        { id: "audit", group: "This brand", label: "Re-audit site", hint: "Run the 20 GEO checks", keys: "A", run: () => brandCmd("audit") },
        { id: "t1", group: "This brand", label: "Overview", keys: "1", run: () => brandCmd("tab:overview") },
        { id: "t2", group: "This brand", label: "Prompts", keys: "2", run: () => brandCmd("tab:prompts") },
        { id: "t3", group: "This brand", label: "GEO audit", keys: "3", run: () => brandCmd("tab:audit") },
        { id: "t4", group: "This brand", label: "Action plan", keys: "4", run: () => brandCmd("tab:actions") },
        { id: "t5", group: "This brand", label: "Brand settings", keys: "5", run: () => brandCmd("tab:settings") },
      );
    }
    for (const b of brands ?? []) {
      cmds.push({ id: `b-${b.id}`, group: "Brands", label: b.name, hint: `${b.domain}${b.visibility != null ? ` · ${b.visibility}% visible` : ""}`, run: go(`/brands/${b.id}`) });
    }
    cmds.push(
      { id: "dash", group: "Go to", label: "All brands", run: go("/dashboard") },
      { id: "new", group: "Go to", label: "Add a new brand", run: go("/dashboard?new=1") },
      { id: "settings", group: "Go to", label: "Account & billing", run: go("/settings") },
      { id: "plans", group: "Go to", label: "Compare plans", run: go("/settings?upgrade=growth") },
      { id: "tool", group: "Resources", label: "Free GEO audit tool", run: go("/tools/geo-audit") },
      { id: "llms", group: "Resources", label: "llms.txt generator", run: go("/tools/llms-txt-generator") },
      { id: "learn", group: "Resources", label: "GEO guides", run: go("/learn") },
      {
        id: "logout",
        group: "Account",
        label: "Log out",
        run: async () => {
          await fetch("/api/auth/logout", { method: "POST" });
          router.push("/login");
          router.refresh();
        },
      },
    );
    return cmds;
  }, [brands, onBrand, router]);

  const results = useMemo(() => {
    if (!q.trim()) return commands;
    const hits = commands
      .map((c) => ({ c, s: Math.max(score(q.trim(), c.label), score(q.trim(), `${c.group} ${c.label} ${c.hint ?? ""}`) - 2) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s);
    // Keep each group together, ordered by its best hit, so headers never repeat.
    const groupRank = new Map<string, number>();
    hits.forEach((h, i) => !groupRank.has(h.c.group) && groupRank.set(h.c.group, i));
    return hits.sort((a, b) => groupRank.get(a.c.group)! - groupRank.get(b.c.group)! || b.s - a.s).map((x) => x.c);
  }, [commands, q]);

  useEffect(() => setSel(0), [q]);
  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-i="${sel}"]`)?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  if (!open) return null;

  const run = (c: Cmd | undefined) => {
    if (!c) return;
    close();
    c.run();
  };

  let lastGroup = "";
  return (
    <div className="overlay-in fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 px-4 pt-[12vh] backdrop-blur-sm" onMouseDown={close}>
      <div
        role="dialog"
        aria-modal
        aria-label="Command palette"
        className="pop-in w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSel((s) => Math.min(results.length - 1, s + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSel((s) => Math.max(0, s - 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                run(results[sel]);
              } else if (e.key === "Escape") close();
            }}
            placeholder="Search brands, actions and pages…"
            className="h-14 flex-1 bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
            role="combobox"
            aria-expanded
            aria-controls="palette-list"
            aria-activedescendant={results[sel] ? `cmd-${results[sel].id}` : undefined}
          />
          <kbd className="kbd">Esc</kbd>
        </div>
        <div ref={list} id="palette-list" role="listbox" className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 && <p className="px-3 py-8 text-center text-sm text-slate-400">No matches for “{q}”</p>}
          {results.map((c, i) => {
            const header = c.group !== lastGroup ? c.group : null;
            lastGroup = c.group;
            return (
              <div key={c.id}>
                {header && <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{header}</p>}
                <button
                  id={`cmd-${c.id}`}
                  data-i={i}
                  role="option"
                  aria-selected={i === sel}
                  type="button"
                  onMouseMove={() => sel !== i && setSel(i)}
                  onClick={() => run(c)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${i === sel ? "bg-brand-50 text-brand-900" : "text-slate-700"}`}
                >
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${i === sel ? "bg-brand-500" : "bg-slate-300"}`} />
                  <span className="flex-1 truncate font-medium">{c.label}</span>
                  {c.hint && <span className="truncate text-xs text-slate-400">{c.hint}</span>}
                  {c.keys && <kbd className="kbd">{c.keys}</kbd>}
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 border-t border-slate-100 bg-slate-50 px-4 py-2 text-[11px] text-slate-400">
          <span><kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd> navigate</span>
          <span><kbd className="kbd">↵</kbd> open</span>
          <span className="ml-auto"><kbd className="kbd">/</kbd> or <kbd className="kbd">⌘K</kbd> anywhere</span>
        </div>
      </div>
    </div>
  );
}
