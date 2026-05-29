"use client";

export interface CandidateRow {
  id: string;
  displayName: string;
  location: string | null;
  confidence: number | null;
}

export function CandidateList({
  candidates,
  onSelect,
}: {
  candidates: CandidateRow[];
  onSelect?: (id: string) => void;
}) {
  if (candidates.length === 0) return null;

  return (
    <section className="mb-8 rounded-xl border bg-white p-4">
      <h2 className="font-semibold">Possible matches</h2>
      <p className="mt-1 text-sm text-gray-500">
        We found multiple people with a similar name. Select the best match.
      </p>
      <ul className="mt-4 space-y-2">
        {candidates.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => onSelect?.(c.id)}
              className="flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm hover:border-blue-400"
            >
              <span className="font-medium">{c.displayName}</span>
              <span className="text-gray-500">
                {c.location ?? "Unknown"} · {c.confidence ?? 0}% match
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
