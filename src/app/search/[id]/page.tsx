"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/app/AppSidebar";
import {
  DeepSearchResults,
  type PreviewMeta,
} from "@/components/app/DeepSearchResults";
import { ScanProgress } from "@/components/ScanProgress";
import type { PersonReport } from "@/lib/types";

function SearchDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const [status, setStatus] = useState("queued");
  const [report, setReport] = useState<PersonReport | null>(null);
  const [locked, setLocked] = useState(true);
  const [scanning, setScanning] = useState(true);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [previewMeta, setPreviewMeta] = useState<PreviewMeta | null>(null);

  const load = useCallback(async () => {
    const checkout = searchParams.get("checkout") === "success";
    const res = await fetch(
      `/api/search/${id}${checkout ? "?checkout=success" : ""}`,
    );
    const data = await res.json();
    setStatus(data.search?.status ?? "unknown");
    if (data.report) setReport(data.report);
    setLocked(data.locked ?? true);
    setPreviewMeta(data.previewMeta ?? null);
    if (data.search?.status === "completed" || data.search?.status === "failed") {
      setScanning(false);
    }
  }, [id, searchParams]);

  useEffect(() => {
    load();
  }, [load]);

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

  return (
    <AppShell>
      {scanning && status !== "completed" && status !== "failed" && (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
          <p className="mb-6 text-lg font-medium text-gray-700">Scanning public sources…</p>
          <div className="w-full max-w-md">
            <ScanProgress
              searchId={id}
              onComplete={() => {
                setScanning(false);
                load();
              }}
            />
          </div>
        </div>
      )}

      {report && !scanning && (
        <DeepSearchResults
          report={report}
          locked={locked}
          previewMeta={previewMeta}
          onUnlock={unlock}
          unlockLoading={unlockLoading}
        />
      )}

      {!report && !scanning && status === "failed" && (
        <div className="flex flex-1 items-center justify-center p-12 text-center">
          <div>
            <p className="text-gray-600">Search failed. Please try again.</p>
            <Link href="/chat" className="mt-4 inline-block text-blue-600 underline">
              New Search
            </Link>
          </div>
        </div>
      )}

      {!report && !scanning && status !== "failed" && (
        <div className="flex flex-1 items-center justify-center text-gray-500">
          Loading report…
        </div>
      )}
    </AppShell>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12">Loading…</div>}>
      <SearchDetailContent />
    </Suspense>
  );
}
