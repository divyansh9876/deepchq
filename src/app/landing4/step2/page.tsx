import { FunnelLayout, ContinueButton } from "@/components/funnel/FunnelLayout";
import { RadarScanner } from "@/components/funnel/RadarScanner";

export default function LandingStep2() {
  return (
    <FunnelLayout illustration={<RadarScanner />}>
      <h1 className="text-3xl font-bold leading-tight">
        <span className="text-blue-600">Deeper</span> Insights.{" "}
        <span className="text-blue-600">Powered</span> by AI.
      </h1>
      <p className="mt-4 text-gray-600">
        Discover social media profiles, photos, videos, and professional details
        instantly!
      </p>
      <ContinueButton href="/landing4/step3" />
    </FunnelLayout>
  );
}
