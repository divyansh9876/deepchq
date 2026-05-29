"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MarketingNav } from "@/components/MarketingNav";
import { MarketingFooter } from "@/components/MarketingFooter";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { LatestResultsTable } from "@/components/marketing/LatestResultsTable";
import { PopularSearchChips } from "@/components/marketing/PopularSearchChips";
import { TruthLensHook } from "@/components/marketing/TruthLensHook";
import { BRAND_NAME } from "@/lib/brand";
import {
  getFaqItems,
  LATEST_RESULTS,
  POPULAR_SEARCHES,
  TESTIMONIALS,
  USE_CASES,
} from "@/lib/marketing/home-content";

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const faqItems = getFaqItems();

  function search(name?: string) {
    const q = name ?? query;
    if (!q.trim()) return;
    router.push(`/landing/register?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <MarketingNav />

      <section className="mx-auto max-w-4xl px-6 pb-8 pt-16 text-center md:pt-20">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Welcome to <span className="text-blue-600">{BRAND_NAME}</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Find people by name. Access their social profiles in seconds.
        </p>

        <div className="mx-auto mt-10 flex max-w-xl items-center rounded-full border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-200/60">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter full name to search..."
            className="flex-1 bg-transparent px-5 py-3 text-slate-900 outline-none placeholder:text-slate-400"
            onKeyDown={(e) => e.key === "Enter" && search()}
          />
          <button type="button" onClick={() => search()} className="btn-primary shrink-0 !py-3">
            Search Now
          </button>
        </div>

        <p className="mt-10 text-sm text-slate-500">Popular people searched in US 🇺🇸</p>
        <PopularSearchChips items={POPULAR_SEARCHES} onSelect={search} />
      </section>

      <section id="use-cases" className="marketing-section bg-slate-50">
        <h2 className="text-center text-3xl font-bold text-slate-900">Use Cases</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          Explore how {BRAND_NAME} can help in real-world scenarios.
        </p>
        <p className="mx-auto mt-1 max-w-xl text-center text-sm text-slate-500">
          From recruiting to reconnecting, the possibilities are endless.
        </p>
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((u) => (
            <article
              key={u.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-base font-semibold text-slate-900">{u.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{u.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="results" className="marketing-section border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-slate-900">Latest Results</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            Here are some of the latest results from our search service.
          </p>
          <div className="mt-10">
            <LatestResultsTable rows={LATEST_RESULTS} />
          </div>
        </div>
      </section>

      <TruthLensHook />

      <section className="marketing-section bg-slate-50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold leading-snug text-slate-900 md:text-4xl">
            Thousands Are Uncovering
            <br />
            the Truth with <span className="text-blue-600">{BRAND_NAME}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-slate-600">
            See how real users are revealing connections, protecting loved ones, and
            satisfying their curiosity — all with just one search.
          </p>
        </div>
        <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm leading-relaxed text-slate-600">{t.quote}</p>
              <footer className="mt-5 border-t border-slate-100 pt-4">
                <p className="font-semibold text-slate-900">{t.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">{t.location}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section id="faq" className="marketing-section mx-auto max-w-2xl">
        <h2 className="text-center text-3xl font-bold text-slate-900">
          Frequently Asked Questions
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-sm text-slate-600">
          Curious how {BRAND_NAME} works? We&apos;ve answered the most common questions
          to help you get started with ease.
        </p>
        <div className="mt-10">
          <FaqAccordion items={faqItems} />
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link href="/landing/register" className="btn-primary !px-10 !py-3.5">
            Join now
          </Link>
          <Link href="/ads/google/step/1" className="btn-outline !px-10 !py-3.5">
            Try Now
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
