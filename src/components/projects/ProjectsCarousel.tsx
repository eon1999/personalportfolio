"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createLayout, type AutoLayout } from "animejs";
import { PROJECTS } from "@/data/projects";
import { SegmentReadout } from "@/components/ui/SegmentReadout";
import { HUD } from "@/lib/hud";
import { prefersReducedMotion } from "@/lib/prefs";
import { CarouselArrow } from "./CarouselArrow";
import { ProjectDossier } from "./ProjectDossier";
import { ProjectPanel, type Slot } from "./ProjectPanel";

const COUNT = PROJECTS.length;

/**
 * Signed distance from the focused index, wrapped to the shorter way round —
 * so the panel one step behind index 0 is the last one, not four steps away.
 */
function offsetFrom(index: number, active: number): number {
  const raw = (((index - active) % COUNT) + COUNT) % COUNT;
  return raw > COUNT / 2 ? raw - COUNT : raw;
}

function slotFor(offset: number): Slot {
  if (offset === 0) return 0;
  if (offset === -1) return -1;
  if (offset === 1) return 1;
  return "off";
}

/**
 * The projects bay: one unit in focus, its neighbours backgrounded on either
 * side, and a triangle at each edge to walk between them.
 *
 * The travel itself is anime.js's layout engine. Each panel carries a stable
 * `data-layout-id`, so on every step it is measured where it was, measured
 * where it lands, and tweened between the two — including the panels being
 * shown or hidden at the outer edges, which is why they use `display` rather
 * than being unmounted.
 */
export function ProjectsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<AutoLayout | null>(null);
  const pendingRef = useRef(false);

  const [active, setActive] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return;

    layoutRef.current = createLayout(track, {
      duration: HUD.carousel,
      ease: "outQuint",
      properties: ["opacity"],
      enterFrom: { opacity: 0 },
      leaveTo: { opacity: 0 },
      // anime.js signs off by writing each panel's final transform back as a
      // resolved pixel matrix, which freezes `-50%` at whatever the width
      // happened to be. React never clears it — it was never React's to set —
      // so a later resize would leave the panels off-centre until the next
      // step. Dropping it returns them to the stylesheet's percentage rule.
      onComplete: () => {
        for (const panel of track.querySelectorAll<HTMLElement>(
          "[data-layout-id]",
        )) {
          panel.style.removeProperty("transform");
        }
      },
    });

    return () => {
      layoutRef.current?.revert();
      layoutRef.current = null;
    };
  }, []);

  /** Snapshot the current geometry, then let React move the panels. */
  const goTo = useCallback((next: number) => {
    layoutRef.current?.record();
    pendingRef.current = true;
    setActive(((next % COUNT) + COUNT) % COUNT);
  }, []);

  // Runs after the DOM has the new slots but before paint, which is the window
  // anime.js needs to invert the panels back and tween them forward.
  useLayoutEffect(() => {
    if (!pendingRef.current) return;
    pendingRef.current = false;
    layoutRef.current?.animate();
  }, [active]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(active - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(active + 1);
    }
  };

  const open = PROJECTS.find((project) => project.id === openId);

  return (
    <div className="bay relative">
      <div className="flex items-center justify-between gap-4 border-b border-line px-[18px] py-[10px] text-[9.5px] tracking-[.22em] text-dim">
        <span className="text-ac">BAY 02 / PROJECT REGISTRY</span>
        <SegmentReadout
          value={`${String(active + 1).padStart(2, "0")}.${String(COUNT).padStart(2, "0")}`}
          height={12}
          quiet
          className="lcd"
          label={`Unit ${active + 1} of ${COUNT}`}
        />
      </div>

      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Projects"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative h-[360px] overflow-hidden outline-none focus-visible:ring-1 focus-visible:ring-ac wide:h-[330px]"
      >
        {/*
          The track must stay in flow. anime.js reads the layout root's own
          `position`: an absolute or fixed root puts the engine in viewport-
          coordinate mode, and every panel is then pinned with `position: fixed`
          while still being offset by parent-relative numbers — so the whole bay
          detaches for the length of the tween and snaps back at the end.
        */}
        <div ref={trackRef} className="relative h-full">
          {PROJECTS.map((project, index) => (
            <ProjectPanel
              key={project.id}
              project={project}
              slot={slotFor(offsetFrom(index, active))}
              onOpen={() => setOpenId(project.id)}
              onFocus={() => goTo(index)}
            />
          ))}
        </div>

        <CarouselArrow
          direction="prev"
          label="Previous project"
          onClick={() => goTo(active - 1)}
        />
        <CarouselArrow
          direction="next"
          label="Next project"
          onClick={() => goTo(active + 1)}
        />
      </div>

      <div className="flex items-center justify-center gap-[7px] border-t border-line py-[13px]">
        {PROJECTS.map((project, index) => (
          <button
            key={project.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Show ${project.title}`}
            aria-current={index === active}
            className="p-[6px]"
          >
            <span
              aria-hidden
              className={`tri block size-[8px] transition-colors duration-200 ${
                index === active ? "bg-ac" : "bg-dim/50 hover:bg-dim"
              }`}
            />
          </button>
        ))}
      </div>

      {open ? (
        <ProjectDossier project={open} onClose={() => setOpenId(null)} />
      ) : null}
    </div>
  );
}
