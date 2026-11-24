import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 font-bold text-slate-900 transition hover:opacity-80 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 via-fuchsia-600 to-rose-500 text-sm text-white shadow-md shadow-fuchsia-500/25">
        D
      </span>
      {BRAND_NAME}
    </Link>
  );
}
