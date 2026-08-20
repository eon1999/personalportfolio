/**
 * Splits the single jazz mix into one MP3 per track, and regenerates
 * `src/data/tracks.ts` to match.
 *
 * The cut is lossless and needs no ffmpeg: the source is constant-bitrate, so
 * every MPEG frame is self-contained and slicing on frame boundaries is a plain
 * byte copy. Frames are walked rather than assumed to be a fixed width — CBR
 * still alternates a padding byte to hold the average rate exactly.
 *
 * Usage: node scripts/split-audio.mjs [input] [outDir]
 */
import { mkdir, readFile, writeFile, readdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { TRACKLIST } from "./tracklist.mjs";

const INPUT = process.argv[2] ?? "assets/jazz.mp3";
const OUT_DIR = process.argv[3] ?? "public/audio/tracks";
const DATA_FILE = "src/data/tracks.ts";

/** MPEG 1 Layer III, the only shape this script claims to understand. */
const BITRATES = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];
const SAMPLE_RATES = [44100, 48000, 32000];
const SAMPLES_PER_FRAME = 1152;

function fail(message) {
  console.error(`\n  x ${message}\n`);
  process.exit(1);
}

/** "MM:SS" or "HH:MM:SS" -> seconds. */
function toSeconds(stamp) {
  const parts = stamp.split(":").map(Number);
  if (parts.some((n) => !Number.isFinite(n) || n < 0)) {
    fail(`Malformed timestamp: "${stamp}"`);
  }
  return parts.reduce((total, part) => total * 60 + part, 0);
}

/** Filesystem- and URL-safe name, accents folded away. */
function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Byte offset of the first audio frame, stepping over any ID3v2 tag. */
function audioStart(buf) {
  if (buf.toString("latin1", 0, 3) !== "ID3") return 0;
  const size =
    ((buf[6] & 0x7f) << 21) |
    ((buf[7] & 0x7f) << 14) |
    ((buf[8] & 0x7f) << 7) |
    (buf[9] & 0x7f);
  return 10 + size;
}

/**
 * Walks every MPEG frame from `start`, returning their byte offsets.
 *
 * Resyncs by scanning forward on a bad header rather than giving up — a stray
 * run of non-audio bytes shouldn't cost us the rest of the file.
 */
function readFrames(buf, start) {
  const frames = [];
  let i = start;

  while (i + 4 <= buf.length) {
    if (buf[i] !== 0xff || (buf[i + 1] & 0xe0) !== 0xe0) {
      i += 1;
      continue;
    }

    const version = (buf[i + 1] >> 3) & 3;
    const layer = (buf[i + 1] >> 1) & 3;
    const bitrate = BITRATES[(buf[i + 2] >> 4) & 0xf];
    const sampleRate = SAMPLE_RATES[(buf[i + 2] >> 2) & 3];
    const padding = (buf[i + 2] >> 1) & 1;

    // 3 = MPEG 1, 1 = Layer III. Anything else is a false sync.
    if (version !== 3 || layer !== 1 || !bitrate || !sampleRate) {
      i += 1;
      continue;
    }

    const length = Math.floor((144 * bitrate * 1000) / sampleRate) + padding;
    if (length < 4) {
      i += 1;
      continue;
    }

    frames.push({ offset: i, length, bitrate, sampleRate });
    i += length;
  }

  return frames;
}

/** ID3v2.4 tag carrying just title and artist, so each file stands alone. */
function id3Tag(title, artist) {
  const frame = (id, text) => {
    // 0x03 = UTF-8.
    const body = Buffer.concat([
      Buffer.from([0x03]),
      Buffer.from(text, "utf8"),
      Buffer.from([0]),
    ]);
    const header = Buffer.alloc(10);
    header.write(id, 0, "latin1");
    // Frame sizes are syncsafe in 2.4, same as the tag size.
    const n = body.length;
    header[4] = (n >> 21) & 0x7f;
    header[5] = (n >> 14) & 0x7f;
    header[6] = (n >> 7) & 0x7f;
    header[7] = n & 0x7f;
    return Buffer.concat([header, body]);
  };

  const body = Buffer.concat([frame("TIT2", title), frame("TPE1", artist)]);
  const header = Buffer.alloc(10);
  header.write("ID3", 0, "latin1");
  header[3] = 4; // version 2.4.0
  const n = body.length;
  header[6] = (n >> 21) & 0x7f;
  header[7] = (n >> 14) & 0x7f;
  header[8] = (n >> 7) & 0x7f;
  header[9] = n & 0x7f;
  return Buffer.concat([header, body]);
}

// ---------------------------------------------------------------------------

if (!existsSync(INPUT)) fail(`No input file at ${INPUT}`);

console.log(`  reading ${INPUT} ...`);
const buf = await readFile(INPUT);

const start = audioStart(buf);
console.log(`  audio starts at byte ${start}`);

let frames = readFrames(buf, start);
if (frames.length === 0) {
  fail("No MPEG 1 Layer III frames found — is this a CBR MP3?");
}

// The Xing/Info frame is a real frame that decodes to silence and declares the
// *whole file's* length. Left in, every slice would inherit a bogus duration.
const first = frames[0];
const head = buf.toString("latin1", first.offset, first.offset + first.length);
if (head.includes("Xing") || head.includes("Info")) {
  console.log("  dropping leading Xing/Info header frame");
  frames = frames.slice(1);
}

const { sampleRate, bitrate } = frames[0];
const frameSeconds = SAMPLES_PER_FRAME / sampleRate;
const duration = frames.length * frameSeconds;
console.log(
  `  ${frames.length} frames · ${bitrate} kbps · ${sampleRate} Hz · ` +
    `${Math.floor(duration / 60)}m ${(duration % 60).toFixed(0)}s`,
);

// Validate the tracklist against the file before writing anything.
const starts = TRACKLIST.map(([stamp]) => toSeconds(stamp));
starts.forEach((sec, index) => {
  if (index > 0 && sec <= starts[index - 1]) {
    fail(
      `Timestamp ${TRACKLIST[index][0]} is not after ${TRACKLIST[index - 1][0]}`,
    );
  }
  if (sec >= duration) {
    fail(`Timestamp ${TRACKLIST[index][0]} is past the end of the file`);
  }
});

await mkdir(OUT_DIR, { recursive: true });
for (const stale of await readdir(OUT_DIR)) {
  if (stale.endsWith(".mp3")) await unlink(path.join(OUT_DIR, stale));
}

/** First frame at or after `seconds`. */
const frameAt = (seconds) =>
  Math.min(frames.length, Math.round(seconds / frameSeconds));

const written = [];

for (let i = 0; i < TRACKLIST.length; i++) {
  const [, artist, title] = TRACKLIST[i];
  const from = frameAt(starts[i]);
  const to = i + 1 < starts.length ? frameAt(starts[i + 1]) : frames.length;

  const begin = frames[from].offset;
  const finish = to < frames.length ? frames[to].offset : buf.length;
  const audio = buf.subarray(begin, finish);

  const file = `${String(i + 1).padStart(2, "0")}-${slugify(artist)}-${slugify(title)}.mp3`;
  await writeFile(
    path.join(OUT_DIR, file),
    Buffer.concat([id3Tag(title, artist), audio]),
  );

  const seconds = (to - from) * frameSeconds;
  written.push({ file, artist, title, seconds });
  console.log(
    `  ${String(i + 1).padStart(2)} ${file.padEnd(52)} ` +
      `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, "0")}` +
      `  ${(audio.length / 1048576).toFixed(1)} MiB`,
  );
}

const total = written.reduce((sum, t) => sum + t.seconds, 0);
console.log(`\n  ${written.length} tracks · ${(total / 60).toFixed(1)} min total`);

// --- generated data file ---------------------------------------------------

const escape = (text) => text.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const body = written
  .map(
    (t) =>
      `  {\n` +
      `    file: "${t.file}",\n` +
      `    artist: "${escape(t.artist)}",\n` +
      `    title: "${escape(t.title)}",\n` +
      `    seconds: ${t.seconds.toFixed(2)},\n` +
      `  },`,
  )
  .join("\n");

await writeFile(
  DATA_FILE,
  `// Generated by scripts/split-audio.mjs — do not edit by hand.\n` +
    `// Edit scripts/tracklist.mjs and re-run \`npm run split:audio\`.\n\n` +
    `export interface Track {\n` +
    `  /** File name under \`AUDIO_BASE\`. */\n` +
    `  readonly file: string;\n` +
    `  readonly artist: string;\n` +
    `  readonly title: string;\n` +
    `  /** Runtime in seconds, measured off the split rather than the tracklist. */\n` +
    `  readonly seconds: number;\n` +
    `}\n\n` +
    `/** Where the split tracks are served from. */\n` +
    `export const AUDIO_BASE = "/audio/tracks";\n\n` +
    `export const TRACKS: readonly Track[] = [\n${body}\n] as const;\n`,
  "utf8",
);

console.log(`  wrote ${DATA_FILE}\n`);
