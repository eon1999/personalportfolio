export interface Orbital {
  readonly id: string;
  readonly radius: number;
  /** `1` clockwise, `-1` counter-clockwise. */
  readonly direction: 1 | -1;
  /** One full turn, in milliseconds. */
  readonly period: number;
  readonly width: number;
  /** Radius of the marker node that makes the rotation legible. */
  readonly node: number;
  readonly gradient: "insignia-fire" | "insignia-fire-alt";
  readonly dash?: string;
  readonly opacity?: number;
}

/**
 * Three orbitals, alternating direction outside-in. The middle one is dashed so
 * its counter-rotation reads clearly against its neighbours.
 */
export const INSIGNIA = {
  orbitals: [
    {
      id: "outer",
      radius: 92,
      direction: 1,
      period: 24000,
      width: 1,
      node: 3.6,
      gradient: "insignia-fire",
      opacity: 0.85,
    },
    {
      id: "mid",
      radius: 70,
      direction: -1,
      period: 15000,
      width: 1.5,
      node: 3,
      gradient: "insignia-fire-alt",
      dash: "10 7",
      opacity: 0.8,
    },
    {
      id: "inner",
      radius: 50,
      direction: 1,
      period: 9000,
      width: 1,
      node: 2.4,
      gradient: "insignia-fire",
      opacity: 0.6,
    },
  ] as readonly Orbital[],

  /** Aura breathes in and out. */
  auraPulse: 2200,
  /** Slow instability on the triangle itself. */
  coreFlicker: 3000,
} as const;

/** One leg of a duration-based opacity keyframe sequence. */
export interface FlickerStep {
  to: number;
  duration: number;
}

/**
 * Duration-based opacity keyframes for the standby panel coming up out of
 * black: a few failed strikes before the picture holds.
 */
export const STANDBY_FLICKER: FlickerStep[] = [
  { to: 0, duration: 0 },
  { to: 0.22, duration: 90 },
  { to: 0.04, duration: 60 },
  { to: 0.68, duration: 70 },
  { to: 0.12, duration: 55 },
  { to: 0.92, duration: 80 },
  { to: 0.38, duration: 45 },
  { to: 1, duration: 280 },
];

/**
 * `AWAITING OPERATOR INPUT` cursor blink: a 1.2s square wave. Spelled out as
 * durations rather than leaning on a step easing, so the hard edges are exact.
 */
export const STANDBY_HINT_BLINK: FlickerStep[] = [
  { to: 1, duration: 588 },
  { to: 0, duration: 12 },
  { to: 0, duration: 588 },
  { to: 1, duration: 12 },
];
