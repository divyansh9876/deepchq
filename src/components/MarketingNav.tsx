import Link from "next/link";
import { Logo } from "./Logo";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <Logo />
      <nav className="hidden gap-6 text-sm md:flex">
        <Link href="/#use-cases" className="text-slate-600 hover:text-slate-900">
          Use Cases
        </Link>
        <Link href="/#faq" className="text-slate-600 hover:text-slate-900">
          FAQ
        </Link>
        <Link href="/pricing" className="text-slate-600 hover:text-slate-900">
          Pricing
        </Link>
        <Link href="/terms" className="text-slate-600 hover:text-slate-900">
          Terms
        </Link>
      </nav>
      <div className="flex items-center gap-3">
        <Link href="/landing/login" className="text-sm text-slate-600 hover:text-slate-900">
          Login
        </Link>
        <Link
          href="/landing/register"
          className="rounded-full border border-slate-900 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
        >
          Sign Up
        </Link>
        <Link href="/ads/google/step/1" className="btn-primary !py-2 !px-4">
          Try Now
        </Link>
      </div>
    </header>
  );
}
