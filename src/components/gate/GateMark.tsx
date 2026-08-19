import { DisplayText } from "@/components/ui/DisplayText";

const RING_RADIUS = 148;

/** Dash length that leaves the ring fully undrawn at offset. */
export const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

interface GateMarkProps {
  readonly eyebrow: string;
  /** One entry per rendered line. */
  readonly headline: readonly string[];
  readonly sub?: string;
}

/**
 * A stroke that draws itself into a full circle around the gate's message.
 * Shared by the welcome gate and the sub-page access gate.
 */
export function GateMark({ eyebrow, headline, sub }: GateMarkProps) {
  return (
    <div className="gate-mark relative flex size-[min(380px,84vw)] items-center justify-center">
      <svg
        aria-hidden
        viewBox="0 0 320 320"
        className="absolute inset-0 size-full -rotate-90"
      >
        <circle
          cx="160"
          cy="160"
          r={RING_RADIUS}
          fill="none"
          stroke="var(--color-ring)"
          strokeWidth="1"
        />
        <circle
          className="gate-ring"
          cx="160"
          cy="160"
          r={RING_RADIUS}
          fill="none"
          stroke="var(--color-ac)"
          strokeWidth="1.5"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={RING_CIRCUMFERENCE}
        />
      </svg>

      <div className="relative px-5 text-center">
        <p className="gate-line text-[9.5px] tracking-[.4em] text-ac opacity-0">
          {eyebrow}
        </p>
        <p className="gate-line mt-[14px] text-[clamp(20px,3.6vw,34px)] leading-[1.15] tracking-[.16em] text-ink opacity-0">
          {headline.map((line, index) => (
            <span key={index} className="block">
              <DisplayText hatch className="origin-center">
                {line}
              </DisplayText>
            </span>
          ))}
        </p>
        {sub ? (
          <p className="gate-line mt-[14px] text-[9.5px] tracking-[.3em] text-dim opacity-0">
            {sub}
          </p>
        ) : null}
      </div>
    </div>
  );
}
