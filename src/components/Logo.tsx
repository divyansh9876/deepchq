import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 font-bold text-slate-900 transition hover:opacity-80 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">
        D
      </span>
      {BRAND_NAME}
    </Link>
  );
}
