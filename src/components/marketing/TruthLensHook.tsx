"use client";

import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";

/**
 * DeepSearch-style CTA: magnifying lens highlights "truth" in the headline.
 */
export function TruthLensHook({
  tryHref = "/ads/google/step/1",
}: {
  tryHref?: string;
}) {
  return (
    <section className="bg-white px-6 py-16 md:py-20">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-black/5">
        {/* Dotted world-map texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          aria-hidden
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgb(209 213 219) 1px, transparent 0),
              radial-gradient(ellipse 85% 55% at 50% 45%, rgb(243 244 246) 0%, transparent 70%)
            `,
            backgroundSize: "22px 22px, 100% 100%",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          aria-hidden
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Cpath fill='none' stroke='%239ca3af' stroke-width='0.6' d='M120 180c40-30 90-35 130-10 25 18 55 22 85 12 70-25 140-15 200 20 45 25 95 30 140 10 55-25 110-20 155 5M200 220c-30 40-80 55-125 35-35-15-75-10-105 15-40 30-95 35-140 15'/%3E%3C/svg%3E")`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "min(100%, 720px)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center px-6 py-14 text-center md:py-20">
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-gray-800 md:text-4xl md:leading-snug">
            Join thousands who are revealing the{" "}
            <TruthWord /> with {BRAND_NAME}.
          </h2>

          <Link
            href={tryHref}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-gray-800 hover:shadow-xl"
          >
            <span className="text-lg leading-none" aria-hidden>
              +
            </span>
            Try Now
          </Link>
        </div>
      </div>
    </section>
  );
}

function TruthWord() {
  return (
    <span className="relative mx-0.5 inline-block align-baseline">
      <span className="relative z-0 font-semibold text-gray-400">truth</span>

      {/* Blue "truth" visible only inside the lens circle */}
      <span
        className="absolute left-0 top-0 z-10 font-semibold text-blue-600"
        style={{
          clipPath: "circle(34px at 50% 55%)",
          WebkitClipPath: "circle(34px at 50% 55%)",
        }}
        aria-hidden
      >
        truth
      </span>

      {/* Glass magnifier ring */}
      <span
        className="pointer-events-none absolute left-1/2 top-[52%] z-20 h-[4.25rem] w-[4.25rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/90 bg-white/25 shadow-[0_0_28px_rgba(255,255,255,0.95),0_8px_32px_rgba(59,130,246,0.15)] backdrop-blur-[2px] motion-safe:animate-lens-pulse"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute left-1/2 top-[52%] z-[19] h-[4.5rem] w-[4.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-blue-200/60"
        aria-hidden
      />
    </span>
  );
}
