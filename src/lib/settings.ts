/**
 * Chrome scale — how large the two fixed bars are drawn.
 *
 * 1x is the size the nav and the status bar were originally cut at, back when
 * they were the only things on the screen. They are the site's instrumentation
 * rather than its content, so the visitor gets to say how much of the glass
 * they take up; the site ships at 1.5x, which is what they read as on a laptop
 * at arm's length. 2x is the ceiling — past it the bars stop being chrome and
 * start being the page.
 *
 * The number is handed to CSS as `--chrome-scale` and everything sized by the
 * chrome — the bars themselves, the HUD brackets, the content column's top and
 * bottom clearance — is struck from it.
 */
export const CHROME_SCALES = [1, 1.5, 2] as const;

export type ChromeScale = (typeof CHROME_SCALES)[number];

export const DEFAULT_CHROME_SCALE: ChromeScale = 1.5;

/** What each step is called in the settings panel. */
export const CHROME_SCALE_LABELS: Record<ChromeScale, string> = {
  1: "COMPACT",
  1.5: "STANDARD",
  2: "LARGE",
};

/** Namespaced: this is the visitor's `localStorage`, not ours. */
export const CHROME_SCALE_KEY = "terminal-001:chrome-scale";

export function isChromeScale(value: unknown): value is ChromeScale {
  return CHROME_SCALES.some((scale) => scale === Number(value));
}

/** The stored choice, or the default when there is none to read. */
export function readChromeScale(): ChromeScale {
  // Called from a `useState` initialiser, which also runs on the server.
  if (typeof window === "undefined") return DEFAULT_CHROME_SCALE;

  try {
    const stored = window.localStorage.getItem(CHROME_SCALE_KEY);
    return isChromeScale(stored) ? (Number(stored) as ChromeScale) : DEFAULT_CHROME_SCALE;
  } catch {
    // Storage can be switched off outright. The setting still works for this
    // page load; it just won't be there on the next one.
    return DEFAULT_CHROME_SCALE;
  }
}

export function writeChromeScale(scale: ChromeScale): void {
  try {
    window.localStorage.setItem(CHROME_SCALE_KEY, String(scale));
  } catch {
    // Same as above — nothing to recover from, and nothing worth saying.
  }
}

/**
 * The property the choice is written to.
 *
 * Deliberately not `--chrome-scale` itself: that one is derived, so a
 * stylesheet can still hold the chrome down to 1x on a screen with no room to
 * magnify it. An inline style would beat any such rule; this way the
 * preference survives the override rather than fighting it.
 */
export const CHROME_SCALE_PROPERTY = "--chrome-scale-pref";

/** Hands the choice to CSS, which decides what to do with it. */
export function applyChromeScale(scale: ChromeScale): void {
  document.documentElement.style.setProperty(
    CHROME_SCALE_PROPERTY,
    String(scale),
  );
}

/**
 * Restores a stored scale before the first paint.
 *
 * Runs as a blocking inline script in the document head, ahead of React: the
 * server has no way to know what this visitor chose, so without it a visitor
 * on 1x or 2x would watch the bars come up at 1.5x and then snap. Derived from
 * the constants above rather than written out, so the key and the steps stay
 * defined in exactly one place.
 */
export const CHROME_SCALE_BOOTSTRAP = `try{var v=localStorage.getItem(${JSON.stringify(
  CHROME_SCALE_KEY,
)});if(${JSON.stringify(
  CHROME_SCALES.map(String),
)}.indexOf(v)>-1)document.documentElement.style.setProperty(${JSON.stringify(
  CHROME_SCALE_PROPERTY,
)},v)}catch(e){}`;
