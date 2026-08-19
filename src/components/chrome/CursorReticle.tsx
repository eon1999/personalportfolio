"use client";

import { useEffect, useRef } from "react";
import { animate, createAnimatable, utils } from "animejs";
import { FIRE_STOPS, HUD } from "@/lib/hud";
import { prefersReducedMotion } from "@/lib/prefs";

/** Anything the reticle should lock onto. */
const CLICKABLE =
  'a, button, summary, label, input, select, textarea, [role="button"], [role="link"], [data-reticle="target"]';

const SIZE = 26;
const LOCK_SCALE = 2.15;

/**
 * The pointer, replaced by the insignia: a hollow triangle drawn in the fire
 * gradient, trailing the cursor and locking on over anything clickable.
 *
 * Three nested layers, so no two animations ever write the same transform —
 * the outer one is translated by an `Animatable`, the middle one holds the
 * lock-on scale, and the inner one breathes on a loop of its own.
 */
export function CursorReticle() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef<HTMLDivElement>(null);
  const breathRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const lock = lockRef.current;
    const breath = breathRef.current;
    const glow = glowRef.current;
    if (!root || !lock || !breath || !glow) return;

    // Touch and pen users keep their own pointer; so does anyone who has asked
    // for less movement, since the reticle is motion by definition.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (prefersReducedMotion()) return;

    const html = document.documentElement;
    html.classList.add("reticle-on");

    const follow = createAnimatable(root, {
      x: HUD.cursorFollow,
      y: HUD.cursorFollow,
      ease: "out(3)",
    });

    const pulse = animate(breath, {
      scale: [1, 1.16],
      duration: HUD.cursorBreath,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });

    let placed = false;
    let locked = false;

    const setLocked = (next: boolean) => {
      if (next === locked) return;
      locked = next;
      // `speed` is the instance-side setter; `playbackRate` is parameters-only.
      pulse.speed = next ? HUD.cursorLockRate : 1;

      animate(lock, {
        scale: next ? LOCK_SCALE : 1,
        duration: HUD.cursorSnap,
        ease: next ? "out(2.5)" : "outQuad",
      });

      animate(glow, {
        opacity: next ? 0.85 : 0,
        duration: HUD.cursorSnap,
        ease: "outQuad",
      });
    };

    const onMove = (event: PointerEvent) => {
      // The first sighting jumps rather than eases in from the origin.
      if (!placed) {
        placed = true;
        follow.x(event.clientX, 0);
        follow.y(event.clientY, 0);
        animate(root, { opacity: 1, duration: 160, ease: "outQuad" });
      } else {
        follow.x(event.clientX);
        follow.y(event.clientY);
      }

      const target = event.target;
      setLocked(
        target instanceof Element && target.closest(CLICKABLE) !== null,
      );
    };

    const onDown = () =>
      animate(lock, {
        scale: [locked ? LOCK_SCALE : 1, 0.7],
        duration: 110,
        ease: "outQuad",
        alternate: true,
        loop: 1,
      });

    const onLeave = () => {
      placed = false;
      setLocked(false);
      animate(root, { opacity: 0, duration: 140, ease: "outQuad" });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      html.classList.remove("reticle-on");
      pulse.revert();
      follow.revert();
      utils.remove([root, lock, breath, glow]);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] opacity-0"
      style={{ willChange: "transform" }}
    >
      <div
        ref={lockRef}
        style={{
          width: SIZE,
          height: SIZE,
          marginLeft: -SIZE / 2,
          marginTop: -SIZE / 2,
          willChange: "transform",
        }}
      >
        <div ref={breathRef} className="relative size-full">
          <ReticleTriangle
            ref={glowRef}
            className="absolute inset-0 opacity-0 blur-[3px]"
            width={3.4}
          />
          <ReticleTriangle className="absolute inset-0" width={1.6} />
          <span className="absolute left-1/2 top-[62%] size-[2px] -translate-x-1/2 bg-ink" />
        </div>
      </div>
    </div>
  );
}

interface ReticleTriangleProps {
  readonly ref?: React.Ref<HTMLDivElement>;
  readonly className?: string;
  readonly width: number;
}

/** The hollow triangle itself — stroke only, filled with the fire gradient. */
function ReticleTriangle({ ref, className, width }: ReticleTriangleProps) {
  return (
    <div ref={ref} className={className}>
      <svg viewBox="0 0 32 28" className="size-full overflow-visible">
        <defs>
          <linearGradient id={`fire-${width}`} x1="0" y1="0" x2="0" y2="1">
            {FIRE_STOPS.map((stop) => (
              <stop
                key={stop.offset}
                offset={stop.offset}
                stopColor={stop.color}
              />
            ))}
          </linearGradient>
        </defs>
        <polygon
          points="16,1.5 30.5,26.5 1.5,26.5"
          fill="none"
          stroke={`url(#fire-${width})`}
          strokeWidth={width}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
