/**
 * The Web Audio tap that feeds the circular equalizer.
 *
 * Module state, because the graph is a property of the one `<audio>` element on
 * the site rather than of any component: `createMediaElementSource` may be
 * called only once per element, and calling it twice throws. The panel mounts
 * and unmounts freely; this survives it.
 *
 * Everything is created on the first play, which is necessarily inside a user
 * gesture — an `AudioContext` built any earlier starts suspended and takes the
 * audio down with it, since routing the element through the graph makes the
 * context the only way out to the speakers.
 */

/** 128 bins. Enough resolution for a ring of bars, cheap enough to read at 60fps. */
const FFT_SIZE = 256;

/**
 * The analyser's own smoothing. Kept low because the ring damps per frame as
 * well, and stacking the two turns every transient into a slow swell.
 */
const SMOOTHING = 0.6;

let context: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let failed = false;

/**
 * Routes `element` through an analyser, once, and returns it.
 *
 * Returns `null` if Web Audio is unavailable or the element's source can't be
 * created — the equalizer treats that as "no data" and idles rather than
 * breaking, and the music keeps playing untouched.
 */
export function attachAnalyser(element: HTMLAudioElement): AnalyserNode | null {
  if (failed) return null;
  if (analyser) {
    void context?.resume();
    return analyser;
  }

  try {
    const ctx = new AudioContext();
    const node = ctx.createAnalyser();
    node.fftSize = FFT_SIZE;
    node.smoothingTimeConstant = SMOOTHING;

    // The analyser is a tap in the line, not a replacement for it: the source
    // still has to reach the destination or the page goes silent.
    const source = ctx.createMediaElementSource(element);
    source.connect(node);
    node.connect(ctx.destination);

    context = ctx;
    analyser = node;
    void ctx.resume();
    return node;
  } catch {
    failed = true;
    return null;
  }
}

/** The live analyser, if one has been attached. */
export function getAnalyser(): AnalyserNode | null {
  return analyser;
}
