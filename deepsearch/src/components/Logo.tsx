import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 font-semibold text-lg ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-xs">
        🔍
      </span>
      <span>deepchq</span>
    </Link>
  );
}
