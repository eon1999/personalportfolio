"use client";

import { useEffect, useRef } from "react";
import { animate, createScope, type Scope } from "animejs";
import { PROFILE } from "@/data/profile";
import { STANDBY_FLICKER, STANDBY_HINT_BLINK } from "@/lib/standby";
import { prefersReducedMotion } from "@/lib/prefs";
import { DisplayText } from "@/components/ui/DisplayText";
import { Insignia } from "./Insignia";

/**
 * The idle gate: nothing happens until the visitor asks for it.
 *
 * Mounting flickers the whole panel up out of black — on first load, and again
 * every time `REPLAY BOOT` hands the screen back.
 */
export function BootStandby({ onStart }: { readonly onStart: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<Scope | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = prefersReducedMotion();

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
      }
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
    };
  }, []);

  return (
    <div ref={rootRef} className="relative text-center opacity-0">
      <Insignia />

      <h1 className="mt-[34px] text-[clamp(34px,7vw,52px)] tracking-[.18em] text-ink">
        <DisplayText hatch className="origin-center">
          STANDBY
        </DisplayText>
      </h1>
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
