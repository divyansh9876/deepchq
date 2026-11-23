import type { Metadata } from "next";
import { BRAND_DESCRIPTION, BRAND_NAME } from "@/lib/brand";
import { SITE_URL } from "@/lib/env";

export const ORG_ID = `${SITE_URL}/#organization`;
export const SITE_ID = `${SITE_URL}/#website`;

export function absolute(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedAt,
  modifiedAt,
  keywords,
  noindex,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedAt?: string;
  modifiedAt?: string;
  keywords?: string[];
  noindex?: boolean;
}): Metadata {
  return {
    // Titles that already carry the brand skip the "| Deepchq" template suffix.
    title: title.includes(BRAND_NAME) ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: BRAND_NAME,
      type,
      ...(type === "article" ? { publishedTime: publishedAt, modifiedTime: modifiedAt } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

export const organizationLd = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: BRAND_NAME,
  url: SITE_URL,
  logo: absolute("/icon.svg"),
  description: BRAND_DESCRIPTION,
  sameAs: (process.env.NEXT_PUBLIC_SAME_AS ?? "").split(",").map((s) => s.trim()).filter(Boolean),
};

export const websiteLd = {
  "@type": "WebSite",
  "@id": SITE_ID,
  url: SITE_URL,
  name: BRAND_NAME,
  publisher: { "@id": ORG_ID },
  inLanguage: "en",
};

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absolute(it.path) })),
  };
}

export function faqLd(items: readonly { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
