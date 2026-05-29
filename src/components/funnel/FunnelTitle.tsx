import type { FunnelTitleSegment } from "@/lib/funnel/platforms";

export function FunnelTitle({ segments }: { segments: FunnelTitleSegment[] }) {
  return (
    <h1 className="text-3xl font-bold leading-tight">
      {segments.map((seg, i) =>
        seg.highlight ? (
          <span key={i} className="text-blue-600">
            {seg.text}
          </span>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </h1>
  );
}
