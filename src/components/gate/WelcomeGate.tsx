"use client";

import { useEffect, useRef } from "react";
import { createScope, createTimeline, stagger, type Scope } from "animejs";
import {
  RIPPLE,
  WELCOME,
  WELCOME_CUE,
} from "@/lib/gate";
import { prefersReducedMotion } from "@/lib/prefs";
import { PROFILE } from "@/data/profile";
import { GateMark, RING_CIRCUMFERENCE } from "./GateMark";
import { Shockwave } from "./Shockwave";
import { TileGrid } from "./TileGrid";
import { useTileGrid } from "./useTileGrid";

interface WelcomeGateProps {
  /** The cover is opaque — safe to tear down the boot overlay behind it. */
  readonly onCovered: () => void;
  /** The ripple has finished and the site is uncovered. */
  readonly onRevealed: () => void;
}

/**
 * Boot terminal → home. A black cover fades over the finished terminal, greets
 * the operator inside a ring that draws itself closed, then shatters into a
 * grid of tiles that ripple out from the centre of the screen to uncover the
 * site, with an amber shockwave riding the leading edge.
 *
 * Mount this only while the reveal is in flight — unmounting is what resets it
 * for a replayed boot.
 */
export function WelcomeGate({ onCovered, onRevealed }: WelcomeGateProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<Scope | null>(null);
  const grid = useTileGrid();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !grid) return;

    const reduced = prefersReducedMotion();

    scopeRef.current = createScope({ root }).add(() => {
      createTimeline({ defaults: { ease: "outQuad" }, onComplete: onRevealed })
        // Cover the terminal, and drop it once we're opaque.
        .add(
          ".gate-cover",
          { opacity: [0, 1], duration: WELCOME.cover, ease: "linear" },
          WELCOME_CUE.cover,
        )
        .call(onCovered, WELCOME_CUE.uncoverBoot)
        // Draw the ring closed around the greeting.
        .add(
          ".gate-ring",
          {
            strokeDashoffset: [RING_CIRCUMFERENCE, 0],
            duration: reduced ? 1 : WELCOME.ringDraw,
            ease: "inOutQuad",
          },
          WELCOME_CUE.ring,
        )
        .add(
          ".gate-line",
          {
            opacity: [0, 1],
            ...(reduced ? {} : { translateY: [10, 0] }),
            duration: WELCOME.greetIn,
            delay: stagger(WELCOME.greetStagger),
          },
          WELCOME_CUE.greet,
        )
        // Clear the greeting.
        .add(
          ".gate-mark",
          { opacity: [1, 0], duration: WELCOME.greetOut },
          WELCOME_CUE.greetOut,
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
                  // A touch of noise so the front reads as a ripple rather
                  // than a perfect radius. Seeded, so replays match.
                  jitter: 0.4,
                  seed: 1,
                }),
          },
          WELCOME_CUE.ripple,
        )
        .add(
          ".gate-shockwave",
          {
            opacity: [0.85, 0],
            scale: [0, 2.6],
            duration: reduced ? 1 : RIPPLE.shockwave,
          },
          WELCOME_CUE.ripple,
        );
    });

    return () => {
      scopeRef.current?.revert();
      scopeRef.current = null;
    };
  }, [grid, onCovered, onRevealed]);

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
      <div aria-hidden className="gate-cover absolute inset-0 opacity-0">
        {grid ? <TileGrid cols={grid.cols} rows={grid.rows} /> : null}
      </div>

      <Shockwave />

      <div
        role="status"
        className="absolute inset-0 flex items-center justify-center"
      >
        <GateMark
          eyebrow="LINK ESTABLISHED"
          headline={["WELCOME", "OPERATOR"]}
          sub={PROFILE.shortName}
        />
      </div>
    </div>
  );
}
