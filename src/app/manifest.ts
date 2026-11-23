import type { MetadataRoute } from "next";
import { BRAND_DESCRIPTION, BRAND_NAME } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND_NAME} — AI Search Visibility`,
    short_name: BRAND_NAME,
    description: BRAND_DESCRIPTION,
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0d7367",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
