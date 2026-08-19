/** Spacing between handshake stamps, for display only. */
export const GATE_LOG_STEP_MS = 90;

/** The fast handshake readout an access gate streams before clearing. */
export const GATE_LOG: readonly string[] = [
  "handshake ...................... ok",
  "cipher suite ................... aes-256-gcm",
  "operator clearance ............. verified",
  "decrypting record .............. 100%",
  "mounting sector ................ ok",
];

/** One is picked at random per gate. */
export const GATE_HEADLINES: readonly string[] = [
  "ACCESS GRANTED",
  "FILES DECRYPTED",
  "ACCEPTABLE CLEARANCE",
];

/** Splits a headline into the lines `GateMark` renders. */
export function pickHeadline(): readonly string[] {
  const headline =
    GATE_HEADLINES[Math.floor(Math.random() * GATE_HEADLINES.length)];
  return headline.split(" ");
}
