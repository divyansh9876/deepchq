import { Suspense } from "react";
import { FunnelAttribution } from "@/components/funnel/FunnelAttribution";

export default function Landing4Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <FunnelAttribution platform="google" />
      </Suspense>
      {children}
    </>
  );
}
