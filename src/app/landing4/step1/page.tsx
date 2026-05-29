import {
  FunnelLayout,
  ContinueButton,
} from "@/components/funnel/FunnelLayout";
import { SearchResultsMock } from "@/components/funnel/SearchResultsMock";

export default function LandingStep1() {
  return (
    <FunnelLayout illustration={<SearchResultsMock />}>
      <h1 className="text-3xl font-bold leading-tight">
        <span className="text-blue-600">Private</span> &{" "}
        <span className="text-blue-600">Smart</span> Search
      </h1>
      <p className="mt-4 text-gray-600">
        Discover social media profiles, photos, videos, and professional details
        instantly!
      </p>
      <ContinueButton href="/landing4/step2" />
    </FunnelLayout>
  );
}
