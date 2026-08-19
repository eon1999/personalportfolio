import { cn } from "@/lib/cn";

/**
 * `null` reads as an unlit cell; the number is the opacity of a lit one.
 */
const TELEMETRY_CELLS: readonly (
  | { readonly tone: "ac" | "ac2"; readonly opacity: number }
  | null
)[] = [
  { tone: "ac", opacity: 0.9 },
  { tone: "ac", opacity: 0.75 },
  { tone: "ac", opacity: 0.6 },
  null,
  { tone: "ac2", opacity: 0.7 },
  null,
  null,
  { tone: "ac", opacity: 0.5 },
  null,
  { tone: "ac2", opacity: 0.4 },
  null,
  { tone: "ac", opacity: 0.3 },
];

/** Twelve-cell readout strip — pure decoration, no data behind it. */
export function TelemetryStrip() {
  return (
    <div aria-hidden className="mt-4 grid grid-cols-12 gap-[3px]">
      {TELEMETRY_CELLS.map((cell, index) => (
        <span
          key={index}
          className={cn(
            "h-[14px]",
            cell === null && "bg-track",
            cell?.tone === "ac" && "bg-ac",
            cell?.tone === "ac2" && "bg-ac2",
          )}
          style={cell === null ? undefined : { opacity: cell.opacity }}
        />
      ))}
    </div>
  );
}
