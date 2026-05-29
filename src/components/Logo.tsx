import Link from "next/link";
import { BRAND_SLUG } from "@/lib/brand";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 text-lg font-semibold tracking-tight ${className}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm text-white shadow-lg shadow-blue-500/20">
        🔍
      </span>
      <span className="lowercase">{BRAND_SLUG}</span>
    </Link>
  );
}
