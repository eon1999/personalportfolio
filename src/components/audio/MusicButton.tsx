"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { useJukeboxContext } from "./JukeboxProvider";
import { MusicPanel } from "./MusicPanel";

/**
 * The nav-bar handle for the player: a live level meter that opens the panel.
 *
 * Deliberately not a play button — the transport lives inside the panel, so
 * this one control has one meaning, and the bars alone say whether anything is
 * running.
 */
export function MusicButton() {
  const { track, status } = useJukeboxContext();
  const [open, setOpen] = useState(false);
  const playing = status === "playing";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        title={track ? `${track.artist} — ${track.title}` : "Open the music player"}
        className={cn(
          "flex items-center gap-[7px] border border-line px-[10px] py-[4px]",
          "transition-colors duration-[var(--t-hover)] ease-out",
          "hover:border-ac hover:bg-ac-tint",
        )}
      >
        <span aria-hidden className={cn("eq", !playing && "eq-still")}>
          <span />
          <span />
          <span />
        </span>
        <span
          className={cn(
            "hidden text-[8.5px] tracking-[.24em] @min-[380px]:inline",
            playing ? "text-ink" : "text-dim",
          )}
        >
          AUDIO
        </span>
        <span className="sr-only">
          {track
            ? `Music player. Now playing ${track.title} by ${track.artist}.`
            : "Open the music player"}
        </span>
      </button>

      {open ? <MusicPanel onClose={() => setOpen(false)} /> : null}
    </>
  );
}
