"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { HUD } from "@/lib/hud";
import { prefersReducedMotion } from "@/lib/prefs";

const BAND = 190;

/**
 * The amber refresh line that walks down the whole site, top to bottom, for
 * ever. Same trick as the boot screen's `SweepBand`: the element is one band
 * taller than the viewport and starts one band above it, so a 0% → 100%
 * translate of its own height carries the line from just off the top to just
 * off the bottom without mixing units.
 */
export function ScanBeam() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const travel = animate(el, {
      y: ["0%", "100%"],
      duration: HUD.beamTravel,
      ease: "linear",
      loop: true,
    });

    return () => {
      travel.revert();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 z-[5]"
      style={{
        top: -BAND,
        height: `calc(100vh + ${BAND}px)`,
        willChange: "transform",
      }}
    >
      {/* Trailing wash above the line. */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: BAND,
          background:
            "linear-gradient(180deg, transparent, color-mix(in oklab, var(--color-ac) 0.7%, transparent) 55%, color-mix(in oklab, var(--color-ac) 2.4%, transparent) 88%, color-mix(in oklab, var(--color-warn) 4%, transparent))",
        }}
      />
      {/* The line itself, brightest mid-screen and feathered at both edges. */}
      <div
        className="absolute inset-x-0"
        style={{
          top: BAND - 1,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklab, var(--color-warn) 14%, transparent) 12%, color-mix(in oklab, var(--color-warn) 24%, transparent) 50%, color-mix(in oklab, var(--color-warn) 14%, transparent) 88%, transparent)",
          boxShadow:
            "0 0 12px color-mix(in oklab, var(--color-ac) 18%, transparent)",
        }}
      />
    </div>
  );
}
