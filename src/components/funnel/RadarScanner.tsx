const TAGS = [
  "Old Relationships",
  "Social Media Accounts",
  "Social Connections",
  "Photos",
  "Emotional Trends",
];

export function RadarScanner() {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-4 flex flex-wrap gap-2">
        {TAGS.map((t) => (
          <span
            key={t}
            className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-full bg-gray-100">
        <div className="absolute inset-0 rounded-full border border-gray-200" />
        <div className="absolute inset-4 rounded-full border border-gray-200" />
        <div className="absolute inset-8 rounded-full border border-gray-200" />
        <div
          className="absolute left-1/2 top-1/2 h-1/2 w-0.5 origin-bottom -translate-x-1/2 bg-blue-500/60 animate-spin"
          style={{ animationDuration: "3s" }}
        />
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="absolute h-2 w-2 rounded-full bg-blue-500"
            style={{
              left: `${30 + i * 15}%`,
              top: `${25 + (i % 2) * 30}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
