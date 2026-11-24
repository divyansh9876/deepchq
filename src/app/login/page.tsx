import { Suspense } from "react";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { AuthForm } from "@/components/AuthForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Log in",
  description: "Log in to Deepchq to see your AI search visibility reports.",
  path: "/login",
  noindex: true,
});

export default function Page() {
  return (
    <MarketingShell>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Suspense fallback={<div className="card h-96 animate-pulse" />}>
            <AuthForm mode="login" />
          </Suspense>
        </div>
      </div>
    </MarketingShell>
  );
}
