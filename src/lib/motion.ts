import type { Transition } from "motion/react";

/**
 * Durations in seconds, mirroring the design handoff's motion table. Motion
 * covers the site chrome and the boot terminal; the boot → site reveal has its
 * own timeline in `@/lib/reveal`.
 */
export const TIMING = {
  progressBar: 0.3,
  logLine: 0.18,
  hover: 0.16,
  bootRing: 18,
  heroRing: 44,
  sweep: 5.5,
  flicker: 3,
  blink: 1.2,
} as const;

/** A never-ending linear loop, for the ambient cockpit hardware. */
export function loop(duration: number): Transition {
  return { duration, ease: "linear", repeat: Infinity };
}

export const LOG_LINE_TRANSITION: Transition = {
  duration: TIMING.logLine,
  ease: "easeOut",
};

export const BAR_TRANSITION: Transition = {
  duration: TIMING.progressBar,
  ease: "linear",
};
