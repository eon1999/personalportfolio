"use client";

import { useEffect, useRef } from "react";
import { createScope, createTimeline, stagger, type Scope } from "animejs";
import { REPLAY, RIPPLE } from "@/lib/gate";
import { prefersReducedMotion } from "@/lib/prefs";
import { TileGrid } from "./TileGrid";
import { useTileGrid } from "./useTileGrid";

/**
 * Site → boot terminal, the uncover run backwards. Tiles close in from the
 * edges toward the centre, a solid backing fades up to seal the seams, then a
 * beat of full black hands over to the terminal — which flickers its standby
 * screen in from the same black.
 *
 * Driven by `REPLAY BOOT` on the home page and by `RETURN TO TERMINAL` on a
 * sub-page; there `onCovered` is where the route swap happens, so the
 * navigation lands behind an opaque screen.
 */
export function ReplayCover({
  onCovered,
}: {
  readonly onCovered: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<Scope | null>(null);
  const grid = useTileGrid();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !grid) return;

    const reduced = prefersReducedMotion();

    scopeRef.current = createScope({ root }).add(() => {
      createTimeline({ defaults: { ease: "outQuad" }, onComplete: onCovered })
        .add(
          ".gate-tile",
          {
            opacity: [0, 1],
            ...(reduced ? {} : { scale: [0.15, 1] }),
            duration: REPLAY.tile,
            // `reversed` flips the centre-out ordering, so the edges of the
            // screen close first and the focal point is the last thing left.
            delay: reduced
              ? 0
              : stagger(REPLAY.tileStagger, {
                  grid: [grid.cols, grid.rows],
                  from: "center",
                  reversed: true,
                  ease: "inQuad",
                  jitter: 0.4,
                  seed: 1,
                }),
          },
          0,
        )
        // `">"` is the end of the previous step, stagger spread included — the
        // seal can't start before every tile has landed.
        .add(
          ".gate-seal",
          { opacity: [0, 1], duration: REPLAY.seal, ease: "linear" },
          ">",
        )
        // Hold on full black before handing over.
        .add(".gate-seal", { opacity: 1, duration: REPLAY.settle });
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
    };
  }, [grid, onCovered]);

  useEffect(() => {
    const id = setTimeout(onCovered, RIPPLE.fallback);
    return () => clearTimeout(id);
  }, [onCovered]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[21] overflow-hidden"
    >
      <div aria-hidden className="absolute inset-0">
        {grid ? (
          <TileGrid cols={grid.cols} rows={grid.rows} cleared />
        ) : null}
      </div>
      <div aria-hidden className="gate-seal absolute inset-0 bg-void opacity-0" />
    </div>
  );
}
