import { AI_ENGINES } from "@/lib/brand";

export function EngineMarquee() {
  const items = [...AI_ENGINES, ...AI_ENGINES];
  return (
    <div className="overflow-hidden border-y border-slate-200 bg-gradient-to-r from-teal-50 via-violet-50 to-amber-50 py-5">
      <div className="marquee-track flex w-max gap-10 px-8">
        {items.map((e, i) => (
          <span key={`${e.id}-${i}`} className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: e.color }} />
            {e.name}
          </span>
        ))}
      </div>
    </div>
  );
}
