"use client";

import { phaseLabel, type BootLogLine } from "@/data/boot-sequence";
import { BAR_TRANSITION } from "@/lib/motion";
import { Bar } from "@/components/ui/Bar";
import { DisplayText } from "@/components/ui/DisplayText";
import { BootLogWindow } from "./BootLogWindow";

interface BootRunningProps {
  readonly logs: readonly BootLogLine[];
  readonly pct: number;
  readonly sync: number;
  readonly onSkip: () => void;
}

export function BootRunning({ logs, pct, sync, onSkip }: BootRunningProps) {
  const clamped = Math.min(100, pct);

  return (
    <div className="relative w-[min(760px,86vw)]">
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

      <BootLogWindow lines={logs} />

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex gap-[26px] text-[10px] tracking-[.2em] text-dim">
          <span>
            PWR <span className="text-ac2">OK</span>
          </span>
          <span>
            LINK <span className="text-ac2">OK</span>
          </span>
          <span>
            SYNC <span className="text-ac tabular-nums">{sync.toFixed(1)}%</span>
          </span>
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="btn-ghost px-4 py-2 text-[10px] tracking-[.24em]"
        >
          SKIP →
        </button>
      </div>
    </div>
  );
}
