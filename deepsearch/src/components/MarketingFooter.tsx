import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t px-6 py-12 text-center text-sm text-gray-500">
      <nav className="flex flex-wrap justify-center gap-6">
        <Link href="/about">About Us</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/contact">Contact Us</Link>
        <Link href="/help">Help Center</Link>
        <Link href="/terms">Terms of Use</Link>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/refund">Refund Policy</Link>
      </nav>
      <p className="mt-6 text-xs">
        Informational use only · Public sources only · Not a consumer reporting agency
      </p>
    </footer>
  );
}
