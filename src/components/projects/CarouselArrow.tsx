"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { cn } from "@/lib/cn";
import { prefersReducedMotion } from "@/lib/prefs";

interface CarouselArrowProps {
  readonly direction: "prev" | "next";
  readonly label: string;
  readonly onClick: () => void;
}

/**
 * The motif, doing a job: a triangle pointing the way through the carousel. It
 * drifts a few pixels toward its own direction on hover, which is the only
 * cue needed once the shape has already said which way it goes.
 */
export function CarouselArrow({
  direction,
  label,
  onClick,
}: CarouselArrowProps) {
  const markRef = useRef<HTMLSpanElement>(null);
  const back = direction === "prev";

  useEffect(() => {
    const mark = markRef.current;
    if (!mark) return;

    const button = mark.parentElement;
    if (!button || prefersReducedMotion()) return;

    const drift = (to: number) =>
      animate(mark, { x: to, duration: 220, ease: "out(2)" });

    const onEnter = () => drift(back ? -5 : 5);
    const onLeave = () => drift(0);

    button.addEventListener("pointerenter", onEnter);
    button.addEventListener("pointerleave", onLeave);
    button.addEventListener("focus", onEnter);
    button.addEventListener("blur", onLeave);

    return () => {
      button.removeEventListener("pointerenter", onEnter);
      button.removeEventListener("pointerleave", onLeave);
      button.removeEventListener("focus", onEnter);
      button.removeEventListener("blur", onLeave);
      animate(mark, { x: 0, duration: 0 });
    };
  }, [back]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "group absolute top-1/2 z-30 -translate-y-1/2 p-4",
        back ? "left-0 wide:left-2" : "right-0 wide:right-2",
      )}
    >
      <span
        ref={markRef}
        aria-hidden
        className={cn(
          "tri block size-[19px] bg-ac/55 transition-colors duration-200 group-hover:bg-ac group-focus-visible:bg-ac",
          back ? "-rotate-90" : "rotate-90",
        )}
      />
    </button>
  );
}
