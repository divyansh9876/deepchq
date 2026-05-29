import type { LatestResult } from "@/lib/marketing/home-content";

function StackedLines({ lines }: { lines: string[] }) {
  return (
    <div className="flex flex-col text-gray-400">
      {lines.map((line, i) => (
        <span key={i} className={i === 0 ? "text-gray-300" : ""}>
          {line}
        </span>
      ))}
    </div>
  );
}

export function LatestResultsTable({ rows }: { rows: LatestResult[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-black/40">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-gray-800 bg-gray-900/60 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-5 py-4 font-medium">Name</th>
            <th className="px-5 py-4 font-medium">Gender</th>
            <th className="px-5 py-4 font-medium">Phone Number</th>
            <th className="px-5 py-4 font-medium">Location</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/80">
          {rows.map((row) => (
            <tr key={row.name} className="hover:bg-gray-900/30">
              <td className="px-5 py-4 font-medium text-white">{row.name}</td>
              <td className="px-5 py-4 text-gray-300">{row.gender}</td>
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
