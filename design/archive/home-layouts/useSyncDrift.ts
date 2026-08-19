"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DRIFT_MAX,
  DRIFT_MIN,
  DRIFT_TICK_MS,
  SYNC_TARGET,
} from "@/data/boot-sequence";

export interface SyncDrift {
  readonly value: number;
  /** Parks the needle back at its nominal value, for a replayed boot. */
  readonly reset: () => void;
}

/**
 * Post-reveal sync ratio: a bounded random walk starting from the value the
 * boot sequence landed on. Idle until `active`.
 */
export function useSyncDrift(active: boolean): SyncDrift {
  const [value, setValue] = useState(SYNC_TARGET);

  useEffect(() => {
    if (!active) return;

    const id = setInterval(() => {
      setValue((current) => {
        const drift = (Math.random() - 0.48) * 0.9;
        return Math.max(DRIFT_MIN, Math.min(DRIFT_MAX, current + drift));
      });
    }, DRIFT_TICK_MS);

    return () => clearInterval(id);
  }, [active]);

  const reset = useCallback(() => setValue(SYNC_TARGET), []);

  return { value, reset };
}
