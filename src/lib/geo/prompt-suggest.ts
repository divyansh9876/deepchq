import type { Brand, Prompt } from "@/lib/types";

const TEMPLATES: Record<string, string[]> = {
  general: [
    "What is the best {category} for {useCase}?",
    "Top {category} tools in {year}",
    "Compare leading {category} platforms",
    "{brand} vs alternatives — which is better?",
    "Is {brand} worth it for {useCase}?",
  ],
  branded: [
    "What is {brand}?",
    "How does {brand} work?",
    "{brand} reviews and pricing",
    "Pros and cons of {brand}",
  ],
};

export function suggestPrompts(brand: Brand, keywords: string[]): Omit<Prompt, "id" | "brandId" | "createdAt">[] {
  const year = new Date().getFullYear();
  const category = keywords[0] ?? "software";
  const useCase = keywords[1] ?? "small businesses";
  const vars: Record<string, string> = {
    brand: brand.name,
    category,
    useCase,
    year: String(year),
  };

  const fill = (t: string) =>
    t.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? k);

  const prompts: Omit<Prompt, "id" | "brandId" | "createdAt">[] = [];

  for (const t of TEMPLATES.general.slice(0, 4)) {
    prompts.push({ text: fill(t), stage: "tofu" });
  }
  for (const t of TEMPLATES.branded) {
    prompts.push({ text: fill(t), stage: "bofu" });
  }

  for (const kw of keywords.slice(0, 3)) {
    prompts.push({
      text: `Best ${kw} solutions for ${brand.country || "global"} market`,
      stage: "mofu",
    });
  }

  return prompts.slice(0, 12);
}
