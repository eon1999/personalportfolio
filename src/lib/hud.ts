/**
 * Timings for the anime.js layer — the cockpit hardware that runs on top of
 * the Motion-driven boot sequence. Milliseconds, because that is anime.js's
 * default time unit (`@/lib/motion` is in seconds, for Motion).
 */
export const HUD = {
  /** Reticle catch-up. Long enough to trail the pointer, short enough to aim. */
  cursorFollow: 190,
  /** Reticle idle breath, one direction. */
  cursorBreath: 2200,
  /** Reticle settle when crossing on or off a clickable. */
  cursorSnap: 260,
  /** How much faster the breath runs while the reticle is locked on. */
  cursorLockRate: 2.8,
  /** Hero name pulse, one direction. */
  heroPulse: 3400,
  /** One full top-to-bottom pass of the site scan beam. */
  beamTravel: 11000,
  /** CRT brightness flicker cycle. */
  crtFlicker: 4200,
  /** Carousel slot-to-slot travel. */
  carousel: 640,
  /** Dossier open / close. */
  dossier: 380,
  /** Music panel open, same projector warm-up as the dossier. */
  panel: 380,
  /** Split-flap leaf, hinge to seam — the drop. */
  flapFall: 130,
  /** And the seam to flat again — the slap. */
  flapLand: 150,
} as const;

/**
 * The circular equalizer around the track title.
 *
 * Radii are in the ring's own 300x300 viewBox, not pixels — the SVG scales to
 * whatever the panel gives it.
 */
export const EQ = {
  /** Total bars. Even, because the ring is mirrored down the middle. */
  bars: 72,
  /** Radius the bars start from. */
  inner: 96,
  /** How far a bar at full level reaches past `inner`. */
  reach: 46,
  width: 2.5,
  /** Resting height, so a stopped ring still reads as a ring. */
  floor: 0.08,
  /**
   * `damp` factors, asymmetric on purpose: a bar jumps to a transient almost
   * at once and falls back slowly. Matched attack and release read as the ring
   * breathing rather than as it responding to the music.
   */
  attack: 0.2,
  release: 0.045,
  /**
   * Share of the spectrum the ring covers. The top of an FFT on music is
   * mostly empty, and including it flattens everything worth looking at.
   */
  spectrum: 0.62,
  /**
   * Spectral tilt, bass end to treble end.
   *
   * Music carries most of its energy low down, so an untilted ring pins its
   * bass bars at full reach and leaves the treble bars flat. Trimming the
   * bottom and lifting the top spends the ring's travel on what actually
   * moves.
   */
  bassGain: 0.6,
  trebleGain: 1.5,
} as const;

/** The reticle's fire gradient, top to bottom: white-hot down to ember. */
export const FIRE_STOPS = [
  { offset: "0%", color: "#fff6d6" },
  { offset: "28%", color: "#ffcf6b" },
  { offset: "58%", color: "#ff8a2b" },
  { offset: "82%", color: "#ff4d0d" },
  { offset: "100%", color: "#a81b06" },
] as const;
