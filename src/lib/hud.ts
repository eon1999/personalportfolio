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
} as const;

/** The reticle's fire gradient, top to bottom: white-hot down to ember. */
export const FIRE_STOPS = [
  { offset: "0%", color: "#fff6d6" },
  { offset: "28%", color: "#ffcf6b" },
  { offset: "58%", color: "#ff8a2b" },
  { offset: "82%", color: "#ff4d0d" },
  { offset: "100%", color: "#a81b06" },
] as const;
