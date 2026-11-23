import { getGuide, GUIDES } from "@/content/guides";
import { OG_SIZE, ogCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const g = getGuide((await params).slug);
  return ogCard(g?.category ?? "Guide", g?.title ?? "GEO guide");
}
