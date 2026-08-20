"use client";

import { useEffect, useRef } from "react";
import { createScope, createTimeline, stagger, type Scope } from "animejs";
import { RETURN, RIPPLE } from "@/lib/gate";
import { prefersReducedMotion } from "@/lib/prefs";
import { Shockwave } from "./Shockwave";
import { TileGrid } from "./TileGrid";
import { useTileGrid } from "./useTileGrid";

/**
 * The opening half of `RETURN TO TERMINAL`: the home page picks the screen up
 * still sealed, holds the black a beat so the two halves read as one
 * transition, then ripples open from the centre with the shockwave on the
 * leading edge.
 *
 * Opaque on first paint — the sub-page's cover is torn down by the same commit
 * that mounts this, so anything less would flash the site through the seam.
 */
export function ReturnGate({
  onRevealed,
}: {
  readonly onRevealed: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<Scope | null>(null);
  const grid = useTileGrid();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !grid) return;

    const reduced = prefersReducedMotion();
    const rippleAt = RETURN.settle;

    scopeRef.current = createScope({ root }).add(() => {
      createTimeline({ defaults: { ease: "outQuad" }, onComplete: onRevealed })
        // Drop the solid backing just before the ripple, so the tiles are what
        // is covering the screen by the time they start clearing.
        .add(
          ".gate-fill",
          { opacity: [1, 0], duration: RIPPLE.fill, ease: "linear" },
          Math.max(0, rippleAt - RIPPLE.fill),
        )
        .add(
          ".gate-tile",
          {
            opacity: [1, 0],
            ...(reduced ? {} : { scale: [1, 0.15] }),
            duration: RIPPLE.tile,
            // Same focal point, jitter and seed as every other ripple, so the
            // front breaks up identically whichever gate is driving it.
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

  // Safety net: never leave the site sitting behind the cover.
  useEffect(() => {
    const id = setTimeout(onRevealed, RIPPLE.fallback);
    return () => clearTimeout(id);
  }, [onRevealed]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[21] overflow-hidden"
    >
      {/* Solid until the tiles have been measured, which is a frame or two
          after mount — the black has to be unbroken across that gap. */}
      <div aria-hidden className="gate-fill absolute inset-0 bg-void" />

      <div aria-hidden className="absolute inset-0">
        {grid ? <TileGrid cols={grid.cols} rows={grid.rows} /> : null}
      </div>

      <Shockwave />
    </div>
  );
}
