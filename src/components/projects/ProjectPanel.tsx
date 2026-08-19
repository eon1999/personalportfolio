import type { Project } from "@/data/projects";
import { cn } from "@/lib/cn";
import { DisplayText } from "@/components/ui/DisplayText";

/** Where a panel sits relative to the one in focus. */
export type Slot = -1 | 0 | 1 | "off";

/**
 * Slot geometry. `left` is a real layout property, so anime.js's layout engine
 * has something to measure and FLIP between; scale rides along in the
 * transform. The parked positions are only ever reached while `hidden`.
 *
 * The scale is handed over as a custom property rather than a transform,
 * because the transform itself has to live in the stylesheet — see
 * `.project-panel` in globals.css for why.
 */
const SLOTS: Record<Exclude<Slot, "off">, { left: string; scale: number }> = {
  [-1]: { left: "4%", scale: 0.74 },
  0: { left: "50%", scale: 1 },
  1: { left: "96%", scale: 0.74 },
};

interface ProjectPanelProps {
  readonly project: Project;
  readonly slot: Slot;
  readonly onOpen: () => void;
  readonly onFocus: () => void;
}

export function ProjectPanel({
  project,
  slot,
  onOpen,
  onFocus,
}: ProjectPanelProps) {
  const active = slot === 0;
  const geometry = slot === "off" ? SLOTS[0] : SLOTS[slot];

  return (
    <article
      data-layout-id={project.id}
      aria-hidden={!active}
      // `hidden` is how a panel leaves the window: anime.js animates display
      // changes, so the element never has to leave the DOM.
      className={cn(
        "project-panel absolute top-1/2 w-[min(560px,74vw)]",
        active ? "z-20" : "z-10",
        slot === "off" && "hidden",
      )}
      style={
        {
          left: geometry.left,
          "--panel-scale": geometry.scale,
          opacity: active ? 1 : 0.34,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "relative border bg-panel/85 p-6 backdrop-blur-[2px] transition-colors duration-300",
          active ? "border-ring-strong" : "border-line",
        )}
      >
        {active ? (
          <span
            aria-hidden
            className="absolute -left-px -top-px h-[2px] w-10 bg-ac"
          />
        ) : null}

        <div className="flex items-baseline justify-between gap-3 text-[9.5px] tracking-[.22em] text-dim">
          <span>{project.unit}</span>
          <span
            className={
              project.status === "IN PROGRESS" ? "text-ac" : "text-ac2"
            }
          >
            ● {project.status}
          </span>
        </div>

        <h3 className="mt-4 text-[clamp(26px,4vw,38px)] leading-none text-ink">
          <DisplayText>{project.title}</DisplayText>
        </h3>

        <p className="mt-3 min-h-[3.5rem] text-[12.5px] leading-[1.75] text-body-card">
          {project.blurb}
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <span className="text-[9.5px] tracking-[.16em] text-dim">
            {project.stack.slice(0, 3).join(" · ")}
          </span>

          <button
            type="button"
            onClick={active ? onOpen : onFocus}
            // A backgrounded panel is inert to the keyboard; its own nav
            // triangle is the way to reach it.
            tabIndex={active ? 0 : -1}
            className="btn-ac px-[14px] py-2 text-[10px] tracking-[.2em]"
          >
            {active ? "MORE →" : "SELECT"}
          </button>
        </div>
      </div>
    </article>
  );
}
