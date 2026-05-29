import type { TermsBlock } from "@/lib/legal/terms-sections";

export function LegalDocument({ sections }: { sections: TermsBlock[] }) {
  return (
    <div className="space-y-10 text-sm leading-relaxed text-gray-400">
      {sections.map((section) => (
        <section key={section.id} id={section.id}>
          <h2 className="text-lg font-semibold text-white">{section.title}</h2>
          {section.paragraphs?.map((p, i) => (
            <p key={i} className="mt-3">
              {p}
            </p>
          ))}
          {section.bullets && (
            <ul className="mt-3 list-disc space-y-2 pl-6">
              {section.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
          {section.items && (
            <div className="mt-3 space-y-3">
              {section.items.map((item) => (
                <p key={item.id}>
                  <span className="font-medium text-gray-300">{item.id}.</span>{" "}
                  {item.text}
                </p>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
