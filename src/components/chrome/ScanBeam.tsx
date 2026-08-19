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
            "linear-gradient(180deg, transparent, rgba(255,107,26,.005) 55%, rgba(255,107,26,.018) 88%, rgba(255,140,60,.032))",
        }}
      />
      {/* The line itself, brightest mid-screen and feathered at both edges. */}
      <div
        className="absolute inset-x-0"
        style={{
          top: BAND - 1,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(255,140,60,.12) 12%, rgba(255,181,69,.2) 50%, rgba(255,140,60,.12) 88%, transparent)",
          boxShadow: "0 0 10px rgba(255,107,26,.14)",
        }}
      />
    </div>
  );
}
