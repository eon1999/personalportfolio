"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { SegmentReadout } from "@/components/ui/SegmentReadout";
import { prefersReducedMotion } from "@/lib/prefs";

/**
 * Time-connected readout for the top nav. Reads as an uplink counter rather
 * than a wall clock — `T+` is the elapsed-time convention the rest of the
 * cockpit copy already borrows from.
 */
export function SessionTimer() {
  const elapsed = useSessionTimer();
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot || prefersReducedMotion()) return;

    const beat = animate(dot, {
      opacity: [1, 0.2],
      duration: 900,
      ease: "inOutQuad",
      loop: true,
      alternate: true,
    });

    return () => {
      beat.revert();
    };
  }, []);

  return (
    <div
      className="hidden items-center gap-[9px] border border-line px-[10px] py-[4px] sm:flex"
      title="Time connected this session"
    >
      <span ref={dotRef} aria-hidden className="tri block size-[7px] bg-ac2" />
      <span aria-hidden className="text-[8.5px] tracking-[.24em] text-dim">
        UPLINK T+
      </span>

      <SegmentReadout
        value={elapsed}
        height={14}
        className="lcd"
        label={`Time connected this session: ${elapsed}`}
      />
    </div>
  );
}
