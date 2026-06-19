const MOCK = [
  { name: "Sofia Moretti", gender: "Female", phone: "+39 ••• ••• 4821", loc: "Italy" },
  { name: "Ethan Campbell", gender: "Male", phone: "+44 ••• ••• 9032", loc: "Scotland" },
  { name: "Chloe Dubois", gender: "Female", phone: "+33 ••• ••• 7710", loc: "France" },
];

export function SearchResultsMock() {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-medium">Search Results</span>
        <span className="text-gray-500">✨ 478 sources scanned</span>
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b text-gray-500">
            <th className="pb-2">Name</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {MOCK.map((r) => (
            <tr key={r.name} className="border-b border-gray-100">
              <td className="py-2 font-medium text-blue-600">{r.name}</td>
              <td className="text-gray-600">{r.gender}</td>
              <td className="text-gray-400">{r.phone}</td>
              <td className="text-gray-600">{r.loc}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 h-32 rounded-xl bg-[radial-gradient(circle_at_center,#e5e7eb_1px,transparent_1px)] bg-[length:12px_12px] opacity-60" />
    </div>
  );
}
