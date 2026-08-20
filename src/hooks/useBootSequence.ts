"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BOOT_LOG_LIMIT,
  BOOT_SEQUENCE,
  BOOT_SETTLE_MS,
  BOOT_TOTAL_MS,
  SYNC_APPROACH,
  SYNC_CREEP_FACTOR,
  SYNC_HOLD,
  SYNC_STALL_CHANCE,
  SYNC_TARGET,
  SYNC_TICK_MS,
  formatStamp,
  type BootLogLine,
} from "@/data/boot-sequence";

/**
 * `rain` is the character wipe between the operator confirming and the panel
 * striking on. It holds no timers of its own — the rain reports when it is
 * spent, and only then does the log timeline start.
 */
export type BootPhase = "idle" | "rain" | "running" | "done";

export interface BootSequence {
  readonly phase: BootPhase;
  readonly logs: readonly BootLogLine[];
  /** 0–100 progress through the sequence. */
  readonly pct: number;
  readonly sync: number;
  /** True once the link has asked for a level — the sync bar's cue to appear. */
  readonly syncArmed: boolean;
  /** Standby → the character rain. */
  readonly start: () => void;
  /** The rain is spent → the log timeline. */
  readonly beginLogs: () => void;
  readonly skip: () => void;
  readonly reset: () => void;
}

/**
 * Drives the startup log readout. Every timer it opens is tracked so a skip,
 * a replay or an unmount can tear the whole thing down.
 */
export function useBootSequence(): BootSequence {
  const [phase, setPhase] = useState<BootPhase>("idle");
  const [logs, setLogs] = useState<readonly BootLogLine[]>([]);
  const [pct, setPct] = useState(0);
  const [sync, setSync] = useState(0);
  const [syncArmed, setSyncArmed] = useState(false);

  const phaseRef = useRef<BootPhase>("idle");
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const syncTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  /** The value the climb is currently working toward. */
  const ceilingRef = useRef(SYNC_HOLD);

  const clearTimers = useCallback(() => {
    for (const id of timeouts.current) clearTimeout(id);
    timeouts.current = [];
    if (syncTimer.current !== null) {
      clearInterval(syncTimer.current);
      syncTimer.current = null;
    }
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    phaseRef.current = "done";
    setPhase("done");
    setPct(100);
    setSyncArmed(true);
    setSync(SYNC_TARGET);
  }, [clearTimers]);

  /**
   * One ticker covers both stages. It closes a random slice of whatever
   * distance is left to the ceiling, and stalls outright often enough that the
   * readout never looks like it is being interpolated.
   */
  const startSyncClimb = useCallback(() => {
    if (syncTimer.current !== null) clearInterval(syncTimer.current);
    ceilingRef.current = SYNC_HOLD;

    syncTimer.current = setInterval(() => {
      if (phaseRef.current !== "running") return;
      if (Math.random() < SYNC_STALL_CHANCE) return;

      setSync((current) => {
        const ceiling = ceilingRef.current;
        const remaining = ceiling - current;
        if (remaining <= 0.05) return ceiling;

        const span = SYNC_APPROACH.max - SYNC_APPROACH.min;
        const approach = SYNC_APPROACH.min + Math.random() * span;
        const rate =
          ceiling === SYNC_HOLD ? approach : approach * SYNC_CREEP_FACTOR;

        return Math.min(ceiling, current + remaining * rate);
      });
    }, SYNC_TICK_MS);
  }, []);

  const beginLogs = useCallback(() => {
    if (phaseRef.current !== "rain") return;

    phaseRef.current = "running";
    setPhase("running");

    timeouts.current = BOOT_SEQUENCE.map((step, index) =>
      setTimeout(() => {
        const line: BootLogLine = {
          id: index,
          stamp: formatStamp(step.at),
          message: step.message,
          kind: step.kind,
        };
        setLogs((current) => {
          const next = [...current, line];
          return next.length > BOOT_LOG_LIMIT
            ? next.slice(next.length - BOOT_LOG_LIMIT)
            : next;
        });
        setPct(Math.round((step.at / BOOT_TOTAL_MS) * 100));

        if (step.cue === "sync") {
          setSyncArmed(true);
          startSyncClimb();
        } else if (step.cue === "release") {
          ceilingRef.current = SYNC_TARGET;
        }
      }, step.at),
    );

    timeouts.current.push(setTimeout(finish, BOOT_TOTAL_MS + BOOT_SETTLE_MS));
  }, [finish, startSyncClimb]);

  const start = useCallback(() => {
    if (phaseRef.current !== "idle") return;

    phaseRef.current = "rain";
    setPhase("rain");
    setLogs([]);
    setPct(0);
    setSync(0);
    setSyncArmed(false);
  }, []);

  const skip = useCallback(() => {
    if (phaseRef.current === "idle" || phaseRef.current === "done") return;
    finish();
  }, [finish]);

  const reset = useCallback(() => {
    clearTimers();
    phaseRef.current = "idle";
    setPhase("idle");
    setLogs([]);
    setPct(0);
    setSync(0);
    setSyncArmed(false);
  }, [clearTimers]);

  useEffect(() => clearTimers, [clearTimers]);

  return { phase, logs, pct, sync, syncArmed, start, beginLogs, skip, reset };
}
