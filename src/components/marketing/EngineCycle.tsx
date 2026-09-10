"use client";

import { useEffect, useState } from "react";
import { AI_ENGINES } from "@/lib/brand";

export function EngineCycle() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % AI_ENGINES.length), 1600);
    return () => clearInterval(id);
  }, []);

  const e = AI_ENGINES[i];
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: e.color }} />
      <span style={{ color: e.color }}>{e.name}</span>
    </span>
  );
}
