export type BootLogKind = "boot" | "ok" | "warn";

export interface BootStep {
  /** Offset in milliseconds from the start of the sequence. */
  readonly at: number;
  readonly kind: BootLogKind;
  readonly message: string;
}

export interface BootLogLine {
  readonly id: number;
  /** Pre-formatted `[00.00]` timestamp. */
  readonly stamp: string;
  readonly message: string;
  readonly kind: BootLogKind;
}

export const BOOT_SEQUENCE: readonly BootStep[] = [
  { at: 0, kind: "boot", message: "power bus ....................... nominal" },
  { at: 260, kind: "boot", message: "coolant loop A/B ................ nominal" },
  { at: 520, kind: "boot", message: "loading operator record 001" },
  { at: 820, kind: "ok", message: "record found: DANG, VIET-ANH" },
  { at: 1120, kind: "boot", message: "entry plug ...................... locked" },
  { at: 1420, kind: "boot", message: "LCL pressure .................... 1.04 atm" },
  { at: 1700, kind: "warn", message: "harmonics drifting — recalibrating" },
  { at: 2050, kind: "ok", message: "harmonics ....................... stable" },
  { at: 2350, kind: "boot", message: "establishing neural link" },
  { at: 2700, kind: "ok", message: "link established — sync ratio rising" },
  { at: 3100, kind: "boot", message: "mounting /projects /writing /record" },
  { at: 3400, kind: "ok", message: "all sectors mounted" },
  { at: 3750, kind: "ok", message: "INTERFACE READY — RELEASING CONTROL" },
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

/** Sync ratio climb during boot: +1.9 every 90ms, capped at 64.7. */
export const SYNC_TICK_MS = 90;
export const SYNC_TICK_STEP = 1.9;
export const SYNC_TARGET = 64.7;

/** Post-reveal sync-ratio random walk. */
export const DRIFT_TICK_MS = 160;
export const DRIFT_MIN = 58.2;
export const DRIFT_MAX = 71.4;

export function formatStamp(ms: number): string {
  return `[${(ms / 1000).toFixed(2).padStart(5, "0")}]`;
}

export function phaseLabel(pct: number): string {
  if (pct > 80) return "RELEASING";
  if (pct > 40) return "SYNCHRONIZING";
  return "INITIATING";
}
