import type { LatestResult } from "@/lib/marketing/home-content";

function StackedLines({ lines }: { lines: string[] }) {
  return (
    <div className="flex flex-col text-slate-500">
      {lines.map((line, i) => (
        <span key={i} className={i === 0 ? "text-slate-700" : ""}>
          {line}
        </span>
      ))}
    </div>
  );
}

export function LatestResultsTable({ rows }: { rows: LatestResult[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-4 font-medium">Name</th>
            <th className="px-5 py-4 font-medium">Gender</th>
            <th className="px-5 py-4 font-medium">Phone Number</th>
            <th className="px-5 py-4 font-medium">Location</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.name} className="hover:bg-slate-50">
              <td className="px-5 py-4 font-medium text-blue-600">{row.name}</td>
              <td className="px-5 py-4 text-slate-600">{row.gender}</td>
              <td className="px-5 py-4">
                <StackedLines
                  lines={[row.phoneCode, row.phoneMasked, row.phoneSuffix]}
                />
              </td>
              <td className="px-5 py-4">
                <StackedLines lines={[row.city, `, ${row.country}`]} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
