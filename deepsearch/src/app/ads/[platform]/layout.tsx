import { Suspense } from "react";
import { notFound } from "next/navigation";
import { FunnelAttribution } from "@/components/funnel/FunnelAttribution";
import { isAdPlatform, type AdPlatform } from "@/lib/funnel/platforms";

export default async function AdsFunnelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ platform: string }>;
}) {
  const { platform: raw } = await params;
  if (!isAdPlatform(raw)) notFound();
  const platform = raw as AdPlatform;

  return (
    <>
      <Suspense fallback={null}>
        <FunnelAttribution platform={platform} />
      </Suspense>
      {children}
    </>
  );
}
