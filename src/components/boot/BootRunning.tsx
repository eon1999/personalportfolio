"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  formatSync,
  phaseLabel,
  SYNC_TARGET,
  type BootLogLine,
} from "@/data/boot-sequence";
import {
  BAR_TRANSITION,
  FLICKER_KEYFRAMES,
  flickerIn,
  TIMING,
} from "@/lib/motion";
import { Bar } from "@/components/ui/Bar";
import { DisplayText } from "@/components/ui/DisplayText";
import { SegmentReadout } from "@/components/ui/SegmentReadout";
import { BootLogWindow } from "./BootLogWindow";

/**
 * The log window comes up a beat behind the header, so the panel reads as two
 * strikes rather than one. Held just short of the first log line at 600ms.
 */
const LOG_WINDOW_DELAY = 0.22;

interface BootRunningProps {
  readonly logs: readonly BootLogLine[];
  readonly pct: number;
  readonly sync: number;
  /** The link has asked for a level; the sync row strikes on. */
  readonly syncArmed: boolean;
  readonly onSkip: () => void;
}

/**
 * The running panel. Mounts the moment the character rain clears, and strikes
 * on in three beats: header and sequence bar, then the log window, then — once
 * the logs reach the line that asks for it — the sync row.
 */
export function BootRunning({
  logs,
  pct,
  sync,
  syncArmed,
  onSkip,
}: BootRunningProps) {
  const clamped = Math.min(100, pct);

  return (
    <div className="relative w-[min(760px,86vw)]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: FLICKER_KEYFRAMES }}
        transition={flickerIn()}
      >
        <div className="flex items-baseline justify-between">
          <p className="text-[clamp(22px,4.5vw,34px)] tracking-[.14em] text-ac">
            <DisplayText>{phaseLabel(pct)}</DisplayText>
          </p>
          <p className="text-[11px] tracking-[.24em] text-dim">
            SEQUENCE {String(clamped).padStart(3, "0")}%
          </p>
        </div>

        <Bar
          value={clamped / 100}
          transition={BAR_TRANSITION}
          className="mt-3 h-[3px] bg-track"
          label="Startup progress"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: FLICKER_KEYFRAMES }}
        transition={flickerIn(LOG_WINDOW_DELAY)}
      >
        <BootLogWindow lines={logs} />
      </motion.div>

      {/* Nothing here until the link asks for a level — the ratio does not
          exist as far as the operator is concerned until then. */}
      <AnimatePresence>
        {syncArmed ? (
          <motion.div
            key="sync-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: FLICKER_KEYFRAMES }}
            exit={{ opacity: 0, transition: { duration: TIMING.logLine } }}
            transition={flickerIn()}
            className="mt-4 flex items-center gap-3 border-t border-line bg-log-bg px-3 py-[10px]"
          >
            <span className="text-[9px] tracking-[.22em] text-dim">SYNC</span>

            <Bar
              value={sync / SYNC_TARGET}
              transition={BAR_TRANSITION}
              className="h-[5px] flex-1 bg-track"
              label="Sync ratio"
            />

            <SegmentReadout
              value={formatSync(sync)}
              height={16}
              label={`Sync ratio ${sync.toFixed(1)} percent`}
            />
            <span className="text-[9px] tracking-[.22em] text-dim">%</span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: FLICKER_KEYFRAMES }}
        transition={flickerIn(LOG_WINDOW_DELAY)}
        className="mt-4 flex items-center justify-between gap-4"
      >
        <div className="flex gap-[26px] text-[10px] tracking-[.2em] text-dim">
          <span>
            PWR <span className="text-ac2">OK</span>
          </span>
          <span>
            LINK <span className="text-ac2">OK</span>
          </span>
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="btn-ghost px-4 py-2 text-[10px] tracking-[.24em]"
        >
          SKIP →
        </button>
      </motion.div>
    </div>
  );
}
