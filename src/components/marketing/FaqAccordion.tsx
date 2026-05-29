"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/marketing/home-content";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <dl className="overflow-hidden rounded-2xl border border-slate-200 bg-white divide-y divide-slate-200">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <dt>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-slate-900 hover:bg-slate-50"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                {item.question}
                <span className="text-slate-400">{isOpen ? "−" : "+"}</span>
              </button>
            </dt>
            {isOpen && (
              <dd className="px-5 pb-4 text-sm leading-relaxed text-slate-600">
                {item.answer}
              </dd>
            )}
          </div>
        );
      })}
    </dl>
  );
}
