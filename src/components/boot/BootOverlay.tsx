"use client";

import { AnimatePresence, motion } from "motion/react";
import type { BootLogLine } from "@/data/boot-sequence";
import type { BootPhase } from "@/hooks/useBootSequence";
import { PROFILE } from "@/data/profile";
import { cn } from "@/lib/cn";
import { TIMING } from "@/lib/motion";
import { BootRunning } from "./BootRunning";
import { BootStandby } from "./BootStandby";
import { CharacterRain } from "./CharacterRain";
import { CornerBrackets } from "./CornerBrackets";
import { SweepBand } from "./SweepBand";

interface BootOverlayProps {
  readonly phase: BootPhase;
  readonly logs: readonly BootLogLine[];
  readonly pct: number;
  readonly sync: number;
  readonly syncArmed: boolean;
  readonly clock: string;
  readonly onStart: () => void;
  /** The rain has cleared; the log timeline can start. */
  readonly onRainComplete: () => void;
  readonly onSkip: () => void;
}

export function BootOverlay({
  phase,
  logs,
  pct,
  sync,
  syncArmed,
  clock,
  onStart,
  onRainComplete,
  onSkip,
}: BootOverlayProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-20 flex items-center justify-center overflow-hidden bg-void",
        // Once the sequence is done the curtain owns the screen.
        phase === "done" && "pointer-events-none",
      )}
    >
      <div
        aria-hidden
        className="scan-boot pointer-events-none absolute inset-0"
      />
      <SweepBand />
      <CornerBrackets />

      <p className="absolute left-16 top-[30px] hidden text-[9.5px] tracking-[.3em] text-dim wide:block">
        {PROFILE.terminal} — OPERATIONS INTERFACE
      </p>
      <p className="absolute right-16 top-[30px] hidden text-[9.5px] tabular-nums tracking-[.3em] text-dim wide:block">
        {clock}
      </p>

      {/* The rain phase deliberately holds nothing: the wipe plays against an
          empty screen, and the panel strikes on only once it has cleared. */}
      <AnimatePresence mode="wait" initial={false}>
        {phase === "idle" ? (
          <motion.div
            key="standby"
            exit={{ opacity: 0 }}
            transition={{ duration: TIMING.standbyExit }}
          >
            <BootStandby onStart={onStart} />
          </motion.div>
        ) : phase === "rain" ? null : (
          <motion.div key="running">
            <BootRunning
              logs={logs}
              pct={pct}
              sync={sync}
              syncArmed={syncArmed}
              onSkip={onSkip}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Outside the presence swap: it paints to its own canvas and has
          nothing for `mode="wait"` to sequence. */}
      {phase === "rain" ? (
        <CharacterRain onComplete={onRainComplete} />
      ) : null}
    </div>
  );
}
