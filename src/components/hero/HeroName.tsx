"use client";

import { useEffect, useRef } from "react";
import { createTimeline } from "animejs";
import { HUD } from "@/lib/hud";
import { PROFILE } from "@/data/profile";
import { prefersReducedMotion } from "@/lib/prefs";
import { DisplayText } from "@/components/ui/DisplayText";

/** Metrics only — the face and the squeeze come from `DisplayText` inside. */
const NAME_CLASS = "text-[clamp(52px,12vw,116px)] leading-[.9] tracking-[.02em]";

/**
 * The operator's name, breathing. A blurred copy sits behind the real text and
 * carries the glow, so the pulse never touches the legible layer's opacity —
 * the type stays at full contrast while the halo behind it swells.
 */
export function HeroName() {
  const glowRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    const text = textRef.current;
    if (!glow || !text || prefersReducedMotion()) return;

    const breath = createTimeline({ loop: true, alternate: true })
      .add(
        glow,
        {
          opacity: [0.22, 0.62],
          scale: [1, 1.014],
          duration: HUD.heroPulse,
          ease: "inOutSine",
        },
        0,
      )
      .add(
        text,
        {
          opacity: [0.94, 1],
          duration: HUD.heroPulse,
          ease: "inOutSine",
        },
        0,
      );

    return () => {
      breath.revert();
    };
  }, []);

  return (
    <h1 className="relative mt-[22px]">
      <span
        ref={glowRef}
        aria-hidden
        className={`${NAME_CLASS} absolute inset-0 block text-ac opacity-[.22] blur-[16px]`}
        style={{ willChange: "opacity, transform" }}
      >
        <DisplayText className="origin-center">
          {PROFILE.firstName} {PROFILE.lastName}
        </DisplayText>
      </span>

      <span ref={textRef} className={`${NAME_CLASS} relative block`}>
        <DisplayText hatch className="origin-center">
          {PROFILE.firstName} {PROFILE.lastName}
        </DisplayText>
      </span>
    </h1>
  );
}
