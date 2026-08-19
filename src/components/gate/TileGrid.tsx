import type { TileGridSize } from "@/lib/gate";
import { cn } from "@/lib/cn";

interface TileGridProps extends TileGridSize {
  /**
   * Start the tiles cleared, for gates that close them in rather than open
   * them out.
   */
  readonly cleared?: boolean;
}

/**
 * The cover, built out of tiles so it can be opened or closed as a ripple.
 *
 * Tiles butt up against each other with no gap; the 1px spread box-shadow hides
 * the sub-pixel seams that fractional column widths would otherwise leave.
 * Ordering is row-major, which is what anime.js's grid stagger expects.
 */
export function TileGrid({ cols, rows, cleared }: TileGridProps) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: cols * rows }, (_, index) => (
        <span
          key={index}
          className={cn("gate-tile bg-void", cleared && "opacity-0")}
          style={{ boxShadow: "0 0 0 1px var(--color-void)" }}
        />
      ))}
    </div>
  );
}
