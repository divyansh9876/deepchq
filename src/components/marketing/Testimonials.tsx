"use client";

import { useEffect, useState } from "react";
import { TESTIMONIALS } from "@/lib/marketing";

export function Testimonials() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % TESTIMONIALS.length), 6500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-violet-100 bg-white p-8 text-center shadow-sm">
      <p key={t.name} className="fade-swap font-display text-xl leading-relaxed text-slate-800 md:text-2xl">
        “{t.quote}”
      </p>
      <p className="mt-6 text-sm font-semibold text-violet-800">{t.name}</p>
      <p className="text-sm text-slate-500">{t.role}</p>
      <div className="mt-6 flex justify-center gap-2">
        {TESTIMONIALS.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Show quote ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`h-2.5 rounded-full transition-all ${i === idx ? "w-8 bg-violet-600" : "w-2.5 bg-amber-200"}`}
          />
        ))}
      </div>
    </div>
  );
}
