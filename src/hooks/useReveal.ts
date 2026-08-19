"use client";

import { useCallback, useState } from "react";

export interface Reveal {
  /** The boot overlay stays mounted until the cover is fully opaque. */
  readonly bootVisible: boolean;
  /** True once the gate has left the screen and the site is interactive. */
  readonly revealed: boolean;
  readonly hideBoot: () => void;
  readonly finish: () => void;
  readonly reset: () => void;
}

/**
 * Tracks how far the boot → site handoff has got. Deliberately holds no timers:
 * the gates drive their own transitions off anime.js completion events and call
 * in here when each one lands.
 *
 * Pass `alreadyRevealed` to start on the site with no boot at all — used when
 * the visitor has already been through a gate this page load.
 */
export function useReveal(alreadyRevealed = false): Reveal {
  const [bootVisible, setBootVisible] = useState(!alreadyRevealed);
  const [revealed, setRevealed] = useState(alreadyRevealed);

  const hideBoot = useCallback(() => setBootVisible(false), []);

  const finish = useCallback(() => {
    setBootVisible(false);
    setRevealed(true);
  }, []);

  const reset = useCallback(() => {
    setBootVisible(true);
    setRevealed(false);
  }, []);

  return { bootVisible, revealed, hideBoot, finish, reset };
}
