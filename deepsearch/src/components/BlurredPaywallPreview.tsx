"use client";

import Link from "next/link";

export function BlurredPaywallPreview({
  searchId,
  onUnlock,
  loading,
}: {
  searchId: string;
  onUnlock: () => void;
  loading?: boolean;
}) {
  return (
    <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/80 p-6 text-center">
      <p className="text-sm font-medium text-amber-900">Full report locked</p>
      <p className="mt-2 text-xs text-amber-800">
        Subscribe to unlock social profiles, emails, locations, and AI deep insights.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onUnlock}
          disabled={loading}
          className="rounded-full bg-gray-900 px-6 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Processing…" : "Unlock report"}
        </button>
        <Link
          href={`/pricing?searchId=${searchId}`}
          className="rounded-full border border-gray-900 px-6 py-2 text-sm font-medium"
        >
          View plans
        </Link>
      </div>
    </div>
  );
}
