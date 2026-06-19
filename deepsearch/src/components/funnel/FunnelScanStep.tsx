"use client";

import { Suspense, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FunnelLayout, ContinueButton } from "@/components/funnel/FunnelLayout";
import { ScanProgress } from "@/components/ScanProgress";

function ScanStepContent() {
  const params = useSearchParams();
  const searchId = params.get("searchId") ?? "";
  const name = params.get("name") ?? "your subject";
  const [done, setDone] = useState(false);
  const onComplete = useCallback(() => setDone(true), []);

  return (
    <FunnelLayout
      illustration={
        searchId && !done ? (
          <ScanProgress searchId={searchId} onComplete={onComplete} />
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center shadow-xl">
            <p className="text-lg font-medium">
              Report ready for {decodeURIComponent(name)}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Preview available — unlock full access
            </p>
          </div>
        )
      }
    >
      <h1 className="text-3xl font-bold">
        {done ? "Your report is ready" : "Scanning public sources…"}
      </h1>
      <p className="mt-4 text-gray-600">
        {done
          ? "We found signals across social, directories, and web mentions."
          : `Analyzing digital footprint for ${decodeURIComponent(name)}`}
      </p>
      {done && searchId && (
        <ContinueButton href={`/search/${searchId}`} label="View report" />
      )}
    </FunnelLayout>
  );
}

export function FunnelScanStep() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading…</div>}>
      <ScanStepContent />
    </Suspense>
  );
}
