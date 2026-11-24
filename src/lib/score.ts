export function scoreTone(score: number) {
  if (score >= 80) return { stroke: "#0d9488", text: "text-teal-700", label: "AI-ready" };
  if (score >= 55) return { stroke: "#f59e0b", text: "text-amber-600", label: "Needs work" };
  return { stroke: "#e11d48", text: "text-rose-600", label: "At risk" };
}

