"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { animate, createTimeline, stagger } from "animejs";
import type { Project } from "@/data/projects";
import { HUD } from "@/lib/hud";
import { cn } from "@/lib/cn";
import { prefersReducedMotion } from "@/lib/prefs";
import { DisplayText } from "@/components/ui/DisplayText";
import { useScrollLock } from "@/hooks/useScrollLock";

const LINK_CLASS = "px-[16px] py-[9px] text-[10px] tracking-[.18em]";

interface ProjectDossierProps {
  readonly project: Project;
  readonly onClose: () => void;
}

/**
 * The long read, projected over the page. Everything behind it is dimmed and
 * blurred by `.dossier-open` on the document, which is the only way a body of
 * text this size stays readable on top of a live scanline field.
 */
export function ProjectDossier({ project, onClose }: ProjectDossierProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

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

    // Projector warm-up: the field comes up, the panel snaps in from a
    // squashed scanline, then the contents print in sequence.
    const intro = createTimeline()
      .add(
        backdrop,
        { opacity: [0, 1], duration: HUD.dossier, ease: "outQuad" },
        0,
      )
      .add(
        panel,
        {
          opacity: [0, 1, 0.55, 1],
          scaleY: [0.02, 1],
          scaleX: [1.04, 1],
          duration: HUD.dossier + 120,
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

  // Portalled out of the page body, because the page body is what gets faded
  // and blurred behind it — the dossier has to sit outside that filter.
  return createPortal(
    <div
      className="fixed inset-0 z-[40] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-title"
    >
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-void/78 opacity-0 backdrop-blur-[3px]"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className="holo relative max-h-[86vh] w-[min(720px,94vw)] overflow-y-auto p-7 opacity-0 wide:p-9"
        style={{ willChange: "transform, opacity" }}
      >
        <div aria-hidden className="holo-scan pointer-events-none absolute inset-0" />

        <div className="relative">
          <div
            data-print
            className="flex items-baseline justify-between gap-4 text-[9.5px] tracking-[.22em] text-dim"
          >
            <span className="text-ac">{project.unit}</span>
            <span
              className={
                project.status === "IN PROGRESS" ? "text-ac" : "text-ac2"
              }
            >
              ● {project.status}
            </span>
          </div>

          <h2
            id="dossier-title"
            data-print
            className="mt-4 text-[clamp(30px,6vw,50px)] leading-none text-ink"
          >
            <DisplayText hatch>{project.title}</DisplayText>
          </h2>

          <p
            data-print
            className="mt-[10px] text-[11px] tracking-[.16em] text-ac2"
          >
            {project.since}
          </p>

          <div
            data-print
            aria-hidden
            className="mt-6 h-px w-full bg-[linear-gradient(90deg,var(--color-ac),transparent)]"
          />

          <p
            data-print
            className="mt-6 text-pretty text-[13.5px] leading-[1.9] text-body"
          >
            {project.writeup}
          </p>

          <ul
            data-print
            className="mt-7 flex flex-wrap gap-[6px]"
            aria-label="Stack"
          >
            {project.stack.map((item) => (
              <li
                key={item}
                className="chip px-[10px] py-[5px] text-[9.5px] tracking-[.18em]"
              >
                {item}
              </li>
            ))}
          </ul>

          <div
            data-print
            className="mt-7 flex flex-wrap gap-2 border-t border-line pt-6"
          >
            <a
              href={project.sourceHref}
              target="_blank"
              rel="noreferrer"
              className={cn("btn-line", LINK_CLASS)}
            >
              SOURCE ↗
            </a>
            {project.liveHref ? (
              <a
                href={project.liveHref}
                target="_blank"
                rel="noreferrer"
                className={cn("btn-ac", LINK_CLASS)}
              >
                LIVE SITE ↗
              </a>
            ) : null}

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className={cn("btn-ghost ml-auto", LINK_CLASS)}
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
