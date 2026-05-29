"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ReportView } from "@/components/ReportView";
import { ScanProgress } from "@/components/ScanProgress";
import { BlurredPaywallPreview } from "@/components/BlurredPaywallPreview";
import { CandidateList, type CandidateRow } from "@/components/CandidateList";
import type { PersonReport } from "@/lib/types";

function SearchDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const [status, setStatus] = useState("queued");
  const [report, setReport] = useState<PersonReport | null>(null);
  const [locked, setLocked] = useState(true);
  const [scanning, setScanning] = useState(true);
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [unlockLoading, setUnlockLoading] = useState(false);

  const load = useCallback(async () => {
    const checkout = searchParams.get("checkout") === "success";
    const res = await fetch(
      `/api/search/${id}${checkout ? "?checkout=success" : ""}`,
    );
    const data = await res.json();
    setStatus(data.search?.status ?? "unknown");
    if (data.report) setReport(data.report);
    setLocked(data.locked ?? true);
    if (data.search?.status === "completed" || data.search?.status === "failed") {
      setScanning(false);
    }
  }, [id, searchParams]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (status !== "completed") return;
    fetch(`/api/search/${id}/candidates`)
      .then((r) => r.json())
      .then((d) =>
        setCandidates(
          (d.candidates ?? []).map(
            (c: {
              id: string;
              displayName: string;
              location: string | null;
              confidence: number | null;
            }) => ({
              id: c.id,
              displayName: c.displayName,
              location: c.location,
              confidence: c.confidence,
            }),
          ),
        ),
      );
  }, [id, status]);

  async function unlock() {
    setUnlockLoading(true);
    const res = await fetch(`/api/search/${id}/unlock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    setUnlockLoading(false);

    if (res.status === 402 || data.requiresCheckout) {
      const checkout = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro", interval: "weekly", searchId: id }),
      });
      const checkoutData = await checkout.json();
      if (checkoutData.url) {
        window.location.href = checkoutData.url;
        return;
      }
    }

    if (res.status === 401) {
      window.location.href = `/landing/login?next=/search/${id}`;
      return;
    }

    if (res.ok) {
      setLocked(false);
      await load();
    }
  }

  async function exportMarkdown() {
    const res = await fetch(`/api/search/${id}/export`);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deepchq-report.md`;
    a.click();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Logo />
          <Link href="/history" className="text-sm text-gray-600">
            History
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">
        {scanning && status !== "completed" && status !== "failed" && (
          <div className="mb-8">
            <ScanProgress
              searchId={id}
              onComplete={() => {
                setScanning(false);
                load();
              }}
            />
          </div>
        )}

        {candidates.length > 0 && (
          <CandidateList candidates={candidates} />
        )}

        {report && locked && (
          <div className="mb-6">
            <BlurredPaywallPreview
              searchId={id}
              onUnlock={unlock}
              loading={unlockLoading}
            />
          </div>
        )}

        {report && (
          <>
            <ReportView report={report} locked={locked} onUnlock={unlock} />
            {!locked && (
              <button
                type="button"
                onClick={exportMarkdown}
                className="mt-6 rounded-full border px-6 py-2 text-sm font-medium"
              >
                Export Markdown
              </button>
            )}
          </>
        )}

        {!report && !scanning && (
          <p className="text-gray-500">Loading report…</p>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12">Loading…</div>}>
      <SearchDetailContent />
    </Suspense>
  );
}
