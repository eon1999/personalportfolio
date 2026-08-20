export type BootLogKind = "boot" | "ok" | "warn";

/**
 * Marks the two lines the sync readout keys off, so the hook never has to
 * match on message text:
 * - `sync` — the link starts reporting a ratio; the bar strikes on and begins
 *   its stuttering climb toward the hold.
 * - `release` — the hold is accepted; the ceiling opens and the ratio creeps
 *   the rest of the way to where the link settles.
 */
export type BootCue = "sync" | "release";

export interface BootStep {
  /** Offset in milliseconds from the start of the log timeline. */
  readonly at: number;
  readonly kind: BootLogKind;
  readonly message: string;
  readonly cue?: BootCue;
}

export interface BootLogLine {
  readonly id: number;
  /** Pre-formatted `[00.00]` timestamp. */
  readonly stamp: string;
  readonly message: string;
  readonly kind: BootLogKind;
}

/**
 * The log timeline, measured from the moment the panel strikes on — which is
 * after the character rain has wiped the screen, not from the button press.
 * The first line is held back past the log window's own strike-on, so the
 * window has flickered up before anything prints into it.
 */
export const BOOT_SEQUENCE: readonly BootStep[] = [
  { at: 600, kind: "boot", message: "power bus ....................... nominal" },
  { at: 850, kind: "boot", message: "coolant loop A/B ................ nominal" },
  { at: 1100, kind: "boot", message: "loading operator record 001" },
  { at: 1380, kind: "ok", message: "record found: DANG, VIET-ANH" },
  { at: 1660, kind: "boot", message: "entry plug ...................... locked" },
  { at: 1920, kind: "boot", message: "LCL pressure .................... 1.04 atm" },
  { at: 2180, kind: "warn", message: "harmonics drifting — recalibrating" },
  { at: 2480, kind: "ok", message: "harmonics ....................... stable" },
  { at: 2740, kind: "boot", message: "establishing neural link" },
  { at: 3040, kind: "ok", message: "link established — sync ratio rising" },
  {
    at: 3340,
    kind: "warn",
    message: "awaiting acceptable sync level",
    cue: "sync",
  },
  { at: 3900, kind: "boot", message: "mounting /projects /writing /record" },
  { at: 4260, kind: "ok", message: "all sectors mounted" },
  {
    at: 4640,
    kind: "ok",
    message: "sync threshold cleared — holding",
    cue: "release",
  },
  { at: 4980, kind: "boot", message: "releasing operator lockouts" },
  { at: 5320, kind: "ok", message: "INTERFACE READY — RELEASING CONTROL" },
];

export const LOG_KIND_COLOR: Record<BootLogKind, string> = {
  boot: "var(--color-body-card)",
  ok: "var(--color-ac2)",
  warn: "var(--color-warn)",
};

/** Padding past the final log line, used as the denominator for progress. */
export const BOOT_TAIL_MS = 700;

/** Beat held on a completed sequence before the reveal starts. */
export const BOOT_SETTLE_MS = 500;

/** The log window only ever shows this many lines. */
export const BOOT_LOG_LIMIT = 11;

export const BOOT_TOTAL_MS =
  BOOT_SEQUENCE[BOOT_SEQUENCE.length - 1].at + BOOT_TAIL_MS;

/**
 * The sync ratio climbs in two stages, both driven by the same ticker:
 * a stuttering rise to `SYNC_HOLD` once the link asks for a level, then a
 * slower creep to `SYNC_TARGET` after the hold is accepted. Each tick either
 * stalls or closes a random fraction of the distance to the current ceiling,
 * which is what gives the readout its uneven, hardware-ish gait.
 */
export const SYNC_TICK_MS = 90;
/** Where the ratio parks while the link decides whether to accept it. */
export const SYNC_HOLD = 50;
/** Where the ratio settles once control is released. */
export const SYNC_TARGET = 64.7;
/** Odds a given tick does nothing at all — the stutter. */
export const SYNC_STALL_CHANCE = 0.24;
/** Fraction of the remaining distance a live tick closes. */
export const SYNC_APPROACH = { min: 0.24, max: 0.44 };
/** The creep past the hold is slower than the rise into it. */
export const SYNC_CREEP_FACTOR = 0.45;

export function formatStamp(ms: number): string {
  return `[${(ms / 1000).toFixed(2).padStart(5, "0")}]`;
}

/**
 * Fixed-width for the seven-segment cells: two integer digits, one decimal, so
 * the readout never changes width as the ratio climbs past ten.
 */
export function formatSync(sync: number): string {
  return sync.toFixed(1).padStart(4, "0");
}

export function phaseLabel(pct: number): string {
  if (pct > 80) return "RELEASING";
  if (pct > 40) return "SYNCHRONIZING";
  return "INITIATING";
}
