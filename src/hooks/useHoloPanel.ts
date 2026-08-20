"use client";

import { useEffect, type RefObject } from "react";
import { animate, createTimeline, stagger } from "animejs";
import { HUD } from "@/lib/hud";
import { prefersReducedMotion } from "@/lib/prefs";
import { useScrollLock } from "./useScrollLock";

interface HoloPanelOptions {
  /** The field the panel is projected onto. */
  readonly backdropRef: RefObject<HTMLElement | null>;
  /** The `.holo` card itself. Anything inside it marked `[data-print]` prints
   *  in sequence once the card has snapped in. */
  readonly panelRef: RefObject<HTMLElement | null>;
  /** Takes focus on open — the close button, in every panel so far. */
  readonly focusRef?: RefObject<HTMLElement | null>;
  readonly onClose: () => void;
  /** Projector warm-up. Defaults to the shared `HUD.panel`. */
  readonly duration?: number;
}

/**
 * Everything a hologram card does on the way in, in one place: the page is
 * pinned and recedes behind it, the close button takes focus, Escape closes,
 * and the projector warms up — field first, then the card snapping in from a
 * squashed scanline, then the contents printing in sequence.
 *
 * Shared by the project dossier, the music panel and the settings card, which
 * had grown three copies of it between them.
 */
export function useHoloPanel({
  backdropRef,
  panelRef,
  focusRef,
  onClose,
  duration = HUD.panel,
}: HoloPanelOptions): void {
  useScrollLock(true);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("dossier-open");
    focusRef?.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Stopped here: the boot sequence listens for Escape on the window to
        // skip itself, and closing a panel should not also do that.
        event.stopPropagation();
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      html.classList.remove("dossier-open");
    };
    // `focusRef` is a ref object — stable for the life of the panel.
  }, [onClose, focusRef]);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    if (prefersReducedMotion()) {
      animate([backdrop, panel], { opacity: 1, duration: 0 });
      return;
    }

    const intro = createTimeline()
      .add(backdrop, { opacity: [0, 1], duration, ease: "outQuad" }, 0)
      .add(
        panel,
        {
          opacity: [0, 1, 0.55, 1],
          scaleY: [0.02, 1],
          scaleX: [1.04, 1],
          duration: duration + 120,
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
  }, [backdropRef, panelRef, duration]);
}
