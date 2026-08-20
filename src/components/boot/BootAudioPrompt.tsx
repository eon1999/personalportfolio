"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { DisplayText } from "@/components/ui/DisplayText";
import { useHoloPanel } from "@/hooks/useHoloPanel";
import { useJukeboxContext } from "@/components/audio/JukeboxProvider";

const BUTTON = "px-[16px] py-[9px] text-[10px] tracking-[.18em]";

interface BootAudioPromptProps {
  /** Confirmed with this preference — the boot sequence proceeds. */
  readonly onConfirm: (audioOn: boolean) => void;
  /** Dismissed without confirming — returns to the standby screen. */
  readonly onClose: () => void;
}

/**
 * The interstitial that sits over the standby screen once `ENTER` has been
 * pressed: a single switch asking whether the boot should bring the music up
 * or leave it muted. It blocks the sequence until the operator confirms, and
 * its face is the same projector warm-up as the dossier, the music panel and
 * the settings card — one component, one animation, one look.
 *
 * Flipping the switch to OFF pauses the mix at once, so a visitor who wants
 * silence hears it immediately rather than after the logs have printed.
 */
export function BootAudioPrompt({
  onConfirm,
  onClose,
}: BootAudioPromptProps) {
  const { pause } = useJukeboxContext();
  const [audioOn, setAudioOn] = useState(true);

  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useHoloPanel({
    backdropRef,
    panelRef,
    focusRef: confirmRef,
    onClose,
  });

  const toggleAudio = () => {
    const next = !audioOn;
    setAudioOn(next);
    if (!next) pause();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[40] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audio-prompt-title"
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
            <span className="text-ac">SYSTEM / AUDIO</span>
            <span className={cn(audioOn ? "text-ac2" : "text-dim")}>
              ● {audioOn ? "ON" : "OFF"}
            </span>
          </div>

          <h2
            id="audio-prompt-title"
            data-print
            className="mt-4 text-[clamp(28px,5.4vw,44px)] leading-none text-ink"
          >
            <DisplayText hatch>BOOT AUDIO</DisplayText>
          </h2>

          <div
            data-print
            aria-hidden
            className="mt-6 h-px w-full bg-[linear-gradient(90deg,var(--color-ac),transparent)]"
          />

          <div data-print className="mt-7 flex flex-col items-center gap-5">
            <label className="text-[9.5px] tracking-[.22em] text-dim">
              ENABLE AUDIO FOR THIS BOOT
            </label>

            <div className="relative flex items-center gap-4">
              <span
                className={cn(
                  "text-[10px] tracking-[.2em]",
                  audioOn ? "text-ac2" : "text-dim",
                )}
              >
                ON
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={audioOn}
                aria-label="Toggle audio on / off"
                onClick={toggleAudio}
                className={cn(
                  "relative inline-flex h-6 w-12 shrink-0 items-center rounded-full",
                  "transition-colors duration-[var(--t-hover)] ease-out",
                  audioOn ? "bg-ac" : "bg-dim/40",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 h-5 w-5 rounded-full",
                    "transition-transform duration-[var(--t-hover)] ease-out",
                    audioOn ? "translate-x-6 bg-void" : "bg-dim/60",
                  )}
                />
              </button>

              <span
                className={cn(
                  "text-[10px] tracking-[.2em]",
                  !audioOn ? "text-ac2" : "text-dim",
                )}
              >
                OFF
              </span>
            </div>

            <p
              className={cn(
                "text-[9.5px] tracking-[.18em]",
                audioOn ? "text-ac2" : "text-dim",
              )}
            >
              {audioOn
                ? "MUSIC WILL PLAY ALONGSIDE THE BOOT"
                : "BOOT SEQUENCE WILL BE SILENT"}
            </p>
          </div>

          <div
            data-print
            className="mt-7 flex flex-wrap gap-2 border-t border-line pt-6"
          >
            <button
              ref={confirmRef}
              type="button"
              onClick={() => onConfirm(audioOn)}
              className={cn("btn-ac", BUTTON)}
            >
              CONFIRM →
            </button>

            <button
              type="button"
              onClick={onClose}
              className={cn("btn-ghost ml-auto", BUTTON)}
            >
              BACK ✕
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
