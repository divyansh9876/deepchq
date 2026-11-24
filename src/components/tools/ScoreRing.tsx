"use client";

import { useEffect, useState } from "react";
import { scoreTone } from "@/lib/score";

export function ScoreRing({ score, size = 160, label }: { score: number; size?: number; label?: string }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setShown(score);
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 1200);
      setShown(Math.round(score * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  const tone = scoreTone(score);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={10} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone.stroke}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (shown / 100) * c}
        />
      </svg>
      <div className="absolute text-center">
        <p className={`font-display text-4xl font-semibold ${tone.text}`} style={{ fontSize: size / 4 }}>{shown}</p>
        <p className="text-xs font-medium text-slate-500">{label ?? tone.label}</p>
      </div>
    </div>
  );
}
