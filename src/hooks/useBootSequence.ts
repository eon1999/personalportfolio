"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BOOT_LOG_LIMIT,
  BOOT_SEQUENCE,
  BOOT_SETTLE_MS,
  BOOT_TOTAL_MS,
  SYNC_TARGET,
  SYNC_TICK_MS,
  SYNC_TICK_STEP,
  formatStamp,
  type BootLogLine,
} from "@/data/boot-sequence";

export type BootPhase = "idle" | "running" | "done";

export interface BootSequence {
  readonly phase: BootPhase;
  readonly logs: readonly BootLogLine[];
  /** 0–100 progress through the sequence. */
  readonly pct: number;
  readonly sync: number;
  readonly start: () => void;
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

  // Mirrors `phase` so the callbacks below can guard without re-creating.
  const phaseRef = useRef<BootPhase>("idle");
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const syncTimer = useRef<ReturnType<typeof setInterval> | null>(null);

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
    setSync(SYNC_TARGET);
  }, [clearTimers]);

  const start = useCallback(() => {
    if (phaseRef.current !== "idle") return;

    phaseRef.current = "running";
    setPhase("running");
    setLogs([]);
    setPct(0);
    setSync(0);

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
      }, step.at),
    );

    syncTimer.current = setInterval(() => {
      setSync((current) => Math.min(SYNC_TARGET, current + SYNC_TICK_STEP));
    }, SYNC_TICK_MS);

    timeouts.current.push(setTimeout(finish, BOOT_TOTAL_MS + BOOT_SETTLE_MS));
  }, [finish]);

  const skip = useCallback(() => {
    if (phaseRef.current !== "running") return;
    finish();
  }, [finish]);

  const reset = useCallback(() => {
    clearTimers();
    phaseRef.current = "idle";
    setPhase("idle");
    setLogs([]);
    setPct(0);
    setSync(0);
  }, [clearTimers]);

  useEffect(() => clearTimers, [clearTimers]);

  return { phase, logs, pct, sync, start, skip, reset };
}
