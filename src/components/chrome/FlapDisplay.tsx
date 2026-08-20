"use client";

import { useEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";
import { HUD } from "@/lib/hud";
import { cn } from "@/lib/cn";
import { prefersReducedMotion } from "@/lib/prefs";

interface FlapDisplayProps {
  /** Everything the board can show, in the order it turns through. */
  readonly labels: readonly string[];
  /** Which of them it should be showing. */
  readonly index: number;
}

/** Half a card: the whole line, cropped to its top or its bottom. */
function Pane({
  label,
  crop,
  className,
}: {
  readonly label: string;
  readonly crop: "top" | "bottom";
  readonly className?: string;
}) {
  return (
    <span className={cn("flap-pane", `crop-${crop}`, className)}>
      <span className="flap-line">{label}</span>
    </span>
  );
}

/**
 * A split-flap card, built the way the departure board in a station is.
 *
 * Three pieces are on screen during a turn: the two static halves, and the
 * leaf hinged along the seam between them. Going down the list, the leaf
 * carries the old top half on its front and the new bottom half on its back,
 * and falls through 180° — so the new top is uncovered as it leaves and the
 * old bottom is buried as it lands. Going back up the list is the same
 * mechanism upside down, which is why `direction` picks the half the leaf
 * starts in rather than switching on two separate constructions.
 *
 * The board only catches up with `index` once the leaf has landed: the gap
 * between what it is showing and what it has been asked to show is what there
 * is to animate.
 */
export function FlapDisplay({ labels, index }: FlapDisplayProps) {
  const [face, setFace] = useState(index);
  const leafRef = useRef<HTMLSpanElement>(null);

  const turning = face !== index;
  const direction = index > face ? 1 : -1;
  const from = labels[face] ?? "";
  const to = labels[index] ?? "";

  useEffect(() => {
    if (face === index) return;

    const leaf = leafRef.current;
    if (!leaf) return;

    if (prefersReducedMotion()) {
      // No theatre, but not a synchronous swap either: the board still has to
      // paint the old value once, or the change is invisible.
      const frame = requestAnimationFrame(() => setFace(index));
      return () => cancelAnimationFrame(frame);
    }

    // Gravity, then the slap. A single ease across the whole 180° reads as a
    // card being placed; the break at the seam is what makes it drop.
    const fall = -180 * (index > face ? 1 : -1);
    const turn = createTimeline({ onComplete: () => setFace(index) })
      .add(leaf, { rotateX: fall / 2, duration: HUD.flapFall, ease: "in(2)" })
      .add(leaf, { rotateX: fall, duration: HUD.flapLand, ease: "out(3)" });

    return () => {
      turn.revert();
    };
  }, [face, index]);

  return (
    <span aria-hidden className="flap">
      {/* Sets the board's size: the longest label it will ever have to hold,
          laid out for real and then hidden, so the width is exact whatever the
          type is doing rather than counted in characters. */}
      <span className="flap-sizer">
        {labels.reduce((widest, label) =>
          label.length > widest.length ? label : widest,
        "")}
      </span>

      {/* Uncovered by the leaf on the way down, buried by it on the way up. */}
      <Pane label={turning && direction === 1 ? to : from} crop="top" />
      <Pane label={turning && direction === -1 ? to : from} crop="bottom" />

      {turning ? (
        <span
          ref={leafRef}
          className={cn("flap-leaf", direction === 1 ? "is-top" : "is-bottom")}
        >
          <Pane label={from} crop={direction === 1 ? "top" : "bottom"} />
          <Pane
            label={to}
            crop={direction === 1 ? "bottom" : "top"}
            className="is-back"
          />
        </span>
      ) : null}

      <span aria-hidden className="flap-seam" />
    </span>
  );
}
