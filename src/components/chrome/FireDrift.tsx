"use client";

import { useEffect } from "react";
import { animate } from "animejs";
import { prefersReducedMotion } from "@/lib/prefs";

/**
 * Drifts `--gradient-ac`'s focal point across the whole site — the same fire
 * the boot standby insignia is cut from, now creeping instead of sitting
 * still. Written once to `:root` as `--fire-x` / `--fire-y`, so every accent
 * surface pulling from the gradient (`.text-ac`, `.bg-ac`, links, buttons,
 * section markers) moves in lockstep without each needing its own timer.
 *
 * The two axes run on different periods rather than one diagonal bounce, so
 * the drift reads as an ember shifting rather than a mechanical sweep.
 */
export function FireDrift() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const root = document.documentElement;

    const x = animate(root, {
      "--fire-x": ["16%", "84%"],
      duration: 27000,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });
    const y = animate(root, {
      "--fire-y": ["22%", "78%"],
      duration: 19000,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });

    return () => {
      x.revert();
      y.revert();
    };
  }, []);

  return null;
}
