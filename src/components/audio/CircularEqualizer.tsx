"use client";

import { useEffect, useRef } from "react";
import { clamp, damp, lerp } from "animejs";
import { getAnalyser } from "@/lib/analyser";
import { EQ } from "@/lib/hud";
import { prefersReducedMotion } from "@/lib/prefs";

const BOX = 300;
const CENTRE = BOX / 2;

/** Bars are mirrored across the vertical axis, so only half are sampled. */
const HALF = EQ.bars / 2;

interface CircularEqualizerProps {
  /** Drives the idle fallback: a stopped ring settles instead of sweeping. */
  readonly running: boolean;
}

/**
 * Maps bar `i` onto an FFT bin.
 *
 * Bins are linear in frequency but hearing is not, so the low end is spread
 * across more bars than its share of the spectrum would give it — otherwise
 * everything interesting is crushed into the first few bars and the rest of the
 * ring sits flat.
 */
function binFor(i: number, bins: number): number {
  const t = i / HALF;
  return Math.min(bins - 1, Math.floor(t ** 1.7 * bins * EQ.spectrum));
}

/** Builds the whole ring as one path: `M` to the inner radius, `L` outward. */
function buildPath(levels: Float32Array, cos: Float32Array, sin: Float32Array) {
  let d = "";
  for (let i = 0; i < EQ.bars; i++) {
    const length = EQ.inner + EQ.reach * levels[i];
    d +=
      `M${(CENTRE + EQ.inner * cos[i]).toFixed(2)} ${(CENTRE + EQ.inner * sin[i]).toFixed(2)}` +
      `L${(CENTRE + length * cos[i]).toFixed(2)} ${(CENTRE + length * sin[i]).toFixed(2)}`;
  }
  return d;
}

/**
 * The ring of bars around the track title, driven by the live signal.
 *
 * One `<path>` holding every bar, rewritten once per frame, rather than a node
 * per bar: a single attribute write beats seventy-two, and the ring never asks
 * the panel for a re-layout.
 *
 * Raw FFT output is far too jumpy to read, so each bar is eased toward its
 * target with anime.js's `damp` — frame-rate independent, so the ring settles
 * at the same rate on a 60Hz and a 144Hz display.
 */
export function CircularEqualizer({ running }: CircularEqualizerProps) {
  const pathRef = useRef<SVGPathElement>(null);

  // The frame loop is set up once and has to see the current value without
  // being torn down and rebuilt every time playback pauses.
  const runningRef = useRef(running);
  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    // Bar angles never change; trig them once.
    const cos = new Float32Array(EQ.bars);
    const sin = new Float32Array(EQ.bars);
    for (let i = 0; i < EQ.bars; i++) {
      // Start at the top and run clockwise, so the seam sits under the label.
      const angle = (i / EQ.bars) * Math.PI * 2 - Math.PI / 2;
      cos[i] = Math.cos(angle);
      sin[i] = Math.sin(angle);
    }

    const levels = new Float32Array(EQ.bars);

    if (prefersReducedMotion()) {
      levels.fill(EQ.floor);
      path.setAttribute("d", buildPath(levels, cos, sin));
      return;
    }

    let raf = 0;
    let last = performance.now();
    let data: Uint8Array<ArrayBuffer> | null = null;

    const frame = (now: number) => {
      // Clamped: a backgrounded tab returns with a huge delta, which would
      // otherwise snap every bar straight to its target in one step.
      const delta = Math.min(64, now - last);
      last = now;

      const analyser = getAnalyser();
      if (analyser && (!data || data.length !== analyser.frequencyBinCount)) {
        data = new Uint8Array(analyser.frequencyBinCount);
      }
      if (analyser && data) analyser.getByteFrequencyData(data);

      for (let i = 0; i < HALF; i++) {
        let target: number;

        if (analyser && data && runningRef.current) {
          const tilt = lerp(EQ.bassGain, EQ.trebleGain, i / HALF);
          const level = clamp((data[binFor(i, data.length)] / 255) * tilt, 0, 1);
          target = EQ.floor + level * (1 - EQ.floor);
        } else if (runningRef.current) {
          // Playing, but no analyser to read — breathe rather than sit dead.
          target =
            EQ.floor +
            0.22 * (0.5 + 0.5 * Math.sin(now / 420 + i * 0.5));
        } else {
          target = EQ.floor;
        }

        const eased = damp(
          levels[i],
          target,
          target > levels[i] ? EQ.attack : EQ.release,
          delta,
        );
        levels[i] = eased;
        // Mirror onto the far side so the ring reads as one symmetric figure.
        levels[EQ.bars - 1 - i] = eased;
      }

      path.setAttribute("d", buildPath(levels, cos, sin));
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${BOX} ${BOX}`}
      className="absolute inset-0 size-full"
    >
      <circle
        cx={CENTRE}
        cy={CENTRE}
        r={EQ.inner - 8}
        fill="none"
        stroke="var(--color-ring-faint)"
        strokeWidth={1}
      />
      <path
        ref={pathRef}
        stroke="var(--color-ac)"
        strokeWidth={EQ.width}
        strokeLinecap="round"
        fill="none"
        className="eq-ring"
      />
    </svg>
  );
}
