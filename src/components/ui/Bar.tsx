"use client";

import { motion, type Transition } from "motion/react";
import { cn } from "@/lib/cn";

interface BarProps {
  /** Fill fraction, 0–1. */
  readonly value: number;
  readonly transition: Transition;
  /** Classes for the track — set its height and background here. */
  readonly className?: string;
  readonly label?: string;
}

/**
 * A telemetry fill bar. Scales rather than resizing so the browser can keep
 * the fill on its own compositor layer.
 */
export function Bar({ value, transition, className, label }: BarProps) {
  return (
    <div
      className={cn("overflow-hidden", className)}
      role={label ? "progressbar" : undefined}
      aria-label={label}
      aria-valuenow={label ? Math.round(value * 100) : undefined}
      aria-valuemin={label ? 0 : undefined}
      aria-valuemax={label ? 100 : undefined}
    >
      <motion.div
        className="h-full w-full origin-left bg-ac"
        style={{ willChange: "transform" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: value }}
        transition={transition}
      />
    </div>
  );
}
