"use client";

import { useEffect, useRef, useState } from "react";
import {
  DRIFT_MAX,
  DRIFT_MIN,
  DRIFT_STEP,
  DRIFT_TICK_MS,
  SYNC_TARGET,
} from "@/data/boot-sequence";

/**
 * Post-boot sync drift: a bounded random walk that keeps the readout alive
 * after the sequence settles.  Starts from `SYNC_TARGET` and wanders slowly
 * between `DRIFT_MIN` and `DRIFT_MAX`.
 */
export function useSyncDrift(active: boolean): number {
  const [value, setValue] = useState(SYNC_TARGET);
  const targetRef = useRef(SYNC_TARGET);

  useEffect(() => {
    if (!active) return;

    const id = setInterval(() => {
      setValue((current) => {
        // Small random step, biased slightly toward the centre to avoid
        // long runs stuck at a boundary.
        const centre = (DRIFT_MIN + DRIFT_MAX) / 2;
        const pull = (centre - current) * 0.008;
        const noise = (Math.random() - 0.5) * 2 * DRIFT_STEP;
        const next = current + pull + noise;
        return Math.max(DRIFT_MIN, Math.min(DRIFT_MAX, next));
      });
    }, DRIFT_TICK_MS);

    return () => clearInterval(id);
  }, [active]);

  // Reset the internal state when replaying a boot.
  useEffect(() => {
    if (!active) {
      setValue(SYNC_TARGET);
      targetRef.current = SYNC_TARGET;
    }
  }, [active]);

  return value;
}
