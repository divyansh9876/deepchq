"use client";

import { useState } from "react";
import { FAQS } from "@/lib/marketing";

export function FaqList({ items = FAQS }: { items?: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition hover:bg-brand-50"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="font-medium text-slate-900">{item.q}</span>
              <span className={`text-slate-400 transition ${isOpen ? "rotate-45" : ""}`}>+</span>
            </button>
            <div className={`faq-body ${isOpen ? "open" : ""}`}>
              <p className="min-h-0 overflow-hidden px-6 pb-5 text-sm leading-relaxed text-slate-600">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
