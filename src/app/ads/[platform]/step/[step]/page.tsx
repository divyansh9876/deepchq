import { notFound } from "next/navigation";
import { FunnelIntroStep } from "@/components/funnel/FunnelIntroStep";
import { FunnelLeadStep } from "@/components/funnel/FunnelLeadStep";
import { FunnelScanStep } from "@/components/funnel/FunnelScanStep";
import { isAdPlatform, type AdPlatform } from "@/lib/funnel/platforms";

export function generateStaticParams() {
  return ["google", "instagram", "snapchat"].flatMap((platform) =>
    [1, 2, 3, 4].map((step) => ({ platform, step: String(step) })),
  );
}

export default async function AdsFunnelStepPage({
  params,
}: {
  params: Promise<{ platform: string; step: string }>;
}) {
  const { platform: rawPlatform, step: rawStep } = await params;
  if (!isAdPlatform(rawPlatform)) notFound();
  const platform = rawPlatform as AdPlatform;

  const step = Number(rawStep);
  if (!Number.isInteger(step) || step < 1 || step > 4) notFound();

  if (step === 1 || step === 2) {
    return <FunnelIntroStep platform={platform} step={step as 1 | 2} />;
  }
  if (step === 3) return <FunnelLeadStep platform={platform} />;
  return <FunnelScanStep />;
}
