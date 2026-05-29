"use client";

import { useEffect, useState } from "react";

export function ScanProgress({
  searchId,
  onComplete,
}: {
  searchId: string;
  onComplete: () => void;
}) {
  const [sourcesScanned, setSourcesScanned] = useState(0);
  const [message, setMessage] = useState("Initializing scan…");
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    const es = new EventSource(`/api/search/${searchId}/events`);
    es.onmessage = (ev) => {
      const data = JSON.parse(ev.data) as {
        type: string;
        payload?: { message?: string; sourcesScanned?: number; plan?: string[] };
      };
      if (data.payload?.message) setMessage(data.payload.message);
      if (data.payload?.sourcesScanned != null)
        setSourcesScanned(data.payload.sourcesScanned);
      if (data.type === "plan" && data.payload?.plan) {
        setSteps(data.payload.plan);
      }
      if (data.type === "done") {
        es.close();
        onComplete();
      }
    };
    return () => es.close();
  }, [searchId, onComplete]);

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-2 flex items-center justify-between text-sm font-medium">
        <span>Scanning public sources</span>
        <span className="text-blue-600">✨ {sourcesScanned || "…"} sources</span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full bg-blue-600 transition-all duration-500"
          style={{ width: `${Math.min(95, sourcesScanned * 8)}%` }}
        />
      </div>
      <p className="text-sm text-gray-600">{message}</p>
      <ul className="mt-4 space-y-1 text-xs text-gray-500">
        {steps.map((s) => (
          <li key={s}>✓ {s}</li>
        ))}
      </ul>
    </div>
  );
}
