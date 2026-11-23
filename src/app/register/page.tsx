import { Suspense } from "react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { AuthForm } from "@/components/AuthForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Start free — Create your account",
  description: "Create a free Deepchq account and track whether ChatGPT, Perplexity and Google AI recommend your brand.",
  path: "/register",
  noindex: false,
});

export default function Page() {
  return (
    <MarketingShell>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Suspense fallback={<div className="card h-96 animate-pulse" />}>
            <AuthForm mode="register" />
          </Suspense>
        </div>
      </div>
    </MarketingShell>
  );
}
