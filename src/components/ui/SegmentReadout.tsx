"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger, utils } from "animejs";
import {
  ALL_LIT,
  CELL_HEIGHT,
  CELL_WIDTH,
  SEGMENT_IDS,
  SEGMENT_POINTS,
  segmentsFor,
  type SegmentId,
} from "@/lib/segments";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface SegmentReadoutProps {
  /** Digits, colons and spaces; anything else renders as a literal glyph. */
  readonly value: string;
  /** Cell height in px. Width follows from the cell's aspect ratio. */
  readonly height?: number;
  /** Accessible text, since the segments themselves are decorative. */
  readonly label?: string;
  /** Skips the power-on self-test, for readouts that mount mid-page. */
  readonly quiet?: boolean;
  readonly className?: string;
  /** Tailwind text colour class driving the lit segments. */
  readonly tone?: string;
}

/**
 * A seven-segment display. Every segment of every cell is always drawn — unlit
 * ones sit at a low opacity, which is the ghosted `88:88:88` you see burned
 * into any real LCD, and the thing that makes the readout look like hardware
 * rather than text.
 *
 * Segment on/off runs on a CSS transition rather than anime.js: these tick
 * once a second across dozens of segments, and a declarative transition is
 * both cheaper and impossible to leave mid-flight. anime.js drives the part
 * that earns it — the power-on self-test.
 */
export function SegmentReadout({
  value,
  height = 15,
  label,
  quiet,
  className,
  tone = "text-ac",
}: SegmentReadoutProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [tested, setTested] = useState(false);

  // Every cell shows a lit `8` until the self-test has run through.
  const testing = !quiet && !reduced && !tested;

  useEffect(() => {
    if (!testing) return;

    const root = rootRef.current;
    if (!root) return;

    // The all-lit cells ripple up from nothing, then the real value takes
    // over. Deliberately animates the cells and not their segments: segment
    // opacity is React's, and two writers on one property is a race.
    const cells = root.querySelectorAll("svg");
    const selfTest = animate(cells, {
      opacity: [0.12, 1],
      duration: 280,
      delay: stagger(34),
      ease: "outQuad",
      onComplete: () => setTested(true),
    });

    return () => {
      selfTest.revert();
      utils.remove(cells);
    };
  }, [testing]);

  const width = (height / CELL_HEIGHT) * CELL_WIDTH;
  const chars = [...value];

  return (
    <span
      ref={rootRef}
      className={cn("inline-flex items-center gap-[2px]", tone, className)}
    >
      {label ? <span className="sr-only">{label}</span> : null}

      <span aria-hidden className="inline-flex items-center gap-[2px]">
        {chars.map((char, index) => {
          if (char === ":" || char === ".") {
            return (
              <Punctuation key={index} char={char} height={height} />
            );
          }

          return (
            <Cell
              key={index}
              lit={testing ? ALL_LIT : segmentsFor(char)}
              width={width}
              height={height}
            />
          );
        })}
      </span>
    </span>
  );
}

interface CellProps {
  readonly lit: readonly SegmentId[];
  readonly width: number;
  readonly height: number;
}

function Cell({ lit, width, height }: CellProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${CELL_WIDTH} ${CELL_HEIGHT}`}
      className="block overflow-visible"
      focusable="false"
    >
      {SEGMENT_IDS.map((id) => (
        <polygon
          key={id}
          data-seg
          points={SEGMENT_POINTS[id]}
          fill="currentColor"
          className="seg"
          style={{ opacity: lit.includes(id) ? 1 : 0.11 }}
        />
      ))}
    </svg>
  );
}

/** Colons and decimal points, sized to match the cells beside them. */
function Punctuation({
  char,
  height,
}: {
  readonly char: string;
  readonly height: number;
}) {
  const dot = Math.max(1.5, height / 11);
  const gap = height / 4;

  return (
    <span
      className="flex flex-col justify-center"
      style={{ height, width: dot * 1.6 }}
    >
      {char === ":" ? (
        <>
          <span
            className="block rounded-[0.5px] bg-current"
            style={{ width: dot, height: dot, marginBottom: gap }}
          />
          <span
            className="block rounded-[0.5px] bg-current"
            style={{ width: dot, height: dot }}
          />
        </>
      ) : (
        <span
          className="mt-auto block rounded-[0.5px] bg-current"
          style={{ width: dot, height: dot }}
        />
      )}
    </span>
  );
}
