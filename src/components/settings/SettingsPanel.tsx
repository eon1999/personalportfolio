"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { CHROME_SCALES, CHROME_SCALE_LABELS } from "@/lib/settings";
import { DisplayText } from "@/components/ui/DisplayText";
import { useHoloPanel } from "@/hooks/useHoloPanel";
import { useSettings } from "./SettingsProvider";

const BUTTON = "px-[16px] py-[9px] text-[10px] tracking-[.18em]";

/**
 * The settings card, projected over the page on the same projector as the
 * dossier and the jukebox.
 *
 * The two bars it configures are the one part of the site the backdrop only
 * washes rather than hides, so a scale change is visible behind the card as it
 * is made — the panel is the control, the chrome behind it is the readout.
 */
export function SettingsPanel({ onClose }: { readonly onClose: () => void }) {
  const { scale, setScale } = useSettings();
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useHoloPanel({ backdropRef, panelRef, focusRef: closeRef, onClose });

  return createPortal(
    <div
      className="fixed inset-0 z-[40] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-void/78 opacity-0 backdrop-blur-[3px]"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className="holo relative max-h-[86vh] w-[min(520px,94vw)] overflow-y-auto p-7 opacity-0 wide:p-9"
        style={{ willChange: "transform, opacity" }}
      >
        <div aria-hidden className="holo-scan pointer-events-none absolute inset-0" />

        <div className="relative">
          <div
            data-print
            className="flex items-baseline justify-between gap-4 text-[9.5px] tracking-[.22em] text-dim"
          >
            <span className="text-ac">SYSTEM / CONFIG</span>
            <span className="text-ac2">● {scale}× CHROME</span>
          </div>

          <h2
            id="settings-title"
            data-print
            className="mt-4 text-[clamp(28px,5.4vw,44px)] leading-none text-ink"
          >
            <DisplayText hatch>SETTINGS</DisplayText>
          </h2>

          <div
            data-print
            aria-hidden
            className="mt-6 h-px w-full bg-[linear-gradient(90deg,var(--color-ac),transparent)]"
          />

          <fieldset data-print className="mt-7">
            <legend className="text-[9.5px] tracking-[.22em] text-ac">
              CHROME SCALE
            </legend>

            <p className="mt-[10px] max-w-[46ch] text-pretty text-[12.5px] leading-[1.8] text-body">
              How large the top nav and the status bar are drawn. Everything
              else on the page keeps its size.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {CHROME_SCALES.map((step) => {
                const active = step === scale;

                return (
                  <label
                    key={step}
                    className={cn(
                      "flex cursor-pointer flex-col items-center gap-[7px] border px-3 py-[14px]",
                      "transition-colors duration-[var(--t-hover)] ease-out",
                      // The input is visually hidden, so the focus ring has to
                      // be drawn by the box it is hiding inside.
                      "has-[:focus-visible]:outline has-[:focus-visible]:outline-1",
                      "has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ac",
                      active
                        ? "border-ac bg-ac-tint text-ac"
                        : "border-line text-dim hover:border-ink hover:text-ink",
                    )}
                  >
                    {/* A real radio, kept for the arrow-key and screen-reader
                        behaviour a hand-built group would have to reimplement
                        — same reasoning as the seek bar in the jukebox. */}
                    <input
                      type="radio"
                      name="chrome-scale"
                      value={step}
                      checked={active}
                      onChange={() => setScale(step)}
                      className="sr-only"
                    />
                    <span className="text-[22px] leading-none">
                      <DisplayText className="origin-center">
                        {step}×
                      </DisplayText>
                    </span>
                    <span className="text-[8.5px] tracking-[.2em]">
                      {CHROME_SCALE_LABELS[step]}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div
            data-print
            className="mt-7 flex flex-wrap items-center gap-2 border-t border-line pt-6"
          >
            <span className="text-[9.5px] tracking-[.2em] text-dim">
              SAVED ON THIS DEVICE
            </span>

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
