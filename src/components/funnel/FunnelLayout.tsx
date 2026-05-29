import { Logo } from "@/components/Logo";
import Link from "next/link";

export function FunnelLayout({
  children,
  illustration,
}: {
  children: React.ReactNode;
  illustration: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-2">
        <div className="hidden items-center justify-center bg-gray-50 p-8 lg:flex">
          {illustration}
        </div>
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
          <Logo className="mb-10" />
          {children}
          <TrustBadge />
          <p className="mt-8 text-center text-xs text-gray-500">
            By continuing, you acknowledge receipt of our{" "}
            <Link href="/terms" className="underline">
              Terms of Use
            </Link>{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function TrustBadge() {
  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm text-gray-600">
      Trusted by over 17 million people
      <div className="mt-1 text-amber-400">★★★★★</div>
    </div>
  );
}

export function ContinueButton({
  onClick,
  href,
  disabled,
  label = "Continue",
}: {
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  label?: string;
}) {
  const cls =
    "btn-primary mt-8 block w-full !py-4 text-center disabled:pointer-events-none";
  if (href && !disabled) {
    return (
      <Link href={href} className={cls}>
        {label}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cls}>
      {label}
    </button>
  );
}
