import Link from "next/link";
import { Logo } from "@/components/Logo";
import { BRAND_NAME } from "@/lib/brand";
import { NAV_LINKS } from "@/lib/marketing";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-slate-500">
            Track brand mentions, citations, and competitor share of voice across the AI engines your buyers already use.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Product</p>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-slate-600 hover:text-slate-900">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Company</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-slate-600 hover:text-slate-900">
                About
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-slate-600 hover:text-slate-900">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-slate-600 hover:text-slate-900">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-slate-600 hover:text-slate-900">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {BRAND_NAME}. Built for marketers investing in GEO.
      </div>
    </footer>
  );
}
