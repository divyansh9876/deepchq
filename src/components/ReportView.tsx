"use client";

import type { PersonReport } from "@/lib/types";

export function ReportView({
  report,
  locked,
  onUnlock,
}: {
  report: PersonReport;
  locked: boolean;
  onUnlock?: () => void;
}) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{report.queryName}</h1>
        <p className="text-sm text-gray-500">
          {report.sourcesScanned} sources scanned · {new Date(report.generatedAt).toLocaleString()}
        </p>
      </header>

      {locked && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
          Preview mode — unlock to see full details.{" "}
          <button
            type="button"
            onClick={onUnlock}
            className="font-medium text-blue-600 underline"
          >
            Unlock report
          </button>
        </div>
      )}

      {report.aiSummary && (
        <section className={`rounded-xl bg-gray-50 p-4 ${locked ? "blur-sm select-none" : ""}`}>
          <h2 className="mb-2 font-semibold">AI Deep Report</h2>
          <div className="whitespace-pre-wrap text-sm text-gray-700">{report.aiSummary}</div>
        </section>
      )}

      {report.sections.map((section) => (
        <section key={section.id} className="rounded-xl border border-gray-200 p-4">
          <h2 className="mb-3 font-semibold">{section.title}</h2>
          <ul className="space-y-2 text-sm">
            {section.items.map((item, i) => (
              <li key={i} className={locked ? "blur-[3px] select-none" : ""}>
                {item.text}
                {item.sourceUrl && !locked && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 text-xs"
                  >
                    source
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="text-xs text-gray-400">
        Informational use only. Public sources only. Not for employment or credit decisions.
      </p>
    </div>
  );
}
