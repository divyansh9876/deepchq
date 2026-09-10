"use client";

import { useState } from "react";
import { TESTIMONIALS } from "@/lib/marketing";

export function Testimonials() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];

  return (
    <div className="card mx-auto max-w-3xl text-center">
      <p className="font-display text-xl leading-relaxed text-slate-800 md:text-2xl">“{t.quote}”</p>
      <p className="mt-6 text-sm font-semibold text-slate-900">{t.name}</p>
      <p className="text-sm text-slate-500">{t.role}</p>
      <div className="mt-6 flex justify-center gap-2">
        {TESTIMONIALS.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Show quote ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`h-2.5 rounded-full transition-all ${i === idx ? "w-8 bg-brand-600" : "w-2.5 bg-slate-200"}`}
          />
        ))}
      </div>
    </div>
  );
}
