"use client";

import { motion } from "motion/react";
import { TIMING, loop } from "@/lib/motion";

const BAND_HEIGHT = 120;

/**
 * The soft amber band that scans down the boot screen. The element is taller
 * than its container by exactly one band height and starts one band above it,
 * so a 0% → 100% translate carries the band from just off the top to just off
 * the bottom without mixing length units.
 */
export function SweepBand() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-0"
      style={{
        top: -BAND_HEIGHT,
        height: `calc(100% + ${BAND_HEIGHT}px)`,
        background: `linear-gradient(180deg, transparent, color-mix(in oklab, var(--color-ac) 8%, transparent), transparent) top center / 100% ${BAND_HEIGHT}px no-repeat`,
        willChange: "transform",
      }}
      animate={{ y: ["0%", "100%"] }}
      transition={loop(TIMING.sweep)}
    />
  );
}
