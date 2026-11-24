import { ogCard } from "@/lib/og";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";

export const alt = `${BRAND_NAME} — ${BRAND_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return ogCard("AI search visibility", "See if ChatGPT, Perplexity & Google AI recommend your brand");
}
