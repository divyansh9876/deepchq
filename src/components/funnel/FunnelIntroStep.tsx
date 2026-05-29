import { FunnelLayout, ContinueButton } from "@/components/funnel/FunnelLayout";
import { FunnelTitle } from "@/components/funnel/FunnelTitle";
import { RadarScanner } from "@/components/funnel/RadarScanner";
import { SearchResultsMock } from "@/components/funnel/SearchResultsMock";
import {
  type AdPlatform,
  AD_PLATFORM_CONFIG,
  funnelStepPath,
} from "@/lib/funnel/platforms";

export function FunnelIntroStep({
  platform,
  step,
  legacyPaths = false,
}: {
  platform: AdPlatform;
  step: 1 | 2;
  legacyPaths?: boolean;
}) {
  const content = AD_PLATFORM_CONFIG[platform].steps[step - 1];
  const illustration =
    content.illustration === "radar" ? (
      <RadarScanner />
    ) : (
      <SearchResultsMock />
    );

  return (
    <FunnelLayout illustration={illustration}>
      <FunnelTitle segments={content.title} />
      <p className="mt-4 text-gray-600">{content.subtitle}</p>
      <ContinueButton
        href={funnelStepPath(platform, step + 1, { legacy: legacyPaths })}
      />
    </FunnelLayout>
  );
}
