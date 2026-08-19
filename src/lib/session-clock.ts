/**
 * How long the visitor has been connected.
 *
 * Module state, for the same reason as `@/lib/session`: it survives client-side
 * navigation between pages — one continuous session — but resets on a reload,
 * which is also when the boot sequence replays. The clock starts on the first
 * read from the client, so the server never seeds it.
 */
let startedAt: number | null = null;

/** Milliseconds since the session began, starting the clock if needed. */
export function sessionElapsed(): number {
  if (startedAt === null) {
    startedAt = Date.now();
  }

  return Date.now() - startedAt;
}

const pad = (value: number) => String(value).padStart(2, "0");

/** `HH:MM:SS`, clamped at 99 hours so the field never changes width. */
export function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.min(99, Math.floor(total / 3600));

  return `${pad(hours)}:${pad(Math.floor(total / 60) % 60)}:${pad(total % 60)}`;
}

/** What the field reads before the first client tick. */
export const ELAPSED_ZERO = "00:00:00";
