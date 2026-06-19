"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MarketingNav } from "@/components/MarketingNav";
import { MarketingFooter } from "@/components/MarketingFooter";
import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";

const POPULAR = ["Elon Musk", "Taylor Swift", "Kim Kardashian", "Playboi Carti"];

const USE_CASES = [
  { title: "Full Name", desc: "Discover the name(s) linked to the number." },
  { title: "Social Accounts", desc: "Reveal associated profiles across major platforms." },
  { title: "Email Address", desc: "Find public emails associated with the contact." },
  { title: "City & Region", desc: "See the most likely location data." },
  { title: "Connections", desc: "Get insights into related individuals." },
  { title: "Web Mentions", desc: "Explore where the person appears online." },
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function search(name?: string) {
    const q = name ?? query;
    if (!q.trim()) return;
    router.push(`/landing/register?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <MarketingNav dark />
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">
          Welcome to <span className="text-blue-500">{BRAND_NAME}</span>
        </h1>
        <p className="mt-4 text-gray-400">
          Find people by name. Access their social profiles in seconds.
        </p>
        <div className="mx-auto mt-10 flex max-w-xl items-center rounded-full bg-white p-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter full name to search..."
            className="flex-1 bg-transparent px-4 text-gray-900 outline-none"
            onKeyDown={(e) => e.key === "Enter" && search()}
          />
          <button
            type="button"
            onClick={() => search()}
            className="rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white"
          >
            Search Now ↑
          </button>
        </div>
        <p className="mt-6 text-sm text-gray-500">Popular people searched in US 🇺🇸</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {POPULAR.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => search(p)}
              className="rounded-full border border-gray-700 px-4 py-1 text-sm text-gray-300 hover:border-gray-500"
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      <section id="use-cases" className="bg-white px-6 py-20 text-gray-900">
        <h2 className="text-center text-3xl font-bold text-gray-400">Use Cases</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-gray-600">
          Explore how {BRAND_NAME} can help in real-world scenarios.
        </p>
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((u) => (
            <div key={u.title} className="rounded-2xl bg-gray-100 p-6">
              <h3 className="font-semibold">{u.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-2xl px-6 py-20">
        <h2 className="text-center text-2xl font-bold">FAQ</h2>
        <dl className="mt-8 space-y-4 text-sm text-gray-400">
          <div>
            <dt className="font-medium text-white">What is {BRAND_NAME}?</dt>
            <dd className="mt-1">
              A tool that helps you uncover digital footprints connected to names,
              numbers, or emails from public sources.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-white">Is it safe and legal?</dt>
            <dd className="mt-1">
              We only use publicly available information. Not for employment or credit
              screening.
            </dd>
          </div>
        </dl>
        <div className="mt-12 text-center">
          <Link
            href="/landing4/step1"
            className="inline-block rounded-full bg-white px-8 py-3 font-medium text-black"
          >
            Try Now
          </Link>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
