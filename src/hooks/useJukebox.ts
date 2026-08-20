"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { animate, clamp, type JSAnimation } from "animejs";
import { TRACKS, type Track } from "@/data/tracks";
import { attachAnalyser } from "@/lib/analyser";
import { formatClock, newSeed, pickTrack, trackSrc } from "@/lib/jukebox";

/** Background music sits under the page, not on top of it. */
const VOLUME = 0.65;

/**
 * How long the mix takes to reach full level when it first comes up.
 *
 * Long, deliberately: the boot is the one moment the visitor has not asked for
 * sound yet, and arriving at volume reads as the page shouting at them.
 */
const FADE_IN = 3000;

export type JukeboxStatus = "idle" | "playing" | "paused" | "error";

export interface Jukebox {
  readonly track: Track | null;
  readonly status: JukeboxStatus;
  /** Seconds into the current track. */
  readonly elapsed: number;
  /** `1:04 / 3:13`, or `--:-- ` shaped placeholders before anything is cued. */
  readonly clock: string;
  readonly toggle: () => void;
  /** 0-1. */
  readonly volume: number;
  readonly setVolume: (level: number) => void;
  readonly next: () => void;
  /** Begins playing if nothing is going yet. Idempotent — safe to call twice. */
  readonly start: () => void;
  readonly seek: (seconds: number) => void;
}

/**
 * Plays the mix as a shuffle: one random track, then another when it ends.
 *
 * The order is a seeded sequence rather than a stored playlist — `pickTrack` is
 * pure, so `(seed, step)` is the whole of the state and the same seed replays
 * the same run. The seed is drawn on the first play, which is necessarily
 * client-side, so the server and the hydrating client never disagree.
 *
 * Nothing is fetched until that first play: the element carries `preload none`
 * and gets its `src` imperatively, which also keeps `play()` inside the user
 * gesture that browsers require.
 */
export function useJukebox(
  audioRef: RefObject<HTMLAudioElement | null>,
): Jukebox {
  const seedRef = useRef(0);
  const stepRef = useRef(0);

  // Mirrored into a ref as well: the fade and the media callbacks run outside
  // React's render, and need the live value rather than a closed-over one.
  const [volume, setVolumeState] = useState(VOLUME);
  const volumeRef = useRef(VOLUME);
  const fadeRef = useRef<JSAnimation | null>(null);

  const [index, setIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<JukeboxStatus>("idle");
  const [elapsed, setElapsed] = useState(0);

  /** Points the element at `nextIndex` and starts it, optionally fading up. */
  const cue = useCallback(
    (nextIndex: number, fade = false) => {
      const audio = audioRef.current;
      if (!audio) return;

      const track = TRACKS[nextIndex];
      if (!track) return;

      setIndex(nextIndex);
      setElapsed(0);
      audio.src = trackSrc(track);

      fadeRef.current?.pause();
      fadeRef.current = null;

      if (fade) {
        // Animating a plain object and writing the result across, rather than
        // pointing anime.js at the element: `volume` is a media property, not
        // a style, and is not something it would know how to set.
        audio.volume = 0;
        const level = { value: 0 };
        fadeRef.current = animate(level, {
          value: volumeRef.current,
          duration: FADE_IN,
          ease: "outQuad",
          onUpdate: () => {
            const el = audioRef.current;
            if (el) el.volume = level.value;
          },
        });
      } else {
        audio.volume = volumeRef.current;
      }

      // Built here rather than on panel open: this is the one call site
      // guaranteed to sit inside the gesture that lets an AudioContext run.
      attachAnalyser(audio);

      // Called synchronously off the click for the first play, so the gesture
      // is still live; later advances are exempt, the element is unlocked.
      audio
        .play()
        .then(() => setStatus("playing"))
        .catch(() => setStatus("error"));
    },
    [audioRef],
  );

  /** Advances to a fresh random track, never repeating the one just played. */
  const advance = useCallback(
    (fade = false) => {
      if (seedRef.current === 0) seedRef.current = newSeed();
      stepRef.current += 1;
      cue(
        pickTrack(
          seedRef.current,
          stepRef.current,
          TRACKS.length,
          index ?? undefined,
        ),
        fade,
      );
    },
    [cue, index],
  );

  // Wrapped rather than exposed directly: as a click handler `advance` would
  // be handed the mouse event, and read it as a request to fade.
  const next = useCallback(() => advance(false), [advance]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (status === "playing") {
      audio.pause();
      setStatus("paused");
      return;
    }

    // Nothing cued yet: open on a random track rather than always track one.
    if (index === null || status === "error") {
      advance();
      return;
    }

    audio
      .play()
      .then(() => setStatus("playing"))
      .catch(() => setStatus("error"));
  }, [advance, audioRef, index, status]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setElapsed(audio.currentTime);
    const onEnded = () => advance();
    const onError = () => setStatus("error");
    // The element can be paused by something other than us — a media key, or
    // the OS taking the audio focus — so mirror it rather than assume.
    const onPause = () => setStatus((s) => (s === "playing" ? "paused" : s));
    const onPlay = () => setStatus("playing");

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
    };
  }, [advance, audioRef]);

  // Unmount only. Deliberately not folded into the listener effect above: that
  // one re-subscribes whenever a track is cued, and would stop the fade a
  // render after starting it.
  useEffect(
    () => () => {
      fadeRef.current?.pause();
    },
    [],
  );

  /**
   * Starts the mix if it isn't already running. Used by the boot sequence.
   *
   * The only entry point that fades: pressing PLAY is a request for sound and
   * gets it at once, whereas the boot hands it to a visitor who didn't ask.
   */
  const start = useCallback(() => {
    if (status === "playing" || index !== null) return;
    advance(true);
  }, [advance, index, status]);

  /** Sets the level, and hands control over from any fade still running. */
  const setVolume = useCallback(
    (level: number) => {
      const next = clamp(level, 0, 1);
      fadeRef.current?.pause();
      fadeRef.current = null;
      volumeRef.current = next;
      setVolumeState(next);

      const audio = audioRef.current;
      if (audio) audio.volume = next;
    },
    [audioRef],
  );

  const seek = useCallback(
    (seconds: number) => {
      const audio = audioRef.current;
      if (!audio || !Number.isFinite(seconds)) return;
      audio.currentTime = Math.max(0, seconds);
      setElapsed(audio.currentTime);
    },
    [audioRef],
  );

  const track = index === null ? null : (TRACKS[index] ?? null);
  const clock = track
    ? `${formatClock(elapsed)} / ${formatClock(track.seconds)}`
    : "";

  return {
    track,
    status,
    elapsed,
    clock,
    toggle,
    next,
    start,
    seek,
    volume,
    setVolume,
  };
}
