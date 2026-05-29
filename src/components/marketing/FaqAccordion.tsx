"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/marketing/home-content";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <dl className="divide-y divide-gray-800 border border-gray-800 rounded-2xl overflow-hidden">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <dt>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-white hover:bg-gray-900/50"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                {item.question}
                <span className="text-gray-500">{isOpen ? "−" : "+"}</span>
              </button>
            </dt>
            {isOpen && (
              <dd className="px-5 pb-4 text-sm leading-relaxed text-gray-400">
                {item.answer}
              </dd>
            )}
          </div>
        );
      })}
    </dl>
  );
}
