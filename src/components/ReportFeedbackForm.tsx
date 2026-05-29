"use client";

import { useState } from "react";

export function ReportFeedbackForm({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/report-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email || undefined, message }),
    });
    if (res.ok) setSent(true);
  }

  return (
    <form onSubmit={submit} className={className}>
      <h2 className="font-semibold">Report inaccurate information</h2>
      <p className="mt-1 text-sm text-gray-500">
        Public sources only. Help us improve result quality.
      </p>
      {sent ? (
        <p className="mt-4 text-sm text-green-700">Thank you — we received your report.</p>
      ) : (
        <>
          <input
            type="email"
            placeholder="Your email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-4 w-full rounded-lg border px-3 py-2 text-sm"
          />
          <textarea
            required
            minLength={10}
            placeholder="Describe what seems incorrect…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"
            rows={4}
          />
          <button
            type="submit"
            className="mt-3 rounded-full border px-4 py-2 text-sm font-medium"
          >
            Submit feedback
          </button>
        </>
      )}
    </form>
  );
}
