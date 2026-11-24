"use client";

import { useEffect, useRef, useState } from "react";

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * One document-level pointer listener that feeds the `.spotlight` CSS effect.
 * Mounted once in the root layout, so cards only need the class name.
 */
export function PointerFx() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      raf = 0;
      const e = last;
      const el = e && (e.target as Element | null)?.closest?.<HTMLElement>(".spotlight");
      if (!e || !el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}

/** Tweens from the previously shown value to the new one whenever `value` changes. */
export function AnimatedNumber({ value, decimals = 0, duration = 900, prefix = "", suffix = "" }: { value: number; decimals?: number; duration?: number; prefix?: string; suffix?: string }) {
  const [shown, setShown] = useState(value);
  const from = useRef(0);
  useEffect(() => {
    if (reducedMotion()) {
      setShown(value);
      from.current = value;
      return;
    }
    const start = from.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const v = start + (value - start) * (1 - (1 - p) ** 3);
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      from.current = value;
    };
  }, [value, duration]);
  return (
    <span className="tabular-nums">
      {prefix}
      {shown.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/** Subtle 3D tilt that follows the pointer. Disabled for touch and reduced motion. */
export function Tilt({ children, className = "", max = 5 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1100px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg)`;
    };
    const leave = () => {
      el.style.transform = "";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [max]);
  return (
    <div ref={ref} className={`transition-transform duration-300 ease-out will-change-transform ${className}`}>
      {children}
    </div>
  );
}

/** A one-shot confetti burst; remount (change `key`) to fire again. */
export function Confetti({ count = 18 }: { count?: number }) {
  const colors = ["#6e4dff", "#d946ef", "#f59e0b", "#0ea5e9", "#f43f5e"];
  return (
    <span className="confetti pointer-events-none absolute inset-0" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2;
        const d = 60 + (i % 3) * 22;
        return (
          <i
            key={i}
            style={
              {
                background: colors[i % colors.length],
                "--dx": `${Math.cos(a) * d}px`,
                "--dy": `${Math.sin(a) * d}px`,
                "--r": `${(i % 2 ? 1 : -1) * (120 + i * 20)}deg`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </span>
  );
}

/** True when focus is in a text field — keyboard shortcuts should stay out of the way. */
export function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  return !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
}
