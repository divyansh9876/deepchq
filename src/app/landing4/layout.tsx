import { Suspense } from "react";
import { UtmCapture } from "@/components/UtmCapture";

export default function Landing4Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <UtmCapture />
      </Suspense>
      {children}
    </>
  );
}
