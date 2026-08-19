"use client";

import { motion } from "motion/react";
import { LOG_KIND_COLOR, type BootLogLine } from "@/data/boot-sequence";
import { LOG_LINE_TRANSITION } from "@/lib/motion";

/** Fixed-height readout; lines scroll off the top rather than growing it. */
export function BootLogWindow({
  lines,
}: {
  readonly lines: readonly BootLogLine[];
}) {
  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Startup log"
      className="mt-[22px] h-[250px] overflow-hidden border border-line bg-log-bg px-4 py-[14px]"
    >
      {lines.map((line) => (
        <motion.p
          key={line.id}
          className="text-[12px] leading-[1.75]"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={LOG_LINE_TRANSITION}
        >
          <span className="text-dim">{line.stamp}</span>{" "}
          <span style={{ color: LOG_KIND_COLOR[line.kind] }}>
            {line.message}
          </span>
        </motion.p>
      ))}
    </div>
  );
}
