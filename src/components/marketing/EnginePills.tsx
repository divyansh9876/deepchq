import { AI_ENGINES } from "@/lib/brand";

export function EnginePills() {
  return (
    <ul className="mt-7 flex flex-wrap gap-2">
      {AI_ENGINES.map((e, i) => (
        <li
          key={e.id}
          className="engine-chip inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: e.color }} />
          {e.name}
        </li>
      ))}
    </ul>
  );
}
