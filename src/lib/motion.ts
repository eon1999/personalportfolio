import type { Transition } from "motion/react";

/**
 * Durations in seconds, mirroring the design handoff's motion table. Motion
 * covers the site chrome and the boot terminal; the boot → site reveal has its
 * own timeline in `@/lib/reveal`.
 */
export const TIMING = {
  progressBar: 0.3,
  /** One element striking on out of black. */
  strikeOn: 0.42,
  /** Standby leaving under the character rain — slow enough to be covered. */
  standbyExit: 0.45,
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

/**
 * A tube striking on: a few failed strikes before the picture holds. Shared by
 * everything that comes up during the boot sequence so the panel reads as one
 * piece of hardware powering on rather than several elements fading in.
 *
 * Pair with `flickerIn()`, which carries the matching `times` — the two have
 * to stay the same length or Motion will not accept the keyframes.
 */
export const FLICKER_KEYFRAMES = [0, 0.45, 0.08, 0.85, 0.3, 1];

const FLICKER_TIMES = [0, 0.14, 0.26, 0.44, 0.58, 1];

/** `delay` staggers one element behind another on the same strike-on. */
export function flickerIn(delay = 0): Transition {
  return {
    duration: TIMING.strikeOn,
    times: FLICKER_TIMES,
    ease: "linear",
    delay,
  };
}
