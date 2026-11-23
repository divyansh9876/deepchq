import { runDueWork } from "@/lib/automation/cycle";

/** In-process scheduler for automated scans, digests and trial handling (single instance). */
export function startScheduler() {
  if (process.env.ENABLE_INTERNAL_CRON === "false") return;
  if (process.env.NODE_ENV !== "production" && process.env.ENABLE_INTERNAL_CRON !== "true") return;
  const everyMs = Math.max(5, Number(process.env.CRON_INTERVAL_MINUTES ?? 30)) * 60_000;
  const tick = () =>
    runDueWork()
      .then((r) => !r.skipped && r.scanned && console.info("[scheduler]", r))
      .catch((e) => console.error("[scheduler] failed", e));
  setTimeout(tick, 60_000);
  setInterval(tick, everyMs).unref?.();
  console.info(`[scheduler] automated scans every ${everyMs / 60_000} min`);
}
