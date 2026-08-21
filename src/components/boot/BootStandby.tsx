"use client";

import { useEffect, useRef } from "react";
import { animate, createScope, type Scope } from "animejs";
import { PROFILE } from "@/data/profile";
import {
  STANDBY_FLICKER,
  STANDBY_FLICKER_DEPTH,
  STANDBY_FLICKER_DURATION,
  STANDBY_FLICKER_GAP,
  STANDBY_FLICKER_STRIKE,
  STANDBY_HINT_BLINK,
} from "@/lib/standby";
import { prefersReducedMotion } from "@/lib/prefs";
import { DisplayText } from "@/components/ui/DisplayText";
import { Insignia } from "./Insignia";

/**
 * The idle gate: nothing happens until the visitor asks for it.
 *
 * Mounting flickers the whole panel up out of black — on first load, and again
 * every time `REPLAY BOOT` hands the screen back. Once settled, the panel dips
 * to a random opacity at random intervals, like a tube struggling to hold.
 */
export function BootStandby({ onStart }: { readonly onStart: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<Scope | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = prefersReducedMotion();
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    scopeRef.current = createScope({ root }).add(() => {
      animate(root, {
        opacity: reduced ? [0, 1] : STANDBY_FLICKER,
        ease: "linear",
      });

      if (!reduced) {
        animate(".standby-hint", {
          opacity: STANDBY_HINT_BLINK,
          ease: "linear",
          loop: true,
        });

        /**
         * After the initial power-up flicker has settled, the panel dips
         * to a random opacity at random intervals — a tube struggling to
         * hold, rather than a full loss of signal.
         */
        const scheduleFlicker = () => {
          const depth =
            STANDBY_FLICKER_DEPTH.min +
            Math.random() *
              (STANDBY_FLICKER_DEPTH.max - STANDBY_FLICKER_DEPTH.min);
          const strikeDown =
            STANDBY_FLICKER_STRIKE.min +
            Math.random() *
              (STANDBY_FLICKER_STRIKE.max - STANDBY_FLICKER_STRIKE.min);
          const strikeUp = strikeDown * 2;
          const gap =
            STANDBY_FLICKER_GAP.min +
            Math.random() * (STANDBY_FLICKER_GAP.max - STANDBY_FLICKER_GAP.min);

          animate(root, {
            opacity: depth,
            duration: strikeDown,
            ease: "linear",
          });

          timeouts.push(
            setTimeout(() => {
              animate(root, {
                opacity: 1,
                duration: strikeUp,
                ease: "linear",
              });
            }, strikeDown),
          );

          timeouts.push(
            setTimeout(scheduleFlicker, strikeDown + strikeUp + gap),
          );
        };

        timeouts.push(setTimeout(scheduleFlicker, STANDBY_FLICKER_DURATION));
      }
    });

    return () => {
      for (const id of timeouts) clearTimeout(id);
      scopeRef.current?.revert();
      scopeRef.current = null;
    };
  }, []);

  return (
    <div ref={rootRef} className="relative text-center opacity-0">
      <Insignia />

      <p className="mt-[34px] text-[clamp(34px,7vw,52px)] tracking-[.18em] text-ink">
        <DisplayText hatch className="origin-center">
          STANDBY
        </DisplayText>
      </p>
      <p className="mt-2 text-[11px] tracking-[.34em] text-dim">
        OPERATOR RECORD — {PROFILE.shortName}
      </p>

      <button
        type="button"
        onClick={onStart}
        className="btn-ac mt-11 px-[34px] py-4 text-[12px] tracking-[.28em]"
      >
        PRESS [ ENTER ] TO INITIATE
      </button>

      <p className="standby-hint mt-4 text-[9.5px] tracking-[.24em] text-dim">
        AWAITING OPERATOR INPUT
      </p>
    </div>
  );
}
