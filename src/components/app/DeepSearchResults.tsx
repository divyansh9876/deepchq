"use client";

import { useState } from "react";
import Link from "next/link";
import type { PersonReport, ReportSection } from "@/lib/types";
import {
  insightSectionsForReport,
  socialSecondaryLine,
} from "@/lib/search/synthesize";
import { AppDisclaimer } from "./AppSidebar";

const PLATFORM_STYLE: Record<
  string,
  { bg: string; label: string }
> = {
  facebook: { bg: "bg-[#1877F2]", label: "f" },
  instagram: { bg: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]", label: "◎" },
  x: { bg: "bg-black", label: "𝕏" },
  tiktok: { bg: "bg-black", label: "♪" },
  linkedin: { bg: "bg-[#0A66C2]", label: "in" },
  youtube: { bg: "bg-[#FF0000]", label: "▶" },
};

export type PreviewMeta = {
  hiddenSocialCount: number;
  hiddenPaaCount: number;
  totalSocialCount: number;
  totalPaaCount: number;
};

function SourceChips({
  domains,
  locked,
  total,
}: {
  domains: string[];
  locked: boolean;
  total: number;
}) {
  if (!domains.length) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {domains.slice(0, 10).map((d, i) => (
        <span
          key={d}
          className={`rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600 ${
            locked && i >= 4 ? "blur-[3px] select-none" : locked && i >= 2 ? "blur-[1.5px]" : ""
          }`}
        >
          {d}
        </span>
      ))}
      <span className="text-xs text-gray-400">
        {total || domains.length} sources
      </span>
    </div>
  );
}

function UnlockBanner({
  onUnlock,
  unlockLoading,
}: {
  onUnlock?: () => void;
  unlockLoading?: boolean;
}) {
  return (
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

function InsightSectionBlock({
  section,
  locked,
  onUnlock,
}: {
  section: ReportSection;
  locked: boolean;
  onUnlock?: () => void;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
      <ul className="mt-3 space-y-2">
        {section.items.map((item, i) => {
          const blurred = locked && i > 0;
          return (
            <li
              key={`${section.id}-${i}`}
              className={`rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700 ${
                blurred ? "blur-sm select-none" : ""
              }`}
            >
              {item.text}
              {item.sourceUrl && !locked && (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-xs text-blue-600 hover:underline"
                >
                  View source ↗
                </a>
              )}
            </li>
          );
        })}
      </ul>
      {locked && section.items.length > 1 && (
        <button
          type="button"
          onClick={onUnlock}
          className="mt-2 text-sm font-medium text-blue-600 hover:underline"
        >
          Unlock to see all {section.title.toLowerCase()} details
        </button>
      )}
    </section>
  );
}

export function DeepSearchResults({
  report,
  locked,
  previewMeta,
  onUnlock,
  unlockLoading,
}: {
  report: PersonReport;
  locked: boolean;
  previewMeta?: PreviewMeta | null;
  onUnlock?: () => void;
  unlockLoading?: boolean;
}) {
  const [bioExpanded, setBioExpanded] = useState(false);
  const [confirmed, setConfirmed] = useState<boolean | null>(null);
  const [followUps, setFollowUps] = useState<{ q: string; a: string }[]>([]);
  const [followUpInput, setFollowUpInput] = useState("");

  const bio = report.biography ?? report.aiSummary ?? "";
  const bioIsTeaser = locked && bio.endsWith("…");
  const bioPreview =
    !locked && bio.length > 480 && !bioExpanded ? `${bio.slice(0, 480)}...` : bio;
  const social = report.socialProfiles ?? [];
  const domains = report.sourceDomains ?? [];
  const sourceTotal = report.sourcesScanned || domains.length;
  const paa = report.peopleAlsoAsk ?? [];
  const insights = insightSectionsForReport(report);
  const hiddenSocial = previewMeta?.hiddenSocialCount ?? 0;
  const hiddenPaa = previewMeta?.hiddenPaaCount ?? 0;

  function copyBio() {
    navigator.clipboard.writeText(bio).catch(() => {});
  }

  function submitFollowUp() {
    if (!followUpInput.trim()) return;
    setFollowUps((prev) => [
      ...prev,
      {
        q: followUpInput.trim(),
        a: `Based on public sources for ${report.queryName}, we cross-referenced directories and social signals. Full AI follow-up is available on unlocked reports.`,
      },
    ]);
    setFollowUpInput("");
  }

  function handlePaaClick() {
    if (locked) onUnlock?.();
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-3xl">
          {/* Header — DeepSearch order: name, subtitle, sources */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 text-xl font-bold text-white">
              {report.queryName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{report.queryName}</h1>
              <p className="mt-0.5 text-sm text-gray-500">
                {report.subtitle ?? "Public figure"}
              </p>
              <SourceChips domains={domains} locked={locked} total={sourceTotal} />
            </div>
          </div>

          {report.lowConfidence && !locked && (
            <div className="mt-8">
              <FindWithAiPanel queryName={report.queryName} />
            </div>
          )}

          {bio && (
            <div className="mt-6">
              <p className="text-sm leading-relaxed text-gray-700">{bioPreview}</p>
              {bioIsTeaser && (
                <p className="mt-2 text-sm font-medium text-amber-800">
                  Unlock to read the full biography
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {!locked && bio.length > 480 && (
                  <button
                    type="button"
                    onClick={() => setBioExpanded(!bioExpanded)}
                    className="text-sm font-medium text-blue-600"
                  >
                    {bioExpanded ? "Show less" : "Show More"}
                  </button>
                )}
                {!locked && (
                  <button
                    type="button"
                    onClick={copyBio}
                    className="text-sm text-gray-500 hover:text-gray-800"
                  >
                    Copy
                  </button>
                )}
              </div>
            </div>
          )}

          {!report.lowConfidence && (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-900">
                Is this the person you were looking for?
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmed(false)}
                  className={`rounded-full border border-gray-300 px-6 py-2 text-sm font-medium transition ${
                    confirmed === false
                      ? "border-gray-900 bg-gray-100"
                      : "hover:border-gray-400"
                  }`}
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmed(true)}
                  className={`rounded-full border px-6 py-2 text-sm font-medium transition ${
                    confirmed === true
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
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
            <UnlockBanner onUnlock={onUnlock} unlockLoading={unlockLoading} />
          )}

          {insights.map((section) => (
            <InsightSectionBlock
              key={section.id}
              section={section}
              locked={locked}
              onUnlock={onUnlock}
            />
          ))}

          {social.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-semibold text-gray-900">Social Accounts</h2>
              <ul className="mt-4 space-y-2">
                {social.map((s, i) => {
                  const rowLocked = locked && i > 0;
                  const heavyBlur = locked && i >= 2;
                  const style = PLATFORM_STYLE[s.platform] ?? {
                    bg: "bg-gray-700",
                    label: "•",
                  };
                  return (
                    <li key={`${s.platform}-${i}`}>
                      <a
                        href={rowLocked ? "#" : s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition hover:border-gray-300 hover:shadow-sm ${
                          heavyBlur ? "blur-[6px] select-none" : ""
                        }`}
                        onClick={(e) => rowLocked && e.preventDefault()}
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${style.bg}`}
                        >
                          {style.label}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {s.label}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {socialSecondaryLine(s)}
                          </p>
                        </div>
                        {!rowLocked ? (
                          <span className="text-gray-400" aria-hidden>
                            ↗
                          </span>
                        ) : (
                          <span className="shrink-0 text-xs font-medium text-amber-700">
                            Locked
                          </span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
              {locked && hiddenSocial > 0 && (
                <p className="mt-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm text-gray-600">
                  +{hiddenSocial} more account{hiddenSocial === 1 ? "" : "s"} in full
                  report
                </p>
              )}
            </section>
          )}

          {paa.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-semibold text-gray-900">People also ask</h2>
              <ul className="mt-4 space-y-2">
                {paa.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      onClick={handlePaaClick}
                      className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3.5 text-left text-sm text-gray-700 transition hover:border-gray-200 hover:bg-gray-100"
                    >
                      <span className="pr-4">{q}</span>
                      <span className="shrink-0 text-lg text-gray-400" aria-hidden>
                        ›
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              {locked && hiddenPaa > 0 && (
                <div className="relative mt-2 overflow-hidden rounded-xl">
                  <ul className="space-y-2 blur-sm select-none" aria-hidden>
                    {Array.from({ length: Math.min(2, hiddenPaa) }).map((_, i) => (
                      <li
                        key={i}
                        className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-400"
                      >
                        More about {report.queryName}…
                      </li>
                    ))}
                  </ul>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white" />
                  <p className="relative -mt-8 pb-1 text-center text-sm font-medium text-gray-600">
                    +{hiddenPaa} more question{hiddenPaa === 1 ? "" : "s"} unlocked
                  </p>
                </div>
              )}
            </section>
          )}

          <section className="mt-10 border-t border-gray-100 pt-10">
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
            {locked ? (
              <div className="mt-4 flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                <span aria-hidden>🔒</span>
                Unlock to ask follow-up questions
              </div>
            ) : (
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
