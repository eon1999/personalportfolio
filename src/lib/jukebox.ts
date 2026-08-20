import { AUDIO_BASE, type Track } from "@/data/tracks";

/**
 * Deterministic 0-1 from a seed and a step.
 *
 * Pure on purpose: the sequence is a function of `(seed, step)` rather than of
 * mutable generator state, so nothing has to thread an RNG object around and a
 * given seed always replays the same order. Same reasoning as the scatter
 * noise in `useScatter`, one dimension up.
 */
function noise(seed: number, step: number): number {
  let t = (seed + Math.imul(step, 0x6d2b79f5)) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * Picks a track index for `step`, never returning `exclude`.
 *
 * Draws from the other `count - 1` slots and shifts past the excluded index,
 * rather than re-rolling until it lands elsewhere: no unbounded loop, and every
 * other track keeps exactly equal odds.
 */
export function pickTrack(
  seed: number,
  step: number,
  count: number,
  exclude?: number,
): number {
  if (count <= 0) return 0;
  if (exclude === undefined || count === 1) {
    return Math.min(count - 1, Math.floor(noise(seed, step) * count));
  }

  const drawn = Math.min(count - 2, Math.floor(noise(seed, step) * (count - 1)));
  return drawn >= exclude ? drawn + 1 : drawn;
}

/** A seed for one visit. Called on the first play, so it never runs on the server. */
export function newSeed(): number {
  return (Math.floor(Math.random() * 0xffffffff) >>> 0) || 1;
}

/** Seconds to `M:SS`, clamped at zero and safe against a not-yet-known duration. */
export function formatClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  return `${minutes}:${String(whole % 60).padStart(2, "0")}`;
}

export function trackSrc(track: Track): string {
  return `${AUDIO_BASE}/${track.file}`;
}
