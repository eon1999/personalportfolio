"use client";

import { useEffect, type RefObject } from "react";
import { animate, onScroll, utils } from "animejs";
import { prefersReducedMotion } from "@/lib/prefs";

/** A container whose direct children each scatter on their own. */
const CONTAINER = "[data-scatter] > *";
/** An element that scatters by itself. */
const ITEM = "[data-scatter-item]";

/**
 * The share of the travel spent assembling, and again disassembling. The rest
 * is held fully legible — the collapse is meant to bite hard at the very top
 * and bottom of the screen rather than fading the whole page out gradually.
 */
const EDGE = 0.13;

/** Deterministic 0–1 from a pair of integers. No seeding, no state. */
function noise(index: number, salt: number): number {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

/** Symmetric spread of `range` around zero. */
function spread(index: number, salt: number, range: number): number {
  return (noise(index, salt) * 2 - 1) * range;
}

/**
 * Scatters content in and out of the viewport as it scrolls.
 *
 * Each block is linked to its own scroll observer running the whole way from
 * "top edge has reached the bottom of the screen" to "bottom edge has reached
 * the top of it". Blocks arrive from below, hold steady through the middle of
 * that travel, and break apart upward as they leave — each on its own drift
 * and rotation, so a section comes apart as a handful of pieces rather than
 * sliding away as one.
 */
export function useScatter(rootRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const blocks = [
      ...root.querySelectorAll<HTMLElement>(ITEM),
      ...root.querySelectorAll<HTMLElement>(CONTAINER),
    ];
    if (blocks.length === 0) return;

    const animations = blocks.map((block, index) => {
      const inX = spread(index, 1, 34);
      const outX = spread(index, 2, 40);
      const inRotate = spread(index, 3, 7);
      const outRotate = spread(index, 4, 9);

      return animate(block, {
        keyframes: {
          "0%": {
            opacity: 0,
            y: 44,
            x: inX,
            rotate: inRotate,
            scale: 0.92,
          },
          [`${EDGE * 100}%`]: {
            opacity: 1,
            y: 0,
            x: 0,
            rotate: 0,
            scale: 1,
          },
          [`${(1 - EDGE) * 100}%`]: {
            opacity: 1,
            y: 0,
            x: 0,
            rotate: 0,
            scale: 1,
          },
          "100%": {
            opacity: 0,
            y: -44,
            x: outX,
            rotate: outRotate,
            scale: 0.92,
          },
        },
        ease: "inOutQuad",
        // Defaults are exactly the travel we want: enter when the block's top
        // meets the bottom of the viewport, leave when its bottom meets the
        // top. `sync` ties progress to the scrollbar instead of playing.
        autoplay: onScroll({ target: block, sync: 0.35 }),
      });
    });

    return () => {
      animations.forEach((animation) => animation.revert());
      utils.remove(blocks);
    };
  }, [rootRef]);
}
