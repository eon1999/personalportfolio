/**
 * Geometry for a seven-segment character cell, drawn once here and reused by
 * every readout on the site.
 *
 * Segments are lettered the standard way:
 *
 *      aaa
 *     f   b
 *      ggg
 *     e   c
 *      ddd
 */
export type SegmentId = "a" | "b" | "c" | "d" | "e" | "f" | "g";

export const CELL_WIDTH = 12;
export const CELL_HEIGHT = 22;

/** Half the bar thickness — also the length of the 45° mitre at each end. */
const H = 1;

/** A horizontal bar, mitred at both ends so neighbours meet cleanly. */
function horizontal(x1: number, x2: number, y: number): string {
  return [
    [x1, y],
    [x1 + H, y - H],
    [x2 - H, y - H],
    [x2, y],
    [x2 - H, y + H],
    [x1 + H, y + H],
  ]
    .map((point) => point.join(","))
    .join(" ");
}

function vertical(x: number, y1: number, y2: number): string {
  return [
    [x, y1],
    [x + H, y1 + H],
    [x + H, y2 - H],
    [x, y2],
    [x - H, y2 - H],
    [x - H, y1 + H],
  ]
    .map((point) => point.join(","))
    .join(" ");
}

/** Every segment's polygon, in draw order. */
export const SEGMENT_POINTS: Readonly<Record<SegmentId, string>> = {
  a: horizontal(2.9, 9.1, 2),
  g: horizontal(2.9, 9.1, 11),
  d: horizontal(2.9, 9.1, 20),
  f: vertical(2, 2.9, 10.1),
  b: vertical(10, 2.9, 10.1),
  e: vertical(2, 11.9, 19.1),
  c: vertical(10, 11.9, 19.1),
};

export const SEGMENT_IDS = Object.keys(SEGMENT_POINTS) as readonly SegmentId[];

/** Which segments each glyph lights. */
const GLYPHS: Readonly<Record<string, readonly SegmentId[]>> = {
  "0": ["a", "b", "c", "d", "e", "f"],
  "1": ["b", "c"],
  "2": ["a", "b", "g", "e", "d"],
  "3": ["a", "b", "g", "c", "d"],
  "4": ["f", "g", "b", "c"],
  "5": ["a", "f", "g", "c", "d"],
  "6": ["a", "f", "g", "e", "c", "d"],
  "7": ["a", "b", "c"],
  "8": ["a", "b", "c", "d", "e", "f", "g"],
  "9": ["a", "b", "c", "d", "f", "g"],
  "-": ["g"],
  " ": [],
};

/** The segments lit for `char`, or none if it has no seven-segment form. */
export function segmentsFor(char: string): readonly SegmentId[] {
  return GLYPHS[char] ?? [];
}

/** Every segment lit — the power-on self-test state. */
export const ALL_LIT = GLYPHS["8"];
