export function scoreTone(score: number) {
  if (score >= 80) return { stroke: "#10b981", text: "text-emerald-600", label: "AI-ready" };
  if (score >= 55) return { stroke: "#f59e0b", text: "text-amber-600", label: "Needs work" };
  return { stroke: "#e11d48", text: "text-rose-600", label: "At risk" };
}

