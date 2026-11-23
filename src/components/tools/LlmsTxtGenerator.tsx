"use client";

import { useMemo, useState } from "react";

type Link = { title: string; url: string; note: string; section: string };

const START: Link[] = [
  { section: "Product", title: "Features", url: "https://example.com/features", note: "What the product does" },
  { section: "Product", title: "Pricing", url: "https://example.com/pricing", note: "Plans and limits" },
  { section: "Guides", title: "Getting started", url: "https://example.com/docs/start", note: "Set up in 5 minutes" },
];

export function LlmsTxtGenerator() {
  const [name, setName] = useState("Acme");
  const [summary, setSummary] = useState("Acme is invoicing software for freelancers and small agencies. Free plan available; paid plans from $12/month.");
  const [details, setDetails] = useState("");
  const [links, setLinks] = useState<Link[]>(START);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    const sections = [...new Set(links.map((l) => l.section.trim() || "Docs"))];
    const optionalLast = sections.sort((a, b) => Number(a.toLowerCase() === "optional") - Number(b.toLowerCase() === "optional"));
    const body = optionalLast
      .map((sec) => {
        const items = links.filter((l) => (l.section.trim() || "Docs") === sec && l.url.trim());
        return items.length ? `## ${sec}\n${items.map((l) => `- [${l.title || l.url}](${l.url.trim()})${l.note ? `: ${l.note}` : ""}`).join("\n")}` : "";
      })
      .filter(Boolean)
      .join("\n\n");
    return `# ${name || "Your site"}\n\n> ${summary.replace(/\n+/g, " ")}\n${details ? `\n${details.trim()}\n` : ""}\n${body}\n`;
  }, [name, summary, details, links]);

  const update = (i: number, patch: Partial<Link>) => setLinks((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card space-y-4">
        <label className="block text-sm font-medium text-slate-700">Site or brand name<input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label className="block text-sm font-medium text-slate-700">One-paragraph summary<textarea className="input mt-1 min-h-20" value={summary} onChange={(e) => setSummary(e.target.value)} /></label>
        <label className="block text-sm font-medium text-slate-700">Extra details (optional)<textarea className="input mt-1 min-h-16" placeholder="Key facts, audience, what you don't do…" value={details} onChange={(e) => setDetails(e.target.value)} /></label>
        <div>
          <p className="text-sm font-medium text-slate-700">Key links</p>
          <div className="mt-2 space-y-3">
            {links.map((l, i) => (
              <div key={i} className="grid gap-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-2">
                <input className="input" placeholder="Section (e.g. Docs)" value={l.section} onChange={(e) => update(i, { section: e.target.value })} />
                <input className="input" placeholder="Title" value={l.title} onChange={(e) => update(i, { title: e.target.value })} />
                <input className="input sm:col-span-2" placeholder="https://…" value={l.url} onChange={(e) => update(i, { url: e.target.value })} />
                <div className="flex gap-2 sm:col-span-2">
                  <input className="input flex-1" placeholder="Short note" value={l.note} onChange={(e) => update(i, { note: e.target.value })} />
                  <button type="button" aria-label="Remove link" className="rounded-lg px-3 text-slate-400 hover:bg-rose-50 hover:text-rose-600" onClick={() => setLinks((ls) => ls.filter((_, j) => j !== i))}>✕</button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="btn-secondary mt-3" onClick={() => setLinks((ls) => [...ls, { section: ls.at(-1)?.section ?? "Docs", title: "", url: "", note: "" }])}>+ Add link</button>
        </div>
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">llms.txt preview</p>
          <div className="flex gap-2">
            <button type="button" className="btn-secondary" onClick={() => { void navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? "Copied ✓" : "Copy"}</button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                const url = URL.createObjectURL(new Blob([output], { type: "text/plain" }));
                const a = document.createElement("a");
                a.href = url;
                a.download = "llms.txt";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download
            </button>
          </div>
        </div>
        <pre className="mt-3 max-h-[70vh] overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-5 text-[13px] leading-relaxed text-slate-100">{output}</pre>
        <p className="mt-3 text-xs text-slate-500">Upload it to your site root so it loads at https://yourdomain.com/llms.txt.</p>
      </div>
    </div>
  );
}
