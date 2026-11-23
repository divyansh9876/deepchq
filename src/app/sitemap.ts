import type { MetadataRoute } from "next";
import { GUIDES } from "@/content/guides";
import { GLOSSARY } from "@/content/glossary";
import { ENGINE_PAGES, INDUSTRY_PAGES } from "@/content/landing";
import { absolute } from "@/lib/seo";

const LAUNCH = new Date("2026-11-24");

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, lastModified = LAUNCH, changeFrequency: "weekly" | "monthly" = "monthly") => ({
    url: absolute(path),
    lastModified,
    changeFrequency,
    priority,
  });
  return [
    page("/", 1, LAUNCH, "weekly"),
    page("/tools/geo-audit", 0.9, LAUNCH, "weekly"),
    page("/tools/llms-txt-generator", 0.8),
    page("/tools", 0.7),
    page("/features", 0.8),
    page("/pricing", 0.8),
    page("/learn", 0.8, LAUNCH, "weekly"),
    ...GUIDES.map((g) => page(`/learn/${g.slug}`, 0.8, new Date(g.updated))),
    page("/ai-visibility", 0.7),
    ...ENGINE_PAGES.map((e) => page(`/ai-visibility/${e.slug}`, 0.8)),
    ...INDUSTRY_PAGES.map((i) => page(`/for/${i.slug}`, 0.7)),
    page("/glossary", 0.6),
    ...GLOSSARY.map((t) => page(`/glossary/${t.slug}`, 0.5)),
    page("/faq", 0.6),
    page("/about", 0.5),
    page("/contact", 0.4),
    page("/careers", 0.3),
    page("/privacy", 0.2),
    page("/terms", 0.2),
  ];
}
