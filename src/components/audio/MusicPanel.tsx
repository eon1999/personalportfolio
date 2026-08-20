"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { animate, createTimeline, stagger } from "animejs";
import { TRACKS } from "@/data/tracks";
import { HUD } from "@/lib/hud";
import { formatClock } from "@/lib/jukebox";
import { prefersReducedMotion } from "@/lib/prefs";
import { cn } from "@/lib/cn";
import { DisplayText } from "@/components/ui/DisplayText";
import { useScrollLock } from "@/hooks/useScrollLock";
import { CircularEqualizer } from "./CircularEqualizer";
import { useJukeboxContext } from "./JukeboxProvider";

const BUTTON = "px-[16px] py-[9px] text-[10px] tracking-[.18em]";

/**
 * The player, projected over the page — same treatment as a project dossier:
 * the field comes up, the panel snaps in from a squashed scanline, and
 * `.dossier-open` dims and blurs everything behind it.
 *
 * The title sits inside the equalizer rather than beside it, so the ring reads
 * as the record it is playing rather than as decoration next to a label.
 */
export function MusicPanel({ onClose }: { readonly onClose: () => void }) {
  const { track, status, elapsed, toggle, next, seek, volume, setVolume } =
    useJukeboxContext();
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const playing = status === "playing";
  const position = TRACKS.findIndex((t) => t.file === track?.file);

  useScrollLock(true);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("dossier-open");
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      html.classList.remove("dossier-open");
    };
  }, [onClose]);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    if (prefersReducedMotion()) {
      animate([backdrop, panel], { opacity: 1, duration: 0 });
      return;
    }

    const intro = createTimeline()
      .add(backdrop, { opacity: [0, 1], duration: HUD.panel, ease: "outQuad" }, 0)
      .add(
        panel,
        {
          opacity: [0, 1, 0.55, 1],
          scaleY: [0.02, 1],
          scaleX: [1.04, 1],
          duration: HUD.panel + 120,
          ease: "out(3)",
        },
        60,
      )
      .add(
        panel.querySelectorAll("[data-print]"),
        {
          opacity: [0, 1],
          y: [7, 0],
          duration: 340,
          delay: stagger(52),
          ease: "outQuad",
        },
        "-=140",
      );

    return () => {
      intro.revert();
    };
  }, []);

  const duration = track?.seconds ?? 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[40] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="music-title"
    >
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-void/78 opacity-0 backdrop-blur-[3px]"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className="holo relative w-[min(520px,94vw)] p-7 opacity-0 wide:p-9"
        style={{ willChange: "transform, opacity" }}
      >
        <div aria-hidden className="holo-scan pointer-events-none absolute inset-0" />

        <div className="relative">
          <div
            data-print
            className="flex items-baseline justify-between gap-4 text-[9.5px] tracking-[.22em] text-dim"
          >
            <span className="text-ac">AUDIO / JUKEBOX</span>
            <span className={playing ? "text-ac2" : "text-dim"}>
              ● {playing ? "PLAYING" : status === "error" ? "OFFLINE" : "STANDBY"}
            </span>
          </div>

          {/* The dial: ring of bars, title in the middle. */}
          <div
            data-print
            className="relative mx-auto mt-7 aspect-square w-[min(300px,72vw)]"
          >
            <CircularEqualizer running={playing} />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-[18%] text-center">
              <h2
                id="music-title"
                className="text-[clamp(17px,4.4vw,23px)] leading-[1.15] text-ink"
              >
                <DisplayText className="origin-center">
                  {track ? track.title : "NO SIGNAL"}
                </DisplayText>
              </h2>
              <p className="mt-[10px] text-[9.5px] tracking-[.2em] text-ac2">
                {track ? track.artist : "PRESS PLAY"}
              </p>
            </div>
          </div>

          {/* Transport. */}
          <div data-print className="mt-7">
            <label className="sr-only" htmlFor="music-seek">
              Seek within the current track
            </label>
            <input
              id="music-seek"
              type="range"
              min={0}
              max={Math.max(1, Math.round(duration))}
              value={Math.min(elapsed, duration)}
              onChange={(event) => seek(Number(event.target.value))}
              disabled={!track}
              className="seek w-full"
            />

            <div className="mt-[6px] flex justify-between text-[9.5px] tabular-nums tracking-[.18em] text-dim">
              <span>{formatClock(elapsed)}</span>
              <span>
                {position >= 0
                  ? `TRACK ${String(position + 1).padStart(2, "0")} / ${TRACKS.length}`
                  : `${TRACKS.length} TRACKS`}
              </span>
              <span>{formatClock(duration)}</span>
            </div>
          </div>

          {/* Level. */}
          <div data-print className="mt-5 flex items-center gap-[10px]">
            <span
              aria-hidden
              className="text-[9.5px] tracking-[.2em] text-dim"
            >
              VOL
            </span>
            <label className="sr-only" htmlFor="music-volume">
              Volume
            </label>
            <input
              id="music-volume"
              type="range"
              min={0}
              max={100}
              value={Math.round(volume * 100)}
              onChange={(event) => setVolume(Number(event.target.value) / 100)}
              className="seek flex-1"
            />
            <span className="w-[4ch] text-right text-[9.5px] tabular-nums tracking-[.14em] text-dim">
              {Math.round(volume * 100)}
            </span>
          </div>

          <div
            data-print
            className="mt-7 flex flex-wrap gap-2 border-t border-line pt-6"
          >
            <button
              type="button"
              onClick={toggle}
              className={cn("btn-ac", BUTTON)}
              aria-pressed={playing}
            >
              {playing ? "❚❚ PAUSE" : "▶ PLAY"}
            </button>

            <button
              type="button"
              onClick={next}
              className={cn("btn-line", BUTTON)}
            >
              ▶▶ SHUFFLE
            </button>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className={cn("btn-ghost ml-auto", BUTTON)}
            >
              CLOSE ✕
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
