"use client";

import { useState } from "react";
import Link from "next/link";
import type { PersonReport } from "@/lib/types";
import { AppDisclaimer } from "./AppSidebar";

const PLATFORM_ICON: Record<string, string> = {
  facebook: "f",
  instagram: "📷",
  x: "𝕏",
  tiktok: "♪",
  linkedin: "in",
  youtube: "▶",
};

function SourceChips({ domains, locked }: { domains: string[]; locked: boolean }) {
  if (!domains.length) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {domains.slice(0, 8).map((d) => (
        <span
          key={d}
          className={`rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600 ${locked ? "blur-sm" : ""}`}
        >
          {d}
        </span>
      ))}
      <span className="text-xs text-gray-400">{domains.length} sources</span>
    </div>
  );
}

function FindWithAiPanel({ queryName }: { queryName: string }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const questions = [
    "Where does this person live?",
    "What is their approximate age or birth year?",
    "Do you know any social media username?",
    "Any workplace, school, or company name?",
  ];

  return (
    <div className="rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50 to-white p-6">
      <p className="text-sm font-semibold text-violet-900">Find with AI</p>
      <p className="mt-2 text-sm text-gray-600">
        Unfortunately, we couldn&apos;t find a profile that clearly matches{" "}
        <strong>{queryName}</strong>. Answer {questions.length} quick questions and
        we&apos;ll refine the search.
      </p>
      <p className="mt-4 text-sm font-medium text-gray-800">{questions[step]}</p>
      <input
        type="text"
        value={answers[step] ?? ""}
        onChange={(e) => {
          const next = [...answers];
          next[step] = e.target.value;
          setAnswers(next);
        }}
        placeholder="Type your answer..."
        className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
      />
      <button
        type="button"
        onClick={() => {
          if (step < questions.length - 1) setStep(step + 1);
          else alert("Refined search will run in a future update. Try a more specific name.");
        }}
        className="mt-3 rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white"
      >
        {step < questions.length - 1 ? "Next" : "Search again"}
      </button>
    </div>
  );
}

export function DeepSearchResults({
  report,
  locked,
  onUnlock,
  unlockLoading,
}: {
  report: PersonReport;
  locked: boolean;
  onUnlock?: () => void;
  unlockLoading?: boolean;
}) {
  const [bioExpanded, setBioExpanded] = useState(false);
  const [confirmed, setConfirmed] = useState<boolean | null>(null);
  const [followUps, setFollowUps] = useState<{ q: string; a: string }[]>([]);
  const [followUpInput, setFollowUpInput] = useState("");

  const bio = report.biography ?? report.aiSummary ?? "";
  const bioPreview = bio.length > 420 && !bioExpanded ? `${bio.slice(0, 420)}...` : bio;
  const social = report.socialProfiles ?? [];
  const domains = report.sourceDomains ?? [];
  const paa = report.peopleAlsoAsk ?? [];

  function copyBio() {
    navigator.clipboard.writeText(bio).catch(() => {});
  }

  function submitFollowUp() {
    if (!followUpInput.trim()) return;
    setFollowUps((prev) => [
      ...prev,
      { q: followUpInput.trim(), a: `Based on public sources for ${report.queryName}, we would cross-reference directories and social signals. Full AI follow-up requires an unlocked report.` },
    ]);
    setFollowUpInput("");
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 text-xl font-bold text-white">
              {report.queryName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{report.queryName}</h1>
              {report.subtitle && (
                <p className="mt-0.5 text-sm text-gray-500">{report.subtitle}</p>
              )}
            </div>
          </div>

          {report.lowConfidence && !locked && (
            <div className="mt-8">
              <FindWithAiPanel queryName={report.queryName} />
            </div>
          )}

          {bio && (
            <div className={`mt-8 ${locked ? "relative" : ""}`}>
              <div
                className={`text-sm leading-relaxed text-gray-700 ${locked ? "blur-[4px] select-none" : ""}`}
              >
                {bioPreview}
              </div>
              {!locked && bio.length > 420 && (
                <button
                  type="button"
                  onClick={() => setBioExpanded(!bioExpanded)}
                  className="mt-2 text-sm font-medium text-blue-600"
                >
                  {bioExpanded ? "Show less" : "Show More"}
                </button>
              )}
              {!locked && (
                <button
                  type="button"
                  onClick={copyBio}
                  className="ml-4 text-sm text-gray-500 hover:text-gray-800"
                >
                  Copy
                </button>
              )}
              <SourceChips domains={domains} locked={locked} />
            </div>
          )}

          {!report.lowConfidence && (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-sm font-medium text-gray-900">
                Is this the person you were looking for?
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmed(false)}
                  className={`rounded-full border px-6 py-2 text-sm font-medium ${confirmed === false ? "border-gray-900 bg-gray-100" : ""}`}
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmed(true)}
                  className={`rounded-full border px-6 py-2 text-sm font-medium ${confirmed === true ? "border-gray-900 bg-gray-900 text-white" : ""}`}
                >
                  Yes
                </button>
              </div>
              {confirmed === false && (
                <p className="mt-3 text-sm text-gray-500">
                  Try a more specific name or use{" "}
                  <Link href="/chat" className="text-blue-600 underline">
                    New Search
                  </Link>
                  .
                </p>
              )}
            </div>
          )}

          {locked && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm text-amber-900">
                Preview mode — unlock to see social accounts, full bio, and follow-up
                questions.
              </p>
              <button
                type="button"
                onClick={onUnlock}
                disabled={unlockLoading}
                className="mt-3 rounded-full bg-gray-900 px-6 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {unlockLoading ? "Loading…" : "Unlock full report"}
              </button>
            </div>
          )}

          {social.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-semibold text-gray-900">Social Accounts</h2>
              <ul className={`mt-4 space-y-2 ${locked ? "blur-md select-none" : ""}`}>
                {social.map((s) => (
                  <li key={s.platform}>
                    <a
                      href={locked ? "#" : s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-gray-300"
                      onClick={(e) => locked && e.preventDefault()}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold">
                        {PLATFORM_ICON[s.platform] ?? "•"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">{s.label}</p>
                        <p className="truncate text-xs text-gray-500">
                          {s.handle} • {s.label}
                        </p>
                      </div>
                      <span className="text-gray-400">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {paa.length > 0 && (
            <section className={`mt-10 ${locked ? "blur-sm select-none" : ""}`}>
              <h2 className="text-lg font-semibold text-gray-900">People also ask</h2>
              <ul className="mt-4 space-y-2">
                {paa.map((q) => (
                  <li
                    key={q}
                    className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700"
                  >
                    {q}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
            <p className="mt-1 text-sm text-gray-500">
              Is there anything else you are curious about?
            </p>
            {followUps.map((item, i) => (
              <div key={i} className="mt-4 rounded-xl bg-gray-100 p-4 text-sm">
                <p className="font-medium text-gray-900">{item.q}</p>
                <p className="mt-2 text-gray-600">{item.a}</p>
              </div>
            ))}
            {!locked && (
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={followUpInput}
                  onChange={(e) => setFollowUpInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitFollowUp()}
                  placeholder="Ask a follow-up"
                  className="flex-1 rounded-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                />
                <button
                  type="button"
                  onClick={submitFollowUp}
                  className="rounded-full bg-gray-900 px-5 py-3 text-sm font-medium text-white"
                >
                  Ask now
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
      <AppDisclaimer />
    </div>
  );
}
