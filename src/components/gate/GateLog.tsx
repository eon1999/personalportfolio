import { GATE_LOG, GATE_LOG_STEP_MS } from "@/data/gate";

/** Formats the fake elapsed stamp for a log line. */
function stamp(index: number): string {
  return `[${((index * GATE_LOG_STEP_MS) / 1000).toFixed(2).padStart(5, "0")}]`;
}

/**
 * The fast handshake readout on an access gate. Parked near the bottom of the
 * screen so the ring stays centred on the ripple's focal point.
 */
export function GateLog() {
  return (
    <div
      aria-hidden
      className="absolute bottom-[13vh] left-1/2 w-[min(520px,86vw)] -translate-x-1/2 text-[10.5px] leading-[1.7] text-body-card"
    >
      {GATE_LOG.map((line, index) => (
        <p key={index} className="gate-log-line opacity-0">
          <span className="text-dim">{stamp(index)}</span> {line}
        </p>
      ))}
    </div>
  );
}
