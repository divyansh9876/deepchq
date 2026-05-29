import Link from "next/link";
import { Logo } from "./Logo";
import { USE_CASES } from "@/lib/marketing/home-content";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.deepchq.app";
const APP_STORE_URL = "#";

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-6 py-14 text-sm text-slate-600">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Company
          </p>
          <nav className="flex flex-col gap-2">
            <Link href="/about" className="hover:text-slate-900">
              About Us
            </Link>
            <Link href="/pricing" className="hover:text-slate-900">
              Pricing
            </Link>
            <Link href="/contact" className="hover:text-slate-900">
              Contact Us
            </Link>
            <Link href="/help" className="hover:text-slate-900">
              Help Center
            </Link>
          </nav>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Terms &amp; Policies
          </p>
          <nav className="flex flex-col gap-2">
            <Link href="/terms" className="hover:text-slate-900">
              Terms of Use
            </Link>
            <Link href="/privacy" className="hover:text-slate-900">
              Privacy Policy
            </Link>
            <Link href="/refund" className="hover:text-slate-900">
              Refund Policy
            </Link>
          </nav>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Use Cases
          </p>
          <nav className="flex flex-col gap-2">
            {USE_CASES.map((u) => (
              <Link key={u.title} href="/#use-cases" className="hover:text-slate-900">
                {u.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-5xl flex-col items-center gap-6 border-t border-slate-200 pt-8 md:flex-row md:justify-between">
        <p className="text-xs text-slate-500">© 2025 Deepchq, Inc.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={PLAY_STORE_URL}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs text-slate-700 hover:border-slate-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get it on Google Play
          </a>
          <a
            href={APP_STORE_URL}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs text-slate-400"
            aria-disabled
            title="Coming soon"
          >
            Download on the App Store
          </a>
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-5xl text-center text-xs text-slate-500">
        Informational use only · Public sources only · Not a consumer reporting agency
      </p>
    </footer>
  );
}
