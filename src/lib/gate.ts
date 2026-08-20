/**
 * Full-screen gates: the transitions that cover and uncover the site.
 *
 * All three are one anime.js timeline each, and all unmount on the timeline's
 * completion rather than on a timer. `fallback` exists only so a dropped
 * completion event can't leave the page sealed behind a black panel.
 *
 * - `WELCOME` — boot terminal → home. Cover, greet the operator, ripple open.
 * - `ACCESS`  — arriving on a sub-page. Fast log, clearance line, ripple open.
 * - `REPLAY`  — site → boot terminal. Ripple shut from the edges in, then seal.
 * - `RETURN`  — sub-page → home. `REPLAY`'s cover, then ripple open on the far
 *   side of the navigation, so the route swap happens behind full black.
 */

/** Shared by every gate: the tile ripple and the shockwave riding its edge. */
export const RIPPLE = {
  /** Per-tile clear, and the delay added per step out from the focal point. */
  tile: 520,
  tileStagger: 52,
  shockwave: 900,
  /** How fast the solid backing fades, once the tiles have taken over. */
  fill: 80,
  fallback: 9000,
} as const;

export const WELCOME = {
  /** Cover fades over the finished terminal. */
  cover: 420,
  /** Ring draws itself closed around the greeting. */
  ringDraw: 900,
  greetIn: 420,
  greetStagger: 110,
  /** Beat held on the finished greeting. */
  hold: 900,
  greetOut: 340,
} as const;

/** Absolute cue points on the welcome timeline, in ms. */
export const WELCOME_CUE = {
  cover: 0,
  ring: 0,
  greet: 180,
  /**
   * Boot overlay is dropped a beat past the cover landing, so a callback
   * arriving a frame early can't flash the site through a not-quite-opaque
   * cover.
   */
  uncoverBoot: WELCOME.cover + 40,
  greetOut: WELCOME.ringDraw + WELCOME.hold,
  ripple: WELCOME.ringDraw + WELCOME.hold + WELCOME.greetOut,
} as const;

export const ACCESS = {
  /** Log lines land fast — this is a handshake, not a cold boot. */
  logStagger: 90,
  logIn: 140,
  /** Ring snaps closed rather than drawing at boot pace. */
  ringDraw: 420,
  headlineIn: 320,
  hold: 480,
  clear: 240,
} as const;

/** Absolute cue points on the access timeline, in ms. */
export const ACCESS_CUE = {
  log: 0,
  ring: 240,
  headline: 400,
} as const;

export const REPLAY = {
  /** Tiles close back in from the edges. */
  tile: 420,
  tileStagger: 44,
  /** Solid backing fades up behind the closed tiles to seal any seams. */
  seal: 260,
  /** Beat of full black before the terminal takes over. */
  settle: 180,
} as const;

/**
 * Landing on the home page from a sub-page, picking the screen up on the black
 * `REPLAY` left it on. The opening is `RIPPLE`'s, shared with the other gates.
 */
export const RETURN = {
  /** Beat of black held before opening, so the seam reads as one transition. */
  settle: 160,
} as const;

/** Target tile size in px; the grid is sized to cover the viewport. */
export const TILE_PX = 92;

/** Guards against a pathological tile count on very large displays. */
export const MAX_TILES = 900;

export interface TileGridSize {
  readonly cols: number;
  readonly rows: number;
}

/**
 * Picks a tile grid that covers `width` x `height`, backing off to a coarser
 * grid rather than exceeding `MAX_TILES`.
 */
export function measureTileGrid(width: number, height: number): TileGridSize {
  let size = TILE_PX;
  let cols = Math.max(2, Math.ceil(width / size));
  let rows = Math.max(2, Math.ceil(height / size));

  while (cols * rows > MAX_TILES) {
    size *= 1.25;
    cols = Math.max(2, Math.ceil(width / size));
    rows = Math.max(2, Math.ceil(height / size));
  }

  return { cols, rows };
}
