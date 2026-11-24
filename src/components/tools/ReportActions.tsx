"use client";

import { useState } from "react";

export function ShareReport({ url, domain, score }: { url: string; domain: string; score: number }) {
  const [copied, setCopied] = useState(false);
  const text = `${domain} scored ${score}/100 on the AI search readiness audit`;
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className="btn-secondary"
        onClick={() => {
          void navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? "Link copied ✓" : "Copy report link"}
      </button>
      <a className="btn-secondary" target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}>Share on LinkedIn</a>
      <a className="btn-secondary" target="_blank" rel="noopener noreferrer" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}>Post on X</a>
    </div>
  );
}

export function EmailReport({ id }: { id: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  if (state === "done") return <p className="text-sm font-medium text-brand-700">Saved ✓ We&apos;ll email you when there&apos;s something worth fixing.</p>;
  return (
    <form
      className="flex flex-col gap-2 sm:flex-row"
      onSubmit={async (e) => {
        e.preventDefault();
        setState("busy");
        const res = await fetch("/api/public/audit", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, email }) });
        setState(res.ok ? "done" : "error");
      }}
    >
      <input className="input flex-1" type="email" required placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button className="btn-primary" disabled={state === "busy"}>{state === "busy" ? "Saving…" : "Email me this report"}</button>
      {state === "error" && <p className="text-sm text-red-600">Couldn&apos;t save — try again.</p>}
    </form>
  );
}
