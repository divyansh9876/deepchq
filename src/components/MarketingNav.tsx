import Link from "next/link";
import { Logo } from "./Logo";

export function MarketingNav({ dark = false }: { dark?: boolean }) {
  const link = dark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900";
  return (
    <header
      className={`flex items-center justify-between px-6 py-4 ${dark ? "bg-black text-white" : "bg-white border-b"}`}
    >
      <Logo className={dark ? "text-white" : ""} />
      <nav className="hidden gap-6 text-sm md:flex">
        <Link href="/#use-cases" className={link}>
          Use Cases
        </Link>
        <Link href="/#faq" className={link}>
          FAQ
        </Link>
        <Link href="/pricing" className={link}>
          Pricing
        </Link>
        <Link href="/terms" className={link}>
          Terms
        </Link>
      </nav>
      <div className="flex items-center gap-3">
        <Link href="/landing/login" className={`text-sm ${link}`}>
          Login
        </Link>
        <Link
          href="/landing/register"
          className="rounded-full border px-4 py-2 text-sm font-medium"
        >
          Sign Up
        </Link>
        <Link
          href="/landing4/step1"
          className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white"
        >
          ✦ Try Now
        </Link>
      </div>
    </header>
  );
}
