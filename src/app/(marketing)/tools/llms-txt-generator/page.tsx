import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { LlmsTxtGenerator } from "@/components/tools/LlmsTxtGenerator";
import { ORG_ID, absolute, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free llms.txt Generator",
  description: "Create a valid llms.txt file for your website in seconds. Add a summary and key links, preview the markdown, then copy or download. Free, no signup.",
  path: "/tools/llms-txt-generator",
  keywords: ["llms.txt generator", "create llms.txt", "llms.txt example", "llms.txt file"],
});

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <JsonLd data={{ "@type": "WebApplication", name: "llms.txt Generator", url: absolute("/tools/llms-txt-generator"), applicationCategory: "DeveloperApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, publisher: { "@id": ORG_ID } }} />
      <Breadcrumbs items={[{ name: "Free tools", path: "/tools" }, { name: "llms.txt generator", path: "/tools/llms-txt-generator" }]} />
      <h1 className="mt-6 font-display text-4xl font-semibold text-slate-900">llms.txt generator</h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-600">
        llms.txt is a short markdown file that tells language models what your site is and which pages matter. Fill in the form — the preview updates as you type.{" "}
        <Link href="/learn/llms-txt-guide" className="font-medium text-teal-700 hover:underline">What is llms.txt?</Link>
      </p>
      <div className="mt-10"><LlmsTxtGenerator /></div>
    </main>
  );
}
