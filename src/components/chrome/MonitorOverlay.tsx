"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { HUD } from "@/lib/hud";
import { prefersReducedMotion } from "@/lib/prefs";
import { ScanBeam } from "./ScanBeam";

/**
 * The screen the whole site is being displayed on: scanlines, a vignette that
 * bends the corners away, an unsteady tube, and the refresh line walking down
 * it. Strength lives in `--scan` so the whole stack can be turned down behind
 * a reduce-effects preference.
 */
export function MonitorOverlay() {
  const glassRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glass = glassRef.current;
    if (!glass || prefersReducedMotion()) return;

    // Irregular keyframes, so the tube never settles into a visible rhythm.
    const flicker = animate(glass, {
      opacity: [
        { to: 1, duration: HUD.crtFlicker * 0.42 },
        { to: 0.9, duration: 90 },
        { to: 1, duration: 140 },
        { to: 0.95, duration: HUD.crtFlicker * 0.3 },
        { to: 1, duration: HUD.crtFlicker * 0.2 },
      ],
      loop: true,
      ease: "inOutSine",
    });

    return () => {
      flicker.revert();
    };
  }, []);

  return (
    <div ref={glassRef} aria-hidden className="crt-glass">
      <div
        className="scan-site pointer-events-none fixed inset-0 z-[5]"
        style={{ opacity: "var(--scan)" }}
      />
      <div className="crt-vignette pointer-events-none fixed inset-0 z-[5]" />
      <ScanBeam />
    </div>
  );
}
