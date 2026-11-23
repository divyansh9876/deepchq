import { DomainAuditForm } from "@/components/tools/DomainAuditForm";

export function AuditCta({ title = "Is your site ready for AI search?", tone = "teal" }: { title?: string; tone?: "teal" | "dark" }) {
  return (
    <div
      className={`rounded-3xl p-8 ${
        tone === "dark" ? "gradient-shift bg-gradient-to-br from-teal-800 via-violet-800 to-slate-900 text-white" : "border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-violet-50"
      }`}
    >
      <h2 className={`font-display text-2xl font-semibold ${tone === "dark" ? "text-white" : "text-slate-900"}`}>{title}</h2>
      <p className={`mt-2 max-w-xl text-sm ${tone === "dark" ? "text-teal-100" : "text-slate-600"}`}>
        Free instant audit: AI crawler access, llms.txt, schema, content structure and 15 more checks. No signup.
      </p>
      <div className="mt-5 max-w-xl">
        <DomainAuditForm dark={tone === "dark"} />
      </div>
    </div>
  );
}
