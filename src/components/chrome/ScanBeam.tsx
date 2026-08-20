"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { HUD } from "@/lib/hud";
import { prefersReducedMotion } from "@/lib/prefs";

const BAND = 240;

/**
 * The amber refresh wash that walks down the whole site, top to bottom, for
 * ever.
 *
 * Built the same way as the boot screen's `SweepBand`, and deliberately so: a
 * single soft gradient with no hot line in it, because anything with a hard
 * edge draws the eye off the paragraph it is crossing. The element is one band
 * taller than the viewport and starts one band above it, so a 0% → 100%
 * translate of its own height carries the band from just off the top to just
 * off the bottom without mixing units.
 *
 * The band is twice as tall as the boot one and runs at `--scan`, the monitor's
 * own strength dial — so it lands at half the boot band's peak, and drops
 * further still when a dossier takes the screen.
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
        background: `linear-gradient(180deg, transparent, color-mix(in oklab, var(--color-ac) 8%, transparent), transparent) top center / 100% ${BAND}px no-repeat`,
        opacity: "var(--scan)",
        willChange: "transform",
      }}
    />
  );
}
