"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { NAV_LINKS } from "@/lib/marketing";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setScrolled(y > 8);
        setProgress(max > 0 ? Math.min(1, y / max) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-all duration-300 ${
        scrolled ? "border-slate-200/80 bg-white/85 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)]" : "border-transparent bg-white/50"
      }`}
    >
      <div className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-all duration-300 ${scrolled ? "py-2.5" : "py-4"}`}>
        <Logo />
        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3.5 py-1.5 transition ${isActive(l.href) ? "bg-teal-50 text-teal-800" : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">
            Log in
          </Link>
          <Link href="/register" className="btn-primary group">
            Start free
            <span className="ml-1.5 transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
        <button
          type="button"
          className="relative h-9 w-9 rounded-lg border border-slate-200 bg-white md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`absolute left-2 right-2 top-1/2 h-0.5 rounded bg-slate-800 transition ${open ? "rotate-45" : "-translate-y-1.5"}`} />
          <span className={`absolute left-2 right-2 top-1/2 h-0.5 rounded bg-slate-800 transition ${open ? "opacity-0" : ""}`} />
          <span className={`absolute left-2 right-2 top-1/2 h-0.5 rounded bg-slate-800 transition ${open ? "-rotate-45" : "translate-y-1.5"}`} />
        </button>
      </div>
      <div className={`grid transition-[grid-template-rows] duration-300 md:hidden ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <nav className="flex flex-col gap-1 border-t border-slate-100 bg-white px-6 py-4 text-sm font-medium">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={`rounded-lg px-3 py-2 ${isActive(l.href) ? "bg-teal-50 text-teal-800" : "text-slate-700"}`}>
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Link href="/login" className="btn-secondary flex-1">
                Log in
              </Link>
              <Link href="/register" className="btn-primary flex-1">
                Start free
              </Link>
            </div>
          </nav>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-teal-500 via-violet-500 to-amber-400" style={{ transform: `scaleX(${progress})` }} aria-hidden />
    </header>
  );
}
