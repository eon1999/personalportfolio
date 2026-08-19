"use client";

import { useEffect, useRef, useState } from "react";
import { createScope, createTimeline, stagger, type Scope } from "animejs";
import { ACCESS, ACCESS_CUE, RIPPLE } from "@/lib/gate";
import { prefersReducedMotion } from "@/lib/prefs";
import { pickHeadline } from "@/data/gate";
import { GateLog } from "./GateLog";
import { GateMark, RING_CIRCUMFERENCE } from "./GateMark";
import { Shockwave } from "./Shockwave";
import { TileGrid } from "./TileGrid";
import { useTileGrid } from "./useTileGrid";

/**
 * Arriving on a sub-page. Already opaque on first paint, so the incoming route
 * never flashes: a fast handshake log runs, one of three clearance lines lands
 * inside a snapping ring, then the cover ripples open.
 */
export function AccessGate({
  onRevealed,
}: {
  readonly onRevealed: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<Scope | null>(null);
  const grid = useTileGrid();

  // Picked once per gate. It is only ever *rendered* once the grid resolves,
  // which is after hydration — so the server and the hydrating client both emit
  // an empty headline and agree, and the client's own pick lands on the
  // re-render that follows.
  const [headline] = useState(pickHeadline);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !grid) return;

    const reduced = prefersReducedMotion();
    const rippleAt =
      ACCESS_CUE.headline + ACCESS.headlineIn + ACCESS.hold + ACCESS.clear;

    scopeRef.current = createScope({ root }).add(() => {
      createTimeline({ defaults: { ease: "outQuad" }, onComplete: onRevealed })
        // Handshake readout.
        .add(
          ".gate-log-line",
          {
            opacity: [0, 1],
            ...(reduced ? {} : { translateX: [-8, 0] }),
            duration: ACCESS.logIn,
            delay: stagger(ACCESS.logStagger),
          },
          ACCESS_CUE.log,
        )
        .add(
          ".gate-ring",
          {
            strokeDashoffset: [RING_CIRCUMFERENCE, 0],
            duration: reduced ? 1 : ACCESS.ringDraw,
            ease: "outQuart",
          },
          ACCESS_CUE.ring,
        )
        .add(
          ".gate-line",
          {
            opacity: [0, 1],
            ...(reduced ? {} : { translateY: [8, 0] }),
            duration: ACCESS.headlineIn,
            delay: stagger(70),
          },
          ACCESS_CUE.headline,
        )
        // Clear the message, then drop the solid backing so only tiles remain.
        .add(
          ".gate-mark, .gate-log-line",
          { opacity: 0, duration: ACCESS.clear },
          ACCESS_CUE.headline + ACCESS.headlineIn + ACCESS.hold,
        )
        .add(
          ".gate-fill",
          { opacity: [1, 0], duration: RIPPLE.fill, ease: "linear" },
          rippleAt - RIPPLE.fill,
        )
        // Ripple the cover away from the focal point.
        .add(
          ".gate-tile",
          {
            opacity: [1, 0],
            ...(reduced ? {} : { scale: [1, 0.15] }),
            duration: RIPPLE.tile,
            delay: reduced
              ? 0
              : stagger(RIPPLE.tileStagger, {
                  grid: [grid.cols, grid.rows],
                  from: "center",
                  ease: "outQuad",
                  jitter: 0.4,
                  seed: 1,
                }),
          },
          rippleAt,
        )
        .add(
          ".gate-shockwave",
          {
            opacity: [0.85, 0],
            scale: [0, 2.6],
            duration: reduced ? 1 : RIPPLE.shockwave,
          },
          rippleAt,
        );
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
    };
  }, [grid, onRevealed]);

  useEffect(() => {
    const id = setTimeout(onRevealed, RIPPLE.fallback);
    return () => clearTimeout(id);
  }, [onRevealed]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[21] overflow-hidden"
    >
      {/* Solid on first paint, including on the server, so the incoming page is
          covered before the tiles have been measured. */}
      <div aria-hidden className="gate-fill absolute inset-0 bg-void" />

      <div aria-hidden className="absolute inset-0">
        {grid ? <TileGrid cols={grid.cols} rows={grid.rows} /> : null}
      </div>

      <Shockwave />

      <div
        role="status"
        className="absolute inset-0 flex items-center justify-center"
      >
        <GateMark
          eyebrow="TERMINAL 001 / SECURE CHANNEL"
          headline={grid ? headline : []}
        />
      </div>

      <GateLog />
    </div>
  );
}
